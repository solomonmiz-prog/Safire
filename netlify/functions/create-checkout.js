const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event) {

  const data = JSON.parse(event.body);

  try {

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: data.priceId,
          quantity: data.quantity || 1
        }
      ],
      success_url: "https://safire1.netlify.app/success.html",
      cancel_url: "https://safire1.netlify.app/cart.html"
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };

  }

};