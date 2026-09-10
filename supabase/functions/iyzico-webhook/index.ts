import { createClient } from "jsr:@supabase/supabase-js@2";
import { iyzicoRequest, verifyWebhookV3 } from "../_shared/iyzico.ts";

const CF_RETRIEVE_PATH = "/payment/iyzipos/checkoutform/auth/ecom/detail";

const API_KEY = Deno.env.get("IYZICO_API_KEY") ?? "";
const SECRET_KEY = Deno.env.get("IYZICO_SECRET_KEY") ?? "";
const BASE_URL = Deno.env.get("IYZICO_BASE_URL") ?? "https://sandbox-api.iyzipay.com";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "https://sqozjjlxpelgiedjxtre.supabase.co";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const REQUIRE_SIGNATURE = (Deno.env.get("IYZICO_WEBHOOK_REQUIRE_SIGNATURE") ?? "true") === "true";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function confirmPayment(token: string, conversationId: string): Promise<{ fraudOk: boolean; data: Record<string, unknown> | null }> {
  if (!API_KEY || !SECRET_KEY) return { fraudOk: false, data: null };
  const payload = { locale: "tr", conversationId, token };
  const { res, data } = await iyzicoRequest(API_KEY, SECRET_KEY, BASE_URL, CF_RETRIEVE_PATH, payload);
  if (data.status !== "success" || !res.ok) {
    console.error("CF retrieve failed", JSON.stringify(data));
    return { fraudOk: false, data: null };
  }
  const fraud = Number(data.fraudStatus ?? 1);
  return { fraudOk: fraud === 1, data };
}

export async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  if (!SECRET_KEY || !SERVICE_ROLE) {
    return json({ error: "server misconfigured" }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid JSON" }, 400);
  }

  const headerSig = req.headers.get("x-iyz-signature-v3");
  const valid = await verifyWebhookV3(SECRET_KEY, headerSig, {
    iyziEventType: body.iyziEventType,
    iyziPaymentId: body.iyziPaymentId,
    token: body.token,
    paymentConversationId: body.paymentConversationId,
    status: body.status,
  });

  if (!valid) {
    if (headerSig) {
      console.error("webhook signature mismatch", JSON.stringify(body));
      return json({ error: "invalid signature" }, 401);
    }
    if (REQUIRE_SIGNATURE) {
      console.warn("webhook without signature rejected (enable X-IYZ-SIGNATURE-V3 or set REQUIRE_SIGNATURE=false)");
      return json({ error: "missing signature" }, 401);
    }
    console.warn("webhook processed WITHOUT signature (IYZICO_WEBHOOK_REQUIRE_SIGNATURE=false)");
  }

  const eventType = String(body.iyziEventType ?? "");
  const status = String(body.status ?? "");
  const paymentId = String(body.iyziPaymentId ?? "");
  const token = String(body.token ?? "");
  const conversationId = String(body.paymentConversationId ?? "");

  if (eventType === "CHECKOUT_FORM_AUTH" && status === "SUCCESS") {
    const { fraudOk } = await confirmPayment(token, conversationId);
    if (!fraudOk) {
      console.warn("payment not fraud-approved, not marking paid", { token, conversationId });
      return json({ ok: false, reason: "fraud_in_review_or_rejected" });
    }
    const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
    const { data: order } = await sb
      .from("orders")
      .update({ paid: true })
      .eq("eo_id", conversationId)
      .select("id")
      .maybeSingle();
    await sb.from("transactions").update({ status: "success", stripe_id: paymentId })
      .eq("stripe_id", token);
    console.log("order marked paid", { conversationId, paymentId, orderId: order?.id ?? null });
  } else {
    console.log("non-au-th Webhook acknowledged", { eventType, status, conversationId, token });
  }

  return json({ ok: true });
}