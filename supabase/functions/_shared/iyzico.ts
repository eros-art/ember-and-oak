export interface IyzicoCall {
  status: string;
  [key: string]: unknown;
}

export async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function randomKey(): string {
  return `${Date.now()}${Math.random().toString(36).slice(2, 12)}`;
}

export async function authHeaders(
  apiKey: string,
  secretKey: string,
  uriPath: string,
  rawBody: string,
): Promise<Record<string, string>> {
  const rnd = randomKey();
  const signature = await hmacSha256Hex(secretKey, rnd + uriPath + rawBody);
  const authValue = `apiKey:${apiKey}&randomKey:${rnd}&signature:${signature}`;
  const authB64 = btoa(authValue);
  return {
    Authorization: `IYZWSv2 ${authB64}`,
    "x-iyzi-rnd": rnd,
    "Content-Type": "application/json",
  };
}

export async function iyzicoRequest(
  apiKey: string,
  secretKey: string,
  baseUrl: string,
  uriPath: string,
  payload: Record<string, unknown>,
): Promise<{ res: Response; data: IyzicoCall }> {
  const rawBody = JSON.stringify(payload);
  const headers = await authHeaders(apiKey, secretKey, uriPath, rawBody);
  const res = await fetch(baseUrl + uriPath, {
    method: "POST",
    headers,
    body: rawBody,
  });
  let data: IyzicoCall;
  try {
    data = (await res.json()) as IyzicoCall;
  } catch {
    data = { status: "failure", errorMessage: `non-JSON response (HTTP ${res.status})` };
  }
  return { res, data };
}

export function verifyWebhookV3(
  secretKey: string,
  headerValue: string | null,
  fields: { iyziEventType: unknown; iyziPaymentId: unknown; token: unknown; paymentConversationId: unknown; status: unknown },
): Promise<boolean> {
  if (!headerValue) return Promise.resolve(false);
  const key =
    String(secretKey) +
    String(fields.iyziEventType) +
    String(fields.iyziPaymentId) +
    String(fields.token) +
    String(fields.paymentConversationId) +
    String(fields.status);
  return hmacSha256Hex(secretKey, key).then((expected) => expected.toLowerCase() === headerValue.toLowerCase());
}

export function base64Decode(s: string): string {
  return new TextDecoder().decode(base64ToBytes(s));
}

function base64ToBytes(s: string): Uint8Array {
  const binary = atob(s.replace(/\s+/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}