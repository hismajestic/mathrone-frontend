export async function onRequest(context) {
  const { params, request } = context
  const slugOrId = params.id
  const userAgent = request.headers.get('user-agent') || ''
  const BASE = 'https://mathroneacademy.com'
  const API  = 'https://mathrone-backend.onrender.com/api/v1'

  const isBot = /googlebot|bingbot|yandex|duckduckbot|slurp|baiduspider|whatsapp|telegram|twitterbot|facebookexternalhit|linkedinbot|slackbot|discordbot|crawler|spider|bot/i.test(userAgent)

  // Regular users — serve the SPA shell normally
  if (!isBot) return context.next()

  try {
    // Try slug-based lookup first, fall back to ID
    let article = null
    const slugRes = await fetch(`${API}/news/by-slug/${slugOrId}`)
    if (slugRes.ok) {
      article = await slugRes.json()
    } else {
      const idRes = await fetch(`${API}/news/${slugOrId}`)
      if (idRes.ok) article = await idRes.json()
    }

    if (!article || article.detail) return context.next()

    const title       = esc(article.title || 'Mathrone Academy News')
    const slug        = article.slug || article.id
    const url         = `${BASE}/news/${slug}`
    const image       = article.image_url || `${BASE}/og-banner.jpg`
    const plainText   = (article.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const description = esc(plainText.slice(0, 155) + (plainText.length > 155 ? '…' : ''))
    const fullTitle   = esc(title + ' | Mathrone Academy Rwanda')
    const published   = article.created_at ? new Date(article.created_at).toISOString() : ''
    const modified    = article.updated_at ? new Date(article.updated_at).toISOString() : published
    const dateDisplay = article.created_at
      ? new Date(article.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
      : ''

    // Category label map
    const catLabels = {
      news:'Education News', scholarship:'Scholarships', government:'Government Updates',
      career:'Career Opportunities', abroad:'Study Abroad', resources:'Learning Resources'
    }
    const catLabel = catLabels[article.category] || 'Education News'

    // Render article body — strip scripts/iframes for safety, keep text + headings
    const safeBody = (article.content || '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '[embedded media]')

    const schema = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': article.title,
      'description': plainText.slice(0, 160),
      'image': { '@type': 'ImageObject', 'url': image, 'width': 1200, 'height': 630 },
      'datePublished': published,
      'dateModified': modified,
      'author': { '@type': 'Organization', 'name': 'Mathrone Academy', 'url': BASE },
      'publisher': {
        '@type': 'Organization',
        'name': 'Mathrone Academy',
        'logo': { '@type': 'ImageObject', 'url': `${BASE}/favicon.png` }
      },
      'mainEntityOfPage': { '@type': 'WebPage', '@id': url },
      'articleSection': catLabel,
      'keywords': (article.tags || []).join(', ')
    })

    const breadcrumb = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home',  'item': `${BASE}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'News',  'item': `${BASE}/news` },
        { '@type': 'ListItem', 'position': 3, 'name': article.title, 'item': url }
      ]
    })

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${fullTitle}</title>
  <meta name="description" content="${description}"/>
  <meta name="robots" content="index, follow"/>
  <link rel="canonical" href="${url}"/>

  <meta property="og:type" content="article"/>
  <meta property="og:title" content="${fullTitle}"/>
  <meta property="og:description" content="${description}"/>
  <meta property="og:image" content="${esc(image)}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:site_name" content="Mathrone Academy"/>
  ${published ? `<meta property="article:published_time" content="${published}"/>` : ''}
  ${modified  ? `<meta property="article:modified_time"  content="${modified}"/>` : ''}
  <meta property="article:section" content="${esc(catLabel)}"/>

  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${fullTitle}"/>
  <meta name="twitter:description" content="${description}"/>
  <meta name="twitter:image" content="${esc(image)}"/>
  <meta name="twitter:site" content="@mathroneacademy"/>

  <script type="application/ld+json">${schema}</script>
  <script type="application/ld+json">${breadcrumb}</script>

  <style>
    body{font-family:Arial,sans-serif;max-width:860px;margin:0 auto;padding:24px 16px;color:#1E2845;line-height:1.7}
    nav{margin-bottom:16px;font-size:13px}nav a{color:#1A5FFF;text-decoration:none;margin-right:8px}
    h1{font-size:2rem;font-weight:800;margin:16px 0 8px;line-height:1.2}
    .meta{font-size:13px;color:#6B6B80;margin-bottom:24px;display:flex;gap:12px;flex-wrap:wrap;align-items:center}
    .cat-badge{background:#EEF4FF;color:#1A5FFF;padding:3px 10px;border-radius:999px;font-weight:700;font-size:12px}
    .hero-img{width:100%;max-height:480px;object-fit:cover;border-radius:12px;margin:16px 0}
    .body{font-size:16px}
    .body img{max-width:100%;border-radius:8px;margin:12px 0}
    .body h2{font-size:1.4rem;font-weight:700;margin:24px 0 8px}
    .body h3{font-size:1.2rem;font-weight:700;margin:20px 0 6px}
    .body p{margin:0 0 14px}
    .body ul,.body ol{padding-left:24px;margin-bottom:14px}
    .body a{color:#1A5FFF}
    footer{margin-top:48px;padding-top:16px;border-top:1px solid #E5E2DA;font-size:13px;color:#8A98B8}
    footer a{color:#1A5FFF;text-decoration:none;margin-right:12px}
  </style>
</head>
<body>
  <nav aria-label="Breadcrumb">
    <a href="${BASE}/">Home</a> &rsaquo;
    <a href="${BASE}/news">Education News</a> &rsaquo;
    <span>${esc(article.title)}</span>
  </nav>

  <span class="cat-badge">${esc(catLabel)}</span>

  <h1>${esc(article.title)}</h1>

  <div class="meta">
    ${dateDisplay ? `<time datetime="${published}">${dateDisplay}</time>` : ''}
    ${article.source_name ? `<span>Source: <strong>${esc(article.source_name)}</strong></span>` : ''}
    <span>Mathrone Academy</span>
  </div>

  ${article.image_url ? `<img src="${esc(article.image_url)}" alt="${esc(article.title)}" class="hero-img" loading="eager" fetchpriority="high"/>` : ''}

  <div class="body">${safeBody}</div>

  ${article.source_url ? `<p><a href="${esc(article.source_url)}" target="_blank" rel="noopener">Read full article at source &rarr;</a></p>` : ''}

  <footer>
    <a href="${BASE}/">Home</a>
    <a href="${BASE}/news">Education News</a>
    <a href="${BASE}/tutors">Find a Tutor</a>
    <a href="${BASE}/shop">Learning Store</a>
    <p style="margin-top:8px">&copy; ${new Date().getFullYear()} Mathrone Academy. All rights reserved.</p>
  </footer>
</body>
</html>`

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Vary': 'User-Agent'
      }
    })

  } catch (e) {
    return context.next()
  }
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
