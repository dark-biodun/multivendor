export default async () => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    ok: true,
    service: "Flowing Delivery Platform API",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString()
  })
});