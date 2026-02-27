document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================================
       1. GLOBAL: Broken Image Fallback (Premium Aesthetic Protection)
       ===================================================================== */
    const protectImages = () => {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            img.addEventListener('error', function () {
                // If the image fails to load, gracefully hide it to protect the premium UI
                this.style.display = 'none';
            });
        });
    };
    protectImages();

    /* =====================================================================
       2. NAVBAR: Scroll State (Transparent -> Solid)
       ===================================================================== */
    const navbar = document.getElementById('navbar');

    // Check initial scroll position on load
    if (window.scrollY > 50) {
        navbar.classList.add('bg-brand-blue', 'shadow-md');
        navbar.classList.remove('bg-transparent', 'border-white/10');
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-brand-blue', 'shadow-md');
            navbar.classList.remove('bg-transparent', 'border-white/10');
        } else {
            navbar.classList.add('bg-transparent', 'border-white/10');
            navbar.classList.remove('bg-brand-blue', 'shadow-md');
        }
    });

    /* =====================================================================
       3. MOBILE MENU: Toggle & Auto-Close Logic
       ===================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOpenIcon = document.querySelector('.menu-open-icon');
    const menuCloseIcon = document.querySelector('.menu-close-icon');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMenu = () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
        menuOpenIcon.classList.toggle('hidden');
        menuCloseIcon.classList.toggle('hidden');

        // Ensure navbar is solid if menu is open at the top of the page
        if (!mobileMenu.classList.contains('hidden') && window.scrollY <= 50) {
            navbar.classList.add('bg-brand-blue');
            navbar.classList.remove('bg-transparent');
        } else if (mobileMenu.classList.contains('hidden') && window.scrollY <= 50) {
            navbar.classList.remove('bg-brand-blue');
            navbar.classList.add('bg-transparent');
        }
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Auto-close menu when clicking a link (especially the current page)
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // If the link points to the exact same page we are on, just close the menu
            // (Standard browser behavior handles actual navigation to other pages)
            const targetUrl = link.getAttribute('href');
            if (targetUrl) {
                const isCurrentPage = window.location.pathname.endsWith(targetUrl) ||
                    (targetUrl === 'index.html' && window.location.pathname.endsWith('/'));

                if (isCurrentPage) {
                    e.preventDefault(); // Stop reload
                    toggleMenu(); // Just close it cleanly
                }
            }
        });
    });

    /* =====================================================================
       4. NOTICE BOARD: Fetch, Render, & Modal Logic
       ===================================================================== */
    const noticeModal = document.getElementById('notice-modal');
    const noticeModalContent = document.getElementById('notice-modal-content');
    const noticeBody = document.getElementById('notice-body');
    const noticeDate = document.getElementById('notice-date');
    const closeNoticeBtn = document.getElementById('close-notice');
    const dismissNoticeBtn = document.getElementById('dismiss-notice');

    // Manual Open Buttons
    const openNoticeBtnDesktop = document.getElementById('open-notice-board-desktop');
    const openNoticeBtnMobile = document.getElementById('open-notice-board-mobile');

    let currentNoticeId = null;

    const openModal = () => {
        noticeModal.classList.remove('hidden');
        // Small delay to allow display:block to apply before animating opacity/transform
        setTimeout(() => {
            noticeModal.classList.add('opacity-100');
            noticeModalContent.classList.remove('scale-95', 'opacity-0');
            noticeModalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    };

    const closeModal = (saveToStorage = false) => {
        noticeModalContent.classList.remove('scale-100', 'opacity-100');
        noticeModalContent.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            noticeModal.classList.add('hidden');
            if (saveToStorage && currentNoticeId !== null) {
                localStorage.setItem('tenderlillies_dismissed_notice', currentNoticeId.toString());
            }
        }, 300); // Matches Tailwind duration-300
    };

    // Modal Event Listeners
    if (closeNoticeBtn) closeNoticeBtn.addEventListener('click', () => closeModal(false)); // Close without blacklisting
    if (dismissNoticeBtn) dismissNoticeBtn.addEventListener('click', () => closeModal(true)); // Close AND blacklist

    // Manual Triggers (from Navbar or Mobile Menu)
    const handleManualOpen = (e) => {
        e.preventDefault();
        // If mobile menu is open, close it
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMenu();
        }
        openModal();
    };

    if (openNoticeBtnDesktop) openNoticeBtnDesktop.addEventListener('click', handleManualOpen);
    if (openNoticeBtnMobile) openNoticeBtnMobile.addEventListener('click', handleManualOpen);

    // Close on Esc key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !noticeModal.classList.contains('hidden')) {
            closeModal(false);
        }
    });

    // Fetch and Process Data ONLY if the modal elements exist on page
    if (noticeModal && noticeBody) {
        fetch('data/notices.json')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (!data || data.length === 0) return; // No notices

                // Sort descending by date to get the freshest
                const sortedNotices = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                const latestNotice = sortedNotices[0];
                currentNoticeId = latestNotice.id;

                // Format the Date
                const dateObj = new Date(latestNotice.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                noticeDate.textContent = formattedDate;

                // Build HTML Payload based on Notice Type
                let htmlPayload = `
                    <div class="px-6 py-5 border-b border-gray-100 bg-white">
                        <h3 class="text-xl font-heading font-bold text-brand-blue pr-8">${latestNotice.title}</h3>
                    </div>
                    <div class="p-6">
                `;

                if (latestNotice.type === 'image' || latestNotice.type === 'mixed') {
                    if (latestNotice.image) {
                        htmlPayload += `<img src="${latestNotice.image}" alt="${latestNotice.title}" class="w-full h-auto max-h-[300px] object-cover rounded-lg mb-4 shadow-sm" onerror="this.src='school assets/branding/logo.png'; this.classList.remove('object-cover'); this.classList.add('object-contain', 'p-4', 'bg-gray-50');">`;
                    }
                }

                if (latestNotice.content) {
                    htmlPayload += `<p class="text-gray-600 leading-relaxed text-sm md:text-base">${latestNotice.content}</p>`;
                }

                htmlPayload += `</div>`; // Close p-6 div

                // Inject payload
                noticeBody.innerHTML = htmlPayload;

                // Check localStorage to see if we should auto-open on page load
                const dismissedId = localStorage.getItem('tenderlillies_dismissed_notice');

                // If it hasn't been dismissed, show it automatically after a brief delay
                if (dismissedId !== currentNoticeId.toString()) {
                    setTimeout(openModal, 800);
                }
            })
            .catch(error => console.error("Notice Board Error:", error));
    }

});
