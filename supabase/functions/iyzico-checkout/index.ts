import { createClient } from "jsr:@supabase/supabase-js@2";
import { iyzicoRequest } from "../_shared/iyzico.ts";

const CF_INIT_PATH = "/payment/iyzipos/checkoutform/initialize/auth/ecom";

const API_KEY = Deno.env.get("IYZICO_API_KEY") ?? "";
const SECRET_KEY = Deno.env.get("IYZICO_SECRET_KEY") ?? "";
const BASE_URL = Deno.env.get("IYZICO_BASE_URL") ?? "https://sandbox-api.iyzipay.com";
const CALLBACK_URL = Deno.env.get("IYZICO_CALLBACK_URL") ?? "https://ember-and-oak-1va.pages.dev/";
const CURRENCY: string = Deno.env.get("IYZICO_CURRENCY") ?? "TRY";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "https://sqozjjlxpelgiedjxtre.supabase.co";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

interface OrderLine {
  lineId?: string | null;
  itemId?: string | null;
  name?: string | null;
  qty?: number | null;
  addOnIds?: unknown[];
  unitPrice?: number | null;
  lineTotal?: number | null;
}

interface OrderCustomer {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  notes?: string | null;
}

interface OrderPayload {
  eo_id?: string | null;
  userId?: string | null;
  total?: number | null;
  items?: OrderLine[];
  customer?: OrderCustomer;
}

function splitName(fullName: string): { first: string; surname: string } {
  const parts = fullName.trim().split(/\s+/);
  return { first: parts[0] || "Test", surname: parts.slice(1).join(" ") || "Buyer" };
}

function normPhone(phone?: string | null): string {
  if (!phone) return "+905320000000";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+90${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+90${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith("90")) return `+${digits}`;
  return "+905320000000";
}

function makeAddress(customer: OrderCustomer | undefined, contactName: string) {
  const address = customer?.address?.trim() || "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1";
  return {
    address,
    zipCode: "34732",
    contactName,
    city: customer?.city?.trim() || "İstanbul",
    country: "Turkey",
  };
}

async function upsertTransaction(
  sb: ReturnType<typeof createClient>,
  eoId: string,
  amount: number,
  status: string,
  paymentRef: string,
): Promise<void> {
  try {
    let orderId: string | null = null;
    const { data: order } = await sb.from("orders").select("id").eq("eo_id", eoId).maybeSingle();
    if (order?.id) orderId = order.id as string;
    await sb.from("transactions").insert({
      order_id: orderId,
      amount,
      method: "iyzico",
      status,
      stripe_id: paymentRef,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error("transaction record failed", e);
  }
}

export async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  if (!API_KEY || !SECRET_KEY || !SERVICE_ROLE) {
    return json({ error: "server misconfigured: missing iyzico/supabase env vars" }, 500);
  }

  let body: { order?: OrderPayload };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }

  const order = body.order;
  if (!order?.eo_id || !order?.items?.length || order?.total == null) {
    return json({ error: "missing order fields (eo_id, items, total)" }, 400);
  }

  const price = Number(order.total);
  const conversationId = String(order.eo_id);
  const basketId = `B-${conversationId}`;
  const buyer = splitName(order.customer?.name || "Test Buyer");
  const contactName = `${buyer.first} ${buyer.surname}`.trim();
  const buyerEmail = order.customer?.email?.trim() || "test@example.com";

  const payload: Record<string, unknown> = {
    locale: "tr",
    conversationId,
    price,
    paidPrice: price,
    currency: CURRENCY,
    basketId,
    paymentGroup: "PRODUCT",
    callbackUrl: CALLBACK_URL,
    buyer: {
      id: String(order.userId ?? conversationId),
      name: buyer.first,
      surname: buyer.surname,
      identityNumber: "12345678901",
      email: buyerEmail,
      gsmNumber: normPhone(order.customer?.phone),
      registrationAddress: order.customer?.address?.trim() || "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      city: order.customer?.city?.trim() || "İstanbul",
      country: "Turkey",
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0",
    },
    shippingAddress: makeAddress(order.customer, contactName),
    billingAddress: makeAddress(order.customer, contactName),
    basketItems: order.items.map((it, i) => ({
      id: it.lineId || `${conversationId}-${i}`,
      price: Number(it.lineTotal ?? it.unitPrice ?? 0),
      name: it.name || "Menu item",
      category1: "Coffee & Food",
      itemType: "VIRTUAL",
    })),
  };

  const { res, data } = await iyzicoRequest(API_KEY, SECRET_KEY, BASE_URL, CF_INIT_PATH, payload);

  if (data.status !== "success" || !res.ok) {
    return json({ error: { status: data.status, errorCode: data.errorCode, errorMessage: data.errorMessage } }, 502);
  }

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
  await upsertTransaction(sb, conversationId, price, "pending", String(data.token ?? ""));

  return json({
    ok: true,
    token: data.token,
    paymentPageUrl: data.paymentPageUrl,
    checkoutFormContent: data.checkoutFormContent ?? null,
    conversationId,
  });
}