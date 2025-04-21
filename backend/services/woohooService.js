const axios = require('axios');
const cryptoJS = require('crypto-js');

// Load environment variables
const clientSecret = process.env.CLIENT_SECRET;
const bearerToken = process.env.BEARER_TOKEN;

// Generate Signature for Woohoo API Request
function generateSignature(method, url, body) {
  const dateAtClient = new Date().toISOString();
  const baseArray = [];

  baseArray.push(method.toUpperCase());
  baseArray.push(url.includes('?') ? sortQueryParams(url) : fixedEncodeURIComponent(url));

  if (method !== 'GET' && method !== 'DELETE') {
    const sortedBody = sortObject(body);
    const encodedBody = fixedEncodeURIComponent(JSON.stringify(sortedBody));
    baseArray.push(encodedBody);
  }

  const baseString = baseArray.join('&');
  const signature = cryptoJS.HmacSHA512(baseString, clientSecret).toString();

  return { signature, dateAtClient };
}

// Helper functions
function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c =>
    '%' + c.charCodeAt(0).toString(16)
  );
}

function sortObject(obj) {
  if (Array.isArray(obj)) return obj.map(sortObject);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).sort().reduce((sorted, key) => {
      sorted[key] = sortObject(obj[key]);
      return sorted;
    }, {});
  }
  return obj;
}

function sortQueryParams(url) {
  const [baseUrl, queryString] = url.split('?');
  if (!queryString) return fixedEncodeURIComponent(baseUrl);
  const sortedParams = queryString.split('&').sort().join('&');
  return fixedEncodeURIComponent(baseUrl + '?' + sortedParams);
}

// Function to fetch data from Woohoo API
// Inside woohooService.js
async function fetchData(url, method, body = {}) {
  const { signature, dateAtClient } = generateSignature(method, url, body);

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'signature': signature,
        'dateAtClient': dateAtClient,
      },
    });

   // Log the response data for debugging
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}


module.exports = { fetchData };
