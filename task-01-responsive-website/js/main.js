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
const formStatus = document.querySelector("#form-status");

const contactForm = document.querySelector("#contact-form");
const fullNameInput = document.querySelector("#name");
const nameError = document.querySelector("#name-error");

const emailInput = document.querySelector("#email");
const emailError = document.querySelector("#email-error");

const phoneInput = document.querySelector("#phone");
const phoneError = document.querySelector("#phone-error");

const subjectInput = document.querySelector("#subject");
const subjectError = document.querySelector("#subject-error");

const messageInput = document.querySelector("#message");
const messageError = document.querySelector("#message-error");
const messageCount = document.querySelector("#message-count");

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

const resetValidationState = () => {
    const formControls = contactForm.querySelectorAll(".form-control");
    const errorMessages = contactForm.querySelectorAll(".error-message");

    formControls.forEach((control) => {
        control.classList.remove("is-valid", "is-invalid");
        control.setAttribute("aria-invalid", "false");
    });

    errorMessages.forEach((errorMessage) => {
        errorMessage.textContent = "";
    });

    formStatus.textContent = "";
    formStatus.classList.remove("success", "error");
};

const showFormSuccess = () => {
    contactForm.reset();

    resetValidationState();

    updateCharacterCount();

    formStatus.textContent =
        "Your form was validated successfully:)";

    formStatus.classList.add("success");
};

const toggleBackToTopButton = () => {

    if (window.scrollY > 400) {
        backToTopButton.classList.add("is-visible");
    } else {
        backToTopButton.classList.remove("is-visible");
    }

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

const validateEmail = () => {

    const value = emailInput.value.trim();
    emailInput.value = value;

    if (value.length === 0) {
        showFieldError(
            emailInput,
            emailError,
            "Email address is required."
        );

        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
        showFieldError(
            emailInput,
            emailError,
            "Please enter a valid email address."
        );

        return false;
    }

    clearFieldError(emailInput, emailError);

    return true;
};

const validatePhone = () => {
    const value = phoneInput.value.trim();

    phoneInput.value = value;

    if (value.length === 0) {
        phoneInput.classList.remove("is-invalid");
        phoneInput.classList.remove("is-valid");
        phoneInput.setAttribute("aria-invalid", "false");
        phoneError.textContent = "";

        return true;
    }

    const allowedPhoneCharacters = /^[0-9+\-()\s]+$/;

    if (!allowedPhoneCharacters.test(value)) {
        showFieldError(
            phoneInput,
            phoneError,
            "Phone number contains invalid characters."
        );

        return false;
    }

    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        showFieldError(
            phoneInput,
            phoneError,
            "Phone number must contain between 7 and 15 digits."
        );

        return false;
    }

    clearFieldError(phoneInput, phoneError);

    return true;
};

const validateSubject = () => {
    const value = subjectInput.value.trim();

    subjectInput.value = value;

    if (value.length === 0) {
        showFieldError(
            subjectInput,
            subjectError,
            "Subject is required."
        );

        return false;
    }

    if (value.length < 3 || value.length > 100) {
        showFieldError(
            subjectInput,
            subjectError,
            "Subject must be between 3 and 100 characters."
        );

        return false;
    }

    clearFieldError(subjectInput, subjectError);

    return true;
};

const updateCharacterCount = () => {
    const currentLength = messageInput.value.length;

    messageCount.textContent = `${currentLength} / 500`;
};

const validateMessage = () => {

    const value = messageInput.value.trim();

    messageInput.value = value;

    updateCharacterCount();

    if (value.length === 0) {

        showFieldError(
            messageInput,
            messageError,
            "Message is required."
        );

        return false;
    }

    if (value.length < 10 || value.length > 500) {

        showFieldError(
            messageInput,
            messageError,
            "Message must be between 10 and 500 characters."
        );

        return false;
    }

    clearFieldError(messageInput, messageError);

    return true;
};

// Back To Top Button
const backToTopButton = document.querySelector("#back-to-top");

if (fullNameInput) {
    fullNameInput.addEventListener("blur", validateFullName);

    fullNameInput.addEventListener("input", () => {
        if (fullNameInput.classList.contains("is-invalid")) {
            validateFullName();
        }
    });
}

if (emailInput) {

    emailInput.addEventListener("blur", validateEmail);

    emailInput.addEventListener("input", () => {

        if (emailInput.classList.contains("is-invalid")) {
            validateEmail();
        }

    });

}

if (phoneInput) {
    phoneInput.addEventListener("blur", validatePhone);

    phoneInput.addEventListener("input", () => {
        if (phoneInput.classList.contains("is-invalid")) {
            validatePhone();
        }
    });
}

if (subjectInput) {
    subjectInput.addEventListener("blur", validateSubject);

    subjectInput.addEventListener("input", () => {
        if (subjectInput.classList.contains("is-invalid")) {
            validateSubject();
        }
    });
}

if (messageInput) {

    updateCharacterCount();

    messageInput.addEventListener("input", () => {

        updateCharacterCount();

        if (messageInput.classList.contains("is-invalid")) {
            validateMessage();
        }

    });

    messageInput.addEventListener("blur", validateMessage);

}

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        formStatus.textContent = "";
        formStatus.classList.remove("success", "error");

        const isNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();

        if (!isNameValid) {
            fullNameInput.focus();
            return;
        }

        if (!isEmailValid) {
            emailInput.focus();
            return;
        }

        if (!isPhoneValid) {
            phoneInput.focus();
            return;
        }

        if (!isSubjectValid) {
            subjectInput.focus();
            return;
        }

        if (!isMessageValid) {
            messageInput.focus();
            return;
        }

        showFormSuccess();
    });
}

window.addEventListener("scroll", toggleBackToTopButton);

if (backToTopButton) {

    backToTopButton.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

// Active Navigation State

const pageSections = document.querySelectorAll("main section[id]");

const updateActiveNavigation = (sectionId) => {
    navLinks.forEach((link) => {
        const linkTarget = link.getAttribute("href");

        link.classList.toggle(
            "active",
            linkTarget === `#${sectionId}`
        );
    });
};

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                updateActiveNavigation(entry.target.id);
            }
        });
    },
    {
        root: null,
        threshold: 0.4,
        rootMargin: "-80px 0px -40% 0px"
    }
);

pageSections.forEach((section) => {
    sectionObserver.observe(section);
});

// Statistics Counters

const statisticsSection = document.querySelector("#statistics");
const statisticNumbers =
    document.querySelectorAll(".statistic-number");

let countersStarted = false;

const reduceMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

const animateCounter = (counter) => {
    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || "";

    const duration = 1200;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;

        const progress = Math.min(
            elapsedTime / duration,
            1
        );

        const currentValue = Math.floor(
            progress * target
        );

        counter.textContent =
            `${currentValue}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent =
                `${target}${suffix}`;
        }
    };

    requestAnimationFrame(updateCounter);
};

const startStatisticsCounters = () => {
    if (countersStarted) {
        return;
    }

    countersStarted = true;

    statisticNumbers.forEach((counter) => {
        const target = counter.dataset.target;
        const suffix = counter.dataset.suffix || "";

        if (reduceMotionQuery.matches) {
            counter.textContent =
                `${target}${suffix}`;
        } else {
            animateCounter(counter);
        }
    });
};

if (
    statisticsSection &&
    statisticNumbers.length > 0
) {
    const statisticsObserver =
        new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        startStatisticsCounters();

                        observer.unobserve(
                            entry.target
                        );
                    }
                });
            },
            {
                threshold: 0.25
            }
        );

    statisticsObserver.observe(
        statisticsSection
    );
}