document.addEventListener("DOMContentLoaded", () => {
  /*Hero Section*/
  const ROTATION_INTERVAL = 2000; // 2 seconds per text
  const ACTIVE_CLASS = "main-banner__rotating-text-item--active";
  const rotatingTexts = document.querySelectorAll(
    ".main-banner__rotating-text-item"
  );
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

  /* Partner Section */
  const track = document.querySelector(".partner-logos__track");
  const wrapper = document.querySelector(".partner-logos__wrapper");
  const logos = track.innerHTML;

  track.innerHTML += logos + logos;
  let scrollPosition = 0;
  let speed = 0.5;

  function scrollLogos() {
    scrollPosition += speed;
    if (scrollPosition >= track.scrollWidth / 3) {
      scrollPosition = 0;
    }
    track.style.transform = `translateX(${-scrollPosition}px)`;
    requestAnimationFrame(scrollLogos);
  }

  wrapper.addEventListener("mouseenter", () => (speed = 0));
  wrapper.addEventListener("mouseleave", () => (speed = 0.5));
  scrollLogos();
});

document.addEventListener("DOMContentLoaded", () => {
  const timelineWrapper = document.querySelector(".timeline-wrapper");
  const timelineItems = document.querySelectorAll(".timeline-item");
  const planeIcon = document.querySelector(".timeline__plane-icon");
  const timelineLine = document.querySelector(".timeline__line");

  function updateTimeline() {
    const wrapperRect = timelineWrapper.getBoundingClientRect();
    const sectionHeight = wrapperRect.height;
    const windowHeight = window.innerHeight;

    // Start movement when 25% of the section is visible
    const startOffset = windowHeight * 0.25; // Start at 25% of the viewport
    const scrollPosition = Math.min(
      Math.max(0, windowHeight - wrapperRect.top - startOffset),
      sectionHeight - startOffset
    );

    // Calculate normalized progress (0 to 1)
    const progress = scrollPosition / (sectionHeight - startOffset);

    // Update plane icon and timeline line based on progress
    planeIcon.style.top = `${progress * 100}%`;
    timelineLine.style.height = `${progress * 100}%`;

    // Highlight active timeline items
    timelineItems.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const isActive =
        itemRect.top + itemRect.height / 2 <= windowHeight / 2 &&
        itemRect.top >= 0;

      item.classList.toggle("active", isActive);
    });
  }

  // Add event listeners
  window.addEventListener("scroll", updateTimeline);
  window.addEventListener("resize", updateTimeline);

  // Initial update
  updateTimeline();
});

document.addEventListener("DOMContentLoaded", () => {
  /* Crew Section */
  const wrapper = document.querySelector(".profile-engagements__wrapper");
  const list = document.querySelector(".profile-engagements__list");
  const items = document.querySelectorAll(".profile-engagement__item");

  // Clone items for infinite scroll
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    list.appendChild(clone);
  });

  const itemHeight = items[0].offsetHeight + 10; // 10px for margin-bottom
  const totalHeight = itemHeight * items.length;
  let scrollPosition = 0;
  let animationId;
  let isPaused = false;

  function updateScroll() {
    scrollPosition += 0.5; // Adjust this value to change scroll speed
    if (scrollPosition >= totalHeight) {
      scrollPosition = 0;
    }
    list.style.transform = `translateY(-${scrollPosition}px)`;

    highlightCenterItem();

    if (!isPaused) {
      animationId = requestAnimationFrame(updateScroll);
    }
  }

  function highlightCenterItem() {
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperCenter = wrapperRect.top + wrapperRect.height / 2;

    list.querySelectorAll(".profile-engagement__item").forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.top + itemRect.height / 2;

      if (Math.abs(wrapperCenter - itemCenter) < itemHeight / 2) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  // Start scrolling
  updateScroll();

  // Pause animation on hover
  wrapper.addEventListener("mouseenter", () => {
    isPaused = true;
    cancelAnimationFrame(animationId);
  });

  wrapper.addEventListener("mouseleave", () => {
    isPaused = false;
    updateScroll();
  });

  // Update on window resize
  window.addEventListener("resize", () => {
    const newItemHeight = items[0].offsetHeight + 10;
    itemHeight = newItemHeight;
    totalHeight = itemHeight * items.length;
    highlightCenterItem();
  });

  /* Success Section */
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
      nextEl: ".success__arrow-right",
      prevEl: ".success__arrow-left",
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    autoHeight: true,
  });

  /*  ----------Capabilities------------*/
  const isMobile = () => window.innerWidth <= 1200;

  document.querySelectorAll(".capabilities__items").forEach((item) => {
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
          // Remove 'active' class from all descriptions except the clicked one
          if (desc !== description) {
            desc.classList.remove("active");
          }
        });

        if (description) {
          // Toggle the 'active' class on the clicked item's description
          description.classList.toggle("active");
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
});
