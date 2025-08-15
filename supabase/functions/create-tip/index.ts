
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("FRONTEND_URL") || "http://localhost:8080",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-TIP] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

const { tipAmount, creatorId, message, contentId, contentType } = await req.json();
    logStep("Request data", { tipAmount, creatorId, message, contentId, contentType });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2023-10-16" });
    
    // Calculate platform fee (10% for tips)
    const platformFeePercentage = 10;
    const platformFeeAmount = Math.round(tipAmount * (platformFeePercentage / 100) * 100); // in cents
    const creatorAmount = Math.round((tipAmount * 100)) - platformFeeAmount;
    
    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("Creating new customer");
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: `Tip for Creator`,
              description: message || "Thank you for your content!"
            },
            unit_amount: Math.round(tipAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFeeAmount,
        transfer_data: {
          destination: "acct_creator", // This would be the creator's connected account
        },
      },
      mode: "payment",
      success_url: `${req.headers.get("origin")}/`,
      cancel_url: `${req.headers.get("origin")}/`,
      metadata: {
        type: "tip",
        creatorId,
        contentId,
        contentType,
        tipperId: user.id,
        message: message || ""
      }
    });

    logStep("Tip session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
