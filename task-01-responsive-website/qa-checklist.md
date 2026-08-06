# Task 05 – Frontend QA Checklist

## Project Information

- **Project:** Blue Tech Solutions Website
- **Task:** Task 05 – Frontend QA, Accessibility, Performance and Deployment
- **Testing Date:** August 6, 2026
- **Repository:** https://github.com/Shahd-Barmawi/blue-fullstack-training
- **Tested By:** Shahd Barmawi

---

## QA Issue Log

| Issue ID | Area | Screen / Browser | Problem | Severity | Status | Fix Applied |
|---|---|---|---|---|---|---|
| QA-01 | Active Navigation | Desktop / Chrome | The Contact navigation link did not become active because the observer threshold was too high for the long Contact section. | Medium | Fixed | Reduced the IntersectionObserver threshold and adjusted the root margin so long sections are detected correctly. |
|---|---|---|---|---|---|---|
| QA-02 | Accessibility | Desktop / Chrome | No skip link was available for keyboard users to bypass the navigation and move directly to the main content. | Medium | Fixed | Add a visible-on-focus skip link connected to the main content. |

---

## Functional Regression Checklist

### Navigation

- [x] Desktop navigation links work correctly.
- [x] Mobile menu opens using the menu button.
- [x] Mobile menu closes using the menu button.
- [x] Mobile menu closes after selecting a navigation link.
- [x] Mobile menu closes using the Escape key.
- [x] Active navigation state matches the visible section.
- [x] Back-to-top button appears after scrolling.
- [x] Back-to-top button returns the page to the top.

### Contact Form

- [x] Full Name validation works correctly.
- [x] Email validation works correctly.
- [x] Optional phone validation works correctly.
- [x] Subject validation works correctly.
- [x] Message validation works correctly.
- [x] Invalid submission focuses the first invalid field.
- [x] Successful validation displays an accessible status message.
- [x] The form resets correctly after successful validation.

### Statistics

- [x] Statistics counters begin when the section enters the viewport.
- [x] Statistics counters reach the correct target values.
- [x] Statistics animation runs only once.

### General Functionality

- [x] All buttons work correctly.
- [x] All section links lead to the correct destination.
- [x] All images load without missing-resource errors.
- [x] No placeholder links lead to an unintended destination.
- [x] Browser Console contains no JavaScript errors.
- [x] Browser Console contains no missing-resource errors.

---

## Accessibility Checklist

- [x] Skip link is available and visible on keyboard focus.
- [x] Focus order is logical.
- [x] All interactive elements have visible focus styles.
- [x] The page can be used with Tab and Shift+Tab.
- [x] Buttons work with Enter and Space.
- [x] Escape closes the mobile menu.
- [x] Meaningful images have useful alt text.
- [x] Decorative images use empty alt text.
- [x] Form fields have visible labels.
- [x] Error messages are associated with their fields.
- [x] Status messages are announced accessibly.
- [x] Color contrast is readable.
- [x] Information is not communicated using color alone.
- [x] The page remains usable at 200% zoom.
- [x] No horizontal scrolling occurs at 200% zoom.
- [Not Applicable] Reduced-motion preferences are respected.
- [x] Lighthouse accessibility score is 90 or higher.

---

## Performance Checklist

- [x] Large images are resized or compressed.
- [x] Appropriate image formats are used.
- [x] Images have explicit dimensions or reliable aspect ratios.
- [x] Immediately visible images are not lazy-loaded unnecessarily.
- [x] The JavaScript file loads using defer.
- [x] No unnecessary external libraries are loaded.
- [x] Lighthouse performance results were reviewed.
- [x] Performance improvements do not break layout or functionality.

---

| Width | Chrome | Edge | Layout Status | Notes |
|---|---|---|---|---|
| 320px | Passed | Passed | Passed | No horizontal scrolling or clipped content. |
| 375px | Passed | Passed | Passed | Mobile navigation works correctly. |
| 768px | Passed | Passed | Passed | Layout stacks correctly. |
| 1024px | Passed | Passed | Passed | Tablet layout is stable. |
| 1440px | Passed | Passed | Passed | Desktop layout is stable. |
---

## Final Regression Testing

- [x] All Task 01–04 features work together correctly.
- [x] No horizontal scrolling or clipped content exists.
- [x] No overlapping elements exist.
- [x] Text remains readable at all required widths.
- [x] Forms remain usable on desktop and mobile.
- [x] The deployed GitHub Pages version loads correctly.
- [x] The deployed browser Console is clean.
---

## Known Limitations

None identified at the beginning of testing. Any discovered limitation will be documented here.