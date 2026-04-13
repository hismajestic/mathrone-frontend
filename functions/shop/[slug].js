export async function onRequest(context) {
  const { params, request } = context;
  const productSlug = params.slug; // This grabs the product slug or ID from the URL
  const userAgent = request.headers.get('user-agent') || '';

  // Check if the visitor is a social media bot (WhatsApp, Twitter, Facebook, Google)
  const isBot = /whatsapp|telegram|twitterbot|facebookexternalhit|linkedinbot|slackbot|discordbot|googlebot|crawler|spider/i.test(userAgent);

  // If it's a real human, just load the normal website (index.html)
  if (!isBot) {
    return context.next();
  }

  try {
    // If it's a bot, fetch the specific product details from your backend
    const res = await fetch(`https://mathrone-backend.onrender.com/api/v1/shop/products/${productSlug}`);
    if (!res.ok) throw new Error('Product not found');
    const product = await res.json();

    const title = `${product.name} | Mathrone Academy Store`;
    const image = product.image_url || 'https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png';
    const url = `https://mathroneacademy.pages.dev/shop/${productSlug}`;
    
    // Clean up the description
    const plainText = (product.description || product.name).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const description = `Buy for RWF ${product.price}. ${plainText}`.slice(0, 160);

    // Build a hidden HTML page just for the bot to read
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>${title}</title>
  <meta name="description" content="${description}"/>

  <meta property="og:type" content="product"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${description}"/>
  <meta property="og:image" content="${image}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:site_name" content="Mathrone Academy Store"/>

  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${description}"/>
  <meta name="twitter:image" content="${image}"/>

  <!-- Send the bot/user to the real URL -->
  <meta http-equiv="refresh" content="0;url=${url}"/>
</head>
<body>
  <p>Redirecting to <a href="${url}">${title}</a>...</p>
</body>
</html>`;

    return new Response(html, {
      headers: { 'content-type': 'text/html;charset=UTF-8' }
    });

  } catch (e) {
    // If the product doesn't exist or backend fails, just load the normal site
    return context.next();
  }
}