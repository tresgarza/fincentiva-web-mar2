import axios from 'axios';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15'
];

const COOKIES = {
  'session-id': '123-1234567-1234567',
  'i18n-prefs': 'MXN',
  'ubid-acbmx': '123-1234567-1234567',
  'session-token': '',
  'csm-hit': 'tb:s-XXXXX|1234567890&t:1234567890&adb:adblk_no'
};

export async function scrapeAmazonProduct(url) {
  console.log('Starting Amazon scraping for URL:', url);
  
  try {
    // Clean and normalize the URL
    const cleanUrl = url.split('?')[0].split('&')[0];
    console.log('Cleaned URL:', cleanUrl);

    const config = {
      headers: {
        'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-User': '?1',
        'Sec-Fetch-Dest': 'document',
        'Cookie': Object.entries(COOKIES).map(([key, value]) => `${key}=${value}`).join('; ')
      },
      timeout: 30000,
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Acepta redirecciones
      }
    };

    console.log('Making request with headers:', config.headers);
    const response = await axios.get(cleanUrl, config);
    const html = response.data;
    console.log('Received HTML content length:', html.length);
    
    if (html.includes('Type the characters you see in this image') || 
        html.includes('Enter the characters you see below') ||
        html.includes('Sorry, we just need to make sure you') ||
        html.length < 10000) {
      throw new Error('Amazon está solicitando verificación CAPTCHA. Por favor intenta más tarde.');
    }

    // Extract prices first with more specific patterns
    const currentPrice = extractPrice(html, [
      /class="a-price-whole">([^<]+)<\/span>/,
      /id="priceblock_ourprice"[^>]*>([^<]+)<\/span>/,
      /class="a-offscreen">([^<]+)<\/span>/,
      /class="a-price aok-align-center"[^>]*>.*?<span class="a-price-whole">([^<]+)<\/span>/s,
      /id="corePrice_feature_div"[^>]*>.*?class="a-offscreen">([^<]+)<\/span>/s,
      /"price":{"value":([^,]+),/
    ]);

    const originalPrice = extractPrice(html, [
      /class="a-price a-text-price"[^>]*>.*?<span>([^<]+)<\/span>/s,
      /class="a-text-strike">([^<]+)<\/span>/,
      /class="a-price a-text-price a-size-base"[^>]*>.*?<span>([^<]+)<\/span>/s,
      /"strikePrice":{"value":([^,]+),/
    ]);

    // Extract product data with improved patterns
    const productData = {
      title: extractData(html, [
        /<span id="productTitle"[^>]*>([^<]+)<\/span>/,
        /<h1[^>]*class="[^"]*a-spacing-none[^"]*"[^>]*>([^<]+)<\/h1>/,
        /"title":"([^"]+)"/
      ]),
      price: currentPrice,
      originalPrice: originalPrice,
      discount: originalPrice ? Math.round((1 - currentPrice / originalPrice) * 100) : 0,
      image: extractData(html, [
        /"large":"([^"]+)"/,
        /id="landingImage"[^>]+src="([^"]+)"/,
        /class="a-dynamic-image"[^>]+src="([^"]+)"/,
        /data-old-hires="([^"]+)"/,
        /data-a-dynamic-image="([^"]+)"/,
        /"image":"([^"]+)"/,
        /"imageUrl":"([^"]+)"/
      ]),
      description: extractDescription(html),
      features: extractFeatures(html),
      availability: extractData(html, [
        /id="availability"[^>]*>([^<]+)<\/span>/,
        /class="a-size-medium a-color-success"[^>]*>([^<]+)<\/span>/,
        /"availability":"([^"]+)"/
      ]),
      rating: extractData(html, [
        /class="a-icon-alt">([^<]+)<\/span>/,
        /id="acrPopover"[^>]*title="([^"]+)"/,
        /"rating":([^,]+),/
      ]),
      seller: extractData(html, [
        /id="merchant-info"[^>]*>([^<]+)<\/div>/,
        /id="sellerProfileTriggerId"[^>]*>([^<]+)<\/a>/,
        /"seller":"([^"]+)"/
      ]),
      warranty: extractData(html, [
        /class="a-row warranty"[^>]*>([^<]+)<\/div>/
      ]),
      url: cleanUrl
    };

    console.log('Successfully extracted product data:', productData);
    
    if (!productData.title && !productData.price) {
      console.error('HTML Content Preview:', html.substring(0, 500));
      throw new Error('No se pudieron extraer los datos principales del producto. Es posible que Amazon esté bloqueando el acceso.');
    }

    return productData;
  } catch (error) {
    console.error('Error scraping Amazon:', error.message);
    console.error('Full error:', error);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Headers:', error.response.headers);
    }
    
    throw new Error(`Error al obtener información del producto: ${error.message}`);
  }
}

