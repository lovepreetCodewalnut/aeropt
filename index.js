document.addEventListener("DOMContentLoaded", () => {
  /* ---- Hero Section ---- */
  const ROTATION_INTERVAL = 2000;
  const ACTIVE_CLASS = "hero__rotating-text--active";
  const rotatingTexts = document.querySelectorAll(".hero__rotating-text");
  let currentIndex = 0;
  let intervalId = null;

  function rotateText() {
    rotatingTexts[currentIndex].classList.remove(ACTIVE_CLASS);
    currentIndex = (currentIndex + 1) % rotatingTexts.length;
    rotatingTexts[currentIndex].classList.add(ACTIVE_CLASS);
  }

  function initializeRotation() {
    rotatingTexts[0].classList.add(ACTIVE_CLASS);
    cleanup();
    intervalId = setInterval(rotateText, ROTATION_INTERVAL);
  }

  function cleanup() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  initializeRotation();

  window.addEventListener("unload", cleanup);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cleanup();
    } else {
      initializeRotation();
    }
  });

  /* ---- Partner Section ---- */
  const track = document.querySelector(".logos__track");
  const wrapper = document.querySelector(".logos__wrapper");
  const logos = track.innerHTML;
  track.innerHTML += logos + logos;

  let scrollPosition = 0;
  const speed = 1;
  let isPaused = false;

  function calculateTrackWidth() {
    return Array.from(track.children)
      .slice(0, track.children.length / 3)
      .reduce((acc, logo) => acc + logo.offsetWidth, 0);
  }

  function scrollLogos() {
    if (!isPaused) {
      const trackWidth = calculateTrackWidth();
      scrollPosition = (scrollPosition + speed) % trackWidth;
      track.style.transform = `translateX(${-scrollPosition}px)`;
    }
    requestAnimationFrame(scrollLogos);
  }

  wrapper.addEventListener("mouseenter", () => (isPaused = true));
  wrapper.addEventListener("mouseleave", () => (isPaused = false));

  scrollLogos();

  /*-------What to do-------------*/
  const timelineWrapper = document.querySelector(".timeline-wrapper");
  const timelineItems = Array.from(document.querySelectorAll(".timeline-item"));
  const planeIcon = document.querySelector(".timeline__plane-icon");
  const timelineLine = document.querySelector(".timeline__line");

  function updateTimeline() {
    const { top, height } = timelineWrapper.getBoundingClientRect();
    const visibleStart = Math.max(0, -top);
    const visibleHeight = Math.min(height, window.innerHeight - top);
    const planePosition = (visibleStart + visibleHeight / 2) / height;

    planeIcon.style.top = `${planePosition * 100}%`;
    timelineLine.style.height = `${planePosition * 100}%`;

    timelineItems.forEach((item) => {
      const itemMiddle =
        item.getBoundingClientRect().top + item.offsetHeight / 2;
      const isActive = itemMiddle < window.innerHeight * 0.6 && itemMiddle > 0;
      item.classList.toggle("active", isActive);
    });
  }

  ["scroll", "resize"].forEach((event) =>
    window.addEventListener(event, updateTimeline)
  );

  updateTimeline();

  /*  ----------Capabilities------------*/
  const isMobile = () => window.innerWidth <= 768;

  document.querySelectorAll(".capability-item").forEach((item) => {
    const capability = item.dataset.capability;
    const description = item.nextElementSibling;

    // Handle hover on desktop
    item.addEventListener("mouseenter", () => {
      if (!isMobile()) {
        document.querySelector(
          ".capabilities__center-initial-image"
        ).style.opacity = "0";
        document.querySelector(".capabilities__center-image").style.opacity =
          "1";
        document
          .querySelectorAll(".capabilities__center-overlay")
          .forEach((overlay) => {
            overlay.classList.remove("default");
            overlay.style.opacity =
              overlay.dataset.image === capability ? "1" : "0";
          });
      }
    });

    item.addEventListener("mouseleave", () => {
      if (!isMobile()) {
        document.querySelector(
          ".capabilities__center-initial-image"
        ).style.opacity = "1";
        document
          .querySelectorAll(".capabilities__center-overlay")
          .forEach((overlay) => {
            overlay.classList.remove("default");
            overlay.style.opacity = "0";
          });
      }
    });

    item.addEventListener("click", () => {
      if (isMobile()) {
        document.querySelectorAll(".capability-description").forEach((desc) => {
          desc.classList.remove("active");
        });

        if (description) {
          description.classList.add("active");
        }
      }
    });
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) {
      document.querySelectorAll(".capability-description").forEach((desc) => {
        desc.classList.remove("active");
      });
    }
  });

  /* ---- Crew Section ---- */
  const scrollContainer = document.querySelector(".scroll-container");
  const engagementCards = document.querySelectorAll(".engagement-card");
  const cardHeight = engagementCards[0].offsetHeight;
  const containerHeight = scrollContainer.parentElement.offsetHeight;
  const totalCards = engagementCards.length / 2;
  const centerPosition = containerHeight / 2;
  const threshold = cardHeight / 3;

  function highlightCard() {
    engagementCards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const containerRect =
        scrollContainer.parentElement.getBoundingClientRect();
      const cardCenter = cardRect.top + cardHeight / 2;
      const containerCenter = containerRect.top + containerRect.height / 2;
      const distanceFromCenter = Math.abs(cardCenter - containerCenter);

      card.classList.remove("active");

      if (distanceFromCenter < threshold) {
        card.classList.add("active");
        const duplicateIndex = (index + totalCards) % engagementCards.length;
        engagementCards[duplicateIndex].classList.add("active");
      }
    });
  }

  let scrollPositionPoint = 0;
  let lastTimestamp = null;
  const scrollSpeed = 0.5;

  function smoothScroll(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    scrollPositionPoint += scrollSpeed * delta;

    if (scrollPositionPoint >= cardHeight * totalCards) {
      scrollPositionPoint = 0;
      scrollContainer.scrollTop = 0;
    } else {
      scrollContainer.scrollTop = scrollPositionPoint;
    }

    highlightCard();
    requestAnimationFrame(smoothScroll);
  }

  let animationFrame = requestAnimationFrame(smoothScroll);

  scrollContainer.addEventListener("mouseenter", () => {
    cancelAnimationFrame(animationFrame);
    lastTimestamp = null;
  });

  scrollContainer.addEventListener("mouseleave", () => {
    lastTimestamp = null;
    animationFrame = requestAnimationFrame(smoothScroll);
  });

  scrollContainer.addEventListener("scroll", highlightCard);

  highlightCard();

  scrollContainer.addEventListener("animationend", () => {
    scrollContainer.style.animation = "none";
    scrollContainer.offsetHeight;
    scrollContainer.style.animation = null;
    scrollPositionPoint = 0;
    scrollContainer.scrollTop = 0;
    lastTimestamp = null;
  });

  /* Swiper */
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    speed: 2000,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '"></span>';
      },
    },
    navigation: {
      nextEl: ".success-next",
      prevEl: ".success-prev",
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
  });
});
