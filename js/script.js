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
    const profileSection = document.querySelector('.profile');
    const profileBg = document.querySelector('.profile-bg');

    // Scroll Handler
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;

        // Hero Fade Out Animation
        // Opacity goes from 1 to 0 as we scroll down the first 50% of the viewport height
        // This ensures it's fully gone before the next section fully covers it
        let opacity = 1 - (scrollPosition / (windowHeight * 0.5));

        // Clamp opacity between 0 and 1
        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;

        if (heroContent) {
            heroContent.style.opacity = opacity;
        }

        // Profile Parallax
        // Profile Parallax - REMOVED for Stick Narrative Option
    });

    // Profile Text Reveal Observer
    const profileTexts = document.querySelectorAll('.text-body');
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Optional: Remove if we want re-trigger, for now keep it simple to just reveal
                // entry.target.classList.remove('visible'); 
            }
        });
    }, { threshold: 0.2, rootMargin: "0px 0px -100px 0px" });

    profileTexts.forEach(text => {
        textObserver.observe(text);
    });

    // Intersection Observer for other animations (Future use)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Team Content Reveal (Split Blocks)
    const teamBlocks = document.querySelectorAll('.team-info-block');
    const teamContentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Remove visible to fade out when scrolling past
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.4, rootMargin: "-30% 0px -30% 0px" }); // Tighter focus area

    teamBlocks.forEach(block => {
        teamContentObserver.observe(block);
    });

    // Team Description Scroll Fade (Smoother JS calculation)
    const teamDesc = document.querySelector('.team-desc');
    if (teamDesc) {
        window.addEventListener('scroll', () => {
            const rect = teamDesc.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            // Start fading when it goes into the top half of screen
            // Simple logic: As it approaches top (0), opacity drops.
            // Let's say fade starts at 200px from top and ends at 0.
            const fadeStart = 200;
            const fadeEnd = 50; // Don't let it touch the header fully opaque

            let opacity = 1;

            if (rect.top < fadeStart) {
                opacity = Math.max(0, (rect.top - fadeEnd) / (fadeStart - fadeEnd));
            }

            teamDesc.style.opacity = opacity;
        });
    }

    // Team Photo Blur/Fade Logic (Active Row)
    const teamRows = document.querySelectorAll('.team-member-row');
    const teamPhotoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-photo');
            } else {
                entry.target.classList.remove('active-photo');
            }
        });
    }, { threshold: 0.3, rootMargin: "-10% 0px -10% 0px" });
    // Trigger when 30% visible, with margins to ensure good overlap handling

    teamRows.forEach(row => {
        teamPhotoObserver.observe(row);
    });

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
    }, { threshold: 0.5 }); // Trigger when 50% visible

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

            // Calculate progress strictly within the section
            // We want the animation to start when the sticky container locks (approx sectionTop)
            // and end when we scroll through the 400vh

            // Adjust start point so it starts filling as soon as we enter
            const start = sectionTop;
            const end = sectionTop + sectionHeight - windowHeight;

            let progress = (scrollY - start) / (end - start);

            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            // Update line width
            processFill.style.width = `${progress * 100}%`;

            // Active State for Steps
            // Logic: 
            // Step 1: 0% -> Always active if we are here? Or starts at 0? Let's say it activates immediately.
            // Step 2: > 33%
            // Step 3: > 66%
            // Step 4: > 90% or 100%

            processSteps.forEach((step, index) => {
                // Determine threshold for each step
                // 4 steps -> 3 intervals (0-33, 33-66, 66-100)
                // Thresholds: 0, 0.33, 0.66, 0.95

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

    // meet the team photo handler 


    const photoCols = document.querySelectorAll('.team-photo-col');

    // Define the area at the top where the fade should happen.
    // Since your title is there, 150px is a good starting point.
    const fadeTriggerZone = 150;

    function handlePhotoFade() {
        photoCols.forEach(col => {
            // Get position of the photo column relative to the viewport window
            const rect = col.getBoundingClientRect();

            // Check if the element is currently currently visible on screen
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                // If the top of the column is entering the "fade zone" near the top
                if (rect.top < fadeTriggerZone) {
                    // Calculate opacity: 0 when at top, 1 when at fadeTriggerZone boundary
                    let newOpacity = (rect.top / fadeTriggerZone);
                    // Ensure opacity stays strictly between 0 and 1
                    newOpacity = Math.max(0, Math.min(1, newOpacity));
                    col.style.opacity = newOpacity.toFixed(2);
                } else {
                    // If it's safely below the zone, ensure it's fully visible
                    col.style.opacity = 1;
                }
            }
        });
    }

    // Listen for scroll events
    window.addEventListener('scroll', handlePhotoFade, { passive: true });
    // Run once on load in case the page starts scrolled
    handlePhotoFade();


});
