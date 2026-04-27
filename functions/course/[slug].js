export async function onRequest(context) {
  const { params, request } = context;
  const courseSlug = params.slug;
  const userAgent = request.headers.get('user-agent') || '';

  // Check if the visitor is a search engine or social media bot
  const isBot = /whatsapp|telegram|twitterbot|facebookexternalhit|linkedinbot|slackbot|discordbot|googlebot|crawler|spider/i.test(userAgent);

  // If it's a real human, just load the normal website (index.html)
  if (!isBot) {
    return context.next();
  }

  try {
    // Fetch the specific course details from your backend
    const res = await fetch(`https://mathrone-backend.onrender.com/api/v1/courses/public/${courseSlug}`);
    if (!res.ok) throw new Error('Course not found');
    const course = await res.json();

    const title = `${course.title} | Mathrone Academy`;
    const image = course.image_url || 'https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png';
    const url = `https://mathroneacademy.com/course/${courseSlug}`;
    
    // Clean up the description
    const plainText = (course.description || course.title).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const description = plainText.slice(0, 160);

    // Build a semantic HTML page for the bot to read
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${title}</title>
  <meta name="description" content="${description}"/>
  <link rel="canonical" href="${url}"/>

  <meta property="og:type" content="article"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${description}"/>
  <meta property="og:image" content="${image}"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:site_name" content="Mathrone Academy"/>

  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${description}"/>
  <meta name="twitter:image" content="${image}"/>
</head>
<body>
  <h1>${course.title}</h1>
  <p><strong>Subject:</strong> ${course.subject} | <strong>Level:</strong> ${course.level}</p>
  <img src="${image}" alt="${course.title}" />
  <p>${plainText}</p>
</body>
</html>`;

    return new Response(html, {
      headers: { 
        'content-type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (e) {
    // If the course doesn't exist, fall back to normal site
    return context.next();
  }
}