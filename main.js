(function () {
  const navToggle = document.querySelector("#navToggle");
  const siteNav = document.querySelector("#siteNav");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-category]");
  const contactForm = document.querySelector("#contactForm");
  const formStatus = document.querySelector("#formStatus");
  const fetchBtn = document.querySelector("#fetchAdviceBtn");
  const apiResult = document.querySelector("#apiResult");

  function setNavOpen(isOpen) {
    if (!navToggle || !siteNav) return;
    siteNav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const open = navToggle.getAttribute("aria-expanded") !== "true";
      setNavOpen(open);
    });
    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setNavOpen(false);
        navToggle.focus();
      }
    });
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selected = button.getAttribute("data-filter");
      filterButtons.forEach(function (other) {
        other.setAttribute("aria-pressed", String(other === button));
      });
      projectCards.forEach(function (card) {
        const match = selected === "all" || card.getAttribute("data-category") === selected;
        card.hidden = !match;
      });
    });
  });

  function showError(input, message) {
    const error = document.getElementById(input.id + "Error");
    input.setAttribute("aria-invalid", "true");
    if (error) error.textContent = message;
  }

  function clearError(input) {
    const error = document.getElementById(input.id + "Error");
    input.removeAttribute("aria-invalid");
    if (error) error.textContent = "";
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (contactForm) {
    const fields = ["fullName", "email", "message"].map(function (id) {
      return document.getElementById(id);
    });

    fields.forEach(function (field) {
      field.addEventListener("input", function () {
        if (field.value.trim() !== "") {
          if (field.id === "email" && !isValidEmail(field.value.trim())) {
            showError(field, "Enter a valid email address.");
          } else {
            clearError(field);
          }
        }
      });
    });

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let firstInvalid = null;

      fields.forEach(function (field) {
        const value = field.value.trim();
        if (value === "") {
          showError(field, "This field is required.");
          if (!firstInvalid) firstInvalid = field;
        } else if (field.id === "email" && !isValidEmail(value)) {
          showError(field, "Enter a valid email address.");
          if (!firstInvalid) firstInvalid = field;
        } else {
          clearError(field);
        }
      });

      if (firstInvalid) {
        if (formStatus) formStatus.textContent = "";
        firstInvalid.focus();
        return;
      }

      if (formStatus) {
        formStatus.textContent = "Message ready. Thanks — this demo does not send email yet.";
      }
      contactForm.reset();
      fields.forEach(clearError);
    });
  }

 async function loadAdvice() {
  if (!apiResult) return;
  apiResult.textContent = "Calling the dog fact API…";
  try {
    const response = await fetch("https://dogapi.dog/api/v1/facts?number=1", { cache: "no-store" });
    if (!response.ok) throw new Error("The API returned " + response.status);
    const data = await response.json();
    apiResult.textContent = data.facts && data.facts[0]
      ? data.facts[0]
      : "The API responded, but no fact was found.";
  } catch (error) {
    apiResult.textContent = "Could not load a fact right now. " + error.message;
  }
}
