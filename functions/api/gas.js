export async function onRequest(context) {
  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbxsJ-k_2X6lD7RgkQfP1mJzZlgMipU630BpcOp-7_Ba9_ZCtLVtpbgOP_l85qr6ghYF/exec";

  const request = context.request;
  const requestUrl = new URL(request.url);
  const gasUrl = new URL(GAS_URL);

  // GET 쿼리 전달이 필요한 경우를 위해 search 파라미터를 그대로 복사합니다.
  gasUrl.search = requestUrl.search;

  // 브라우저 preflight 요청 대응 (향후 확장 대비)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const init = {
    method: request.method,
    redirect: "follow",
    headers: {},
  };

  const contentType = request.headers.get("content-type");
  if (contentType) {
    init.headers["Content-Type"] = contentType;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const gasResponse = await fetch(gasUrl.toString(), init);
  const responseText = await gasResponse.text();

  return new Response(responseText, {
    status: gasResponse.status,
    headers: {
      "Content-Type":
        gasResponse.headers.get("content-type") ||
        "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
