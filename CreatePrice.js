import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

// Initialize Stripe with your API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Replace with your actual secret key

// Function to create a product and its associated price
const createSubscriptionProduct = async () => {
  try {
    // Create a product
    const product = await stripe.products.create({
      name: "Starter Subscription",
      description: "$12/Month subscription",
    });

    // Create a price for the product
    const price = await stripe.prices.create({
      unit_amount: 1200, // Amount in cents
      currency: "usd",
      recurring: {
        interval: "month",
      },
      product: product.id, // Link price to product
    });

    console.log(
      "Success! Here is your starter subscription product ID:",
      product.id
    );
    console.log(
      "Success! Here is your starter subscription price ID:",
      price.id
    );
  } catch (error) {
    console.error(
      "Error creating subscription product or price:",
      error.message
    );
  }
};

// Call the function
createSubscriptionProduct();
