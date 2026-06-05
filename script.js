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
lightbox.innerHTML = '<img alt="Expanded project screenshot">';
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector("img");
const closeLightbox = () => {
  lightbox.classList.remove("open");
  document.body.classList.remove("lightbox-open");
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "Expanded project screenshot";
};

lightbox.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
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

  slides.forEach((slide) => {
    slide.addEventListener("click", () => {
      const image = slide.querySelector("img");
      if (!image) {
        return;
      }
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("open");
      document.body.classList.add("lightbox-open");
    });
  });

  showSlide(0);
});