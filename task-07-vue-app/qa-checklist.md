# Task 10 – Frontend QA Checklist

## Project Information

- **Project:** Blue Tech Solutions Website
- **Task:** Task 10 – Vue Testing, Production Build & Frontend Finalization
- **Testing Date:** August 16, 2026
- **Repository:** https://github.com/Shahd-Barmawi/blue-fullstack-training
- **Tested By:** Shahd Barmawi
- **Testing Environment:** Vite Production Preview / Google Chrome

---

## QA Issue Log

| Issue ID | Area | Screen / Browser | Problem | Severity | Status | Fix Applied |
| --- | --- | --- | --- | --- | --- | --- |
| QA-01 | Hero Section | Production Preview / Chrome | The "Start a Project" button did not navigate to the Contact page. | Medium | Fixed | Replaced the anchor link with a RouterLink that navigates to the Contact page. |
| QA-02 | Hero Section | Production Preview / Chrome | The "Explore Services" button did not navigate to the Services page. | Medium | Fixed | Replaced the anchor link with a RouterLink that navigates to the Services page. |
| QA-03 | Navigation | Production Preview / Chrome | The navigation bar did not update the active state while scrolling between page sections. | Medium | Fixed | Added reusable scroll-based active-section tracking using a Vue composable. |
| QA-04 | About Section | Production Preview / Chrome | The "View Our Services" button did not navigate to the Services page. | Medium | Fixed | Replaced the anchor link with a RouterLink that navigates to the Services page. |
| QA-05 | Statistics Section | Production Preview / Chrome | Statistics displayed their final values immediately instead of animating from zero when entering the viewport. | Medium | Fixed | Added a reusable viewport-triggered statistics counter composable. |
| QA-06 | Mobile Navigation | Production Preview / Chrome – Mobile | The mobile menu button was visible but did not open the navigation menu. | High | Fixed | Added a reusable mobile-menu composable with toggle, close-on-link-click, and Escape-key support. |
| QA-07 | Projects Section | Production Preview / Chrome | The "View Details" buttons did not move the user to the selected project details after opening them. | Medium | Fixed | Added project detail event handling and automatic smooth scrolling to the selected project details. |

---

## Home Page Testing

- [x] Hero section loads correctly.
- [x] All hero text displays correctly.
- [x] All images load correctly.
- [x] The "Start a Project" button navigates correctly.
- [x] The "Explore Services" button navigates correctly.
- [x] Navigation links work correctly.
- [x] Active navigation updates while scrolling through sections.
- [x] About section displays correctly.
- [x] The "View Our Services" button navigates correctly.
- [x] Statistics counters start from zero.
- [x] Statistics counters animate when the section enters the viewport.
- [x] Statistics animation runs correctly.
- [x] No layout issues are visible.
- [x] The browser console is clean.

---

## Projects Section Testing

- [x] Project cards display correctly.
- [x] All project filters work correctly.
- [x] The All filter displays all projects.
- [x] The Web filter displays Web projects.
- [x] The Mobile filter displays Mobile projects.
- [x] The UI/UX filter displays UI/UX projects.
- [x] View Details works correctly.
- [x] Selected project details display correctly.
- [x] The page scrolls automatically to the selected project details.
- [x] Close Details works correctly.
- [x] No layout issues are visible.
- [x] The browser console is clean.

---

## Posts Page Testing

- [x] Posts load successfully from the API.
- [x] Loading state appears correctly.
- [x] Error state appears correctly.
- [x] Retry button works correctly.
- [x] Search filters posts correctly.
- [x] Reset button clears the search.
- [x] Query-string synchronization works correctly.
- [x] The "+ New Post" button opens the Create Post page.
- [x] Post cards display correctly.
- [x] Favorite and Unfavorite actions work correctly.
- [x] View Details opens the correct post.
- [x] The browser console is clean.

---

## Post Details Page Testing

- [x] Post data loads correctly.
- [x] Post title displays correctly.
- [x] Post body displays correctly.
- [x] Post ID displays correctly.
- [x] Direct refresh on the details route works correctly.
- [x] Favorite and Unfavorite actions work correctly.
- [x] The Back to Posts button works correctly.
- [x] Invalid or nonexistent post IDs are handled correctly.
- [x] No unexpected failed requests were found.
- [x] The browser console is clean.

---

## Favorites Page Testing

- [x] A post can be added to Favorites from the Posts page.
- [x] The shared favorite count updates correctly.
- [x] Selected favorite posts appear in the Favorites page.
- [x] Favorites persist after refreshing the browser.
- [x] Favorite posts can be removed from the Favorites page.
- [x] The shared favorite count decreases after removing a favorite.
- [x] The empty state appears correctly when no favorites are selected.
- [x] The browser console is clean.

---

## Create Post Page Testing

