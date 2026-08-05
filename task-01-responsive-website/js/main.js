// Mobile Navigation
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-navigation");
const navLinks = document.querySelectorAll(".nav-link");

const closeMenu = () => {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
};

menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );
});

navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        navigation.classList.contains("is-open")
    ) {
        closeMenu();
        menuToggle.focus();
    }
});

// Form Validation
const contactForm = document.querySelector("#contact-form");
const fullNameInput = document.querySelector("#name");
const nameError = document.querySelector("#name-error");

const showFieldError = (input, errorElement, message) => {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    input.setAttribute("aria-invalid", "true");

    errorElement.textContent = message;
};

const clearFieldError = (input, errorElement) => {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");

    input.setAttribute("aria-invalid", "false");

    errorElement.textContent = "";
};

const validateFullName = () => {
    const value = fullNameInput.value.trim();
    fullNameInput.value = value;

    if (value.length === 0) {
        showFieldError(
            fullNameInput,
            nameError,
            "Full name is required."
        );

        return false;
    }

    if (value.length < 2 || value.length > 60) {
        showFieldError(
            fullNameInput,
            nameError,
            "Full name must be between 2 and 60 characters."
        );

        return false;
    }

    clearFieldError(fullNameInput, nameError);

    return true;
};

if (fullNameInput) {
    fullNameInput.addEventListener("blur", validateFullName);

    fullNameInput.addEventListener("input", () => {
        if (fullNameInput.classList.contains("is-invalid")) {
            validateFullName();
        }
    });
}

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const isNameValid = validateFullName();

        if (!isNameValid) {
            fullNameInput.focus();
        }
    });
}