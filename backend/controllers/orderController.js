const woohooService = require('../services/woohooService');

function generateRefNo() {
  return `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

const placeOrder = async (req, res) => {
  try {
    const { sku, price } = req.body;

    if (!sku || !price) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        details: !sku ? 'SKU is required' : 'Price is required'
      });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid price',
        details: 'Please select a valid denomination amount'
      });
    }

    const refno = generateRefNo();

    const payload = {
      address: {
        salutation: "Mr.",
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        telephone: "+919876543210",
        line1: "123 Main Street",
        city: "Bangalore",
        region: "Karnataka",
        country: "IN",
        postcode: "560001",
        billToThis: true
      },
      payments: [
        {
          code: "svc",
          amount: parsedPrice,
          poNumber: `PO-${Date.now()}`
        }
      ],
      products: [
        {
          sku,
          price: parsedPrice,
          qty: 1,
          currency: 356,
          giftMessage: "Enjoy your gift!"
        }
      ],
      refno,
      remarks: "Synchronous digital gift card order",
      deliveryMode: "API",
      syncOnly: true
    };

    const url = 'https://sandbox.woohoo.in/rest/v3/orders';
    console.log('Payload:', payload);
      
    const result = await woohooService.fetchData(url, 'POST', payload);
    

    console.log('✅ Order placed successfully:', result);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ Order failed:', error.response?.data || error.message);


    res.status(error.response?.status || 500).json({
      success: false,
      error: 'Order placement failed',
      details: error.response?.data || error.message
    });
  }
};

module.exports = { placeOrder };
