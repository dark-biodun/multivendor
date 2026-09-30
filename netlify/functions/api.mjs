const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  body: JSON.stringify(body)
});

export default async (request) => {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/.netlify\/functions\/api\/?/, "").replace(/^\/api\/?/, "");

  if (request.method === "OPTIONS") return json(204, {});
  if (path === "health" || path === "") {
    return json(200, {
      ok: true,
      message: "Flowing API is online",
      version: "1.0.0",
      endpoints: ["health", "orders", "merchants", "products"]
    });
  }

  // Production integration point:
  // Connect these handlers to Supabase/PostgreSQL, payment gateways,
  // authentication and realtime services when deploying the backend.
  if (path === "orders" && request.method === "GET") {
    return json(200, { data: [], message: "Connect orders repository/database." });
  }
  if (path === "merchants" && request.method === "GET") {
    return json(200, { data: [], message: "Connect merchants repository/database." });
  }
  if (path === "products" && request.method === "GET") {
    return json(200, { data: [], message: "Connect products repository/database." });
  }

  return json(404, { ok: false, error: "Endpoint not found" });
};