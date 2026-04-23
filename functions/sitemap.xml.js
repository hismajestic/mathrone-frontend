export async function onRequest(context) {
  const SUPABASE_URL = 'https://hdpkjomganndiiprnpok.supabase.co'
  const SUPABASE_ANON_KEY = context.env.SUPABASE_ANON_KEY
  const BASE = 'https://mathroneacademy.com'
  const today = new Date().toISOString().split('T')[0]

  const staticPages = [
    { loc: '/',        changefreq: 'weekly',  priority: '1.0', lastmod: today },
    { loc: '/news',    changefreq: 'daily',   priority: '0.9', lastmod: today },
    { loc: '/shop',    changefreq: 'weekly',  priority: '0.8', lastmod: today },
    { loc: '/courses',  changefreq: 'weekly',  priority: '0.8', lastmod: today },
    { loc: '/tutors',  changefreq: 'weekly',  priority: '0.8', lastmod: today },
    { loc: '/about',   changefreq: 'monthly', priority: '0.7', lastmod: today },
    { loc: '/terms',   changefreq: 'yearly',  priority: '0.4', lastmod: today },
    { loc: '/privacy', changefreq: 'yearly',  priority: '0.4', lastmod: today },
  ]

  let dynamicUrls = ''

  try {
    // News articles
    const newsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/news_posts?select=slug,updated_at&slug=not.is.null&order=updated_at.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    )
    const articles = await newsRes.json()
    if (Array.isArray(articles)) {
      for (const a of articles) {
        if (!a.slug) continue
        const lastmod = a.updated_at ? a.updated_at.split('T')[0] : today
        dynamicUrls += urlTag(`${BASE}/news/${a.slug}`, lastmod, 'weekly', '0.7')
      }
    }

    // Public courses
    const coursesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/courses?select=id,slug,updated_at&is_published=eq.true`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    )
    const courses = await coursesRes.json()
    if (Array.isArray(courses)) {
      for (const c of courses) {
        if (!c.id) continue
        const lastmod = c.updated_at ? c.updated_at.split('T')[0] : today
        const urlIdentifier = c.slug || c.id
        dynamicUrls += urlTag(`${BASE}/course/${urlIdentifier}`, lastmod, 'weekly', '0.8')
      }
    }

    // Products — select all active with slug, no updated_at filter
    const shopRes = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=slug,created_at&is_active=eq.true&slug=not.is.null`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    )
    const products = await shopRes.json()
    if (Array.isArray(products)) {
      for (const p of products) {
        if (!p.slug) continue
        const lastmod = p.created_at ? p.created_at.split('T')[0] : today
        dynamicUrls += urlTag(`${BASE}/shop/${p.slug}`, lastmod, 'weekly', '0.6')
      }
    }
  } catch (e) {
    // Supabase unavailable — sitemap still serves static pages
  }

  const staticUrls = staticPages
    .map(p => urlTag(`${BASE}${p.loc}`, p.lastmod, p.changefreq, p.priority))
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}${dynamicUrls}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

function urlTag(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>\n`
}