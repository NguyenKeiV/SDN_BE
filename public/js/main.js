// Main JavaScript for Quiz Management App

document.addEventListener("DOMContentLoaded", function () {
  // Confirm delete actions
  const deleteForms = document.querySelectorAll('form[action*="DELETE"]');
  deleteForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      if (!confirm("Are you sure you want to delete this item?")) {
        e.preventDefault();
      }
    });
  });

  // Add active class to current nav link
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  navLinks.forEach((link) => {
    if (
      link.getAttribute("href") === currentPath ||
      (currentPath.includes("quizzes") &&
        link.getAttribute("href") === "/quizzes") ||
      (currentPath.includes("questions") &&
        link.getAttribute("href") === "/questions")
    ) {
      link.classList.add("active");
    }
  });

  // Form validation
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add("was-validated");
    });
  });

  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => {
    setTimeout(() => {
      alert.style.transition = "opacity 0.5s";
      alert.style.opacity = "0";
      setTimeout(() => alert.remove(), 500);
    }, 5000);
  });
});
