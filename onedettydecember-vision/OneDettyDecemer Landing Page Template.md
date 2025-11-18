\<html lang="en"\>\<head\>\<meta charset="UTF-8"\>  
\<meta name="viewport" content="width=device-width, initial-scale=1.0"\>  
\<title\>NOIR — Haute Couture Atelier\</title\>  
\<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600\&amp;family=Cormorant+Garamond:wght@300;400;500;600;700\&amp;display=swap" rel="stylesheet"\>  
\<script src="https://cdn.tailwindcss.com"\>\</script\>  
\<script src="https://unpkg.com/lucide@latest"\>\</script\>  
\<style\>  
body {  
font-family: 'Inter', \-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;  
}  
.font-serif {  
font-family: 'Cormorant Garamond', Georgia, serif;  
}  
.reveal {  
opacity: 0;  
transform: translateY(30px);  
filter: blur(8px);  
transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);  
}  
.reveal.active {  
opacity: 1;  
transform: translateY(0);  
filter: blur(0);  
}  
.reveal-scale {  
opacity: 0;  
transform: scale(0.95);  
filter: blur(8px);  
transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);  
}  
.reveal-scale.active {  
opacity: 1;  
transform: scale(1);  
filter: blur(0);  
}  
.parallax-slow {  
transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);  
}  
.image-reveal {  
clip-path: inset(100% 0 0 0);  
transition: clip-path 1.2s cubic-bezier(0.77, 0, 0.175, 1);  
}  
.image-reveal.active {  
clip-path: inset(0 0 0 0);  
}  
.gradient-text {  
background: linear-gradient(135deg, \#ffffff 0%, \#a1a1a1 100%);  
\-webkit-background-clip: text;  
\-webkit-text-fill-color: transparent;  
background-clip: text;  
}  
.mobile-menu {  
transform: translateX(100%);  
transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);  
}  
.mobile-menu.open {  
transform: translateX(0);  
}  
.collection-item-img {  
transition: filter 0.5s ease, transform 0.7s ease;  
}  
.collection-item:hover .collection-item-img {  
filter: blur(4px) brightness(0.4);  
}  
.collection-details {  
opacity: 0;  
transform: translateY(20px);  
transition: opacity 0.5s ease, transform 0.5s ease;  
pointer-events: none;  
}  
.collection-item:hover .collection-details {  
opacity: 1;  
transform: translateY(0);  
pointer-events: auto;  
}  
\</style\>  
\<link id="all-fonts-link-font-geist" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700\&amp;display=swap"\>  
\<style id="all-fonts-style-font-geist"\>  
.font-geist { font-family: 'Geist', sans-serif \!important; }  
\</style\>  
\<link id="all-fonts-link-font-roboto" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700\&amp;display=swap"\>  
\<style id="all-fonts-style-font-roboto"\>  
.font-roboto { font-family: 'Roboto', sans-serif \!important; }  
\</style\>  
\<link id="all-fonts-link-font-montserrat" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700\&amp;display=swap"\>  
\<style id="all-fonts-style-font-montserrat"\>  
.font-montserrat { font-family: 'Montserrat', sans-serif \!important; }  
\</style\>  
\<link id="all-fonts-link-font-poppins" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700\&amp;display=swap"\>  
\<style id="all-fonts-style-font-poppins"\>  
.font-poppins { font-family: 'Poppins', sans-serif \!important; }  
\</style\>  
\<link id="all-fonts-link-font-playfair" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;900\&amp;display=swap"\>  
\<style id="all-fonts-style-font-playfair"\>  
.font-playfair { font-family: 'Playfair Display', serif \!important; }  
\</style\>  
\<link id="all-fonts-link-font-instrument-serif" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@400;500;600;700\&amp;display=swap"\>  
\<style id="all-fonts-style-font-instrument-serif"\>  
.font-instrument-serif { font-family: 'Instrument Serif', serif \!important; }  
\</style\>  
\<link id="all-fonts-link-font-merriweather" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900\&amp;display=swap"\>  
\<style id="all-fonts-style-font-merriweather"\>  
.font-merriweather { font-family: 'Merriweather', serif \!important; }  
\</style\>  
\<link id="all-fonts-link-font-bricolage" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700\&amp;display=swap"\>  
\<style id="all-fonts-style-font-bricolage"\>  
.font-bricolage { font-family: 'Bricolage Grotesque', sans-serif \!important; }  
\</style\>  
\<link id="all-fonts-link-font-jakarta" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800\&amp;display=swap"\>  
\<style id="all-fonts-style-font-jakarta"\>  
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif \!important; }  
\</style\>  
\<link id="all-fonts-link-font-manrope" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800\&amp;display=swap"\>  
\<style id="all-fonts-style-font-manrope"\>  
.font-manrope { font-family: 'Manrope', sans-serif \!important; }  
\</style\>  
\<link id="all-fonts-link-font-space-grotesk" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700\&amp;display=swap"\>  
\<style id="all-fonts-style-font-space-grotesk"\>  
.font-space-grotesk { font-family: 'Space Grotesk', sans-serif \!important; }  
\</style\>  
\<link id="all-fonts-link-font-work-sans" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700;800\&amp;display=swap"\>  
\<style id="all-fonts-style-font-work-sans"\>  
.font-work-sans { font-family: 'Work Sans', sans-serif \!important; }  
\</style\>  
\<link id="all-fonts-link-font-pt-serif" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700\&amp;display=swap"\>  
\<style id="all-fonts-style-font-pt-serif"\>  
.font-pt-serif { font-family: 'PT Serif', serif \!important; }  
\</style\>  
\<link id="all-fonts-link-font-geist-mono" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600;700\&amp;display=swap"\>  
\<style id="all-fonts-style-font-geist-mono"\>  
.font-geist-mono { font-family: 'Geist Mono', monospace \!important; }  
\</style\>  
\<link id="all-fonts-link-font-space-mono" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700\&amp;display=swap"\>  
\<style id="all-fonts-style-font-space-mono"\>  
.font-space-mono { font-family: 'Space Mono', monospace \!important; }  
\</style\>  
\<link id="all-fonts-link-font-quicksand" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700\&amp;display=swap"\>  
\<style id="all-fonts-style-font-quicksand"\>  
.font-quicksand { font-family: 'Quicksand', sans-serif \!important; }  
\</style\>  
\<link id="all-fonts-link-font-nunito" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800\&amp;display=swap"\>  
\<style id="all-fonts-style-font-nunito"\>  
.font-nunito { font-family: 'Nunito', sans-serif \!important; }  
\</style\>\</head\>  
  \<body class="antialiased overflow-x-hidden text-zinc-100 bg-zinc-950"\>  
    \<div id="wrapper" class=""\>  
      \<\!--  
  Progress blur from top. Usage:  
    
  1\) Insert this code in the \<body\>  
  \!--\>  
      \<div class="gradient-blur"\>  
        \<div\>\</div\>  
        \<div\>\</div\>  
        \<div\>\</div\>  
        \<div\>\</div\>  
        \<div\>\</div\>  
        \<div\>\</div\>  
      \</div\>  
      \<style\>  
        .gradient-blur {  
          position: fixed;  
          z-index: 5;  
          inset: 0 0 auto 0;  
          height: 12%;  
          pointer-events: none;  
        }

        .gradient-blur\>div,  
        .gradient-blur::before,  
        .gradient-blur::after {  
          position: absolute;  
          inset: 0;  
        }

        .gradient-blur::before {  
          content: "";  
          z-index: 1;  
          backdrop-filter: blur(0.5px);  
          mask: linear-gradient(to top,  
              rgba(0, 0, 0, 0\) 0%,  
              rgba(0, 0, 0, 1\) 12.5%,  
              rgba(0, 0, 0, 1\) 25%,  
              rgba(0, 0, 0, 0\) 37.5%);  
        }

        .gradient-blur\>div:nth-of-type(1) {  
          z-index: 2;  
          backdrop-filter: blur(1px);  
          mask: linear-gradient(to top,  
              rgba(0, 0, 0, 0\) 12.5%,  
              rgba(0, 0, 0, 1\) 25%,  
              rgba(0, 0, 0, 1\) 37.5%,  
              rgba(0, 0, 0, 0\) 50%);  
        }

        .gradient-blur\>div:nth-of-type(2) {  
          z-index: 3;  
          backdrop-filter: blur(2px);  
          mask: linear-gradient(to top,  
              rgba(0, 0, 0, 0\) 25%,  
              rgba(0, 0, 0, 1\) 37.5%,  
              rgba(0, 0, 0, 1\) 50%,  
              rgba(0, 0, 0, 0\) 62.5%);  
        }

        .gradient-blur\>div:nth-of-type(3) {  
          z-index: 4;  
          backdrop-filter: blur(4px);  
          mask: linear-gradient(to top,  
              rgba(0, 0, 0, 0\) 37.5%,  
              rgba(0, 0, 0, 1\) 50%,  
              rgba(0, 0, 0, 1\) 62.5%,  
              rgba(0, 0, 0, 0\) 75%);  
        }

        .gradient-blur\>div:nth-of-type(4) {  
          z-index: 5;  
          backdrop-filter: blur(8px);  
          mask: linear-gradient(to top,  
              rgba(0, 0, 0, 0\) 50%,  
              rgba(0, 0, 0, 1\) 62.5%,  
              rgba(0, 0, 0, 1\) 75%,  
              rgba(0, 0, 0, 0\) 87.5%);  
        }

        .gradient-blur\>div:nth-of-type(5) {  
          z-index: 6;  
          backdrop-filter: blur(16px);  
          mask: linear-gradient(to top,  
              rgba(0, 0, 0, 0\) 62.5%,  
              rgba(0, 0, 0, 1\) 75%,  
              rgba(0, 0, 0, 1\) 87.5%,  
              rgba(0, 0, 0, 0\) 100%);  
        }

        .gradient-blur\>div:nth-of-type(6) {  
          z-index: 7;  
          backdrop-filter: blur(32px);  
          mask: linear-gradient(to top,  
              rgba(0, 0, 0, 0\) 75%,  
              rgba(0, 0, 0, 1\) 87.5%,  
              rgba(0, 0, 0, 1\) 100%);  
        }

        .gradient-blur::after {  
          content: "";  
          z-index: 8;  
          backdrop-filter: blur(64px);  
          mask: linear-gradient(to top,  
              rgba(0, 0, 0, 0\) 87.5%,  
              rgba(0, 0, 0, 1\) 100%);  
        }  
      \</style\>  
    \</div\>

    \<\!-- Navigation \--\>  
    \<nav class="fixed top-0 w-full z-50"\>  
      \<div class="lg:px-12 max-w-\[1600px\] mr-auto ml-auto pt-6 pr-6 pb-6 pl-6"\>  
        \<div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-6 lg:px-8 py-4 shadow-2xl shadow-black/20"\>  
          \<div class="flex items-center justify-between"\>  
            \<a href="\#" class="text-2xl tracking-\[0.2em\] font-light text-white"\>  
              NOIR  
            \</a\>  
            \<div class="hidden md:flex items-center gap-12 text-sm tracking-wider"\>  
              \<a href="\#collection" class="text-white hover:opacity-60 transition-opacity duration-300"\>  
                COLLECTION  
              \</a\>  
              \<a href="\#philosophy" class="text-white hover:opacity-60 transition-opacity duration-300"\>  
                PHILOSOPHY  
              \</a\>  
              \<a href="\#atelier" class="text-white hover:opacity-60 transition-opacity duration-300"\>  
                ATELIER  
              \</a\>  
            \</div\>  
            \<button id="menuBtn" class="text-white hover:opacity-60 transition-opacity md:hidden"\>  
              \<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu w-6 h-6" style="stroke-width: 1.5;"\>  
                \<path d="M4 5h16"\>\</path\>  
                \<path d="M4 12h16"\>\</path\>  
                \<path d="M4 19h16"\>\</path\>  
              \</svg\>  
            \</button\>  
          \</div\>  
        \</div\>  
      \</div\>  
    \</nav\>

    \<\!-- Mobile Menu \--\>  
    \<div id="mobileMenu" class="mobile-menu fixed top-0 right-0 h-full w-full sm:w-80 bg-zinc-950 z-\[60\] shadow-2xl"\>  
      \<div class="flex flex-col h-full"\>  
        \<div class="flex items-center justify-between px-6 py-8 border-b border-white/10"\>  
          \<span class="text-2xl tracking-\[0.2em\] font-light text-white"\>  
            NOIR  
          \</span\>  
          \<button id="closeMenuBtn" class="text-white hover:opacity-60 transition-opacity"\>  
            \<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-6 h-6" style="stroke-width: 1.5;"\>  
              \<path d="M18 6 6 18"\>\</path\>  
              \<path d="m6 6 12 12"\>\</path\>  
            \</svg\>  
          \</button\>  
        \</div\>  
        \<div class="flex-1 px-6 py-12 flex flex-col gap-8"\>  
          \<a href="\#collection" class="text-2xl font-light tracking-wider text-white hover:opacity-60 transition-opacity mobile-menu-link"\>  
            COLLECTION  
          \</a\>  
          \<a href="\#philosophy" class="text-2xl font-light tracking-wider text-white hover:opacity-60 transition-opacity mobile-menu-link"\>  
            PHILOSOPHY  
          \</a\>  
          \<a href="\#atelier" class="text-2xl font-light tracking-wider text-white hover:opacity-60 transition-opacity mobile-menu-link"\>  
            ATELIER  
          \</a\>  
        \</div\>  
        \<div class="px-6 py-8 border-t border-white/10"\>  
          \<div class="flex items-center gap-6"\>  
            \<a href="https://instagram.com" class="text-sm tracking-wider text-zinc-500 hover:text-white transition-colors"\>  
              INSTAGRAM  
            \</a\>  
            \<a href="https://twitter.com" class="text-sm tracking-wider text-zinc-500 hover:text-white transition-colors"\>  
              FACEBOOK  
            \</a\>  
            \<a href="https://facebook.com" class="text-sm tracking-wider text-zinc-500 hover:text-white transition-colors"\>  
              TWITTER  
            \</a\>  
          \</div\>  
        \</div\>  
      \</div\>  
    \</div\>

    \<\!-- Mobile Menu Overlay \--\>  
    \<div id="menuOverlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-\[55\] opacity-0 pointer-events-none transition-opacity duration-300"\>\</div\>

    \<\!-- Hero Section \--\>  
    \<section class="flex overflow-hidden h-screen relative items-center justify-center reveal active"\>  
      \<div class="z-10 bg-gradient-to-b from-black/60 via-black/40 to-black absolute top-0 right-0 bottom-0 left-0"\>\</div\>  
      \<div class="absolute inset-0"\>  
        \<img src="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/30a171b9-41c8-48fe-8ea6-deec71d988ec\_3840w.webp" alt="Hero" class="w-full h-full object-cover"\>  
      \</div\>

      \<div class="relative z-20 text-center px-6 max-w-5xl mx-auto"\>  
        \<div class="reveal mb-6 active"\>  
          \<div class="inline-block border border-white/20 rounded-full px-6 py-2 backdrop-blur-sm"\>  
            \<span class="text-xs tracking-\[0.3em\] text-white/90"\>  
              SPRING SUMMER 2024  
            \</span\>  
          \</div\>  
        \</div\>  
        \<h1 class="reveal text-\[56px\] md:text-\[96px\] lg:text-\[128px\] font-light leading-\[0.9\] tracking-tight mb-8 font-serif active"\>  
          \<span class="block"\>Refined\</span\>  
          \<span class="block gradient-text py-4"\>Elegance\</span\>  
        \</h1\>  
        \<p class="reveal text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed active"\>  
          Where architectural precision meets timeless beauty  
        \</p\>  
        \<div class="reveal flex flex-col sm:flex-row items-center justify-center gap-6 active"\>  
          \<button class="group overflow-hidden sm:w-auto text-sm font-medium text-black tracking-wider bg-white w-full pt-4 pr-8 pb-4 pl-8 relative" onclick="document.getElementById('collection').scrollIntoView({behavior:'smooth'})"\>  
            \<span class="relative z-10 group-hover:text-white transition-colors duration-500"\>  
              EXPLORE COLLECTION  
            \</span\>  
            \<div class="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"\>\</div\>  
            \<span class="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white absolute top-0 right-0 bottom-0 left-0 pointer-events-none"\>  
              EXPLORE COLLECTION  
            \</span\>  
          \</button\>  
          \<div class="w-full sm:w-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-none"\>  
            \<button class="flex hover:opacity-60 transition-opacity text-sm text-white tracking-wider w-full pt-2 pr-6 pb-2 pl-6 gap-x-3 gap-y-3 items-center justify-center" onclick="document.getElementById('videoModal').classList.remove('pointer-events-none', 'opacity-0'); document.body.style.overflow \= 'hidden';"\>  
              \<span class=""\>WATCH FILM\</span\>  
              \<div class="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center"\>  
                \<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play w-4 h-4 ml-0.5" style="stroke-width: 1.5;"\>  
                  \<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"\>\</path\>  
                \</svg\>  
              \</div\>  
            \</button\>  
          \</div\>  
        \</div\>  
      \</div\>

      \<div class="absolute bottom-12 left-1/2 \-translate-x-1/2 z-20"\>  
        \<div class="flex flex-col items-center gap-2 animate-bounce"\>  
          \<span class="text-xs tracking-widest text-white/60"\>SCROLL\</span\>  
          \<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-5 h-5 text-white/60" style="stroke-width: 1.5;"\>  
            \<path d="m6 9 6 6 6-6"\>\</path\>  
          \</svg\>  
        \</div\>  
      \</div\>  
    \</section\>

    \<\!-- Featured Statement \--\>  
    \<section class="relative py-32 lg:py-48 px-6"\>  
      \<div class="max-w-\[1400px\] mx-auto"\>  
        \<div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"\>  
          \<div class="lg:col-span-5 reveal"\>  
            \<div class="border-l-2 border-white/20 pl-8"\>  
              \<span class="text-xs tracking-\[0.3em\] text-zinc-500 mb-6 block"\>  
                CRAFTSMANSHIP  
              \</span\>  
              \<h2 class="text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-tight font-serif"\>  
                Every stitch tells a story  
              \</h2\>  
              \<p class="text-lg text-zinc-400 leading-relaxed mb-8"\>  
                In our Parisian atelier, master artisans dedicate hundreds of  
                hours to each piece, employing techniques passed down through  
                generations.  
              \</p\>  
              \<button class="text-sm tracking-wider border-b border-white pb-1 hover:border-white/40 transition-colors"\>  
                DISCOVER OUR PROCESS  
              \</button\>  
            \</div\>  
          \</div\>  
          \<div class="lg:col-span-7 reveal-scale"\>  
            \<div class="relative aspect-\[4/5\] overflow-hidden"\>  
              \<img src="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/a865440d-8624-46d5-b8ea-dd1ba3f1cb65\_3840w.webp" alt="Craftsmanship" class="w-full h-full object-cover"\>  
              \<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"\>\</div\>  
            \</div\>  
          \</div\>  
        \</div\>  
      \</div\>  
    \</section\>

    \<\!-- Collection Grid \--\>  
    \<section id="collection" class="relative py-24 px-6"\>  
      \<div class="max-w-\[1600px\] mx-auto"\>  
        \<div class="text-center mb-20 reveal"\>  
          \<span class="text-xs tracking-\[0.3em\] text-zinc-500 mb-4 block"\>  
            SPRING SUMMER 2024  
          \</span\>  
          \<h2 class="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight font-serif"\>  
            The Collection  
          \</h2\>  
        \</div\>

        \<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-x-8 gap-y-8"\>  
          \<\!-- Item 1 \--\>  
          \<div class="group reveal cursor-pointer collection-item" onclick="alert('Product details coming soon. Contact our atelier for inquiries.')"\>  
            \<div class="aspect-\[3/4\] overflow-hidden bg-zinc-900 bg-cover mb-6 relative bg-center bg-\[url(https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/ac9ddeb6-2ed8-44c8-9abe-ac32c98633f1\_3840w.webp)\]"\>  
              \<div class="image-reveal"\>  
                \<img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800\&amp;q=90" alt="Look 01" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 collection-item-img"\>  
              \</div\>  
              \<div class="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"\>  
                \<span class="text-xs tracking-wider text-black"\>  
                  VIEW DETAILS  
                \</span\>  
              \</div\>  
              \<div class="collection-details absolute inset-0 flex flex-col items-center justify-center p-6 text-center"\>  
                \<h3 class="text-3xl font-light font-serif text-white mb-3"\>  
                  Tailored Blazer  
                \</h3\>  
                \<p class="text-sm text-zinc-300 mb-2"\>Wool Cashmere Blend\</p\>  
                \<p class="text-lg text-white font-light mb-4"\>€1,850\</p\>  
                \<p class="text-sm text-zinc-400 leading-relaxed max-w-xs"\>  
                  Meticulously crafted with premium wool-cashmere blend.  
                  Features hand-stitched lapels and custom horn buttons.  
                \</p\>  
              \</div\>  
            \</div\>  
            \<div class="space-y-2"\>  
              \<div class="flex items-center justify-between"\>  
                \<h3 class="text-xl font-light font-serif"\>Tailored Blazer\</h3\>  
                \<span class="text-sm text-zinc-500"\>01\</span\>  
              \</div\>  
              \<p class="text-sm text-zinc-500"\>Wool Cashmere Blend\</p\>  
              \<p class="text-lg font-light"\>€1,850\</p\>  
            \</div\>  
          \</div\>

          \<\!-- Item 2 \--\>  
          \<div class="group reveal cursor-pointer collection-item" onclick="alert('Product details coming soon. Contact our atelier for inquiries.')"\>  
            \<div class="aspect-\[3/4\] overflow-hidden bg-zinc-900 bg-\[url(https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/b9dc1ae3-ddf0-49be-a144-8e85fe27bb27\_1600w.jpg)\] bg-cover mb-6 relative"\>  
              \<div class="image-reveal"\>  
                \<img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800\&amp;q=90" alt="Look 02" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 collection-item-img"\>  
              \</div\>  
              \<div class="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"\>  
                \<span class="text-xs tracking-wider text-black"\>  
                  VIEW DETAILS  
                \</span\>  
              \</div\>  
              \<div class="collection-details absolute inset-0 flex flex-col items-center justify-center p-6 text-center"\>  
                \<h3 class="text-3xl font-light font-serif text-white mb-3"\>  
                  Silk Dress  
                \</h3\>  
                \<p class="text-sm text-zinc-300 mb-2"\>Pure Silk\</p\>  
                \<p class="text-lg text-white font-light mb-4"\>€2,200\</p\>  
                \<p class="text-sm text-zinc-400 leading-relaxed max-w-xs"\>  
                  Elegant flowing silhouette in luxurious pure silk.  
                  Hand-finished seams with concealed back closure.  
                \</p\>  
              \</div\>  
            \</div\>  
            \<div class="space-y-2"\>  
              \<div class="flex items-center justify-between"\>  
                \<h3 class="text-xl font-light font-serif"\>Silk Dress\</h3\>  
                \<span class="text-sm text-zinc-500"\>02\</span\>  
              \</div\>  
              \<p class="text-sm text-zinc-500"\>Pure Silk\</p\>  
              \<p class="text-lg font-light"\>€2,200\</p\>  
            \</div\>  
          \</div\>

          \<\!-- Item 3 \--\>  
          \<div class="group reveal cursor-pointer collection-item" onclick="alert('Product details coming soon. Contact our atelier for inquiries.')"\>  
            \<div class="aspect-\[3/4\] overflow-hidden bg-zinc-900 bg-cover mb-6 relative bg-\[url(https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/c9295085-0ea0-46d3-b93a-6d044ebc2dea\_1600w.webp)\] bg-center"\>  
              \<div class="image-reveal"\>  
                \<img src="https://images.unsplash.com/photo-1558769132-cb1aea663c3f?w=800\&amp;q=90" alt="Look 03" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 collection-item-img"\>  
              \</div\>  
              \<div class="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"\>  
                \<span class="text-xs tracking-wider text-black"\>  
                  VIEW DETAILS  
                \</span\>  
              \</div\>  
              \<div class="collection-details absolute inset-0 flex flex-col items-center justify-center p-6 text-center"\>  
                \<h3 class="text-3xl font-light font-serif text-white mb-3"\>  
                  Structured Coat  
                \</h3\>  
                \<p class="text-sm text-zinc-300 mb-2"\>Virgin Wool\</p\>  
                \<p class="text-lg text-white font-light mb-4"\>€3,400\</p\>  
                \<p class="text-sm text-zinc-400 leading-relaxed max-w-xs"\>  
                  Architectural design in virgin wool. Padded shoulders and full  
                  canvas construction for lasting shape.  
                \</p\>  
              \</div\>  
            \</div\>  
            \<div class="space-y-2"\>  
              \<div class="flex items-center justify-between"\>  
                \<h3 class="text-xl font-light font-serif"\>Structured Coat\</h3\>  
                \<span class="text-sm text-zinc-500"\>03\</span\>  
              \</div\>  
              \<p class="text-sm text-zinc-500"\>Virgin Wool\</p\>  
              \<p class="text-lg font-light"\>€3,400\</p\>  
            \</div\>  
          \</div\>

          \<\!-- Item 4 \--\>  
          \<div class="group reveal cursor-pointer collection-item" onclick="alert('Product details coming soon. Contact our atelier for inquiries.')"\>  
            \<div class="aspect-\[3/4\] overflow-hidden bg-zinc-900 bg-cover mb-6 relative bg-\[url(https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/91c257c8-be79-4317-a0ef-3572a47683f4\_1600w.jpg)\] bg-center"\>  
              \<div class="image-reveal"\>  
                \<img src="https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800\&amp;q=90" alt="Look 04" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 collection-item-img"\>  
              \</div\>  
              \<div class="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"\>  
                \<span class="text-xs tracking-wider text-black"\>  
                  VIEW DETAILS  
                \</span\>  
              \</div\>  
              \<div class="collection-details absolute inset-0 flex flex-col items-center justify-center p-6 text-center"\>  
                \<h3 class="text-3xl font-light font-serif text-white mb-3"\>  
                  Evening Gown  
                \</h3\>  
                \<p class="text-sm text-zinc-300 mb-2"\>Chiffon Silk\</p\>  
                \<p class="text-lg text-white font-light mb-4"\>€4,100\</p\>  
                \<p class="text-sm text-zinc-400 leading-relaxed max-w-xs"\>  
                  Ethereal chiffon silk gown with delicate draping. Hand-rolled  
                  edges and invisible zipper closure.  
                \</p\>  
              \</div\>  
            \</div\>  
            \<div class="space-y-2"\>  
              \<div class="flex items-center justify-between"\>  
                \<h3 class="text-xl font-light font-serif"\>Evening Gown\</h3\>  
                \<span class="text-sm text-zinc-500"\>04\</span\>  
              \</div\>  
              \<p class="text-sm text-zinc-500"\>Chiffon Silk\</p\>  
              \<p class="text-lg font-light"\>€4,100\</p\>  
            \</div\>  
          \</div\>

          \<\!-- Item 5 \--\>  
          \<div class="group reveal cursor-pointer collection-item" onclick="alert('Product details coming soon. Contact our atelier for inquiries.')"\>  
            \<div class="aspect-\[3/4\] overflow-hidden bg-zinc-900 bg-cover mb-6 relative bg-\[url(https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/6f3c86a4-80b4-4a49-b8e1-90d97dd42d93\_1600w.jpg)\] bg-center"\>  
              \<div class="image-reveal"\>  
                \<img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800\&amp;q=90" alt="Look 05" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 collection-item-img"\>  
              \</div\>  
              \<div class="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"\>  
                \<span class="text-xs tracking-wider text-black"\>  
                  VIEW DETAILS  
                \</span\>  
              \</div\>  
              \<div class="collection-details absolute inset-0 flex flex-col items-center justify-center p-6 text-center"\>  
                \<h3 class="text-3xl font-light font-serif text-white mb-3"\>  
                  Trench Coat  
                \</h3\>  
                \<p class="text-sm text-zinc-300 mb-2"\>Cotton Gabardine\</p\>  
                \<p class="text-lg text-white font-light mb-4"\>€2,650\</p\>  
                \<p class="text-sm text-zinc-400 leading-relaxed max-w-xs"\>  
                  Classic trench in weatherproof cotton gabardine.  
                  Double-breasted with adjustable belt and storm shield.  
                \</p\>  
              \</div\>  
            \</div\>  
            \<div class="space-y-2"\>  
              \<div class="flex items-center justify-between"\>  
                \<h3 class="text-xl font-light font-serif"\>Trench Coat\</h3\>  
                \<span class="text-sm text-zinc-500"\>05\</span\>  
              \</div\>  
              \<p class="text-sm text-zinc-500"\>Cotton Gabardine\</p\>  
              \<p class="text-lg font-light"\>€2,650\</p\>  
            \</div\>  
          \</div\>

          \<\!-- Item 6 \--\>  
          \<div class="group reveal cursor-pointer collection-item" onclick="alert('Product details coming soon. Contact our atelier for inquiries.')"\>  
            \<div class="aspect-\[3/4\] overflow-hidden bg-zinc-900 bg-\[url(https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/f1c052b4-c100-46fc-8632-e901d967537c\_1600w.webp)\] bg-cover mb-6 relative"\>  
              \<div class="image-reveal"\>  
                \<img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800\&amp;q=90" alt="Look 06" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 collection-item-img"\>  
              \</div\>  
              \<div class="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"\>  
                \<span class="text-xs tracking-wider text-black"\>  
                  VIEW DETAILS  
                \</span\>  
              \</div\>  
              \<div class="collection-details absolute inset-0 flex flex-col items-center justify-center p-6 text-center"\>  
                \<h3 class="text-3xl font-light font-serif text-white mb-3"\>  
                  Wide Leg Trouser  
                \</h3\>  
                \<p class="text-sm text-zinc-300 mb-2"\>Italian Linen\</p\>  
                \<p class="text-lg text-white font-light mb-4"\>€890\</p\>  
                \<p class="text-sm text-zinc-400 leading-relaxed max-w-xs"\>  
                  Relaxed wide-leg silhouette in breathable Italian linen.  
                  Pleated front with side pockets and zip fly.  
                \</p\>  
              \</div\>  
            \</div\>  
            \<div class="space-y-2"\>  
              \<div class="flex items-center justify-between"\>  
                \<h3 class="text-xl font-light font-serif"\>Wide Leg Trouser\</h3\>  
                \<span class="text-sm text-zinc-500"\>06\</span\>  
              \</div\>  
              \<p class="text-sm text-zinc-500"\>Italian Linen\</p\>  
              \<p class="text-lg font-light"\>€890\</p\>  
            \</div\>  
          \</div\>  
        \</div\>

        \<div class="text-center mt-16 reveal"\>  
          \<button class="border border-white/20 px-12 py-4 text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-300"\>  
            VIEW FULL COLLECTION  
          \</button\>  
        \</div\>  
      \</div\>  
    \</section\>

    \<\!-- Philosophy Section \--\>  
    \<section class="lg:py-48 bg-zinc-900/50 pt-32 pr-6 pb-32 pl-6 relative" id="philosophy"\>  
      \<div class="max-w-\[1200px\] mx-auto"\>  
        \<div class="text-center mb-24 reveal"\>  
          \<span class="text-xs tracking-\[0.3em\] text-zinc-500 mb-4 block"\>  
            OUR ETHOS  
          \</span\>  
          \<h2 class="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight font-serif mb-8"\>  
            Philosophy  
          \</h2\>  
          \<p class="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed"\>  
            NOIR is built on three pillars that guide every decision, every  
            stitch, every creation that leaves our atelier.  
          \</p\>  
        \</div\>

        \<div class="grid grid-cols-1 md:grid-cols-3 gap-12"\>  
          \<div class="reveal text-center"\>  
            \<div class="w-20 h-20 mx-auto mb-8 border border-white/20 rounded-full flex items-center justify-center"\>  
              \<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scissors w-8 h-8" style="stroke-width: 1;"\>  
                \<circle cx="6" cy="6" r="3"\>\</circle\>  
                \<path d="M8.12 8.12 12 12"\>\</path\>  
                \<path d="M20 4 8.12 15.88"\>\</path\>  
                \<circle cx="6" cy="18" r="3"\>\</circle\>  
                \<path d="M14.8 14.8 20 20"\>\</path\>  
              \</svg\>  
            \</div\>  
            \<h3 class="text-2xl font-light mb-4 font-serif"\>Craftsmanship\</h3\>  
            \<p class="text-zinc-400 leading-relaxed"\>  
              Each piece is meticulously handcrafted by master artisans using  
              time-honored techniques refined over decades.  
            \</p\>  
          \</div\>

          \<div class="reveal text-center"\>  
            \<div class="w-20 h-20 mx-auto mb-8 border border-white/20 rounded-full flex items-center justify-center"\>  
              \<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-leaf w-8 h-8" style="stroke-width: 1;"\>  
                \<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"\>\</path\>  
                \<path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"\>\</path\>  
              \</svg\>  
            \</div\>  
            \<h3 class="text-2xl font-light mb-4 font-serif"\>Sustainability\</h3\>  
            \<p class="text-zinc-400 leading-relaxed"\>  
              We source only the finest sustainable materials and maintain  
              ethical practices throughout our entire supply chain.  
            \</p\>  
          \</div\>

          \<div class="reveal text-center"\>  
            \<div class="w-20 h-20 mx-auto mb-8 border border-white/20 rounded-full flex items-center justify-center"\>  
              \<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star w-8 h-8" style="stroke-width: 1;"\>  
                \<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"\>\</path\>  
              \</svg\>  
            \</div\>  
            \<h3 class="text-2xl font-light mb-4 font-serif"\>Timelessness\</h3\>  
            \<p class="text-zinc-400 leading-relaxed"\>  
              Our designs transcend seasonal trends, focusing on enduring  
              silhouettes that remain relevant for decades.  
            \</p\>  
          \</div\>  
        \</div\>  
      \</div\>  
    \</section\>

    \<\!-- Full Width Image Break \--\>  
    \<section class="relative h-screen reveal-scale"\>  
      \<div class="absolute inset-0"\>  
        \<img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000\&amp;q=90" alt="Atelier" class="w-full h-full object-cover"\>  
        \<div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"\>\</div\>  
      \</div\>  
      \<div class="relative z-10 h-full flex items-end px-6 lg:px-12 pb-24"\>  
        \<div class="max-w-2xl"\>  
          \<span class="text-xs tracking-\[0.3em\] text-zinc-400 mb-4 block"\>  
            PARIS, FRANCE  
          \</span\>  
          \<h2 class="text-4xl md:text-5xl lg:text-6xl font-light mb-6 font-serif"\>  
            Visit Our Atelier  
          \</h2\>  
          \<p class="text-lg text-zinc-300 mb-8"\>  
            Experience the world of NOIR firsthand in our Parisian studio.  
            Schedule a private appointment for bespoke consultations.  
          \</p\>  
          \<button class="text-sm tracking-wider border-b border-white pb-1 hover:border-white/40 transition-colors"\>  
            BOOK AN APPOINTMENT  
          \</button\>  
        \</div\>  
      \</div\>  
    \</section\>

    \<\!-- Atelier Services \--\>  
    \<section class="pt-32 pr-6 pb-32 pl-6 relative" id="atelier"\>  
      \<div class="max-w-\[1400px\] mx-auto"\>  
        \<div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start"\>  
          \<div class="reveal lg:sticky lg:top-32"\>  
            \<span class="text-xs tracking-\[0.3em\] text-zinc-500 mb-6 block"\>  
              SERVICES  
            \</span\>  
            \<h2 class="text-4xl md:text-5xl lg:text-6xl font-light mb-12 leading-tight font-serif"\>  
              Bespoke Excellence  
            \</h2\>

            \<div class="space-y-8"\>  
              \<div class="border-t border-white/10 pt-8 transition-all duration-500" data-service="01" style="transform: translateX(0px);"\>  
                \<div class="flex items-start justify-between mb-4"\>  
                  \<h3 class="text-2xl font-light font-serif"\>  
                    Private Consultations  
                  \</h3\>  
                  \<span class="text-sm text-zinc-500"\>01\</span\>  
                \</div\>  
                \<p class="text-zinc-400 leading-relaxed"\>  
                  One-on-one sessions with our designers to create pieces  
                  tailored exclusively to your vision and measurements.  
                \</p\>  
                \<div class="mt-4 overflow-hidden transition-all duration-500" style="max-height: 0px; opacity: 0;" data-details="01"\>  
                  \<div class="pt-4 space-y-3 text-sm text-zinc-500"\>  
                    \<p\>• Initial consultation and style assessment\</p\>  
                    \<p\>• Detailed measurements and fitting sessions\</p\>  
                    \<p\>• Fabric selection from our curated collection\</p\>  
                    \<p\>• Design customization and personalization\</p\>  
                    \<p\>• Multiple fittings throughout the creation process\</p\>  
                  \</div\>  
                \</div\>  
              \</div\>

              \<div class="border-t border-white/10 pt-8 transition-all duration-500" data-service="02" style="transform: translateX(0px);"\>  
                \<div class="flex items-start justify-between mb-4"\>  
                  \<h3 class="text-2xl font-light font-serif"\>  
                    Master Tailoring  
                  \</h3\>  
                  \<span class="text-sm text-zinc-500"\>02\</span\>  
                \</div\>  
                \<p class="text-zinc-400 leading-relaxed"\>  
                  Expert alterations and modifications ensuring every garment  
                  fits perfectly and maintains design integrity.  
                \</p\>  
                \<div class="mt-4 overflow-hidden transition-all duration-500" style="max-height: 0px; opacity: 0;" data-details="02"\>  
                  \<div class="pt-4 space-y-3 text-sm text-zinc-500"\>  
                    \<p\>• Precision alterations and adjustments\</p\>  
                    \<p\>• Structural modifications and resizing\</p\>  
                    \<p\>• Restoration of vintage and heritage pieces\</p\>  
                    \<p\>• Quality repairs maintaining original craftsmanship\</p\>  
                    \<p\>• Complimentary pressing and finishing\</p\>  
                  \</div\>  
                \</div\>  
              \</div\>

              \<div class="border-t border-white/10 pt-8 transition-all duration-500" data-service="03" style="transform: translateX(0px);"\>  
                \<div class="flex items-start justify-between mb-4"\>  
                  \<h3 class="text-2xl font-light font-serif"\>  
                    Wardrobe Curation  
                  \</h3\>  
                  \<span class="text-sm text-zinc-500"\>03\</span\>  
                \</div\>  
                \<p class="text-zinc-400 leading-relaxed"\>  
                  Comprehensive styling services to build a timeless wardrobe  
                  that reflects your personal aesthetic.  
                \</p\>  
                \<div class="mt-4 overflow-hidden transition-all duration-500" style="max-height: 0px; opacity: 0;" data-details="03"\>  
                  \<div class="pt-4 space-y-3 text-sm text-zinc-500"\>  
                    \<p\>• Personal style analysis and consultation\</p\>  
                    \<p\>• Wardrobe audit and optimization\</p\>  
                    \<p\>• Seasonal capsule collection planning\</p\>  
                    \<p\>• Styling for special occasions and events\</p\>  
                    \<p\>• Ongoing wardrobe management services\</p\>  
                  \</div\>  
                \</div\>  
              \</div\>  
            \</div\>  
          \</div\>

          \<div class="reveal-scale grid grid-cols-2 gap-6"\>  
            \<div class="aspect-\[3/4\] overflow-hidden"\>  
              \<img src="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/c11f646f-0ab7-4100-86e5-2b80a7784a4f\_800w.webp" alt="Service 1" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700"\>  
            \</div\>  
            \<div class="aspect-\[3/4\] overflow-hidden mt-12"\>  
              \<img src="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/e87b51ca-8d91-41ef-b65f-4af836f689cd\_800w.webp" alt="Service 2" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700"\>  
            \</div\>  
          \</div\>  
        \</div\>  
      \</div\>

      \<script\>  
        (function() {  
          const serviceItems \= document.querySelectorAll('\[data-service\]');

          const observerOptions \= {  
            root: null,  
            rootMargin: '-100px 0px \-60% 0px',  
            threshold: 0  
          };

          const observer \= new IntersectionObserver((entries) \=\> {  
            entries.forEach(entry \=\> {  
              const serviceId \= entry.target.getAttribute('data-service');  
              const details \= document.querySelector(\`\[data-details="${serviceId}"\]\`);

              if (entry.isIntersecting) {  
                details.style.maxHeight \= '300px';  
                details.style.opacity \= '1';  
                entry.target.style.transform \= 'translateX(0)';  
              } else {  
                details.style.maxHeight \= '0';  
                details.style.opacity \= '0';  
              }  
            });  
          }, observerOptions);

          serviceItems.forEach(item \=\> observer.observe(item));  
        })();  
      \</script\>  
    \</section\>

    \<\!-- Contact Section \--\>  
    \<section class="relative py-32 px-6 bg-zinc-900/50"\>  
      \<div class="max-w-\[1000px\] mx-auto reveal"\>  
        \<div class="text-center mb-16"\>  
          \<span class="text-xs tracking-\[0.3em\] text-zinc-500 mb-4 block"\>  
            GET IN TOUCH  
          \</span\>  
          \<h2 class="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight font-serif"\>  
            Let's Create Together  
          \</h2\>  
        \</div\>

        \<div class="grid grid-cols-1 md:grid-cols-2 gap-16"\>  
          \<div class="space-y-8"\>  
            \<div class=""\>  
              \<h3 class="text-sm tracking-wider text-zinc-500 mb-4"\>  
                VISIT US  
              \</h3\>  
              \<p class="text-lg leading-relaxed"\>  
                28 Rue de Rivoli 75004 Paris, France  
              \</p\>  
            \</div\>  
            \<div class=""\>  
              \<h3 class="text-sm tracking-wider text-zinc-500 mb-4"\>HOURS\</h3\>  
              \<p class="text-lg leading-relaxed"\>  
                Monday – Friday: 10:00 – 19:00 Saturday: 11:00 – 17:00 Sunday:  
                By Appointment  
              \</p\>  
            \</div\>  
            \<div class=""\>  
              \<h3 class="text-sm tracking-wider text-zinc-500 mb-4"\>CONTACT\</h3\>  
              \<p class="text-lg leading-relaxed"\>  
                atelier@noir.com \+33 1 42 86 82 00  
              \</p\>  
            \</div\>  
          \</div\>

          \<form class="space-y-6" onsubmit="event.preventDefault(); alert('Thank you for your message\! We will contact you within 24 hours.'); this.reset();"\>  
            \<div class=""\>  
              \<input type="text" placeholder="Full Name" class="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-white transition-colors text-lg"\>  
            \</div\>  
            \<div\>  
              \<input type="email" placeholder="Email Address" class="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-white transition-colors text-lg"\>  
            \</div\>  
            \<div class=""\>  
              \<textarea rows="4" placeholder="Message" class="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-white transition-colors text-lg resize-none"\>\</textarea\>  
            \</div\>  
            \<button type="submit" class="w-full bg-white text-black py-4 text-sm tracking-wider font-medium hover:bg-zinc-200 transition-colors"\>  
              SEND MESSAGE  
            \</button\>  
          \</form\>  
        \</div\>  
      \</div\>  
    \</section\>

    \<\!-- Footer \--\>  
    \<footer class="border-t border-white/10 py-12 px-6 reveal"\>  
      \<div class="max-w-\[1600px\] mx-auto"\>  
        \<div class="flex flex-col md:flex-row items-center justify-between gap-8"\>  
          \<div class="text-2xl tracking-\[0.2em\] font-light"\>NOIR\</div\>  
          \<div class="flex items-center gap-8"\>  
            \<a href="https://instagram.com" class="text-sm tracking-wider text-zinc-500 hover:text-white transition-colors"\>  
              INSTAGRAM  
            \</a\>  
            \<a href="https://twitter.com" class="text-sm tracking-wider text-zinc-500 hover:text-white transition-colors"\>  
              FACEBOOK  
            \</a\>  
            \<a href="https://facebook.com" class="text-sm tracking-wider text-zinc-500 hover:text-white transition-colors"\>  
              TWITTER  
            \</a\>  
          \</div\>  
          \<div class="text-sm text-zinc-500"\>© 2024 NOIR Atelier\</div\>  
        \</div\>  
      \</div\>  
    \</footer\>

    \<script\>  
      lucide.createIcons();

      // Mobile Menu  
      const menuBtn \= document.getElementById('menuBtn');  
      const closeMenuBtn \= document.getElementById('closeMenuBtn');  
      const mobileMenu \= document.getElementById('mobileMenu');  
      const menuOverlay \= document.getElementById('menuOverlay');  
      const mobileMenuLinks \= document.querySelectorAll('.mobile-menu-link');

      function openMenu() {  
        mobileMenu.classList.add('open');  
        menuOverlay.classList.remove('pointer-events-none');  
        menuOverlay.classList.add('opacity-100');  
        document.body.style.overflow \= 'hidden';  
      }

      function closeMenu() {  
        mobileMenu.classList.remove('open');  
        menuOverlay.classList.add('pointer-events-none');  
        menuOverlay.classList.remove('opacity-100');  
        document.body.style.overflow \= '';  
      }

      menuBtn.addEventListener('click', openMenu);  
      closeMenuBtn.addEventListener('click', closeMenu);  
      menuOverlay.addEventListener('click', closeMenu);

      mobileMenuLinks.forEach(link \=\> {  
        link.addEventListener('click', () \=\> {  
          closeMenu();  
        });  
      });

      // Reveal on scroll  
      const revealElements \= document.querySelectorAll('.reveal, .reveal-scale, .image-reveal');

      const revealObserver \= new IntersectionObserver((entries) \=\> {  
        entries.forEach(entry \=\> {  
          if (entry.isIntersecting) {  
            entry.target.classList.add('active');  
          }  
        });  
      }, {  
        threshold: 0.15,  
        rootMargin: '0px 0px \-50px 0px'  
      });

      revealElements.forEach(el \=\> {  
        revealObserver.observe(el);  
      });

      // Smooth scroll  
      document.querySelectorAll('a\[href^="\#"\]').forEach(anchor \=\> {  
        anchor.addEventListener('click', function(e) {  
          e.preventDefault();  
          const target \= document.querySelector(this.getAttribute('href'));  
          if (target) {  
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });  
          }  
        });  
      });

      // Parallax effect  
      window.addEventListener('scroll', () \=\> {  
        const scrolled \= window.pageYOffset;  
        const parallaxElements \= document.querySelectorAll('.parallax-slow');

        parallaxElements.forEach(el \=\> {  
          const speed \= 0.5;  
          el.style.transform \= \`translateY(${scrolled \* speed}px)\`;  
        });  
      });  
    \</script\>

    \<div id="videoModal" class="fixed inset-0 z-\[100\] bg-black/95 backdrop-blur-md flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-500" onclick="if(event.target \=== this) { this.classList.add('pointer-events-none', 'opacity-0'); document.body.style.overflow \= ''; }"\>  
      \<button onclick="document.getElementById('videoModal').classList.add('pointer-events-none', 'opacity-0'); document.body.style.overflow \= '';" class="absolute top-6 right-6 text-white hover:opacity-60 transition-opacity z-10"\>  
        \<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x" style="stroke-width: 1.5;"\>  
          \<path d="M18 6 6 18"\>\</path\>  
          \<path d="m6 6 12 12"\>\</path\>  
        \</svg\>  
      \</button\>  
      \<div class="w-full max-w-6xl mx-6"\>  
        \<div class="relative w-full" style="padding-bottom: 56.25%;"\>  
          \<iframe class="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/6rNP8B-hdJU?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""\>\</iframe\>  
        \</div\>  
      \</div\>  
    \</div\>

    \<div class="gradient-blur-bottom"\>  
      \<div\>\</div\>  
      \<div\>\</div\>  
      \<div\>\</div\>  
      \<div\>\</div\>  
      \<div\>\</div\>  
      \<div\>\</div\>  
    \</div\>  
    \<style\>  
      .gradient-blur-bottom{position:fixed;z-index:5;inset:auto 0 0 0;height:12%;pointer-events:none}.gradient-blur-bottom\>div,.gradient-blur-bottom::before,.gradient-blur-bottom::after{position:absolute;inset:0}.gradient-blur-bottom::before{content:"";z-index:1;backdrop-filter:blur(0.5px);mask:linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 12.5%,rgba(0,0,0,1) 25%,rgba(0,0,0,0) 37.5%)}.gradient-blur-bottom\>div:nth-of-type(1){z-index:2;backdrop-filter:blur(1px);mask:linear-gradient(to bottom,rgba(0,0,0,0) 12.5%,rgba(0,0,0,1) 25%,rgba(0,0,0,1) 37.5%,rgba(0,0,0,0) 50%)}.gradient-blur-bottom\>div:nth-of-type(2){z-index:3;backdrop-filter:blur(2px);mask:linear-gradient(to bottom,rgba(0,0,0,0) 25%,rgba(0,0,0,1) 37.5%,rgba(0,0,0,1) 50%,rgba(0,0,0,0) 62.5%)}.gradient-blur-bottom\>div:nth-of-type(3){z-index:4;backdrop-filter:blur(4px);mask:linear-gradient(to bottom,rgba(0,0,0,0) 37.5%,rgba(0,0,0,1) 50%,rgba(0,0,0,1) 62.5%,rgba(0,0,0,0) 75%)}.gradient-blur-bottom\>div:nth-of-type(4){z-index:5;backdrop-filter:blur(8px);mask:linear-gradient(to bottom,rgba(0,0,0,0) 50%,rgba(0,0,0,1) 62.5%,rgba(0,0,0,1) 75%,rgba(0,0,0,0) 87.5%)}.gradient-blur-bottom\>div:nth-of-type(5){z-index:6;backdrop-filter:blur(16px);mask:linear-gradient(to bottom,rgba(0,0,0,0) 62.5%,rgba(0,0,0,1) 75%,rgba(0,0,0,1) 87.5%,rgba(0,0,0,0) 100%)}.gradient-blur-bottom\>div:nth-of-type(6){z-index:7;backdrop-filter:blur(32px);mask:linear-gradient(to bottom,rgba(0,0,0,0) 75%,rgba(0,0,0,1) 87.5%,rgba(0,0,0,1) 100%)}.gradient-blur-bottom::after{content:"";z-index:8;backdrop-filter:blur(64px);mask:linear-gradient(to bottom,rgba(0,0,0,0) 87.5%,rgba(0,0,0,1) 100%)}  
    \</style\>  
    
\</body\>\</html\>  
