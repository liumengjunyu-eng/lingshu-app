import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, {
    apiVersion: "2025-05-27.dahlia" as any,
  });
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const { name, birthYear, birthMonth, birthDay, birthHour, gender } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "LingShu Full Report — Complete BaZi Analysis",
              description: "Full 8-character BaZi chart · NaYin metals · 10-year DaYun cycles · Year-by-year guidance · Relationship compatibility",
              images: [],
            },
            unit_amount: 999,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/success?name=${encodeURIComponent(name)}&year=${birthYear}&month=${birthMonth}&day=${birthDay}&hour=${birthHour}&gender=${gender}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/report?name=${encodeURIComponent(name)}&year=${birthYear}&month=${birthMonth}&day=${birthDay}&hour=${birthHour}&gender=${gender}`,
      metadata: {
        name: name || "",
        birthYear: String(birthYear || ""),
        birthMonth: String(birthMonth || ""),
        birthDay: String(birthDay || ""),
        birthHour: String(birthHour || ""),
        gender: gender || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
