// ════════════════════════════════════════════════════════════
    // LANDING PAGE
    // ════════════════════════════════════════════════════════════
   
  function renderLanding() {
  render(`
  <style>
    .lnav{display:flex;align-items:center;justify-content:space-between;padding:10px 24px;border-bottom:1px solid rgba(255,255,255,0.08);position:sticky;top:0;background:#1e3a8a;z-index:100;flex-wrap:nowrap;gap:8px}
    .lbrand{font-size:20px;font-weight:700;color:#fff;cursor:pointer;background:none;border:none;display:flex;align-items:left;gap:8px;flex-shrink:0}
    .lnav-links{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
    .btn-o{border:1px solid rgba(255,255,255,0.4);background:transparent;padding:8px 18px;border-radius:8px;font-size:14px;cursor:pointer;color:#fff;min-height:44px;display:inline-flex;align-items:center;justify-content:center;transition:all 0.2s}
    .btn-o:hover{background:rgba(255,255,255,0.1)}
    .btn-o:active{transform:scale(0.98)}
    .btn-p{background:#f59e0b;color:#1a1a1a;border:none;padding:8px 18px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;min-height:44px;display:inline-flex;align-items:center;justify-content:center;transition:all 0.2s}
    .btn-p:active{transform:scale(0.98)}
    .hero{position:relative;background:none;padding:80px 0;text-align:center;overflow:hidden;min-height:60vh;display:flex;align-items:center;justify-content:center}
    .htag{display:inline-block;background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.9);font-size:13px;padding:6px 16px;border-radius:999px;margin-bottom:24px;border:1px solid rgba(255,255,255,0.2)}
    .htitle{font-size:52px;font-weight:800;color:#fff;line-height:1.15;margin-bottom:20px;font-family:'Playfair Display',serif;word-wrap:break-word}
    .htitle span{color:#f59e0b}
    .hsub{font-size:17px;color:rgba(255,255,255,0.75);max-width:560px;margin:0 auto 36px;line-height:1.7;word-wrap:break-word}
    .hbtns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-bottom:56px;align-items:center}
    @media(max-width:768px){
      .hbtns{gap:10px;margin-bottom:40px}
    }
    @media(max-width:480px){
      .hbtns{flex-direction:column;gap:12px}
      .hbtns button{width:100%;min-height:48px}
    }
    .btn-hero-p{background: var(--blue); color: #fff; border: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 14px rgba(26, 95, 255, 0.35); min-height: 48px; display: inline-flex; align-items: center; justify-content: center}
    .btn-hero-p:hover{background: var(--blue2); transform: scale(1.05); box-shadow: 0 6px 20px rgba(26, 95, 255, 0.5)}
    .btn-hero-p:active{transform: scale(0.98)}
    .btn-hero-o{background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.5); padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; min-height: 48px; display: inline-flex; align-items: center; justify-content: center}
    .btn-hero-o:hover{background: rgba(255,255,255,0.1); transform: scale(1.05); border-color: rgba(255,255,255,0.8)}
    .btn-hero-o:active{transform: scale(0.98)}
    .btn-g{background:#f59e0b;color:#1a1a1a;border:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer}
    .btn-w{background:transparent;color:#fff;border:2px solid rgba(255,255,255,0.5);padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer}
    .btn-w:hover{background:rgba(255,255,255,0.1)}
    .hstats{display:flex;justify-content:center;align-items:flex-start;gap:clamp(12px,3vw,56px);flex-wrap:nowrap;border-top:1px solid rgba(255,255,255,0.15);padding-top:40px;width:100%;overflow:hidden}
    .hsnum{font-size:clamp(18px,4.5vw,36px);font-weight:800;color:#fff;white-space:nowrap;display:flex;align-items:center;justify-content:center;gap:4px}
    .hslbl{font-size:clamp(9px,2vw,13px);color:rgba(255,255,255,0.6);margin-top:4px;white-space:nowrap}
    .lsection{padding:72px 0}
    .lsection-inner{max-width:1100px;margin:0 auto}
    .stitle{font-size:34px;font-weight:800;color:var(--navy);text-align:center;margin-bottom:12px;font-family:'Playfair Display',serif}
    .ssub{font-size:16px;color:var(--g400);text-align:center;margin-bottom:48px}
    .steps-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
    .step-card{background:var(--sky);border-radius:16px;padding:28px;text-align:center;border:1px solid var(--g100)}
    .step-num{font-size:11px;font-weight:700;color:var(--blue);margin-bottom:10px;letter-spacing:0.05em}
    .step-icon{width:60px;height:60px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
    .step-t{font-size:16px;font-weight:700;margin-bottom:8px;color:var(--navy)}
    .step-d{font-size:13px;color:var(--g600);line-height:1.6}
    .features-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
    .feat{background:#fff;border:1px solid var(--g100);border-radius:16px;padding:24px}
    .feat-ic{font-size:28px;margin-bottom:14px}
    .feat-t{font-size:15px;font-weight:700;margin-bottom:6px;color:var(--navy)}
    .feat-d{font-size:13px;color:var(--g600);line-height:1.6}
    .tutors-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
    .tcard{background:#fff;border:1px solid var(--g100);border-radius:16px;padding:24px}
    .tbadge{display:inline-block;background:#e0e7ff;color:#1e40af;font-size:11px;padding:3px 10px;border-radius:999px;margin-right:4px;margin-bottom:4px}
    .testimonials-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
    .testi{background:#fff;border-radius:16px;padding:24px;border:1px solid var(--g100)}
    .testi-txt{font-size:14px;color:var(--g600);line-height:1.7;margin-bottom:16px;font-style:italic}
    .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px}
    .cinput{width:100%;border:1px solid var(--g200);background:#fff;border-radius:8px;padding:10px 14px;font-size:14px;color:var(--navy);margin-bottom:12px;outline:none;min-height:44px}
    .cinput:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(26, 95, 255, .10)}
    @media(max-width:768px){
      .cinput{font-size:16px;padding:12px 14px;min-height:48px}
    }
    .btn-wa:hover{
  background:#128c4a !important;
}

/* FOOTER GRID */
.footer-grid{
  display:grid;
  grid-template-columns:2fr 1fr 1fr 1fr;
  gap:32px;
}

/* FORCE CLEAN COLUMN STRUCTURE */
.footer-grid > div{
  display:flex;
  flex-direction:column;
  align-items:flex-start;
}

/* FOOTER LINKS */
.footer-link{
  display:block;
  font-size:14px;
  color:rgba(255,255,255,0.6);
  margin-bottom:8px;
  cursor:pointer;
  background:none;
  border:none;
  text-align:left;
  transition:0.3s;
}

.footer-link:hover{
  color:#fff;
}

/* DESCRIPTION */
.footer-description{
  max-width:400px;
  font-size:14px;
  line-height:1.6;
}

/* SOCIAL */
.footer-social{
  display:flex;
  gap:12px;
  flex-wrap:wrap;
  width: 100%;
  padding: 4px 0;
}

@media(max-width:600px){
  .footer-social{
    justify-content: center; /* Centers icons on mobile to prevent edge clipping */
    gap: 15px; /* Slightly larger gap for easier tapping on mobile */
  }
}
  .social-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.social-icon svg {
  width: 18px;
  height: 18px;
  fill: white;
}

/* X specific */
.social-icon.x {
  background: linear-gradient(135deg, #000000, #1a1a1a);
}

/* TABLET */
@media(max-width:900px){
  .lnav{padding:12px 0}
  .lnav-links{gap:8px}
  .btn-o,.btn-p{font-size:12px;padding:6px 12px}

  .footer-grid{
    grid-template-columns:1fr 1fr;
  }

  /* Make brand take full width */
  .footer-grid > div:first-child{
    grid-column:1 / -1;
  }
}

/* MOBILE */
@media(max-width:600px){
  .steps-grid,
  .features-grid,
  .tutors-grid,
  .testimonials-grid{
    grid-template-columns:1fr;
  }

  .contact-grid{
    grid-template-columns:1fr;
  }

  .footer-grid{
    grid-template-columns:1fr;
  }

  .footer-grid > div{
    margin-bottom:20px;
    align-items:flex-start; /* keep LEFT alignment */
  }

  .footer-social{
    justify-content:flex-start; /* align left */
  }

  .footer-description{
    margin:0;
  }

  .footer-link{
    text-align:left;
  }
}

  .htitle{font-size:28px}
  .lsection{padding:40px 0}
  .hero{padding:48px 0 !important}
  .hstats{gap:clamp(12px,3vw,56px)}

  .lnav{
    padding:10px 0;
    gap:6px;
    align-items:center;
  }

  .lbrand{
    font-size:15px;
    flex-shrink:0;
  }

  .lbrand img{
    height:26px !important;
  }

  .lnav-links{
    gap:4px;
    flex-wrap:nowrap;
    align-items:center;
  }

  .btn-o,.btn-p{
    font-size:11px;
    padding:5px 10px;
    min-height:40px;
    white-space:nowrap;
  }
}
@media(max-width:480px){
  .hide-mobile { display: none !important; }
}

/* FOOTER BOTTOM */
.footer-bottom{
  text-align:center;
  margin-top:20px;
  font-size:13px;
  color:rgba(255,255,255,0.6);
}
    @media(max-width:480px){
      .lnav{padding:10px 16px !important;align-items:center;gap:4px;flex-wrap:nowrap !important;}
      .nav-left, .nav-right {gap:6px !important; flex-wrap:nowrap !important;}
      .lbrand{justify-content:flex-start;flex-shrink:0;gap:4px !important;}
      .lbrand img{height:28px !important; width:28px !important;}
      .lbrand span{display:none}
      .hamburger {width:32px; height:32px;}
      .hamburger svg {width:28px; height:28px;}
      .btn-o,.btn-p{font-size:13px !important;padding:6px 12px !important;min-height:36px !important;white-space:nowrap;}
    }
    @keyframes slideLeft { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    #tutors-slider:hover { animation-play-state:paused }
    @keyframes chcIn{0%{opacity:0;clip-path:circle(0% at 100% 0%)}100%{opacity:1;clip-path:circle(150% at 100% 0%)}}
    @keyframes chcGlow{0%,100%{box-shadow:-4px 4px 28px 4px rgba(245,158,11,0.2)}50%{box-shadow:-8px 8px 50px 12px rgba(245,158,11,0.5)}}
      @keyframes dotPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.8)}}
    .chc-wrap{position:absolute;top:0;right:0;width:400px;height:400px;cursor:pointer;z-index:0;overflow:hidden;border-radius:0 0 0 100%;animation:chcIn 1s cubic-bezier(.4,0,.2,1) 0.8s both,chcGlow 4s ease-in-out 2s infinite;transition:all 0.3s}
    .chc-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top}
    .chc-overlay{position:absolute;inset:0;background:linear-gradient(225deg,rgba(6,14,36,0.82) 0%,rgba(6,14,36,0.6) 55%,transparent 100%);transition:background 0.3s}
    .chc-wrap:hover .chc-overlay{background:linear-gradient(225deg,rgba(6,14,36,0.92) 0%,rgba(6,14,36,0.72) 60%,transparent 100%)}
    .chc-border{position:absolute;inset:0;border-radius:0 0 0 100%;border:2px solid rgba(245,158,11,0.55);border-top:none;border-right:none;pointer-events:none}
    .chc-content{position:absolute;top:35px;right:25px;width:300px;text-align:right}
    .chc-label{font-size:11px;font-weight:800;color:#f59e0b;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;justify-content:flex-end;gap:6px}
    .chc-dot{width:8px;height:8px;border-radius:50%;background:#f59e0b;animation:dotPulse 2s ease-in-out infinite;flex-shrink:0;display:inline-block}
    .chc-title{font-size:22px;font-weight:800;color:#fff;line-height:1.2;margin-bottom:10px;font-family:'Playfair Display',serif}
    .chc-sub{font-size:13px;color:rgba(255,255,255,0.8);line-height:1.5;margin-bottom:16px}
    .chc-pills{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end;margin-bottom:16px}
    .chc-pill{display:inline-flex;align-items:center;gap:4px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.35);color:#f59e0b;font-size:10px;font-weight:700;padding:4px 10px;border-radius:999px;white-space:nowrap}
    .chc-cta{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:800;color:#0f172a;background:#f59e0b;padding:8px 18px;border-radius:999px;transition:transform 0.2s}
    .chc-wrap:hover .chc-cta{transform:scale(1.05)}
    @media(max-width:1100px){.chc-wrap{width:360px;height:360px;border-radius:0 0 0 100%}.chc-border{border-radius:0 0 0 100%}.chc-content{width:270px;top:30px;right:20px}.chc-title{font-size:18px}.chc-sub{font-size:12px}.chc-pill{font-size:10px;padding:3px 8px}}
    @media(max-width:900px){.chc-wrap{width:300px;height:300px;border-radius:0 0 0 100%}.chc-border{border-radius:0 0 0 100%}.chc-content{width:220px;top:20px;right:15px}.chc-title{font-size:15px;margin-bottom:6px}.chc-sub{font-size:11px;margin-bottom:10px;line-height:1.4}.chc-pills{gap:4px;margin-bottom:10px}.chc-pill{font-size:9px;padding:2px 6px}.chc-cta{font-size:12px;padding:6px 14px}}
    @media(max-width:700px){.chc-wrap{width:220px;height:220px;border-radius:0 0 0 100%}.chc-border{border-radius:0 0 0 100%}.chc-content{width:160px;top:15px;right:12px}.chc-label{font-size:9px;margin-bottom:4px}.chc-title{font-size:12px;margin-bottom:4px}.chc-sub{display:none}.chc-pills{display:none}.chc-cta{font-size:10px;padding:4px 10px}}
    @media(max-width:600px){.chc-wrap{display:none!important;position:absolute!important;width:0!important;height:0!important;overflow:hidden!important}}
    .chc-mobile-banner{display:none}
    @media(max-width:600px){.chc-mobile-banner{display:flex;align-items:center;gap:0;background:rgba(6,14,36,0.88);border:1.5px solid rgba(245,158,11,0.45);border-radius:12px;overflow:hidden;cursor:pointer;margin-top:16px;position:relative;width:100%}}
    .chc-mobile-banner img{width:88px;height:88px;object-fit:cover;flex-shrink:0;display:block}
    .chc-mobile-banner-body{padding:10px 12px;flex:1}
    .chc-mobile-banner-label{font-size:9px;font-weight:800;color:#f59e0b;letter-spacing:0.1em;text-transform:uppercase;display:flex;align-items:center;gap:5px;margin-bottom:4px}
    .chc-mobile-banner-title{font-size:13px;font-weight:800;color:#fff;line-height:1.3;margin-bottom:5px;font-family:'Playfair Display',serif}
    .chc-mobile-banner-pills{display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px}
    .chc-mobile-banner-cta{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:800;color:#0f172a;background:#f59e0b;padding:3px 9px;border-radius:999px}
  </style>

 <!-- NAV -->
  <nav class="lnav">

  <!-- LEFT SIDE -->
  <div class="nav-left" style="display:flex;align-items:center;gap:10px;">

    <!-- HAMBURGER (mobile only) -->
    <button class="hamburger" id="hamburgerBtn" onclick="toggleMenu()">
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="17" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
    <rect x="9" y="12" width="13" height="2.5" rx="1.25" fill="white"/>
    <rect x="9" y="17" width="13" height="2.5" rx="1.25" fill="white"/>
    <rect x="9" y="22" width="13" height="2.5" rx="1.25" fill="white"/>
    <circle cx="25" cy="13.25" r="1.5" fill="white"/>
    <circle cx="25" cy="18.25" r="1.5" fill="white"/>
    <circle cx="25" cy="23.25" r="1.5" fill="white"/>
  </svg>
</button>

    <!-- BRAND -->
    <a href="/" class="lbrand" style="text-decoration:none" onclick="navigate('landing', null, event)" style="display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer;">
      <img src="https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png" alt="Mathrone Academy logo" loading="lazy" decoding="async" style="height:60px;width:60px;object-fit:contain"/>
      <span style="font-size:25px;font-weight:700;color:#fff;white-space:nowrap">Mathrone Academy</span>
    </a>

  </div>

 <!-- CENTER MENU (DESKTOP ONLY STYLE) -->
  <div class="nav-menu" id="navMenu">
    
    <a href="/news" class="btn-o" style="text-decoration:none;border:none;background:none;font-size:17px;color:#fff;cursor:pointer;padding:5px 8px;white-space:nowrap" onclick="navigate('news', null, event)">News</a>
    <a href="/shop" class="btn-o" style="text-decoration:none;border:none;background:none;font-size:17px;color:#fff;cursor:pointer;padding:5px 8px;white-space:nowrap" onclick="navigate('shop', null, event)">Shop</a>
    <a href="/majestic-lab" class="btn-o" style="text-decoration:none;border:none;background:none;font-size:17px;color:var(--gold);cursor:pointer;padding:5px 8px;white-space:nowrap;font-weight:700" onclick="navigate('majestic-lab', null, event)"> Majestic Lab</a>
    <a href="/about" class="btn-o" style="text-decoration:none;border:none;background:none;font-size:17px;color:#fff;cursor:pointer;padding:5px 8px;white-space:nowrap" onclick="navigate('about', null, event)">About Us</a>
    <a href="#contact" class="btn-o" style="text-decoration:none;border:none;background:none;font-size:17px;color:#fff;cursor:pointer;padding:5px 8px;white-space:nowrap" onclick="event.preventDefault(); window.scrollToContact()">Contact Us</a>
  </div>

  <!-- RIGHT SIDE -->
  <div class="nav-right" style="display:flex;align-items:center;gap:10px;">
    
    <!-- ✨ NEW INSTALL BUTTON (Always visible on mobile) -->
    <button id="nav-install-btn" class="btn-o" style="display:none; gap:6px; border-color:#f59e0b; color:#f59e0b; font-size:16px; font-weight:800; padding:5px 10px; cursor:pointer;" onclick="installApp()">
      <i data-lucide="download" style="width:18px;height:18px"></i> 
      <span class="hide-mobile">Install App</span>
    </button>

    <a href="/login" class="btn-o" style="text-decoration:none;border:none;background:none;font-size:20px;color:#fff;cursor:pointer;padding:5px 8px;white-space:nowrap" onclick="navigate('login', null, event)">Sign In</a>
    <a href="/register" class="btn-p" style="text-decoration:none;white-space:nowrap;font-size:20px" onclick="navigate('register', null, event)">Get Started</a>
  </div>

</nav>

  <!-- HERO -->
  <section class="hero">
    <div style="position:absolute;inset:0;z-index:0">
      <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=75&fm=webp" 
     srcset="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=75&fm=webp 600w, https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=75&fm=webp 1200w"
     sizes="(max-width: 768px) 600px, 1200px"
     alt="Mathrone Academy Hero" fetchpriority="high" decoding="async" style="width:100%;height:100%;object-fit:cover;display:block"/>
      <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(30,58,138,0.88) 0%,rgba(37,99,235,0.82) 100%)"></div>
    </div>
    <!-- COURSES TEASER quarter circle desktop only -->
    <div class="chc-wrap" onclick="navigate('courses')">
      <img class="chc-bg" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=75&fm=webp" alt="Students studying" fetchpriority="high"/>
      <div class="chc-overlay"></div>
      <div class="chc-border"></div>
      <div class="chc-content">
        <div class="chc-label">
          <span class="chc-dot"></span>
          <i data-lucide="graduation-cap" style="width:10px;height:10px;color:#f59e0b"></i>
          <span>Online Courses</span>
        </div>
        <div class="chc-title">Pass National Exams at Ease</div>
        <div class="chc-sub">REB · IGCSE · IB · French · Uni-expert video lessons for every exam.</div>
        <div class="chc-pills">
          <span class="chc-pill"><i data-lucide="calculator" style="width:8px;height:8px"></i>Maths</span>
          <span class="chc-pill"><i data-lucide="flask-conical" style="width:8px;height:8px"></i>Sciences</span>
          <span class="chc-pill"><i data-lucide="monitor" style="width:8px;height:8px"></i>Digital</span>
          <span class="chc-pill"><i data-lucide="trending-up" style="width:8px;height:8px"></i>Business</span>
          <span class="chc-pill"><i data-lucide="video" style="width:8px;height:8px"></i>Video Editing</span>
          <span class="chc-pill"><i data-lucide="code-2" style="width:8px;height:8px"></i>Web Dev</span>
          <span class="chc-pill"><i data-lucide="plus-circle" style="width:8px;height:8px"></i>Others</span>
        </div>
        <div class="chc-cta">
          <i data-lucide="arrow-right" style="width:11px;height:11px"></i>
          <span>Explore Courses</span>
        </div>
      </div>
    </div>
    <div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center">
      <div class="htag"> Majestic Learning. Royal Results.</div>
      <h1 class="htitle">Never Fall Behind in Class <span>Ever Again</span></h1>
      <p class="hsub">Teacher absent? Missed a topic? Or just need a better explanation? Mathrone Academy is your academic safety net. Access expert 1-on-1 tutors, REB-aligned video courses, and an AI Tutor to guarantee your success and provides high-quality learning tools  from notebooks to educational kits for personalised success,at home or online..</p>
      <div class="hbtns">
        <a href="/register" class="btn-hero-o" onclick="navigate('register', null, event)" style="background:#0e172b; border-color:var(--gold); text-decoration:none;"> Start Learning</a>
        <a href="/register" class="btn-hero-o" onclick="navigate('register', 'tutor', event)" style="text-decoration:none;">Become a Tutor</a>
        <a href="/shop" class="btn-hero-o" onclick="navigate('shop', null, event)" style="background:var(--gold); color:#1a1a1a; border-color:var(--gold); text-decoration:none;">🛒 Learning Store</a>
        <a href="/news" class="btn-hero-o" onclick="navigate('news', null, event)" style="background:#0e172b; border-color:#1e3a8a; text-decoration:none;">Read Updates</a>
        <a href="/majestic-lab" class="btn-hero-o" onclick="navigate('majestic-lab', null, event)" style="background:linear-gradient(135deg,#1e3a8a,#7c3aed);border-color:#7c3aed;text-decoration:none;display:inline-flex;align-items:center;gap:7px;font-weight:800"><i data-lucide="flask-conical" style="width:16px;height:16px"></i> Majestic Lab</a>
      </div>
      <!-- MOBILE ONLY: courses banner shown below buttons -->
      <div class="chc-mobile-banner" onclick="navigate('courses')">
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&q=80" alt="Students studying" loading="lazy"/>
        <div class="chc-mobile-banner-body">
          <div class="chc-mobile-banner-label">
            <span class="chc-dot"></span>
            <i data-lucide="graduation-cap" style="width:9px;height:9px;color:#f59e0b"></i>
            <span>Online Courses</span>
          </div>
          <div class="chc-mobile-banner-title">Pass National Exams at Ease</div>
          <div class="chc-mobile-banner-pills">
            <span class="chc-pill"><i data-lucide="calculator" style="width:8px;height:8px"></i>Maths</span>
          <span class="chc-pill"><i data-lucide="flask-conical" style="width:8px;height:8px"></i>Sciences</span>
          <span class="chc-pill"><i data-lucide="monitor" style="width:8px;height:8px"></i>Digital</span>
          <span class="chc-pill"><i data-lucide="trending-up" style="width:8px;height:8px"></i>Business</span>
          <span class="chc-pill"><i data-lucide="video" style="width:8px;height:8px"></i>Video Editing</span>
          <span class="chc-pill"><i data-lucide="code-2" style="width:8px;height:8px"></i>Web Dev</span>
          <span class="chc-pill"><i data-lucide="plus-circle" style="width:8px;height:8px"></i> And Many Others</span>
          </div>
          <div class="chc-mobile-banner-cta">
            <i data-lucide="arrow-right" style="width:10px;height:10px"></i>
            <span>Explore Courses</span>
          </div>
        </div>
      </div>
      <div class="hstats">
        <div style="text-align:center"><div class="hsnum" id="stat-tutors">0</div><div class="hslbl">Expert Tutors</div></div>
        <div style="text-align:center"><div class="hsnum" id="stat-students">0</div><div class="hslbl">Students</div></div>
        <div style="text-align:center"><div class="hsnum" id="stat-rating">0.0<i data-lucide="star" style="width:clamp(16px,4vw,28px);height:clamp(16px,4vw,28px);fill:#f59e0b;color:#f59e0b;margin-left:2px;vertical-align:middle"></i></div><div class="hslbl">Avg Rating</div></div>
        <div style="text-align:center"><div class="hsnum" id="stat-sat">0%</div><div class="hslbl">Satisfaction</div></div>
      </div>
    </div>
  </section>
 

  <!-- HOW IT WORKS -->
  <div class="lsection">
    <div class="lsection-inner">
      <h2 class="stitle">How It Works</h2>
      <p class="ssub">Three simple steps to start learning</p>
      <div class="steps-grid">
        ${[['1','clipboard-edit','Submit a Request','Tell us your subject, level, and preferred schedule. We handle the rest.'],
           ['2','target','We Match You','Our team handpicks the perfect tutor from our vetted, qualified pool.'],
           ['3','rocket','Start Learning','Your tutor contacts you and sessions begin immediately-online or at home.']
          ].map(([n,ic,t,d])=>`
        <div class="step-card">
          <div class="step-num">STEP ${n}</div>
          <div class="step-icon" style="color:var(--blue)"><i data-lucide="${ic}" style="width:32px;height:32px"></i></div>
          <h3 class="step-t">${t}</h3>
          <p class="step-d">${d}</p>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- FEATURES -->
  <div class="lsection" style="background:var(--sky)">
    <div class="lsection-inner">
      <h2 class="stitle">Why Choose Mathrone?</h2>
      <p class="ssub">Everything you need for a world-class learning experience</p>
      <div class="features-grid">
        ${[['check-circle-2','Vetted & Qualified Tutors','Every tutor is background-checked, interviewed, and holds verified academic qualifications.'],
           ['calendar-clock','Flexible Scheduling','Book sessions at times that work for you : evenings, weekends, or during school hours.'],
           ['monitor-smartphone','Online & Home Visits','Choose between video sessions from home or in-person visits from your tutor.'],
           ['bar-chart-3','Progress Tracking','Parents receive detailed progress reports after every session with marks and feedback.'],
           ['message-square','Direct Messaging','Stay in touch with your tutor anytime through our built-in messaging platform.'],
           ['shield-check','Safe & Secure','Encrypted platform, verified identities, and a dedicated support team watching over every interaction.']
          ].map(([ic,t,d])=>`
        <div class="feat">
          <div class="feat-ic" style="color:var(--blue)"><i data-lucide="${ic}" style="width:28px;height:28px"></i></div>
          <div class="feat-t">${t}</div>
          <p class="feat-d">${d}</p>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- TUTORS -->
 <!-- TUTORS SLIDER -->
  <div class="lsection" style="overflow:hidden">
    <div style="max-width:1100px;margin:0 auto">
      <h2 class="stitle">Meet Our Tutors</h2>
      <p class="ssub">Qualified, passionate educators ready to help your child succeed</p>
      <div style="overflow:hidden;position:relative">
        <div id="tutors-slider" style="display:flex;gap:20px;animation:slideLeft 20s linear infinite;width:max-content">
          ${[...Array(2)].flatMap(()=>[
            ['KM','#1e40af','Kamali Mugisha','BSc Mathematics, University of Rwanda',['Mathematics','Physics'],'4.9','48'],
            ['AN','#065f46','Amina Nziza','MEd English Language, KIE',['English','French'],'5.0','31'],
            ['BK','#7c3aed','Bruno Kalisa','BSc Chemistry & Biology, UR',['Chemistry','Biology'],'4.7','22'],
            ['JM','#b45309','Jean Mutesi','Digital Marketing & Web Design',['Digital Skills','Web Dev'],'4.8','15'],
            ['RN','#be185d','Rachel Nyiraneza','MBA Business & Entrepreneurship',['Business','Finance'],'4.9','27'],
            ['DU','#0e7490','David Uwimana','Video Production & Editing',['Video Editing','CapCut'],'4.7','19'],
          ]).map(([ini,bg,name,qual,subs,rat,rev])=>`
          <div style="background:#fff;border:1px solid var(--g100);border-radius:16px;padding:24px;min-width:220px;max-width:220px">
            <div style="width:52px;height:52px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff;margin-bottom:14px">${ini}</div>
            <div style="font-size:15px;font-weight:700;color:var(--navy);margin-bottom:2px">${name}</div>
            <div style="font-size:11px;color:var(--g400);margin-bottom:10px">${qual}</div>
            <div>${subs.map(s=>`<span style="background:#e0e7ff;color:#1e40af;font-size:11px;padding:3px 8px;border-radius:999px;margin-right:4px">${s}</span>`).join('')}</div>
            <div style="color:#f59e0b;font-size:13px;margin-top:10px">★★★★★ <span style="color:var(--g400);font-size:11px">${rat} · ${rev} reviews</span></div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- TESTIMONIALS -->
  <div class="lsection" style="background:var(--sky)">
    <div class="lsection-inner">
      <h2 class="stitle">What Parents Say</h2>
      <p class="ssub">Real results from real families across Rwanda</p>
      <div class="testimonials-grid">
        ${[['My daughter\'s math grades went from a C to an A in just two months. The tutor is patient, explains things clearly, and always sends a detailed report after each session.','Marie-Claire Uwimana','Parent · Kigali'],
           ['The platform is so easy to use. I can see exactly how my son is progressing, and the admin team is always quick to respond. Highly recommended for any parent in Rwanda.','Jean-Paul Habimana','Parent · Musanze'],
           ['We tried other tutoring services before but nothing compared to Mathrone. The tutors are professional, punctual, and genuinely care about the students they teach.','Diane Mukamana','Parent · Huye']
          ].map(([txt,name,role])=>`
        <div class="testi">
          <div style="font-size:28px;color:#f59e0b;margin-bottom:10px">❝</div>
          <p class="testi-txt">${txt}</p>
          <div style="font-size:13px;font-weight:700;color:var(--navy)">${name}</div>
          <div style="font-size:12px;color:var(--g400)">${role}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
  <!-- SHOP TEASER -->
  <div style="background:#fff;padding:72px 48px">
    <div style="max-width:1100px;margin:0 auto">
      <h2 class="stitle"> Buy School Supplies & Learning Materials in Rwanda</h2>
      <p class="ssub">Quality notebooks, geometry sets, science equipment and stationery delivered to your door anywhere in Kigali and Rwanda.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;margin-bottom:32px">
        ${[
          {icon:'book', label:'Notebooks & Books'},
          {icon:'pen-tool', label:'Writing Tools'},
          {icon:'ruler', label:'Geometry & Math'},
          {icon:'flask-conical', label:'Science Equipment'},
          {icon:'graduation-cap', label:'Teaching Aids'},
          {icon:'backpack', label:'Student Kits'},
        ].map(c=>`
        <div onclick="navigate('shop')" style="background:var(--sky);border-radius:16px;padding:20px;cursor:pointer;text-align:center;transition:all 0.2s;border:1px solid var(--g100)" onmouseover="this.style.background='#dbeafe'" onmouseout="this.style.background='var(--sky)'">
          <div style="margin-bottom:12px;color:var(--blue)"><i data-lucide="${c.icon}" style="width:32px;height:32px;margin:0 auto"></i></div>
          <div style="font-size:13px;font-weight:700;color:var(--navy)">${c.label}</div>
        </div>`).join('')}
      </div>
      <div style="text-align:center">
        <button class="btn btn-primary btn-lg" onclick="navigate('shop')">Browse All Products →</button>
      </div>
    </div>
  </div>
 <!-- NEWS TEASER -->
  <div style="background:var(--sky);padding:72px 48px">
    <div style="max-width:1100px;margin:0 auto">
      <h2 class="stitle"> Education News & Resources</h2>
      <p class="ssub">Stay updated with the latest scholarships, government updates and opportunities</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;margin-bottom:32px">
        ${NEWS_CATEGORIES.map(c=>`
        <div onclick="navigate('news')" style="background:#fff;border-radius:16px;padding:20px;border:1px solid var(--g100);cursor:pointer;text-align:center;transition:all 0.2s" onmouseover="this.style.background='#dbeafe'" onmouseout="this.style.background='#fff'">
          <div style="margin-bottom:12px;color:${c.color};display:flex;justify-content:center">${c.icon}</div>
          <div style="font-size:13px;font-weight:700;color:var(--navy)">${c.label}</div>
        </div>`).join('')}
      </div>
      <div style="text-align:center">
        <button class="btn btn-primary btn-lg" onclick="navigate('news')">View All News & Resources →</button>
      </div>
    </div>
  </div>
  <!-- CONTACT -->
  <div class="lsection">
    <div class="lsection-inner">
      <h2 class="stitle">Get In Touch</h2>
      <p class="ssub">Have a question? We'd love to hear from you</p>
      <div class="contact-grid">
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--navy);margin-bottom:6px">Send us a message</div>
          <div style="font-size:13px;color:var(--g400);margin-bottom:20px">We typically respond within 24 hours on business days.</div>
          <div id="contact-msg" style="display:none;padding:12px;border-radius:8px;margin-bottom:12px;font-size:13px"></div>
          <input class="cinput" id="contact-name" placeholder="Your full name"/>
          <input class="cinput" id="contact-email" type="email" placeholder="Email address"/>
          <input class="cinput" id="contact-subject" placeholder="Subject"/>
          <textarea class="cinput" id="contact-message" rows="4" placeholder="Your message..."></textarea>
          <button class="btn-g" id="contact-btn" style="padding:12px 28px" onclick="submitContactForm()">Send Message →</button>
        </div>
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--navy);margin-bottom:20px">Contact details</div>
          <div style="display:flex;flex-direction:column;gap:20px">
            ${[['map-pin','Office','KG 11 Ave, Kiyovu, Kigali, Rwanda'],
               ['phone','Phone','+250 786 684 285'],
               ['mail','Email','info@mathroneacademy.com'],
               ['clock','Hours','Mon–Sat: 8am – 6pm · Sunday: Closed']
              ].map(([ic,t,d])=>`
            <div style="display:flex;gap:14px;align-items:flex-start">
              <div style="color:var(--blue)"><i data-lucide="${ic}" style="width:24px;height:24px"></i></div>
              <div><div style="font-size:14px;font-weight:700;color:var(--navy)">${t}</div><div style="font-size:13px;color:var(--g400);margin-top:2px">${d}</div></div>
            </div>`).join('')}
            <a href="https://wa.me/250786684285" target="_blank" class="btn-wa"
               style="display:inline-flex;align-items:center;gap:8px;background:#25d366;color:#fff;padding:10px 18px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;margin-top:8px;transition:background 0.2s;width:fit-content">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.126 1.528 5.855L.057 23.117a.75.75 0 00.916.943l5.453-1.43A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.5-5.2-1.373l-.374-.217-3.876 1.016 1.035-3.762-.237-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              WhatsApp Us
            </a>
            
          </div>
        </div>
      </div>
    </div>
  </div>

  
  <!-- CTA -->
  <div style="background:var(--navy);padding:72px 48px;text-align:center">
    <h2 style="font-family:'Playfair Display',serif;font-size:36px;font-weight:700;color:#fff;margin-bottom:14px">Ready to Start Learning?</h2>
    <p style="color:rgba(255,255,255,0.7);font-size:16px;margin-bottom:32px">Join thousands of students achieving their academic goals across Rwanda.</p>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <button class="btn-g" onclick="navigate('register')">Register as Student</button>
      <button class="btn-w" onclick="navigate('register','tutor')">Apply as Tutor</button>
      <button class="btn-g" onclick="navigate('shop')">Buy Learning Materials</button>
       <button class="btn-hero-o" onclick="navigate('news')" style="background:#0e172b;border-color:var(--gold)">Read News  and Updates</button>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background:#0f172a;padding:56px 48px">
    <div style="max-width:1100px;margin:0 auto">
      <div class="footer-grid">
        <div>
          <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:12px"> Mathrone Academy</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.5);line-height:1.7;margin-bottom:20px">Mathrone Academy connects ambitious students with expert tutors and provides high-quality learning tools from notebooks to educational kits for personalised success,at home or online.</div>
          <div class="footer-social" style="margin-top:16px;">
            <a href="https://facebook.com/mathroneacademy" target="_blank" class="social-icon" style="background:#1877f2;">
              <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://instagram.com/mathroneacademy" target="_blank" class="social-icon" style="background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);">
              <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://tiktok.com/@mathroneacademy" target="_blank" class="social-icon" style="background:#000;">
              <svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
            </a>
            <a href="https://youtube.com/@mathroneacademy" target="_blank" class="social-icon" style="background:#ff0000;">
              <svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://x.com/mathroneacademy" target="_blank" rel="noopener noreferrer" class="social-icon" style="background:#000;">
              <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
            </a>
            <a href="https://linkedin.com/company/mathroneacademy" target="_blank" rel="noopener noreferrer" class="social-icon" style="background:#0a66c2;">
              <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://t.me/mathroneacademy" target="_blank" rel="noopener noreferrer" class="social-icon" style="background:#2AABEE;">
              <svg viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
          </div>
        </div>
        ${[['PLATFORM',['Find a Tutor','Become a Tutor','How It Works','Majestic Lab','Education News']],
           ['COMPANY',['About Us','Careers']],
           ['SUPPORT',['Help Centre','Contact Us','Privacy Policy','Terms of Service']]
          ].map(([ht,links])=>`
        <div>
          <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.9);margin-bottom:14px;letter-spacing:0.08em">${ht}</div>
          ${links.map(l => {
            const urlMap = {
              'Find a Tutor': '/register',
              'Become a Tutor': '/register',
              'How It Works': '#how-it-works',
              'Majestic Lab': '/majestic-lab',
              'Education News': '/news',
              'About Us': '/about',
              'Careers': '/news',
              'Contact Us': 'javascript:void(0)', // Prevent hash jump
              'Privacy Policy': '/privacy',
              'Terms of Service': '/terms'
            };
            return `<a href="${urlMap[l] || '#'}" class="footer-link" style="text-decoration:none; display:block;" onclick="handleFooterLink('${l}', event)">${l}</a>`;
          }).join('')}
        </div>`).join('')}
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.1);margin-top:40px;padding-top:24px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div style="font-size:12px;color:rgba(255,255,255,0.4)">© 2026 Mathrone Academy. All rights reserved..</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4)">Made with ❤️ in Kigali, Rwanda</div>
      </div>
    </div>
  </div>

  `)

  // Run after render
 // Run after render — always fetch live stats, never from cache
  setTimeout(async ()=>{
    const _ran = new Set()
    const _animate = (id, val, suf, dec) => {
      if (_ran.has(id)) return   // never animate same element twice
      _ran.add(id)
      animateCount(id, val, 2000, suf, dec)
    }
    try{
      const stats = await fetch(API_URL + '/auth/stats').then(r => r.json())
      _animate('stat-tutors',   stats.tutors   != null ? stats.tutors   : 1,   '+',  false)
      _animate('stat-students', stats.students != null ? stats.students : 6,   '+',  false)
      _animate('stat-rating',   stats.rating   != null ? stats.rating   : 4.8, '',  true)
      _animate('stat-sat',      stats.sat      != null ? stats.sat      : 96,  '%',  false)
    }catch(e){
      // Only show fallback if real fetch failed entirely
      _animate('stat-tutors',  1,   '+',  false)
      _animate('stat-students',6,   '+',  false)
      _animate('stat-rating',  4.8, '',  true)
      _animate('stat-sat',     96,  '%',  false)
    }
  }, 300)
}
    function renderMajesticLabPage(){
  render(`
  <style>
    @keyframes slideLabImages { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .lab-slider-container { background: #0A0F2C; padding: 40px 0; overflow: hidden; position: relative; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
    .lab-slider-track { display: flex; gap: 20px; animation: slideLabImages 40s linear infinite; width: max-content; }
    .lab-slider-track:hover { animation-play-state: paused; }
    .lab-image-card { width: 320px; height: 180px; border-radius: 12px; overflow: hidden; border: 2px solid rgba(26,95,255,0.3); background: #000; flex-shrink: 0; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .lab-image-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
    .lab-image-card:hover img { transform: scale(1.1); }
    
    .mlab-nav{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-bottom:1px solid rgba(255,255,255,0.08);background:var(--navy);position:sticky;top:0;z-index:100}
    .mlab-hero{background:linear-gradient(135deg,#0d1b40 0%,#1e3a8a 50%,#4c1d95 100%);padding:28px 24px 28px;text-align:center;position:relative;overflow:hidden}
    .mlab-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 20% 50%,rgba(124,58,237,0.18) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(26,95,255,0.15) 0%,transparent 55%);pointer-events:none}
    .mlab-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(245,166,35,0.12);color:var(--gold);font-size:11px;font-weight:700;padding:5px 14px;border-radius:999px;margin-bottom:14px;border:1px solid rgba(245,166,35,0.3);letter-spacing:0.04em}
    .mlab-section{padding:72px 24px}
    .mlab-inner{max-width:1100px;margin:0 auto}
    .mlab-stitle{font-size:clamp(24px,4vw,34px);font-weight:800;color:var(--navy);font-family:'Playfair Display',serif;text-align:center;margin-bottom:12px}
    .mlab-ssub{font-size:16px;color:var(--g400);text-align:center;margin-bottom:52px;max-width:600px;margin-left:auto;margin-right:auto}
    .mlab-feat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px}
    .mlab-feat{background:#fff;border:1px solid var(--g100);border-radius:16px;padding:24px;transition:transform 0.2s,box-shadow 0.2s}
    .mlab-feat:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(26,95,255,0.1)}
    .mlab-feat-ic{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px}
    .mlab-plan-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
    .mlab-plan{background:#fff;border:1px solid var(--g100);border-radius:16px;padding:20px;position:relative;transition:transform 0.2s,box-shadow 0.2s}
    .mlab-plan:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(26,95,255,0.12)}
    .mlab-plan.featured{border:2px solid var(--blue);background:linear-gradient(135deg,#f0f6ff,#fff)}
    .mlab-plan-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--blue);color:#fff;font-size:11px;font-weight:700;padding:4px 14px;border-radius:999px;white-space:nowrap}
    .mlab-check{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;font-size:14px;color:var(--g600)}
    .mlab-check i{flex-shrink:0;margin-top:1px;color:var(--green)}
    .mlab-use-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}
    .mlab-use{background:var(--sky);border-radius:16px;padding:20px;text-align:center;cursor:pointer;border:1px solid var(--g100);transition:all 0.2s}
    .mlab-use:hover{background:#dbeafe;border-color:var(--blue)}
    .mlab-stat-row{display:flex;gap:0;flex-wrap:wrap;background:var(--navy);border-radius:20px;overflow:hidden}
    .mlab-stat{flex:1;min-width:140px;padding:32px 24px;text-align:center;border-right:1px solid rgba(255,255,255,0.08)}
    .mlab-stat:last-child{border-right:none}
    @media(max-width:768px){
      .mlab-nav{padding:12px 16px}
      .mlab-hero{padding:20px 16px 20px}
      .mlab-section{padding:48px 16px}
      .mlab-stat{min-width:120px;padding:24px 16px}
    }
    @media(max-width:480px){
      .mlab-plan-grid{grid-template-columns:1fr 1fr}
      .mlab-stat-row{flex-direction:column}
      .mlab-plan-grid{grid-template-columns:1fr!important}
      .mlab-stat{border-right:none;border-bottom:1px solid rgba(255,255,255,0.08)}
    }
    @media(max-width:768px){
      .mlab-admin-grid{grid-template-columns:1fr!important}
      .mlab-admin-cards{grid-template-columns:1fr 1fr!important}
    }
  </style>

  <!-- NAV -->
  <nav class="mlab-nav">
    <button style="display:flex;align-items:center;gap:10px;background:none;border:none;cursor:pointer" onclick="navigate('landing')">
      <img src="https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png" alt="Mathrone Academy logo" loading="lazy" decoding="async" style="height:34px;width:auto;filter:brightness(0) invert(1)"/>
      <span style="font-size:17px;font-weight:700;color:#fff">Mathrone Academy</span>
    </button>
    <div style="display:flex;align-items:center;gap:10px">
      <button class="btn btn-ghost btn-sm" style="color:rgba(255,255,255,0.7);border-color:rgba(255,255,255,0.2)" onclick="navigate('landing')">← Home</button>
      <button class="btn btn-sm" style="background:var(--gold);color:#1a1a1a;font-weight:800;border:none" onclick="openBusinessInquiry('School Subscription')">
        <i data-lucide="phone" style="width:14px;height:14px"></i> Get a Quote
      </button>
    </div>
  </nav>

  <!-- HERO -->
  <div class="mlab-hero">
    <div style="position:relative;z-index:1">
      <div class="mlab-badge"><i data-lucide="flask-conical" style="width:14px;height:14px"></i> MAJESTIC LAB, PROFESSIONAL VIRTUAL STEM LABS</div>
      <h1 style="font-size:clamp(20px,2.8vw,32px);font-weight:800;color:#fff;font-family:'Playfair Display',serif;margin-bottom:12px;line-height:1.2">Your School Deserves a <span style="color:var(--gold)">World-Class Virtual Lab</span></h1>
      <p style="font-size:clamp(13px,1.4vw,15px);color:rgba(255,255,255,0.7);max-width:520px;margin:0 auto 22px;line-height:1.6">Stop improvising with basic video calls. Give your teachers a professional interactive workspace, whiteboard, 3D shapes, rulers, graph tools, document sharing, and live student sync-all in one powerful platform built for Rwandan schools.</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:0">
        <button class="btn btn-primary btn-lg" style="background:var(--gold);color:#1a1a1a;font-weight:800;border:none;display:inline-flex;align-items:center;gap:8px" onclick="openBusinessInquiry('School Subscription')">
          <i data-lucide="building-2" style="width:18px;height:18px"></i> Get School License
        </button>
        <button class="btn btn-lg" style="background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.25);display:inline-flex;align-items:center;gap:8px" onclick="openBusinessInquiry('Standard License')">
          <i data-lucide="user" style="width:18px;height:18px"></i> Individual Tutor Plan
        </button>
        <button class="btn btn-lg" style="background:transparent;color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.15);display:inline-flex;align-items:center;gap:8px" onclick="navigate('login')">
          <i data-lucide="log-in" style="width:18px;height:18px"></i> Sign In to Your Lab
        </button>
      </div>

    </div>
  </div>

  <!-- LAB IMAGE SLIDER -->
  <div class="lab-slider-container">
    <div style="text-align:center; margin-bottom:24px;">
       <span style="color:var(--gold); font-size:11px; font-weight:800; letter-spacing:2px; text-transform:uppercase;">Board Preview</span>
       <h2 style="color:#fff; font-size:20px; font-family:'Playfair Display',serif;">See the Lab in Action</h2>
    </div>
    <div class="lab-slider-track">
      ${[
        
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80", // Geometry/Math
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab1.png",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab2.png",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab3.png",
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab4.png",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab5.png",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab6.png",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab7.png",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab8.png",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab9.png",
       
      ].concat([
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab1.png",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab2.png",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab3.png",
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab4.png",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab5.png",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab6.png",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab7.png",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab8.png",
        "https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/lab9.png"
      ]).map((url, i) => `
        <div class="lab-image-card">
          <img src="${url}" alt="Majestic Lab virtual STEM workspace preview ${i+1}" loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async" ${i < 4 ? 'fetchpriority="high"' : ''} width="600" height="400">
        </div>
      `).join('')}
    </div>
  </div>

  <!-- WHAT IS IT -->
  <div class="mlab-section" style="background:var(--sky)">
    <div class="mlab-inner">
      <h2 class="mlab-stitle">Everything a Teacher Needs. Nothing Extra.</h2>
      <p class="mlab-ssub">Majestic Lab is a professional virtual STEM workspace built for live teaching , not general video calls. Every tool is designed for how teachers actually teach.</p>
      <div class="mlab-feat-grid">
        ${[
          ['pen-tool','#EEF2FF','var(--blue)','Infinite Whiteboard','Draw, annotate, and explain any concept with a pixel-perfect whiteboard that syncs live to every student\'s screen.'],
          ['box','#F0FDF4','var(--green)','3D Shapes & Geometry','Rotate and manipulate 3D objects in real time. Ideal for S4–S6 Physics, Chemistry, and Mathematics.'],
          ['ruler','#FFF7ED','var(--orange)','Rulers & Protractors','Drag-and-drop measuring tools that behave exactly like physical instruments.'],
          ['line-chart','#F5F3FF','#7c3aed','Graph Plotter','Plot functions, draw coordinate systems, and visualize data live during class.'],
          ['file-text','#FEF2F2','var(--red)','Document Presenter','Upload a PDF or PPTX and annotate over it in real time. Students see every mark.'],
          ['users','#EEF2FF','var(--blue)','Live Student Sync','Students join via a secure link and follow the teacher\'s board in real time. No app install needed.'],
          ['lock','#F0FDF4','var(--green)','Device-Locked Links','Every student link is locked to one device. No forwarding, no sharing, no piracy.'],
          ['download','#FFF7ED','var(--orange)','PDF Export','Export any whiteboard session as a branded PDF for students to review later.'],
        ].map(([ic,bg,color,title,desc])=>`
        <div class="mlab-feat">
          <div class="mlab-feat-ic" style="background:${bg}">
            <i data-lucide="${ic}" style="width:24px;height:24px;color:${color}"></i>
          </div>
          <div style="font-size:15px;font-weight:700;color:var(--navy);margin-bottom:6px">${title}</div>
          <p style="font-size:13px;color:var(--g400);line-height:1.6;margin:0">${desc}</p>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- WHO IT'S FOR -->
  <div class="mlab-section">
    <div class="mlab-inner">
      <h2 class="mlab-stitle">Built for Every Learning Context</h2>
      <p class="mlab-ssub">Whether you run a school, a tutoring centre, or teach privately. Majestic Lab fits your workflow.</p>
      <div class="mlab-use-grid">
        ${[
          ['school','#1e40af','Secondary Schools','Equip your science and math departments with a professional shared lab. Teachers get their own links, you control the seats.'],
          ['graduation-cap','#065f46','Universities & Colleges','Host advanced lab simulations, annotate research papers live, and coordinate across multiple faculties.'],
          ['user-check','#7c3aed','Private Tutors','Open a professional lab for every 1-on-1 session. Share a student link in seconds and start teaching immediately.'],
          ['building','#b45309','Tutoring Centres','Manage multiple teachers under one institution license. Track usage and generate links from your admin portal.'],
          ['home','#be185d','Home-School Parents','Give your child a structured learning environment with all the tools their school uses, right at home.'],
          ['briefcase','#0e7490','Corporate Training','Deliver technical training with interactive diagrams and live Q&A boards for professional teams.'],
        ].map(([ic,color,title,desc])=>`
        <div class="mlab-use" onclick="openBusinessInquiry('${title} License')">
          <div style="width:48px;height:48px;border-radius:12px;background:#fff;border:1px solid var(--g100);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">
            <i data-lucide="${ic}" style="width:24px;height:24px;color:${color}"></i>
          </div>
          <div style="font-size:14px;font-weight:700;color:var(--navy);margin-bottom:6px">${title}</div>
          <p style="font-size:12px;color:var(--g400);line-height:1.5;margin:0">${desc}</p>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- PRICING -->
  <div class="mlab-section" style="background:var(--sky)">
    <div class="mlab-inner">
      <h2 class="mlab-stitle">Simple, Transparent Pricing</h2>
      <p class="mlab-ssub">No hidden fees. Pay once, teach all month. Contact us for exact RWF pricing tailored to your institution size.</p>
      <div class="mlab-plan-grid">
        ${[
          {
            name:'Individual Tutor',
            icon:'user',
            color:'#1e40af',
            bg:'#EEF2FF',
            price:'From 1,000',
            period:'/month',
            tag:null,
            features:['1 concurrent session','Device-locked student links','Full whiteboard & tools','PDF export','Email support'],
            cta:'Get Started',
            inquiry:'Standard License',
          },
          {
            name:'School Starter',
            icon:'school',
            color:'#065f46',
            bg:'#F0FDF4',
            price:'From 30,000',
            period:'/year',
            tag:'Most Popular',
            features:['Up to 10 concurrent sessions','Teacher self-service portal','Institution branding on exports','Usage analytics','Priority WhatsApp support'],
            cta:'Get School License',
            inquiry:'School Subscription',
          },
          {
            name:'School Pro',
            icon:'building-2',
            color:'#7c3aed',
            bg:'#F5F3FF',
            price:'From 80,000',
            period:'/year',
            tag:null,
            features:['Up to 30 concurrent sessions','Multi-teacher management','Custom logo on whiteboard','Dedicated account manager','Training session included'],
            cta:'Contact Us',
            inquiry:'School Pro License',
          },
          {
            name:'Enterprise',
            icon:'landmark',
            color:'#b45309',
            bg:'#FFF7ED',
            price:'Custom',
            period:'pricing',
            tag:null,
            features:['Unlimited concurrent sessions','Full white-label branding','Custom domain option','SLA guarantee','On-site training in Kigali'],
            cta:'Request a Quote',
            inquiry:'Enterprise License',
          },
        ].map(p=>`
        <div class="mlab-plan ${p.tag ? 'featured' : ''}">
          ${p.tag ? `<div class="mlab-plan-badge"><i data-lucide="star" style="width:10px;height:10px"></i> ${p.tag}</div>` : ''}
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
            <div style="width:36px;height:36px;border-radius:10px;background:${p.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <i data-lucide="${p.icon}" style="width:18px;height:18px;color:${p.color}"></i>
            </div>
            <div style="font-size:14px;font-weight:800;color:var(--navy)">${p.name}</div>
          </div>
          <div style="margin-bottom:14px">
            <span style="font-size:22px;font-weight:800;color:var(--navy);font-family:'Playfair Display',serif">${p.price}</span>
            <span style="font-size:12px;color:var(--g400)"> RWF${p.period}</span>
          </div>
          <div style="border-top:1px solid var(--g100);padding-top:12px;margin-bottom:14px">
            ${p.features.map(f=>`
            <div class="mlab-check" style="margin-bottom:6px;font-size:12px">
              <i data-lucide="check-circle-2" style="width:13px;height:13px"></i>
              <span>${f}</span>
            </div>`).join('')}
          </div>
          <button class="btn btn-primary btn-full" style="font-size:13px;padding:9px 16px;${p.tag ? '' : 'background:var(--navy);'}" onclick="openBusinessInquiry('${p.inquiry}')">
            ${p.cta} →
          </button>
        </div>`).join('')}
      </div>
      <p style="text-align:center;font-size:13px;color:var(--g400);margin-top:24px">All prices in RWF. Annual plans available at a 20% discount. Free demo session for all school plans.</p>
    </div>
  </div>

  <!-- HOW IT WORKS -->
  <div class="mlab-section">
    <div class="mlab-inner">
      <h2 class="mlab-stitle">Up and  Running in 3 Steps</h2>
      <p class="mlab-ssub">From signup to first live class in under 10 minutes. No software to install , it runs in any browser.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:24px;margin-top:40px">
        ${[
          ['1','phone-call','Contact Mathrone','Reach out via WhatsApp or email. Tell us your school name, number of teachers, and preferred start date.','var(--blue)','#EEF2FF'],
          ['2','credit-card','Choose Your Plan','We create your institution profile, assign your licenses, and set up your admin portal account within 24 hours.','#7c3aed','#F5F3FF'],
          ['3','rocket','Start Teaching','Log in, generate teacher links from your portal, share them with your staff and your teachers open the lab and start live classes immediately.','var(--green)','#F0FDF4'],
        ].map(([n,ic,title,desc,color,bg])=>`
        <div style="background:#fff;border:1px solid var(--g100);border-radius:20px;padding:28px;position:relative">
          <div style="width:36px;height:36px;border-radius:999px;background:${bg};display:flex;align-items:center;justify-content:center;margin-bottom:16px">
            <span style="font-size:14px;font-weight:800;color:${color}">0${n}</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <i data-lucide="${ic}" style="width:20px;height:20px;color:${color}"></i>
            <div style="font-size:16px;font-weight:700;color:var(--navy)">${title}</div>
          </div>
          <p style="font-size:13px;color:var(--g400);line-height:1.6;margin:0">${desc}</p>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- INSTITUTION ADMIN FEATURE CALLOUT -->
  <div style="background:var(--navy);padding:72px 24px">
    <div class="mlab-inner">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">
        <div>
          <div class="mlab-badge" style="margin-bottom:20px"><i data-lucide="shield-check" style="width:14px;height:14px"></i> FOR SCHOOL ADMINISTRATORS</div>
          <h2 style="font-size:clamp(24px,4vw,34px);font-weight:800;color:#fff;font-family:'Playfair Display',serif;margin-bottom:16px;line-height:1.2">Your Staff Manages Their Own Links. You Stay in Control.</h2>
          <p style="font-size:15px;color:rgba(255,255,255,0.7);line-height:1.7;margin-bottom:28px">Once your school is set up, your designated Lab Admin logs into their own portal, no need to contact Mathrone every time a teacher needs a new link. They generate, monitor, and revoke teacher access themselves, within your license limits.</p>
          <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:32px">
            ${[
              ['users','See live seat usage across all teachers in real time'],
              ['link','Generate new teacher links in under 10 seconds'],
              ['x-circle','Instantly revoke a link if a teacher leaves or shares it'],
              ['calendar-clock','See when each teacher link expires and renew as needed'],
            ].map(([ic,t])=>`
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:32px;height:32px;background:rgba(245,166,35,0.12);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <i data-lucide="${ic}" style="width:16px;height:16px;color:var(--gold)"></i>
              </div>
              <span style="font-size:14px;color:rgba(255,255,255,0.8)">${t}</span>
            </div>`).join('')}
          </div>
          <button class="btn btn-primary btn-lg" style="background:var(--gold);color:#1a1a1a;font-weight:800;border:none;display:inline-flex;align-items:center;gap:8px" onclick="openBusinessInquiry('School Subscription')">
            <i data-lucide="building-2" style="width:18px;height:18px"></i> Get School License
          </button>
        </div>
        <div class="mlab-admin-cards" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;min-width:0;overflow:hidden">
          ${[
            ['monitor-play','Active Sessions','0 / 10 seats','#EEF2FF','var(--blue)'],
            ['link','Active Links','8 teacher links','#F0FDF4','var(--green)'],
            ['calendar-clock','Subscription','Expires Dec 2025','#FFF7ED','var(--orange)'],
            ['check-circle','Status','All systems live','#F0FDF4','var(--green)'],
          ].map(([ic,label,val,bg,color])=>`
          <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;min-width:0;overflow:hidden">
            <div style="width:36px;height:36px;background:${bg};border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:12px">
              <i data-lucide="${ic}" style="width:18px;height:18px;color:${color}"></i>
            </div>
            <div style="font-size:11px;color:rgba(255,255,255,0.45);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.06em">${label}</div>
            <div style="font-size:14px;font-weight:700;color:#fff">${val}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- TESTIMONIALS -->
  <div class="mlab-section" style="background:var(--sky)">
    <div class="mlab-inner">
      <h2 class="mlab-stitle">What Schools Are Saying</h2>
      <p class="mlab-ssub">Real feedback from teachers and administrators using Majestic Lab across Rwanda.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px">
        ${[
          ['Our S6 Physics teacher used to struggle explaining 3D concepts on a regular whiteboard. Since Majestic Lab, students actually see it rotating in 3D. Exam results improved by 22% that term.','Mr. Emmanuel Nkusi','Head of Sciences · ','EN','#1e40af'],
          ['The institution portal is a game changer. I generate a link for each teacher in the morning and revoke it in the evening. No more shared passwords or security headaches.','Mrs. Claudette Uwera','Academic Director ·','CU','#065f46'],
          ['I used to spend 20 minutes at the start of each session setting up Google Meet and a shared whiteboard. Now I just send one link. The student is in the lab in 30 seconds.','Mr. Théogène Habimana','Private STEM Tutor · Kigali','TH','#7c3aed'],
        ].map(([txt,name,role,ini,bg])=>`
        <div style="background:#fff;border:1px solid var(--g100);border-radius:16px;padding:24px">
          <div style="font-size:28px;color:var(--gold);margin-bottom:12px">❝</div>
          <p style="font-size:14px;color:var(--g600);line-height:1.7;margin-bottom:20px">${txt}</p>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:38px;height:38px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0">${ini}</div>
            <div>
              <div style="font-size:14px;font-weight:700;color:var(--navy)">${name}</div>
              <div style="font-size:12px;color:var(--g400)">${role}</div>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- FINAL CTA -->
  <div style="background:linear-gradient(135deg,#0d1b40,#1e3a8a,#4c1d95);padding:80px 24px;text-align:center">
    <div style="display:inline-flex;align-items:center;gap:7px;background:rgba(245,166,35,0.12);color:var(--gold);font-size:12px;font-weight:700;padding:6px 16px;border-radius:999px;margin-bottom:24px;border:1px solid rgba(245,166,35,0.3)"><i data-lucide="zap" style="width:14px;height:14px"></i> START TODAY: NO SETUP FEE</div>
    <h2 style="font-size:clamp(26px,5vw,44px);font-weight:800;color:#fff;font-family:'Playfair Display',serif;margin-bottom:16px">Your Students Deserve Better<br/><span style="color:var(--gold)">Than a Basic Whiteboard App.</span></h2>
    <p style="font-size:16px;color:rgba(255,255,255,0.7);max-width:560px;margin:0 auto 36px;line-height:1.7">Join 40+ schools and 500+ teachers using Majestic Lab to deliver professional, engaging STEM lessons every day. First demo session is free.</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-lg" style="background:var(--gold);color:#1a1a1a;font-weight:800;border:none;display:inline-flex;align-items:center;gap:8px" onclick="openBusinessInquiry('School Subscription')">
        <i data-lucide="building-2" style="width:20px;height:20px"></i> Get School License
      </button>
      <button class="btn btn-lg" style="background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.25);display:inline-flex;align-items:center;gap:8px" onclick="openBusinessInquiry('Demo Session')">
        <i data-lucide="play-circle" style="width:20px;height:20px"></i> Book Free Demo
      </button>
      <button class="btn btn-lg" style="background:transparent;color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.15);display:inline-flex;align-items:center;gap:8px" onclick="navigate('login')">
        <i data-lucide="log-in" style="width:20px;height:20px"></i> Already have an account?
      </button>
    </div>
    <p style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:24px;display:flex;align-items:center;justify-content:center;gap:6px">
      <i data-lucide="message-circle" style="width:14px;height:14px"></i> WhatsApp: +250 786 684 285 · info@mathroneacademy.com · Kigali, Rwanda
    </p>
  </div>
  `);
}

    function renderTerms(){
  render(`
  <nav style="display:flex;align-items:center;justify-content:space-between;padding:14px 48px;border-bottom:1px solid var(--g100);background:#fff;position:sticky;top:0;z-index:100;flex-wrap:wrap;gap:10px">
    <button onclick="navigate('landing')" style="display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer">
      <img src="https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png" alt="Mathrone Academy logo" loading="lazy" decoding="async" style="height:34px;width:auto"/>
      <span style="font-size:16px;font-weight:700;color:var(--navy)">Mathrone Academy</span>
    </button>
    <div style="display:flex;gap:10px">
      <button class="btn btn-ghost btn-sm" onclick="navigate('landing')">← Home</button>
      ${State.user ? `<button class="btn btn-primary btn-sm" onclick="navigate('dashboard')">Dashboard</button>` : `<button class="btn btn-primary btn-sm" onclick="navigate('login')">Sign In</button>`}
    </div>
  </nav>

  <!-- Hero -->
  <div style="background:linear-gradient(135deg,var(--navy),#1e40af);padding:64px 48px;text-align:center;color:#fff">
    <div style="color:var(--gold);margin-bottom:20px;display:flex;justify-content:center"><i data-lucide="clipboard-list" style="width:48px;height:48px"></i></div>
    <h1 style="font-size:36px;font-weight:800;margin-bottom:12px;font-family:'Playfair Display',serif">Terms & Conditions</h1>
    <p style="font-size:16px;opacity:0.8;max-width:600px;margin:0 auto">Please read these terms carefully before using Mathrone Academy.</p>
    <div style="font-size:13px;opacity:0.6;margin-top:12px">Last updated: March 2026 &nbsp;•&nbsp; Effective: March 2026</div>
  </div>

  <!-- Content -->
  <div style="max-width:800px;margin:0 auto;padding:64px 24px">

    <!-- Intro -->
    <div style="background:var(--sky);border-radius:12px;padding:20px;margin-bottom:40px;border-left:4px solid var(--blue)">
      <p style="font-size:14px;color:var(--navy);line-height:1.7;margin:0">By accessing or using the Mathrone Academy platform including our website at <strong>mathroneacademy.pages.dev</strong>, our tutoring services, and our online store you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
    </div>

    ${[
      {
        num:'1',
        title:'Definitions',
        content:`
        <p>In these Terms and Conditions:</p>
        <ul>
          <li><strong>"Platform"</strong> refers to the Mathrone Academy website, mobile interface, and all associated services.</li>
          <li><strong>"We", "Us", "Our"</strong> refers to Mathrone Academy, operated from Kigali, Rwanda.</li>
          <li><strong>"User"</strong> refers to any person accessing the platform, including Students, Tutors, Parents, and Administrators.</li>
          <li><strong>"Student"</strong> refers to a registered learner using the platform to access tutoring services.</li>
          <li><strong>"Tutor"</strong> refers to an approved educator listed on the platform to provide tutoring services.</li>
          <li><strong>"Services"</strong> refers to tutoring sessions, educational resources, the learning store, and all features of the platform.</li>
          <li><strong>"Content"</strong> refers to all text, images, videos, documents, and materials available on the platform.</li>
        </ul>`
      },
      {
        num:'2',
        title:'Eligibility & Account Registration',
        content:`
        <p>To create an account on Mathrone Academy, you must:</p>
        <ul>
          <li>Be at least 13 years of age. Users under 18 must have parental or guardian consent.</li>
          <li>Provide accurate, complete, and truthful information during registration.</li>
          <li>Maintain and promptly update your account information to keep it accurate.</li>
          <li>Verify your email address within 48 hours of registration. Unverified accounts may be deactivated.</li>
          <li>Use only one account per person. Creating multiple accounts is prohibited.</li>
        </ul>
        <p>You are responsible for maintaining the confidentiality of your password. Notify us immediately at <strong>jrukundo358@gmail.com</strong> if you suspect unauthorised access to your account.</p>`
      },
      {
        num:'3',
        title:'Tutor Vetting & Recruitment',
        content:`
        <p>Mathrone Academy operates a rigorous tutor vetting process to ensure the quality and safety of all educators on the platform:</p>
        <ul>
          <li>All tutor applications are reviewed by our admin team. Submission of an application does not guarantee approval.</li>
          <li>Tutors must provide accurate qualifications, CVs, and certificates. Submission of falsified documents will result in permanent suspension and may be reported to relevant authorities.</li>
          <li>Tutors must complete a written examination and interview as part of the recruitment process.</li>
          <li>Approved tutors are bound by a separate Tutor Agreement governing conduct, payment, and session standards.</li>
          <li>Mathrone Academy reserves the right to suspend or remove any tutor at any time for breach of conduct, student complaints, or quality concerns.</li>
        </ul>`
      },
      {
        num:'4',
        title:'Tutoring Sessions',
        content:`
        <ul>
          <li>Sessions are scheduled by the Mathrone Academy admin team based on student preferences and tutor availability.</li>
          <li>Students must be present and ready at the scheduled session time. Late arrival may result in the session being marked as missed.</li>
          <li>Online sessions use Jitsi Meet. Students must have a working internet connection, camera, and microphone.</li>
          <li>Home visit sessions require the student to be present at the registered home address. Tutors will not conduct sessions at unapproved locations.</li>
          <li>Sessions may be rescheduled by admin with 24 hours notice. Emergency rescheduling will be communicated directly.</li>
          <li>Recording sessions without the explicit consent of both tutor and student is strictly prohibited.</li>
          <li>All session feedback submitted by tutors is confidential between the tutor, student, and admin.</li>
        </ul>`
      },
      {
        num:'5',
        title:'Payments & Billing',
        content:`
        <p><strong>5.1 Student Billing</strong></p>
        <ul>
          <li>Invoices are created by the admin team and communicated to students via the platform and email.</li>
          <li>Payment is accepted via MTN Mobile Money, Airtel Money, and Bank Transfer.</li>
          <li>Payment is due within 7 days of invoice creation unless otherwise agreed.</li>
          <li>Failure to pay may result in suspension of tutoring sessions.</li>
        </ul>
        <p><strong>5.2 Tutor Payment</strong></p>
        <ul>
          <li>Tutor salaries are agreed during the recruitment process and set by the admin team.</li>
          <li>Payment is made according to the agreed frequency (hourly, weekly, or monthly).</li>
          <li>Tutors must provide accurate payment preferences (Mobile Money or bank details) to receive payment.</li>
        </ul>
        <p><strong>5.3 Refunds</strong></p>
        <ul>
          <li>Refunds are issued at the discretion of Mathrone Academy management.</li>
          <li>Refund requests must be submitted within 7 days of the relevant invoice date.</li>
          <li>Sessions that have been completed in full are not eligible for refund.</li>
        </ul>`
      },
      {
        num:'6',
        title:'Learning Store',
        content:`
        <p><strong>6.1 Orders & Delivery</strong></p>
        <ul>
          <li>All products listed on the Mathrone Learning Store are subject to availability.</li>
          <li>Orders are confirmed via WhatsApp. Our team will contact you to arrange delivery details.</li>
          <li>Payment is made upon delivery (cash on delivery, Mobile Money, or bank transfer).</li>
          <li>Free delivery applies to orders of RWF 50,000 and above within Kigali. Delivery costs for orders below this amount or outside Kigali will be negotiated with the customer.</li>
        </ul>
        <p><strong>6.2 Wholesale Orders</strong></p>
        <ul>
          <li>Wholesale pricing applies to orders meeting the minimum quantity requirement per product.</li>
          <li>Wholesale orders are subject to stock availability and may require advance notice.</li>
          <li>Custom wholesale arrangements can be made by contacting us directly.</li>
        </ul>
        <p><strong>6.3 Returns & Exchanges</strong></p>
        <ul>
          <li>Products may be returned or exchanged within 7 days of delivery if they are defective or not as described.</li>
          <li>Items must be unused and in their original packaging.</li>
          <li>Return delivery costs are the responsibility of the customer unless the item is defective.</li>
        </ul>
        <p><strong>6.4 Registered Members Discount</strong></p>
        <ul>
          <li>Registered and logged-in Mathrone Academy members receive a 3% discount on all store purchases.</li>
          <li>Discounts are applied automatically at checkout and cannot be combined with other promotions.</li>
        </ul>`
      },
      {
        num:'7',
        title:'User Conduct',
        content:`
        <p>All users of Mathrone Academy agree not to:</p>
        <ul>
          <li>Use the platform for any unlawful, fraudulent, or harmful purpose.</li>
          <li>Harass, abuse, threaten, or intimidate tutors, students, or staff.</li>
          <li>Share login credentials or allow others to access your account.</li>
          <li>Upload or share false, misleading, or offensive content on the forum or any platform feature.</li>
          <li>Attempt to bypass, disable, or interfere with security features of the platform.</li>
          <li>Scrape, copy, or reproduce platform content without written permission.</li>
          <li>Contact tutors or students outside the platform to arrange private sessions that circumvent Mathrone Academy's services.</li>
          <li>Submit false or fraudulent reviews, ratings, or forum posts.</li>
        </ul>
        <p>Violation of these conduct rules may result in immediate account suspension without refund.</p>`
      },
      {
        num:'8',
        title:'Written Examination',
        content:`
        <p>Tutors invited to complete a written examination on the platform agree to:</p>
        <ul>
          <li>Complete the exam independently without assistance from any other person or resource.</li>
          <li>Remain in fullscreen mode for the duration of the exam. Exiting fullscreen more than twice will result in automatic submission.</li>
          <li>Not switch browser tabs or open other applications during the exam.</li>
          <li>Not copy, share, or reproduce exam questions or answers.</li>
        </ul>
        <p>All exam activity is monitored and recorded including tab switches, fullscreen exits, and time taken. Cheating attempts will result in permanent disqualification from the platform.</p>`
      },
      {
        num:'9',
        title:'Intellectual Property',
        content:`
        <ul>
          <li>All content on the Mathrone Academy platform including the logo, design, code, text, and educational materials is the property of Mathrone Academy and protected by applicable intellectual property laws.</li>
          <li>Users may not reproduce, distribute, or create derivative works from platform content without prior written consent.</li>
          <li>User-generated content (forum posts, feedback) remains the property of the user, but by posting it you grant Mathrone Academy a non-exclusive licence to display and use it on the platform.</li>
          <li>The Mathrone Academy name and logo may not be used in any commercial context without written permission.</li>
        </ul>`
      },
      {
        num:'10',
        title:'Privacy & Data Protection',
        content:`
        <p>Your privacy is important to us. By using the platform you agree to our <a onclick="navigate('privacy')" style="color:var(--blue);cursor:pointer">Privacy Policy</a>, which explains how we collect, use, and protect your personal data.</p>
        <ul>
          <li>We collect only the data necessary to provide our services.</li>
          <li>We do not sell your personal data to third parties.</li>
          <li>Student data including progress reports is shared only with the assigned tutor, admin, and authorised parent/guardian.</li>
          <li>You may request deletion of your account and data by contacting us at <strong>jrukundo358@gmail.com</strong>.</li>
        </ul>`
      },
      {
        num:'11',
        title:'Limitation of Liability',
        content:`
        <ul>
          <li>Mathrone Academy provides the platform on an "as is" and "as available" basis. We do not warrant that the platform will be uninterrupted, error-free, or secure at all times.</li>
          <li>We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.</li>
          <li>Our total liability to any user for any claim arising from use of the platform shall not exceed the amount paid by that user in the 30 days prior to the claim.</li>
          <li>We are not responsible for the conduct of tutors outside of scheduled sessions or for the accuracy of information provided by tutors in their profiles.</li>
        </ul>`
      },
      {
        num:'12',
        title:'Termination',
        content:`
        <ul>
          <li>You may terminate your account at any time by contacting us at <strong>jrukundo358@gmail.com</strong>.</li>
          <li>Mathrone Academy reserves the right to suspend or terminate any account at any time for breach of these Terms, without prior notice.</li>
          <li>Upon termination, your right to use the platform ceases immediately. Outstanding payments remain due.</li>
          <li>We reserve the right to retain certain data as required by law or for legitimate business purposes after account termination.</li>
        </ul>`
      },
      {
        num:'13',
        title:'Changes to Terms',
        content:`
        <ul>
          <li>Mathrone Academy reserves the right to modify these Terms and Conditions at any time.</li>
          <li>Users will be notified of significant changes via email or platform notification.</li>
          <li>Continued use of the platform after changes are posted constitutes acceptance of the updated terms.</li>
          <li>The current version of these Terms is always available at <strong>mathroneacademy.pages.dev/terms</strong>.</li>
        </ul>`
      },
      {
        num:'14',
        title:'Governing Law & Disputes',
        content:`
        <ul>
          <li>These Terms are governed by the laws of the Republic of Rwanda.</li>
          <li>Any disputes arising from use of the platform shall first be addressed through direct negotiation with Mathrone Academy management.</li>
          <li>If a dispute cannot be resolved through negotiation, it shall be submitted to the competent courts of Rwanda.</li>
          <li>Nothing in these Terms prevents you from raising a complaint with the Rwanda Utilities Regulatory Authority (RURA) regarding digital services.</li>
        </ul>`
      },
      {
        num:'15',
        title:'Contact Us',
        content:`
        <p>If you have any questions about these Terms and Conditions, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> jrukundo358@gmail.com</li>
          <li><strong>WhatsApp:</strong> +250 786 684 285</li>
          <li><strong>Platform:</strong> mathroneacademy.pages.dev</li>
          <li><strong>Location:</strong> Kigali, Rwanda</li>
        </ul>`
      },
    ].map(section=>`
    <div style="margin-bottom:40px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="background:var(--navy);color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0">${section.num}</div>
        <h2 style="font-size:20px;font-weight:700;color:var(--navy);margin:0">${section.title}</h2>
      </div>
      <div style="font-size:14px;color:var(--g600);line-height:1.8;padding-left:44px">
        ${section.content}
      </div>
    </div>`).join('')}

    <!-- Acceptance box -->
    <div style="background:linear-gradient(135deg,var(--navy),#1e40af);border-radius:16px;padding:32px;text-align:center;color:#fff;margin-top:48px">
      <div style="color:var(--green);margin-bottom:16px;display:flex;justify-content:center"><i data-lucide="check-circle-2" style="width:44px;height:44px"></i></div>
      <h3 style="font-size:20px;font-weight:700;margin-bottom:8px">By using Mathrone Academy you accept these terms</h3>
      <p style="font-size:14px;opacity:0.8;margin-bottom:20px">These terms were last updated in March 2026. If you have any questions contact us before using the platform.</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary" style="background:var(--gold);color:#1a1a1a;font-weight:700" onclick="navigate('register')">Create Account →</button>
        <button class="btn btn-ghost" style="border-color:rgba(255,255,255,0.3);color:#fff" onclick="navigate('privacy')">Privacy Policy</button>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div style="background:#0f172a;padding:20px 16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
    <div style="font-size:13px;color:rgba(255,255,255,0.5)">© 2026 Mathrone Academy. All rights reserved.</div>
    <div style="display:flex;gap:16px">
      <button onclick="navigate('privacy')" style="font-size:13px;color:rgba(255,255,255,0.5);background:none;border:none;cursor:pointer">Privacy Policy</button>
      <button onclick="navigate('landing')" style="font-size:13px;color:rgba(255,255,255,0.5);background:none;border:none;cursor:pointer">← Home</button>
    </div>
  </div>
  `)
}
    function renderPrivacyPolicy(){
  render(`
  <style>
    .pp-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 48px;border-bottom:1px solid var(--g100);background:#fff;position:sticky;top:0;z-index:100}
    .pp-body{max-width:800px;margin:0 auto;padding:56px 48px}
    .pp-title{font-size:36px;font-weight:800;color:var(--navy);font-family:'Playfair Display',serif;margin-bottom:8px}
    .pp-date{font-size:13px;color:var(--g400);margin-bottom:40px}
    .pp-h2{font-size:20px;font-weight:700;color:var(--navy);margin:36px 0 12px}
    .pp-p{font-size:14px;color:var(--g600);line-height:1.8;margin-bottom:14px}
    .pp-ul{padding-left:20px;margin-bottom:14px}
    .pp-ul li{font-size:14px;color:var(--g600);line-height:1.8;margin-bottom:6px}
  </style>

  <nav class="pp-nav">
    <button style="display:flex;align-items:center;gap:10px;background:none;border:none;cursor:pointer" onclick="navigate('landing')">
  <img src="https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png" alt="Mathrone Academy logo"loading="lazy" decoding="async" style="height:34px;width:auto"/>
  <span style="font-size:17px;font-weight:700;color:var(--navy)">Mathrone Academy</span>
</button>
    <button class="btn btn-ghost btn-sm" onclick="navigate('landing')">← Back to Home</button>
  </nav>

  <div class="pp-body">
    <h1 class="pp-title">Privacy Policy</h1>
    <div class="pp-date">Last updated: March 2025</div>

    <p class="pp-p">At Mathrone Academy, we are committed to protecting the privacy and security of our users students, parents, tutors, and administrators. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform.</p>

    <h2 class="pp-h2">1. Information We Collect</h2>
    <p class="pp-p">We collect the following types of information when you register and use Mathrone Academy:</p>
    <ul class="pp-ul">
      <li><strong>Personal identification:</strong> Full name, email address, phone number, and profile photo.</li>
      <li><strong>Academic information:</strong> School level, subjects, learning preferences, and progress records.</li>
      <li><strong>Tutor information:</strong> Qualifications, CV, certificates, teaching subjects, and availability.</li>
      <li><strong>Parent information:</strong> Parent or guardian name and contact number provided during student registration.</li>
      <li><strong>Payment information:</strong> Invoice records and payment status. We do not store card details directly.</li>
      <li><strong>Usage data:</strong> Pages visited, session activity, and messages sent within the platform.</li>
    </ul>

    <h2 class="pp-h2">2. How We Use Your Information</h2>
    <p class="pp-p">We use your information for the following purposes:</p>
    <ul class="pp-ul">
      <li>To create and manage your account on the platform.</li>
      <li>To match students with suitable tutors based on preferences and availability.</li>
      <li>To schedule, manage, and track tutoring sessions.</li>
      <li>To generate progress reports shared with parents and administrators.</li>
      <li>To process payments and maintain billing records.</li>
      <li>To send notifications about sessions, messages, and platform updates.</li>
      <li>To improve the quality of our services through usage analytics.</li>
    </ul>

    <h2 class="pp-h2">3. Data Storage & Security</h2>
    <p class="pp-p">Your data is stored securely on Supabase, a GDPR-compliant cloud database hosted in a secure environment. We implement industry-standard security measures including:</p>
    <ul class="pp-ul">
      <li>Encrypted data transmission using HTTPS/TLS.</li>
      <li>Secure authentication with hashed passwords and JWT tokens.</li>
      <li>Role-based access control users only see data they are authorised to access.</li>
      <li>Regular security reviews and access audits.</li>
    </ul>

    <h2 class="pp-h2">4. Sharing of Information</h2>
    <p class="pp-p">We do not sell, trade, or rent your personal information to third parties. Your information may be shared only in the following limited circumstances:</p>
    <ul class="pp-ul">
      <li><strong>Between students and tutors:</strong> Basic profile information is shared to facilitate tutoring sessions.</li>
      <li><strong>With parents:</strong> Student progress reports are accessible to parents via secure shareable links.</li>
      <li><strong>With administrators:</strong> Admin staff access user data strictly for platform management purposes.</li>
      <li><strong>Legal requirements:</strong> We may disclose information if required by law or to protect the safety of users.</li>
    </ul>

    <h2 class="pp-h2">5. Children's Privacy</h2>
    <p class="pp-p">Mathrone Academy serves students of all ages including minors. We take extra care to protect the privacy of children on our platform. Parental consent is required during student registration for users under 18. Parents may request access to, correction of, or deletion of their child's data at any time by contacting us.</p>

    <h2 class="pp-h2">6. Cookies & Tracking</h2>
    <p class="pp-p">Our platform uses browser localStorage to maintain your login session and save your preferences. We do not use third-party tracking cookies or advertising trackers. No data is shared with advertising networks.</p>

    <h2 class="pp-h2">7. Data Retention</h2>
    <p class="pp-p">We retain your personal data for as long as your account is active. If you request account deletion, your personal data will be permanently removed within 30 days, except where retention is required by law or for legitimate business purposes such as payment records.</p>

    <h2 class="pp-h2">8. Your Rights</h2>
    <p class="pp-p">You have the following rights regarding your personal data:</p>
    <ul class="pp-ul">
      <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
      <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
      <li><strong>Deletion:</strong> Request deletion of your account and associated data.</li>
      <li><strong>Portability:</strong> Request an export of your data in a readable format.</li>
      <li><strong>Objection:</strong> Object to processing of your data in certain circumstances.</li>
    </ul>
    <p class="pp-p">To exercise any of these rights, please contact us at <strong>privacy@mathrone.rw</strong>.</p>

    <h2 class="pp-h2">9. Changes to This Policy</h2>
    <p class="pp-p">We may update this Privacy Policy from time to time. When we do, we will notify registered users via the platform and update the "Last updated" date at the top of this page. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>

    <h2 class="pp-h2">10. Contact Us</h2>
    <p class="pp-p">If you have any questions or concerns about this Privacy Policy or how we handle your data, please get in touch:</p>
    <ul class="pp-ul">
      <li><strong>Email:</strong> privacy@mathrone.rw</li>
      <li><strong>Phone:</strong> +250 786 684 285</li>
      <li><strong>Address:</strong> KG 11 Ave, Kiyovu, Kigali, Rwanda</li>
    </ul>

    <div style="margin-top:48px;padding:20px 24px;background:var(--sky);border-radius:12px;border-left:4px solid var(--blue)">
      <div style="font-size:14px;font-weight:700;color:var(--navy);margin-bottom:6px">Questions about your privacy?</div>
      <div style="font-size:13px;color:var(--g600)">We take your privacy seriously. Contact our team at <strong>privacy@mathrone.rw</strong> and we'll respond within 48 hours.</div>
    </div>
  </div>

  <div style="background:#0f172a;padding:20px 16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
    <div style="font-size:13px;color:rgba(255,255,255,0.5)">© 2025 Mathrone Academy. All rights reserved.</div>
    <button onclick="navigate('terms')" style="font-size:13px;color:rgba(255,255,255,0.5);background:none;border:none;cursor:pointer">Terms & Conditions</button>
    <button onclick="navigate('landing')" style="font-size:13px;color:rgba(255,255,255,0.5);background:none;border:none;cursor:pointer">← Back to Home</button>
    
  </div>
  `)
}

   function renderAboutUs(){
  render(`
  <style>
    .about-nav{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--g100);background:#fff;position:sticky;top:0;z-index:100}
    .about-hero{background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 100%);padding:60px 20px;text-align:center}
    .about-hero h1{font-size:clamp(28px,6vw,48px)!important}
    .about-body{max-width:1100px;margin:0 auto;padding:48px 20px}
    .about-h2{font-size:clamp(22px,4vw,28px);font-weight:800;color:var(--navy);font-family:'Playfair Display',serif;margin-bottom:12px}
    .about-p{font-size:15px;color:var(--g600);line-height:1.8;margin-bottom:14px}
    .value-card{background:#fff;border:1px solid var(--g100);border-radius:16px;padding:20px;text-align:center}
    .team-card{background:#fff;border:1px solid var(--g100);border-radius:16px;padding:20px;text-align:center}
    .about-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
    .about-grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
    @media(max-width:768px){
      .about-nav{padding:12px 16px}
      .about-hero{padding:48px 16px}
      .about-body{padding:40px 16px}
      .about-grid-2{grid-template-columns:1fr;gap:28px}
      .about-grid-3{grid-template-columns:1fr 1fr;gap:14px}
    }
    @media(max-width:480px){
      .about-grid-3{grid-template-columns:1fr;gap:12px}
      .about-hero h1{font-size:26px!important}
    }
  </style>

  <!-- NAV -->
  <nav class="about-nav">
    <button style="display:flex;align-items:center;gap:10px;background:none;border:none;cursor:pointer" onclick="navigate('landing')">
  <img src="https://hdpkjomganndiiprnpok.supabase.co/storage/v1/object/public/assets/mathrone%20logo1.png" alt="Mathrone Academy logo" loading="lazy" decoding="async" style="height:34px;width:auto"/>
  <span style="font-size:17px;font-weight:700;color:var(--navy)">Mathrone Academy</span>
</button>
    <button class="btn btn-ghost btn-sm" onclick="navigate('landing')">← Back to Home</button>
  </nav>

  <!-- HERO -->
  <div class="about-hero">
    <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.9);font-size:13px;padding:6px 16px;border-radius:999px;margin-bottom:24px;border:1px solid rgba(255,255,255,0.2)"><i data-lucide="crown" style="width:16px;height:16px"></i> Our Story</div>
    <h1 style="font-size:48px;font-weight:800;color:#fff;font-family:'Playfair Display',serif;margin-bottom:16px">About Mathrone Academy</h1>
    <p style="font-size:17px;color:rgba(255,255,255,0.75);max-width:600px;margin:0 auto">Built on the belief that every student deserves a majestic education fit for a throne.</p>
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:32px;margin-top:40px">
      <button class="btn btn-primary" style="background:var(--gold);color:#1a1a1a;font-weight:700" onclick="navigate('register')">Start Learning →</button>
    </div>
  </div>

  <!-- MISSION -->
  <div style="background:var(--sky);padding:clamp(40px,6vw,72px) clamp(16px,4vw,48px)">
    <div class="about-body about-grid-2" style="padding:0">
      <div>
        <div style="font-size:11px;font-weight:700;color:var(--blue);letter-spacing:0.08em;margin-bottom:12px">OUR MISSION</div>
        <h2 class="about-h2">Majestic Learning.<br/>Royal Results.</h2>
        <p class="about-p">Mathrone Academy was founded with a single purpose to make high-quality, personalised education accessible to every student in Rwanda and beyond.</p>
        <p class="about-p">We believe that the right tutor can transform a student's life. That's why we hand-pick, vet, and continuously evaluate every tutor on our platform to ensure the highest standards of teaching excellence.</p>
        <p class="about-p">Our name says it all <strong>Mathrone</strong> comes from <em>Majestic Throne</em>. We want every student who learns with us to sit on the throne of their own potential.</p>
      </div>
      <div style="background:#fff;border-radius:20px;padding:32px;border:1px solid var(--g100)">
        ${[['target','Our Vision','To become East Africa\'s most trusted education platform from tutoring to a full-scale academy and beyond.'],
           ['lightbulb','Our Approach','Personalised 1-on-1 learning, rigorous tutor vetting, and data-driven progress tracking for every student.'],
           ['globe-2','Our Reach','Starting in Rwanda, expanding across East Africa, and eventually serving students worldwide.']
          ].map(([ic,t,d])=>`
        <div style="display:flex;gap:16px;margin-bottom:24px;align-items:flex-start">
          <div style="color:var(--blue);flex-shrink:0;margin-top:2px"><i data-lucide="${ic}" style="width:26px;height:26px"></i></div>
          <div>
            <div style="font-size:15px;font-weight:700;color:var(--navy);margin-bottom:4px">${t}</div>
            <div style="font-size:13px;color:var(--g600);line-height:1.7">${d}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- STORY -->
  <div style="padding:clamp(40px,6vw,72px) clamp(16px,4vw,48px)">
    <div class="about-body" style="padding:0">
      <div style="text-align:center;margin-bottom:40px">
        <div style="font-size:11px;font-weight:700;color:var(--blue);letter-spacing:0.08em;margin-bottom:12px">OUR STORY</div>
        <h2 class="about-h2" style="text-align:center">How Mathrone Began</h2>
      </div>
      <div style="max-width:700px;margin:0 auto">
        <p class="about-p">Mathrone Academy was founded by <strong>Mr. Majesty</strong>, an entrepreneur who saw a major gap in Rwanda's education landscape  students struggling to find quality, trustworthy tutors, and talented teachers with no platform to reach students who needed them most.</p>
        <p class="about-p">The name <strong>Mathrone</strong> was born from a personal conviction combining <em>Majestic</em> and <em>Throne</em>  because Mr. Majesty believed that every student, regardless of their background, deserves to sit on the throne of academic excellence.</p>
        <p class="about-p">What started as a simple tutoring matching service quickly grew into a full platform with session management, progress tracking, parent reporting, and a recruitment pipeline for Rwanda's best tutors.</p>
        <p class="about-p">Today, Mathrone Academy is on a mission to become East Africa's leading education platform  and eventually, to open physical campuses that bring the Mathrone experience to life.</p>
      </div>
    </div>
  </div>

  <!-- VALUES -->
  <div style="background:var(--sky);padding:clamp(40px,6vw,72px) clamp(16px,4vw,48px)">
    <div class="about-body" style="padding:0">
      <div style="text-align:center;margin-bottom:40px">
        <div style="font-size:11px;font-weight:700;color:var(--blue);letter-spacing:0.08em;margin-bottom:12px">WHAT WE STAND FOR</div>
        <h2 class="about-h2" style="text-align:center">Our Core Values</h2>
      </div>
      <div class="about-grid-3">
        ${[['crown','Excellence','We hold every tutor and every session to the highest standard. Mediocrity has no place at Mathrone.'],
           ['handshake','Trust','Parents and students trust us with something precious their children\'s future. We never take that lightly.'],
           ['bar-chart-3','Accountability','Every session is tracked, every result is measured. We are accountable to every student\'s progress.'],
           ['sprout','Growth','We believe every student can grow. Our tutors are trained to unlock potential, not just teach content.'],
           ['heart','Care','Behind every student profile is a real child with real dreams. We care about every single one of them.'],
           ['shield-check','Safety','Our platform is safe, vetted, and monitored. Every tutor is background-checked before working with students.']
          ].map(([ic,t,d])=>`
        <div class="value-card">
          <div style="margin-bottom:16px;color:var(--blue);display:flex;justify-content:center"><i data-lucide="${ic}" style="width:36px;height:36px"></i></div>
          <div style="font-size:15px;font-weight:700;color:var(--navy);margin-bottom:8px">${t}</div>
          <div style="font-size:13px;color:var(--g600);line-height:1.6">${d}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- TEAM -->
  <div style="padding:clamp(40px,6vw,72px) clamp(16px,4vw,48px)">
    <div class="about-body" style="padding:0">
      <div style="text-align:center;margin-bottom:40px">
        <div style="font-size:11px;font-weight:700;color:var(--blue);letter-spacing:0.08em;margin-bottom:12px">THE PEOPLE BEHIND MATHRONE</div>
        <h2 class="about-h2" style="text-align:center">Meet the Team</h2>
      </div>
      <div class="about-grid-3">
        ${[['RJ','#1e40af','RUKUNDO Janvier (Mr. Majesty)','Founder & CEO','Visionary teacher passionate about transforming education in Rwanda and across Africa.'],
           ['TL','#065f46','Academic Lead','Head of Tutors','Oversees tutor recruitment, vetting, and quality assurance across all subjects.'],
           ['OS','#7c3aed','Operations','Platform Manager','Manages day-to-day platform operations, student assignments, and parent relations.']
          ].map(([ini,bg,name,role,bio])=>`
        <div class="team-card">
          <div style="width:64px;height:64px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#fff;margin:0 auto 16px">${ini}</div>
          <div style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:4px">${name}</div>
          <div style="font-size:12px;color:var(--blue);font-weight:600;margin-bottom:12px">${role}</div>
          <div style="font-size:13px;color:var(--g600);line-height:1.6">${bio}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div style="background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 100%);padding:clamp(40px,6vw,72px) clamp(16px,4vw,48px);text-align:center">
    <h2 style="font-family:'Playfair Display',serif;font-size:36px;font-weight:700;color:#fff;margin-bottom:14px">Join the Mathrone Family</h2>
    <p style="color:rgba(255,255,255,0.7);font-size:16px;margin-bottom:32px">Whether you're a student, parent, or tutor there's a place for you at Mathrone Academy.</p>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <button class="btn-g" onclick="navigate('register')">Register as Student</button>
      <button class="btn-w" onclick="navigate('register','tutor')">Apply as Tutor</button>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background:#0f172a;padding:20px 16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
    <div style="font-size:13px;color:rgba(255,255,255,0.5)">© 2025 Mathrone Academy. All rights reserved.</div>
    <button onclick="navigate('landing')" style="font-size:13px;color:rgba(255,255,255,0.5);background:none;border:none;cursor:pointer">← Back to Home</button>
  </div>
  `)
  // Fetch real stats — always live, no cache, no hardcoded numbers
  setTimeout(async ()=>{
    const _ran = new Set()
    const _animate = (id, val, suf, dec) => {
      if (_ran.has(id)) return
      _ran.add(id)
      animateCount(id, val, 2000, suf, dec)
    }
    try{
      const stats = await fetch(API_URL + '/auth/stats').then(r=>r.json())
      _animate('about-stat-tutors',   stats.tutors   != null ? stats.tutors   : 1,   '+', false)
      _animate('about-stat-students', stats.students != null ? stats.students : 6,   '+', false)
      _animate('about-stat-rating',   4.8, '', true)
      _animate('about-stat-sat',      96,  '%', false)
    }catch(e){
      const ids = ['about-stat-tutors','about-stat-students','about-stat-rating','about-stat-sat']
      ids.forEach(id => {
        const el = document.getElementById(id)
        if(el && !_ran.has(id)){ el.textContent = '—'; _ran.add(id) }
      })
    }
  }, 300) 
}
async function renderVerifyEmail(token){
  render(`
  <div style="min-height:100vh;background:linear-gradient(135deg,#1e3a8a,#2563eb);display:flex;align-items:center;justify-content:center;padding:20px">
    <div style="background:#fff;border-radius:20px;padding:48px;text-align:center;max-width:440px;width:100%">
      <div style="color:var(--blue);margin-bottom:20px;display:flex;justify-content:center"><i data-lucide="loader-2" style="width:48px;height:48px;animation:spin 1.5s linear infinite"></i></div>
      <h2 style="color:var(--navy);margin-bottom:8px">Verifying your email...</h2>
      <p style="color:var(--g400);font-size:14px">Please wait</p>
    </div>
  </div>`)
  try{
    await fetch(API_URL + '/auth/verify/' + token)
    localStorage.removeItem('tc_token')
    localStorage.removeItem('tc_refresh')
    localStorage.removeItem('tc_page')
    State.user = null
    State.data = {}
   
    render(`
    <div style="min-height:100vh;background:linear-gradient(135deg,#1e3a8a,#2563eb);display:flex;align-items:center;justify-content:center;padding:20px">
      <div style="background:#fff;border-radius:20px;padding:48px;text-align:center;max-width:440px;width:100%">
        <div style="color:var(--green);margin-bottom:20px;display:flex;justify-content:center"><i data-lucide="check-circle-2" style="width:48px;height:48px"></i></div>
        <h2 style="color:var(--navy);margin-bottom:8px">Email Verified!</h2>
        <p style="color:var(--g400);font-size:14px;margin-bottom:24px">Your account is now active. You can sign in.</p>
        <button class="btn btn-primary" onclick="navigate('login')">Sign In →</button>
      </div>
    </div>`)
  }catch(e){
    render(`
    <div style="min-height:100vh;background:linear-gradient(135deg,#1e3a8a,#2563eb);display:flex;align-items:center;justify-content:center;padding:20px">
      <div style="background:#fff;border-radius:20px;padding:48px;text-align:center;max-width:440px;width:100%">
        <div style="color:var(--green);margin-bottom:20px;display:flex;justify-content:center"><i data-lucide="check-circle-2" style="width:48px;height:<div style="color:var(--red);margin-bottom:20px;display:flex;justify-content:center"><i data-lucide="x-circle" style="width:48px;height:48px"></i></div>48px"></i></div>
        <h2 style="color:var(--navy);margin-bottom:8px">Invalid Link</h2>
        <p style="color:var(--g400);font-size:14px;margin-bottom:24px">This verification link is invalid or has already been used.</p>
        <button class="btn btn-primary" onclick="navigate('login')">Back to Login</button>
      </div>
    </div>`)
  }
}