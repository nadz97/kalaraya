document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Elements
    const heroContent = document.querySelector('.hero-content');
    const heroSection = document.querySelector('.hero');

    // Scroll Handler
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;

        let opacity = 1 - (scrollPosition / (windowHeight * 0.5));

        // Clamp opacity between 0 and 1
        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;

        if (heroContent) {
            heroContent.style.opacity = opacity;
        }
    });

    // Profile Text Reveal Observer
    const profileTexts = document.querySelectorAll('.text-body');
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2, rootMargin: "0px" });

    profileTexts.forEach(text => {
        textObserver.observe(text);
    });

    // Stats Counter Animation
    const statsSection = document.querySelector('.profile-stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let started = false;

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            started = true;
            statNumbers.forEach(num => {
                const target = parseInt(num.innerText);
                const suffix = num.innerText.replace(/[0-9]/g, ''); // Get + or other suffix
                let count = 0;
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps

                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        num.innerText = target + suffix;
                        clearInterval(timer);
                    } else {
                        num.innerText = Math.floor(count) + suffix;
                    }
                }, 16);
            });
        }
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }


    // Intersection Observer for other animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe Scope Cards
    const scopeCards = document.querySelectorAll('.scope-card');
    scopeCards.forEach(card => {
        observer.observe(card);
    });

    // Optimized Why Choose Us Observer
    const whyBlocks = document.querySelectorAll('.why-block');
    const whyMainImg = document.getElementById('why-main-img');

    const whyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the image source from the data attribute
                const newSrc = entry.target.getAttribute('data-image');

                if (whyMainImg && newSrc) {
                    // Start fade out
                    whyMainImg.style.opacity = '0';

                    // Wait for fade out to complete (matching CSS transition 0.5s)
                    setTimeout(() => {
                        whyMainImg.src = newSrc;
                        // Start fade in
                        whyMainImg.style.opacity = '1';
                    }, 500);
                }
            }
        });
    }, { threshold: 0.5 });

    whyBlocks.forEach(block => {
        whyObserver.observe(block);
    });



    // Design Process Scroll Animation
    const processSection = document.getElementById('process');
    const processFill = document.getElementById('process-fill');
    const processSteps = document.querySelectorAll('.process-step');

    if (processSection && processFill) {
        window.addEventListener('scroll', () => {
            const sectionTop = processSection.offsetTop;
            const sectionHeight = processSection.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;

            // Adjust start point so it starts filling as soon as we enter
            const start = sectionTop;
            const end = sectionTop + sectionHeight - windowHeight;

            let progress = (scrollY - start) / (end - start);

            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            // Update line width
            processFill.style.width = `${progress * 100}%`;

            processSteps.forEach((step, index) => {
                let threshold = 0;
                if (index === 1) threshold = 0.33;
                if (index === 2) threshold = 0.66;
                if (index === 3) threshold = 0.95;

                if (progress >= threshold) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
        });
    }

    // Pricing Toggle Logic
    const toggles = document.querySelectorAll('.pricing-toggle');
    const contents = document.querySelectorAll('.pricing-content');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            // Remove active from all toggles
            toggles.forEach(t => t.classList.remove('active'));
            // Add active to click
            toggle.classList.add('active');

            const target = toggle.getAttribute('data-target');

            // Hide all contents
            contents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none'; // Ensure display is toggled for animation restart
            });

            // Show target content
            const targetContent = document.getElementById(`pricing-${target}`);
            if (targetContent) {
                targetContent.style.display = 'block';
                // Small delay to allow display block to apply before opacity transition
                setTimeout(() => {
                    targetContent.classList.add('active');
                }, 10);
            }
        });
    });

});
