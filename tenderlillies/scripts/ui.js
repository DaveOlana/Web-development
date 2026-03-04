document.addEventListener('DOMContentLoaded', async () => {
    // Dynamically load HTML components into their respective containers
    async function loadComponent(id, file) {
        const el = document.getElementById(id);
        if (el) {
            try {
                // Must explicitly enforce root relative paths for deep subpages
                const res = await fetch(file);
                if (res.ok) {
                    el.innerHTML = await res.text();
                } else {
                    console.error(`Failed to fetch ${file}: ${res.status}`);
                }
            } catch (err) {
                console.error(`Error loading ${file}:`, err);
            }
        }
    }

    // Load components concurrently for optimal performance
    await Promise.all([
        loadComponent('navbar-container', '/components/navbar.html'),
        loadComponent('hero-container', '/components/hero.html'),
        loadComponent('notice-container', '/components/notice.html'),
        loadComponent('footer-container', '/components/footer.html')
    ]);

    // Initialize UI interactions after components exist in the DOM
    initUI();

    // If the notice.js script is loaded, initialize it after the DOM is ready
    if (window.initNotice) window.initNotice();
});

function initUI() {
    initNavbar();
    initMobileMenu();
    initAdvancedFallback();
    initGallery();
    initActiveLinks();
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                // Scrolled state: Dark background with blur effect
                navbar.classList.remove('bg-transparent', 'border-white/5');
                navbar.classList.add('bg-brand-primary/95', 'backdrop-blur-md', 'border-white/5', 'shadow-2xl');
            } else {
                // Top state: Transparent
                navbar.classList.add('bg-transparent', 'border-white/5');
                navbar.classList.remove('bg-brand-primary/95', 'backdrop-blur-md', 'border-white/5', 'shadow-2xl');
            }
        });
        // Evaluate immediately on mount
        window.dispatchEvent(new Event('scroll'));
    }
}

function initActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (currentPath === linkPath || (currentPath === '/' && linkPath.endsWith('index.html'))) {
            // Desk Nav specific class modifications
            link.classList.add('text-white');
            link.classList.remove('text-white/70', 'text-white/50');

            // Add elegant dot indicator for desktop links
            if (link.closest('.nav-desktop')) {
                const dot = document.createElement('span');
                dot.className = 'absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full transition-all duration-300';
                link.appendChild(dot);
            }
        }
    });
}

function initMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const openIcon = document.querySelector('.menu-open-icon');
    const closeIcon = document.querySelector('.menu-close-icon');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            if (openIcon) openIcon.classList.toggle('hidden');
            if (closeIcon) closeIcon.classList.toggle('hidden');
        });

        // Auto-close menu when clicking a link
        const links = mobileMenu.querySelectorAll('a, button');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                if (openIcon) openIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            });
        });
    }
}

function initAdvancedFallback() {
    // Silently remove broken images from the layout, preserving grid integrity
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            this.style.display = 'none';
        });
    });
}

function initGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;

    // Dynamically forge the Lightbox DOM element
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'fixed inset-0 z-[100] hidden bg-brand-black/95 backdrop-blur-md flex items-center justify-center p-4 opacity-0 transition-opacity duration-300';
        lightbox.innerHTML = `
            <button id="close-lightbox" class="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 bg-white/5 rounded-full backdrop-blur-lg">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <img id="lightbox-img" src="" class="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl transform scale-95 transition-transform duration-300 object-contain" alt="Gallery Details">
        `;
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target.id === 'lightbox' || e.target.closest('#close-lightbox')) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
                closeLightbox();
            }
        });
    }

    const lightboxImg = document.getElementById('lightbox-img');

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.remove('hidden');
        // Trigger reflow to ensure the transition engine registers the removal of 'hidden'
        void lightbox.offsetWidth;
        lightbox.classList.add('opacity-100');
        lightboxImg.classList.add('scale-100');
        lightboxImg.classList.remove('scale-95');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('opacity-100');
        lightboxImg.classList.remove('scale-100');
        lightboxImg.classList.add('scale-95');
        setTimeout(() => {
            lightbox.classList.add('hidden');
            lightboxImg.src = '';
            document.body.style.overflow = '';
        }, 300); // 300ms matches Tailwind duration-300
    }

    // Attach click listeners to all gallery imagery
    const images = galleryContainer.querySelectorAll('img');
    images.forEach(img => {
        // Upgrade gallery images with interactive CSS triggers
        img.classList.add('cursor-pointer', 'transition-all', 'duration-500', 'hover:scale-105', 'hover:opacity-90', 'hover:shadow-2xl');
        img.addEventListener('click', () => {
            openLightbox(img.src);
        });
    });
}
