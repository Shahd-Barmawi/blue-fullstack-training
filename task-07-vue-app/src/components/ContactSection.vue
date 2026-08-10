<script setup></script>

<template>
  <section id="contact" class="contact section">
    <div class="container contact-container">
      <div class="contact-info">
        <p class="section-label">Contact Us</p>

        <h2 class="section-title contact-title">Get In Touch</h2>

        <p class="contact-description">
          We'd love to hear from you. Fill out the form and we'll get back to
          you as soon as possible.
        </p>

        <p><strong>Email:</strong> info@bluetechsolutions.com</p>
        <p><strong>Phone:</strong> +970 2 123 4567</p>
        <p><strong>Location:</strong> Al-Bireh, Palestine</p>
      </div>

      <form class="contact-form" id="contact-form" novalidate>
        <div class="form-group">
          <label for="name">Full Name</label>

          <input
            class="form-control"
            type="text"
            id="name"
            name="name"
            autocomplete="name"
            aria-describedby="name-error"
          />

          <small class="error-message" id="name-error"></small>
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>

          <input
            class="form-control"
            type="email"
            id="email"
            name="email"
            autocomplete="email"
            aria-describedby="email-error"
          />

          <small class="error-message" id="email-error"></small>
        </div>

        <div class="form-group">
          <label for="phone">
            Phone Number
            <span class="optional-text">(Optional)</span>
          </label>

          <input
            class="form-control"
            type="tel"
            id="phone"
            name="phone"
            autocomplete="tel"
            aria-describedby="phone-error"
          />

          <small class="error-message" id="phone-error"></small>
        </div>

        <div class="form-group">
          <label for="subject">Subject</label>

          <input
            class="form-control"
            type="text"
            id="subject"
            name="subject"
            aria-describedby="subject-error"
          />

          <small class="error-message" id="subject-error"></small>
        </div>

        <div class="form-group">
          <label for="message">Message</label>

          <textarea
            class="form-control"
            id="message"
            name="message"
            rows="5"
            maxlength="500"
            aria-describedby="message-error message-count"
          ></textarea>

          <div class="message-details">
            <small class="error-message" id="message-error"></small>

            <small class="character-count" id="message-count"> 0 / 500 </small>
          </div>
        </div>

        <button class="button submit-button" type="submit">Send Message</button>

        <div
          class="form-status"
          id="form-status"
          role="status"
          aria-live="polite"
        ></div>
      </form>
    </div>
  </section>
</template>
