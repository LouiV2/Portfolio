# Portfolio Test Plan

This plan covers Home, About Me, Projects, Skills, and Contact.

## Running and recording tests

- Use the current repository checkout. Open the site through a local static server or the IDE's preview server for browser tests.
- Test in a current desktop browser and a mobile browser or responsive device emulator. Record the browser/version, viewport, operating system, date, and commit when recording browser results.
- Start browser tests in English and dark mode unless the test says otherwise. Enable JavaScript except for T22.
- Enter **Pass** only when every expected result is observed; otherwise enter **Fail** and describe the discrepancy. Retest failures after fixes.
- Use fictional form values, such as `Test Visitor` and `visitor@example.com`. Review email drafts without sending them.

## Completed source checks

Executed November 5, 2026 against site revision `80436c1` using PowerShell file, regular-expression, and local-path checks. These results verify the source only; they do not establish browser rendering, keyboard behavior, or JavaScript execution.

| Test ID | What you are testing | Steps to run the test | Expected result | Actual result (Pass or Fail) |
| --- | --- | --- | --- | --- |
| T1 | Required pages exist | Check the repository root for `index.html`, `about.html`, `projects.html`, `skills.html`, and `contact.html`. | All five files exist. | Pass — all five files found. |
| T2 | Mobile viewport declarations | Inspect the head of each of the five pages for the viewport meta tag. | Each declares `width=device-width, initial-scale=1.0`. | Pass — declaration found on all five pages. |
| T3 | Main page heading | Count opening `h1` tags in each page. | Exactly one `h1` appears per page. | Pass — one found per page. |
| T4 | Skip-link target | Inspect each page for a skip link to `#main` and a `main` element with `id="main"`. | Both the link and its target exist on every page. | Pass — both found on all five pages. |
| T5 | Shared footer presence | Inspect each page for an opening `footer` element. | All five pages contain a footer. | Pass — footer found on each page. |
| T6 | Current-page navigation marker | Inspect each page for a link to its own filename with `aria-current="page"`. | The current page is explicitly identified. | Pass — matching marker found on every page. |
| T7 | Local link and asset paths | Extract `href` and `src` values from all five pages; ignore external URLs, email URLs, and fragment-only links; remove query strings/fragments and check each remaining path exists. | Every referenced local file exists. | Pass — no missing local files found. Does not verify external URLs or fragment targets. |
| T8 | Links to all portfolio pages | Inspect each page for relative links to each of the five page filenames. | Every page links to all five portfolio pages. | Pass — all required page links found. |
| T9 | Direct contact email | Inspect the direct email link in `contact.html`. | Its destination is `mailto:LV285@njit.edu`. | Pass — exact destination found. |
| T10 | Required contact controls and labels | For name, email, and message, check for a label targeting `contact-name`, `contact-email`, or `contact-message`, and the corresponding control with `required`. | All three controls have explicit labels and required attributes. | Pass — all three label/control pairs found. |
| T11 | Contact error containers | Check `contact.html` for `name-error`, `email-error`, and `message-error` IDs. | Each field has an error container available to the validator. | Pass — all three found. |
| T12 | Three project entries | Count elements whose class begins with `code-project` in `projects.html`. | At least three project entries exist. | Pass — at least three entries found; this check does not validate project claims. |

## Browser test cases

These tests require an interactive browser and have **not been executed**. Replace each pending actual result with **Pass** or **Fail** and a short observation after running it. Pending is not a failure and is not a claimed pass.

