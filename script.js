const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

const lightbox = document.createElement("div");
lightbox.className = "image-lightbox";
lightbox.innerHTML = `
  <button class="lightbox-control prev" type="button" aria-label="Previous fullscreen screenshot"></button>
  <img alt="Expanded project screenshot">
  <button class="lightbox-control next" type="button" aria-label="Next fullscreen screenshot"></button>
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector("img");
const lightboxPrev = lightbox.querySelector(".lightbox-control.prev");
const lightboxNext = lightbox.querySelector(".lightbox-control.next");
let lightboxSlides = [];
let lightboxIndex = 0;
let lightboxSyncSlide = null;

const showLightboxImage = (index) => {
  if (!lightboxSlides.length) {
    return;
  }

  lightboxIndex = (index + lightboxSlides.length) % lightboxSlides.length;
  const image = lightboxSlides[lightboxIndex];
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;

  if (lightboxSyncSlide) {
    lightboxSyncSlide(lightboxIndex);
  }
};

const closeLightbox = () => {
  lightbox.classList.remove("open");
  document.body.classList.remove("lightbox-open");
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "Expanded project screenshot";
  lightboxSlides = [];
  lightboxIndex = 0;
  lightboxSyncSlide = null;
};

lightbox.addEventListener("click", closeLightbox);

lightboxPrev.addEventListener("click", (event) => {
  event.stopPropagation();
  showLightboxImage(lightboxIndex - 1);
});

lightboxNext.addEventListener("click", (event) => {
  event.stopPropagation();
  showLightboxImage(lightboxIndex + 1);
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showLightboxImage(lightboxIndex - 1);
  }

  if (event.key === "ArrowRight") {
    showLightboxImage(lightboxIndex + 1);
  }
});

document.querySelectorAll("[data-slider]").forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll(".project-slide"));
  const dots = Array.from(slider.querySelectorAll(".slider-dot"));
  const prev = slider.querySelector(".slider-control.prev");
  const next = slider.querySelector(".slider-control.next");
  let activeIndex = 0;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeIndex);
    });
  };

  prev?.addEventListener("click", (event) => {
    event.stopPropagation();
    showSlide(activeIndex - 1);
  });

  next?.addEventListener("click", (event) => {
    event.stopPropagation();
    showSlide(activeIndex + 1);
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", (event) => {
      event.stopPropagation();
      showSlide(dotIndex);
    });
  });

  slides.forEach((slide, slideIndex) => {
    slide.addEventListener("click", () => {
      lightboxSlides = slides
        .map((projectSlide) => projectSlide.querySelector("img"))
        .filter(Boolean);
      lightboxSyncSlide = showSlide;
      showLightboxImage(slideIndex);
      lightbox.classList.add("open");
      document.body.classList.add("lightbox-open");
    });
  });

  showSlide(0);
});