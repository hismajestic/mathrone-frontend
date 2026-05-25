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
    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": course.title,
      "description": description,
      "provider": {
        "@type": "Organization",
        "name": "Mathrone Academy",
        "sameAs": "https://mathroneacademy.com"
      },
      "image": image,
      "offers": {
        "@type": "Offer",
        "price": course.price || "0",
        "priceCurrency": "RWF",
        "availability": "https://schema.org/InStock"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Online",
        "courseWorkload": course.duration_mins ? `PT${course.duration_mins}M` : "PT10H"
      }
    };

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
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <article>
    <h1>${course.title}</h1>
    <nav>Subject: ${course.subject} | Level: ${course.level} | Curriculum: ${course.curriculum || 'General'}</nav>
    <img src="${image}" alt="${course.title}" style="max-width:800px;"/>
    <section>
      <h2>About this course</h2>
      <p>${plainText}</p>
      <p>Price: ${course.price > 0 ? 'RWF ' + Number(course.price).toLocaleString() : 'Free'}</p>
    </section>
    <footer>
      <a href="${url}">Enroll in this course at Mathrone Academy</a>
    </footer>
  </article>
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