function extractFeatures(html) {
  const featureMatch = html.match(/id="feature-bullets"[^>]*>(.*?)<\/div>/s);
  if (!featureMatch) return [];

  const featureText = featureMatch[1];
  const features = featureText.match(/<li[^>]*><span[^>]*>([^<]+)<\/span><\/li>/g) || [];
  
  return features.map(feature => {
    const match = feature.match(/<span[^>]*>([^<]+)<\/span>/);
    return match ? match[1].trim() : '';
  }).filter(Boolean);
}

function extractData(html, patterns) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
}

function extractPrice(html, patterns) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      // Remove currency symbols and convert to proper format
      const priceText = match[1].trim();
      // Remove everything except digits, dots and commas
      const cleanPrice = priceText
        .replace(/[^\d.,]/g, '')
        .replace(/,(\d{3})/g, '$1') // Remove thousands separators
        .replace(/[.,](\d{2})$/, '.$1'); // Ensure proper decimal format
      
      const price = parseFloat(cleanPrice);
      if (!isNaN(price)) {
        return price;
      }
    }
  }
  return null;
}

function extractDescription(html) {
  const patterns = [
    /id="feature-bullets"[^>]*>(.*?)<\/div>/s,
    /id="productDescription"[^>]*>(.*?)<\/div>/s,
    /class="a-spacing-small[^>]*>(.*?)<\/div>/s
  ];
  
  const description = extractData(html, patterns);
  return description
    ? description
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
    : '';
}

