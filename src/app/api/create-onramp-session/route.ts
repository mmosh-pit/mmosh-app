import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const OnrampSessionResource = Stripe.StripeResource.extend({
  create: Stripe.StripeResource.method({
    method: "POST",
    path: "crypto/onramp_sessions",
  }),
});

const stripe = new Stripe(process.env.STRIPE_KEY!);

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { transaction_details } = await req.json();

  // Create an OnrampSession with the order amount and currency
  const session = new OnrampSessionResource(stripe) as any;
  const onrampSession = await session.create({
    transaction_details: {
      destination_currency: "sol",
      destination_network: "solana",
      wallet_address: transaction_details["wallet_address"],
    },
    customer_ip_address: req.ip,
  });

  return NextResponse.json({
    clientSecret: onrampSession.client_secret,
  });
}
