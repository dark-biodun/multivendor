# Flowing — Multi-Vendor Delivery Platform

A Netlify-ready React/Vite MVP based on the supplied full-scale Nigerian delivery marketplace specification.

## Included

- Customer marketplace
- Product discovery and search
- Cart and checkout simulation
- Customer orders and wallet
- Rider dashboard, delivery requests and earnings
- Merchant dashboard, orders and inventory
- Admin dashboard, users, merchants, orders and analytics
- Role switching for demo/testing
- Responsive mobile-first UI
- Nigerian Naira formatting
- Netlify Functions API scaffold
- SPA routing/redirect configuration
- LocalStorage demo persistence
- Production-oriented component structure

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Netlify

1. Push this folder to GitHub.
2. In Netlify, choose **Add new project → Import an existing project**.
3. Select the repository.
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy.

`netlify.toml` is already included, so Netlify can detect the configuration automatically.

## Important production note

The supplied specification calls for real authentication, persistent database storage, GPS/live tracking, payment gateways, wallet accounting, notifications, verification, audit logs and scalable APIs. Those require a real backend and service credentials.

This package deliberately ships with a working demo mode so it can be deployed immediately without exposing secrets. The `netlify/functions/api.mjs` file is the backend integration boundary.

Recommended production stack:

- Supabase/PostgreSQL for database, Auth and Realtime
- Paystack or Flutterwave for Nigerian payments
- Mapbox or Google Maps for maps/routing
- Resend/SendGrid for email
- Termii or another Nigerian SMS provider
- Cloudinary/S3 for merchant/rider documents and images

Do not put payment secret keys or database service-role keys in frontend code.
