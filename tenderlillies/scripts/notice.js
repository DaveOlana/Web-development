window.initNotice = async function () {
    const noticeModal = document.getElementById('notice-modal');
    if (!noticeModal) return;

    const noticeContent = document.getElementById('notice-modal-content');
    const closeBtn = document.getElementById('close-notice');
    const dismissBtn = document.getElementById('dismiss-notice');
    const dateEl = document.getElementById('notice-date');
    const heroImg = document.getElementById('notice-hero-image');

    const desktopOpenBtn = document.getElementById('open-notice-board-desktop');
    const mobileOpenBtn = document.getElementById('open-notice-board-mobile');
    const noticeBell = document.getElementById('notice-bell');

    try {
        const res = await fetch('/data/notices.json');
        const notices = await res.json();

        if (notices && notices.length > 0) {
            // Strictly fetch the latest notice
            const latest = notices.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

            if (dateEl) dateEl.textContent = new Date(latest.date).toLocaleDateString();
            if (heroImg && latest.image) {
                heroImg.src = latest.image;
            }

            // Session check logic
            const sessionKey = `notice_seen_${latest.id}`;
            const hasSeenSession = sessionStorage.getItem(sessionKey);

            if (!hasSeenSession) {
                setTimeout(showNotice, 1500);

                if (noticeBell) {
                    noticeBell.classList.add('animate-pulse', 'text-white/80');
                    setTimeout(() => noticeBell.classList.remove('animate-pulse', 'text-white/80'), 5000);
                }
            }

            if (desktopOpenBtn) desktopOpenBtn.addEventListener('click', showNotice);
            if (mobileOpenBtn) mobileOpenBtn.addEventListener('click', showNotice);

            const handleClose = () => {
                sessionStorage.setItem(sessionKey, 'true');
                if (noticeBell) noticeBell.classList.remove('animate-pulse', 'text-white/80');
                hideNotice();
            };

            if (closeBtn) closeBtn.addEventListener('click', handleClose);
            if (dismissBtn) dismissBtn.addEventListener('click', handleClose);

            function showNotice() {
                noticeModal.classList.remove('hidden');
                void noticeModal.offsetWidth;
                noticeModal.classList.add('opacity-100');
                noticeModal.classList.remove('opacity-0');
                noticeContent.classList.remove('scale-95', 'opacity-0');
                noticeContent.classList.add('scale-100', 'opacity-100');
            }

            function hideNotice() {
                noticeModal.classList.remove('opacity-100');
                noticeModal.classList.add('opacity-0');
                noticeContent.classList.remove('scale-100', 'opacity-100');
                noticeContent.classList.add('scale-95', 'opacity-0');
                setTimeout(() => noticeModal.classList.add('hidden'), 500);
            }

            // Close modal when clicking strictly on the modal backdrop
            noticeModal.addEventListener('click', (e) => {
                if (e.target === noticeModal) {
                    handleClose();
                }
            });
        }
    } catch (err) {
        console.error("Failed to load JSON notices payload", err);
    }
}
