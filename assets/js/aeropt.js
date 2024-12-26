document.addEventListener("DOMContentLoaded", () => {
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
    const list = document.querySelector(".profile-engagements__list");
    const wrapper = document.querySelector(".profile-engagements__wrapper");
  
    // Duplicate list items for infinite scrolling
    const originalItems = Array.from(list.children);
    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      list.appendChild(clone);
    });
  
    // Pause scrolling on hover
    wrapper.addEventListener("mouseenter", () => {
      list.style.animationPlayState = "paused";
    });
  
    // Resume scrolling on mouse leave
    wrapper.addEventListener("mouseleave", () => {
      list.style.animationPlayState = "running";
    });
  });
  