| Test ID | What you are testing | Steps to run the test | Expected result | Actual result (Pass or Fail) |
| --- | --- | --- | --- | --- |
| T13 | Navigation and page loading | From Home, follow each main navigation link. Repeat from the other pages; use the brand link and footer Contact link. | Correct pages open, the current-page indicator follows navigation, and no page is missing. | Not run — record Pass or Fail after execution. |
| T14 | Mobile menu and responsive layout | At 375, 768, and 1280 CSS pixels wide, inspect all pages. At widths up to 850px, open Menu, press Escape, reopen it, and choose a page. Resize across 850px with keyboard focus in the navigation. | Content fits without horizontal scrolling or overlapping controls. Mobile menu opens/closes, Escape returns focus to Menu, links navigate, and desktop navigation becomes visible on resize. | Not run — record Pass or Fail after execution. |
| T15 | Keyboard access and skip link | On every page, reload and press Tab to reveal Skip to content; activate it. Continue with Tab/Shift+Tab through links, controls, and form fields. Activate buttons with the keyboard. | Skip link reaches main content; focus remains visible, order is logical, and controls can be operated without a mouse. | Not run — record Pass or Fail after execution. |
| T16 | Empty and invalid contact submissions | On Contact, submit empty fields. Then enter `Test Visitor`, `invalid-email`, and a message; submit again. Also try a name or message containing only spaces. Correct each invalid field. | Submission is blocked; relevant errors appear, the first invalid field receives focus, errors clear when corrected, and no email draft is offered for invalid data. | Not run — record Pass or Fail after execution. |
| T17 | Valid email draft and stale draft removal | Enter `Test Visitor`, `visitor@example.com`, and `Hello Louis! Can we discuss C++ & Python?`. Prepare the email and inspect the draft link; optionally open it in a configured email app. Return and edit any field. | Draft targets `LV285@njit.edu` with the supplied details and punctuation preserved. Status says no message has been sent. Editing hides the stale draft link until another valid submission. The website sends nothing itself. | Not run — record Pass or Fail after execution. |
| T18 | Contact input length limits | Attempt to type/paste 101 name characters, 255 email characters, and 2,001 message characters. Inspect resulting values and prepare an email only with otherwise valid inputs. | Controls enforce maximum lengths of 100, 254, and 2,000 respectively; no oversized value is included in a draft. | Not run — record Pass or Fail after execution. |
| T19 | Theme switching and persistence | Toggle Light mode on each page. Reload, navigate to another page, then switch back to dark mode. Inspect text, controls, and keyboard focus in both themes. | Theme changes, remains selected across reload/navigation when storage is available, and content and focus indicators remain readable. Switch state matches the theme. | Not run — record Pass or Fail after execution. |
| T20 | Language switching and form preservation | Toggle English/Spanish on each page; reload and navigate. On Contact, enter form data, trigger an error or prepare a valid draft, then change language. | Translatable content and controls update; document language reflects the selection; preference persists when storage is available. Form values remain intact and current validation/draft status updates in the selected language. | Not run — record Pass or Fail after execution. |
| T21 | Screenshot gallery | On Projects, open a screenshot. Use next/previous buttons and Left/Right arrows, including at the first/last image. Close with Escape and the close button. On mobile, swipe horizontally. | Images, captions, and counts update together; navigation wraps; closing restores normal page scrolling and keyboard focus to the opener. Swipes change the image. | Not run — record Pass or Fail after execution. |
| T22 | JavaScript-disabled fallback | Disable JavaScript, reload all pages, follow navigation and project screenshot links, and inspect Contact. Re-enable JavaScript afterward. | Core content and navigation remain usable. Screenshots open as image links. Contact offers the direct email link and a JavaScript notice without presenting a working draft form. | Not run — record Pass or Fail after execution. |
| T23 | Balloon animation, pause, and reduced motion | With reduced motion off, open Home and Contact and observe the balloon. Use Pause HUD motion and Resume HUD motion. Enable the browser/OS reduced-motion preference, then revisit both pages at desktop and mobile widths. | Balloon sways while its character stays still; pause/resume works. Reduced motion disables sway. Artwork never covers form controls or creates horizontal scrolling. | Not run — record Pass or Fail after execution. |
| T24 | Browser console, images, and chapter links | With Developer Tools open, reload each page and exercise its controls. Inspect Console and Network, scroll through all content, and follow each chapter link and Skills-to-Projects link. | No uncaught script errors or failed local asset requests occur; images load; anchor links reach the correct visible content; scrolling does not hide readable content. | Not run — record Pass or Fail after execution. |

## Browser execution record

For each browser run, record:

- Date, tester, commit, browser/version, operating system, and viewport(s).
- Test IDs executed and their Pass/Fail results.
- For failures: observed behavior, reproduction details, and a screenshot or console message when useful.
- Retest date and outcome after a fix.
