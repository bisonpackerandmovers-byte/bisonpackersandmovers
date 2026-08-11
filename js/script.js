/* Bison Packers and Movers — shared front-end behaviour */
document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Preloader (2s, once per tab session) ---------- */
    var preloader = document.getElementById("preloader");
    if (preloader) {
        var alreadyShown = sessionStorage.getItem("bpm_loaded");
        var minTime = alreadyShown ? 0 : 2000;
        window.setTimeout(function () {
            preloader.classList.add("hide");
            sessionStorage.setItem("bpm_loaded", "1");
        }, minTime);
    }

    /* ---------- Mobile nav ---------- */
    var toggle = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");
    var stickyCta = document.querySelector(".mobile-sticky-cta");
    if (stickyCta) {
        document.body.classList.add("has-sticky-cta");
    }
    if (toggle && mobileNav) {
        function setMenuOpen(isOpen) {
            toggle.classList.toggle("open", isOpen);
            mobileNav.classList.toggle("open", isOpen);
            var overflowValue = isOpen ? "hidden" : "";
            document.body.style.overflow = overflowValue;
            document.documentElement.style.overflow = overflowValue;
        }
        toggle.addEventListener("click", function () {
            setMenuOpen(!mobileNav.classList.contains("open"));
        });
        mobileNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                setMenuOpen(false);
            });
        });
        window.addEventListener("resize", function () {
            if (window.innerWidth >= 1024) setMenuOpen(false);
        });
    }

    /* ---------- Seamless hero video sequence ---------- */
    var heroVideo = document.querySelector(".hero-video");
    if (heroVideo) {
        var videoSources = ["images/1.mp4", "images/2.mp4", "images/3.mp4"];
        var currentIndex = 0;
        var isReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        function playCurrentVideo() {
            heroVideo.pause();
            heroVideo.currentTime = 0;
            heroVideo.src = videoSources[currentIndex];
            heroVideo.load();

            var playWhenReady = function () {
                heroVideo.currentTime = 0;
                heroVideo.play().catch(function () {});
                heroVideo.removeEventListener("canplaythrough", playWhenReady);
                heroVideo.removeEventListener("loadeddata", playWhenReady);
            };

            heroVideo.addEventListener("canplaythrough", playWhenReady);
            heroVideo.addEventListener("loadeddata", playWhenReady);
        }

        function advanceSequence() {
            currentIndex = (currentIndex + 1) % videoSources.length;
            playCurrentVideo();
        }

        heroVideo.addEventListener("ended", function () {
            if (!isReducedMotion) {
                advanceSequence();
            }
        });
        heroVideo.addEventListener("error", function () {
            if (!isReducedMotion) {
                setTimeout(function () {
                    advanceSequence();
                }, 400);
            }
        });

        if (!isReducedMotion) {
            heroVideo.removeAttribute("loop");
            playCurrentVideo();
        } else {
            heroVideo.setAttribute("loop", "");
            playCurrentVideo();
        }
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll(".faq-item").forEach(function (item) {
        var q = item.querySelector(".faq-q");
        var a = item.querySelector(".faq-a");
        if (!q || !a) return;
        q.addEventListener("click", function () {
            var isOpen = item.classList.contains("open");
            item.closest(".faq-list").querySelectorAll(".faq-item").forEach(function (other) {
                other.classList.remove("open");
                other.querySelector(".faq-a").style.maxHeight = null;
            });
            if (!isOpen) {
                item.classList.add("open");
                a.style.maxHeight = a.scrollHeight + "px";
            }
        });
    });

    /* ---------- Testimonial carousel ---------- */
    var slides = document.querySelectorAll(".testimonial-slide");
    var dotsWrap = document.querySelector(".testimonial-dots");
    if (slides.length && dotsWrap) {
        var current = 0;
        slides.forEach(function (_, i) {
            var dot = document.createElement("button");
            if (i === 0) dot.classList.add("active");
            dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
            dot.addEventListener("click", function () { show(i); });
            dotsWrap.appendChild(dot);
        });
        function show(i) {
            slides[current].classList.remove("active");
            dotsWrap.children[current].classList.remove("active");
            current = i;
            slides[current].classList.add("active");
            dotsWrap.children[current].classList.add("active");
        }
        window.setInterval(function () { show((current + 1) % slides.length); }, 6000);
    }

    /* ---------- Multi-step quote form ---------- */
    var quoteForm = document.getElementById("quoteForm");
    if (quoteForm) {
        var steps = quoteForm.querySelectorAll(".quote-step");
        var bars = quoteForm.querySelectorAll(".quote-progress i");
        var stepIndex = 0;

        function renderStep() {
            steps.forEach(function (s, i) { s.classList.toggle("active", i === stepIndex); });
            bars.forEach(function (b, i) {
                b.classList.toggle("active", i === stepIndex);
                b.classList.toggle("done", i < stepIndex);
            });
        }
        quoteForm.querySelectorAll("[data-next]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var required = steps[stepIndex].querySelectorAll("[required]");
                for (var i = 0; i < required.length; i++) {
                    if (!required[i].value) { required[i].reportValidity(); return; }
                }
                if (stepIndex < steps.length - 1) { stepIndex++; renderStep(); }
            });
        });
        quoteForm.querySelectorAll("[data-back]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                if (stepIndex > 0) { stepIndex--; renderStep(); }
            });
        });
        quoteForm.addEventListener("submit", function (e) {
            e.preventDefault();
            var required = steps[stepIndex].querySelectorAll("[required]");
            for (var i = 0; i < required.length; i++) {
                if (!required[i].value) { required[i].reportValidity(); return; }
            }
            quoteForm.style.display = "none";
            var success = document.getElementById("quoteSuccess");
            if (success) success.style.display = "block";
            /* NOTE: connect this to your backend / form API before going live.
               Currently this only confirms receipt in the browser and does not send data anywhere. */
        });
        renderStep();
    }

    /* ---------- Generic contact / careers form feedback ---------- */
    document.querySelectorAll("form[data-simple-form]").forEach(function (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var note = form.querySelector(".form-status");
            if (note) {
                note.textContent = "Thanks — your message has been received. Our team will contact you shortly.";
                note.style.display = "block";
            }
            form.reset();
            /* NOTE: connect this to your backend / form API before going live. */
        });
    });

    /* ---------- Cost estimator (rough guide only, not a final quote) ---------- */
    var estimatorForm = document.getElementById("estimatorForm");
    if (estimatorForm) {
        estimatorForm.addEventListener("submit", function (e) {
            e.preventDefault();
            var homeSize = estimatorForm.homeSize.value;
            var packing = estimatorForm.packing.value;
            var distance = estimatorForm.distance.value;

            var base = { "1bhk": 1, "2bhk": 1.6, "3bhk": 2.3, "4bhk": 3, "office": 2.8 }[homeSize] || 1;
            var distFactor = { local: 1, intercity: 1.8, interstate: 2.6 }[distance] || 1;
            var packFactor = packing === "yes" ? 1.3 : 1;

            var low = Math.round(base * distFactor * packFactor * 3500 / 100) * 100;
            var high = Math.round(low * 1.55 / 100) * 100;

            document.getElementById("estimateRange").textContent = "₹" + low.toLocaleString("en-IN") + " – ₹" + high.toLocaleString("en-IN");
            document.getElementById("estimatorResult").classList.add("show");
        });
    }

    /* ---------- Track shipment (demo timeline — connect to real API/database) ---------- */
    var trackForm = document.getElementById("trackForm");
    if (trackForm) {
        trackForm.addEventListener("submit", function (e) {
            e.preventDefault();
            var id = trackForm.bookingId.value.trim();
            var timeline = document.getElementById("trackTimeline");
            var empty = document.getElementById("trackEmpty");
            if (!id) return;
            /* NOTE: this UI is ready to connect to a live tracking API/database.
               It does not currently look up real shipment data. */
            timeline.style.display = "none";
            empty.classList.add("show");
            empty.textContent = "We couldn't find live tracking data for booking ID \"" + id + "\" yet. Shipment tracking will go live once connected to our booking system — please call or WhatsApp us for an update on this booking.";
        });
    }

    /* ---------- Header active link ---------- */
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a, .mobile-nav a").forEach(function (link) {
        var href = link.getAttribute("href");
        if (href === path || (path === "" && href === "index.html")) link.classList.add("active");
    });
});
