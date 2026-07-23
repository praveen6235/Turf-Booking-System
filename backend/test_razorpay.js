const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_test_123456789',
  key_secret: 'dummy_secret'
});

async function run() {
  try {
    await razorpay.orders.create({
      amount: 10000,
      currency: "INR",
      receipt: "receipt_order_123"
    });
  } catch (err) {
    console.log("ERROR IS CAUGHT!");
    console.log("Error keys:", Object.keys(err));
    try {
      JSON.stringify(err);
      console.log("JSON STRINGIFY WORKED!");
    } catch(e) {
      console.log("JSON STRINGIFY FAILED!", e.message);
    }
  }
}

run();
