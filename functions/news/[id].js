export async function onRequest(context) {
  const { params, request } = context
  const articleId = params.id
  const userAgent = request.headers.get('user-agent') || ''

  const isBot = /whatsapp|telegram|twitterbot|facebookexternalhit|linkedinbot|slackbot|discordbot|googlebot|crawler|spider/i.test(userAgent)

  if (!isBot) {
    return context.next()
  }

  try {
    const res = await fetch(`https://mathrone-backend.onrender.com/api/v1/news/${articleId}`)
    const article = await res.json()

    const title = article.title || 'Mathrone Academy News'
    const image = article.image_url || 'https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png'
    const url = `https://mathroneacademy.pages.dev/news/${articleId}`

    // Strip HTML tags from content to get plain text description
    const plainText = (article.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const description = plainText.slice(0, 160)

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>${title}</title>
  <meta name="description" content="${description}"/>

  <meta property="og:type" content="article"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${description}"/>
  <meta property="og:image" content="${image}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:site_name" content="Mathrone Academy"/>

  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${description}"/>
  <meta name="twitter:image" content="${image}"/>

  <meta http-equiv="refresh" content="0;url=${url}"/>
</head>
<body>
  <p>Redirecting to <a href="${url}">${title}</a>...</p>
</body>
</html>`

    return new Response(html, {
      headers: { 'content-type': 'text/html;charset=UTF-8' }
    })

  } catch (e) {
    return context.next()
  }
}