- [x] Required-field validation works correctly.
- [x] Title minimum-length validation works correctly.
- [x] Body minimum-length validation works correctly.
- [x] User ID validation works correctly.
- [x] Field-level validation messages appear correctly.
- [x] Validation messages update when the user corrects invalid input.
- [x] Character counting works correctly.
- [x] Invalid submissions are blocked.
- [x] The submit button is disabled while submitting.
- [x] The loading state appears correctly.
- [x] Error handling works correctly.
- [x] Retry functionality works correctly.
- [x] Successful submissions display success feedback.
- [x] The returned post ID displays correctly.
- [x] The form resets correctly after a successful submission.
- [x] The Create Another Post action works correctly.
- [x] Created posts appear in the Posts page.
- [x] Created posts persist after refreshing the browser.
- [x] The Back to Posts button works correctly.
- [x] The browser console is clean.

---

## Mobile Navigation Testing

- [x] Mobile menu button appears at mobile widths.
- [x] Mobile menu opens correctly.
- [x] Mobile menu closes correctly.
- [x] Mobile menu closes after selecting a navigation link.
- [x] Escape key closes the mobile menu.
- [x] Active navigation state remains functional on mobile.
- [x] Navigation links remain accessible and usable.

---

## Responsive Testing

| Screen Width | Status | Notes |
| --- | --- | --- |
| 320px | Passed | Mobile navigation, content stacking, cards, forms, buttons, and project details display correctly with no horizontal overflow. |
| 375px | Passed | Mobile layout works correctly with no clipped content, overlapping elements, or horizontal scrolling. |
| 768px | Passed | Tablet layout remains stable and navigation, cards, forms, and content display correctly. |
| 1024px | Passed | Larger tablet layout remains stable with correctly aligned content and controls. |
| 1440px | Passed | Desktop layout displays correctly with no overflow, clipping, or alignment problems. |

---

## Accessibility Testing

- [x] Keyboard navigation works with Tab and Shift+Tab.
- [x] Navigation links are keyboard accessible.
- [x] Buttons are keyboard accessible.
- [x] Form fields are keyboard accessible.
- [x] Important actions have visible focus states.
- [x] Escape closes the mobile navigation.
- [x] Images use appropriate alt text.
- [x] Form fields have visible labels.
- [x] Validation feedback is visible and understandable.
- [x] Content remains readable across tested screen sizes.

---

## Console and Network Testing

- [x] No unresolved JavaScript errors appear in the browser console.
- [x] No unresolved Vue warnings appear.
- [x] No missing-resource errors appear.
- [x] API requests use the configured API base URL.
- [x] No unexpected failed network requests remain in the final tested flow.

---

## Automated Testing

- [x] Vitest is configured correctly.
- [x] Vue Test Utils is configured correctly.
- [x] jsdom is configured as the test environment.
- [x] The npm test command runs successfully.
- [x] Favorite addition is tested.
- [x] Favorite removal is tested.
- [x] Favorite persistence from localStorage is tested.
- [x] Empty Create Post validation is tested.
- [x] Minimum-length form validation is tested.
- [x] Successful Create Post submission is tested using a mocked store/API action.
- [x] All automated tests pass successfully.

**Final Automated Test Result:** 6 tests passed.

---

## Environment Configuration Testing

- [x] VITE_API_BASE_URL is configured.
- [x] .env.example documents the required API base URL.
- [x] API requests use the environment-based URL.
- [x] Posts continue loading correctly after the environment refactor.
- [x] Post Details continue working correctly.
- [x] Create Post continues using the correct API endpoint.

---

## Production Build Testing

- [x] `npm run build` completed successfully.
- [x] No production build errors occurred.
- [x] `npm run preview` completed successfully.
- [x] The application was tested using the production preview URL.
- [x] Routes work correctly in production mode.
- [x] Assets and styles load correctly.
- [x] API requests work correctly.
- [x] Pinia state works correctly.
- [x] localStorage persistence works correctly.
- [x] Create Post behavior works correctly.
- [x] The browser console is clean in production preview.

---

## Final Regression Testing

- [x] Home page works correctly.
- [x] About section works correctly.
- [x] Statistics section works correctly.
- [x] Services page works correctly.
- [x] Projects section works correctly.
- [x] Posts page works correctly.
- [x] Post Details page works correctly.
- [x] Favorites page works correctly.
- [x] Create Post page works correctly.
- [x] Navigation works correctly.
- [x] Active navigation works correctly.
- [x] Mobile navigation works correctly.
- [x] No broken links remain.
- [x] No horizontal scrolling exists at tested widths.
- [x] No overlapping elements remain.
- [x] No clipped controls or unreadable content remain.
- [x] No previously fixed QA issues returned.
- [x] No unresolved console errors remain.

---

## Known Issues

None identified after final regression testing.