export async function scrapeMercadoLibreProduct(url) {
  console.log('Starting MercadoLibre scraping for URL:', url);
  
  try {
    const config = {
      headers: {
        'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-User': '?1',
        'Sec-Fetch-Dest': 'document'
      },
      timeout: 30000,
      maxRedirects: 5
    };

    const response = await axios.get(url, config);
    const html = response.data;
    console.log('Received HTML content length:', html.length);

    // Extract prices with more specific patterns for MercadoLibre
    const currentPrice = extractPrice(html, [
      // Patrones para el precio con descuento
      /data-price="([^"]+)"/,
      /class="andes-money-amount ui-pdp-price__part andes-money-amount--cents-superscript andes-money-amount--compact".*?class="andes-money-amount__fraction"[^>]*>([^<]+)<\/span>/s,
      /class="ui-pdp-price__second-line".*?class="andes-money-amount__fraction"[^>]*>([^<]+)<\/span>/s,
      /class="price-tag-amount".*?class="price-tag-fraction"[^>]*>([^<]+)<\/span>/s,
      /"price":([^,]+),/
    ]);

    const originalPrice = extractPrice(html, [
      // Patrones para el precio original
      /class="ui-pdp-price__original-value".*?class="andes-money-amount__fraction"[^>]*>([^<]+)<\/span>/s,
      /class="price-tag-amount".*?class="price-tag-fraction-old"[^>]*>([^<]+)<\/span>/s,
      /data-original-price="([^"]+)"/,
      /"original_price":([^,]+),/,
      /class="price-tag__del".*?class="price-tag-fraction"[^>]*>([^<]+)<\/span>/s
    ]);

    // Extract and clean image URL
    let imageUrl = extractData(html, [
      /class="ui-pdp-gallery__figure"[^>]+data-zoom="([^"]+)"/,
      /class="ui-pdp-image"[^>]+src="([^"]+)"/,
      /"image":"([^"]+)"/,
      /data-full-image="([^"]+)"/,
      /data-zoom="([^"]+)"/
    ]);

    // Clean the image URL by removing escape characters
    imageUrl = imageUrl
      .replace(/\\u002F/g, '/') // Replace \u002F with /
      .replace(/\\u002f/g, '/') // Replace \u002f with /
      .replace(/\\\//g, '/') // Replace \/ with /
      .replace(/^\/\//, 'https://'); // Add https:// if URL starts with //

    const productData = {
      title: extractData(html, [
        /class="ui-pdp-title"[^>]*>([^<]+)<\/h1>/,
        /class="item-title"[^>]*>([^<]+)<\/span>/,
        /"name":"([^"]+)"/
      ]),
      price: currentPrice,
      originalPrice: originalPrice,
      discount: originalPrice && currentPrice ? Math.round((1 - currentPrice / originalPrice) * 100) : 0,
      image: imageUrl,
      description: extractDescription(html),
      condition: extractData(html, [
        /class="ui-pdp-subtitle"[^>]*>([^<]+)<\/p>/,
        /class="item-conditions"[^>]*>([^<]+)<\/div>/,
        /"condition":"([^"]+)"/
      ]),
      seller: extractData(html, [
        /class="ui-pdp-seller__link-trigger"[^>]*>([^<]+)<\/span>/,
        /class="store-info"[^>]*>([^<]+)<\/div>/,
        /"seller_name":"([^"]+)"/
      ]),
      warranty: extractData(html, [
        /class="ui-pdp-warranty"[^>]*>([^<]+)<\/p>/,
        /class="warranty-text"[^>]*>([^<]+)<\/div>/
      ]),
      features: extractMercadoLibreFeatures(html),
      stock: extractData(html, [
        /class="ui-pdp-stock"[^>]*>([^<]+)<\/p>/,
        /class="ui-pdp-buybox__quantity__available"[^>]*>([^<]+)<\/span>/,
        /class="stock-information"[^>]*>([^<]+)<\/div>/,
        /"available_quantity":([^,]+),/
      ]),
      shipping: extractData(html, [
        /class="ui-pdp-media__title"[^>]*>([^<]+)<\/span>/,
        /class="shipping-method-title"[^>]*>([^<]+)<\/div>/,
        /"shipping_mode":"([^"]+)"/
      ]),
      rating: extractData(html, [
        /class="ui-pdp-reviews__rating__summary__average"[^>]*>([^<]+)<\/p>/,
        /class="review-summary-average"[^>]*>([^<]+)<\/div>/,
        /"rating_average":([^,]+),/
      ]),
      url
    };

    console.log('Successfully extracted product data:', productData);
    
    if (!productData.title || !productData.price) {
      console.error('HTML Content Preview:', html.substring(0, 500));
      throw new Error('No se pudieron extraer los datos principales del producto');
    }

    return productData;
  } catch (error) {
    console.error('Error scraping MercadoLibre:', error.message);
    console.error('Full error:', error);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Headers:', error.response.headers);
    }
    
    throw new Error(`Error al obtener información del producto: ${error.message}`);
  }
}

function extractMercadoLibreFeatures(html) {
  const featureMatch = html.match(/class="ui-pdp-features"[^>]*>(.*?)<\/div>/s);
  if (!featureMatch) return [];

  const featureText = featureMatch[1];
  const features = featureText.match(/<p[^>]*>([^<]+)<\/p>/g) || [];
  
  return features.map(feature => {
    const match = feature.match(/>([^<]+)</);
    return match ? match[1].trim() : '';
  }).filter(Boolean);
} 