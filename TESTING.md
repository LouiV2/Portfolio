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

## Required page-by-page coverage

The cases below make the required coverage explicit. They supplement T13-T24 and are not executed yet. Each row is an independent test: record **Pass** or **Fail** after completing all its steps. Do not copy source-check passes into browser results.

### Every navigation link on every page

Procedure N: At both 375 x 812 (phone) and 1366 x 768 (laptop) CSS pixels, start on the named page. Activate **each link occurrence** listed below, returning to the starting page after each navigation. Open the mobile menu and expand Skills details as needed. Include repeated links to the same destination; the brand, main navigation Home, and footer Contact are separate checks. Check the destination URL and visible page/section/image. For external links, verify the intended destination loads (record authentication/network blocks separately); for email links, inspect the recipient without sending. Prepare a valid Contact draft before testing its dynamically revealed link. A row passes only if every link occurrence passes at both sizes; record a failed link's label and destination.

Every page's shared links: Skip to content (`#main`), brand (`index.html`), all five main navigation links (`index.html`, `about.html`, `projects.html`, `skills.html`, `contact.html`), and footer Contact (`contact.html`).

| Test ID | What you are testing | Steps to run the test | Expected result | Actual result (Pass or Fail) |
| --- | --- | --- | --- | --- |
| T25 | Every Home navigation link | Run N on `index.html`: shared links; Follow the story and chapter Perspective (each `#perspective`); chapter People (`#people`); chapter Work (`#work`); Explore my background and Meet Louis (each `about.html`); toolkit (`skills.html`); Visit the projects page (`projects.html`); notebook image (`images/work-ahead-api-notebook.png`). | Every occurrence opens its intended page, section, or image at both sizes; no broken destination. | Not run — record Pass or Fail. |
| T26 | Every About navigation link | Run N on `about.html`: shared links; Follow my path and chapter Background (each `#background`); chapter Education and Explore the education behind it (each `#education`); chapter Public service and From education to public service (each `#service`); chapter Outside of work and its continuation link (each `#interests`); Explore my skills (`skills.html`). | Every occurrence opens its intended page or visible section at both sizes. | Not run — record Pass or Fail. |
| T27 | Every Projects navigation link | Run N on `projects.html`: shared links; all three chapter anchors (`#chapter-1`, `#chapter-2`, `#chapter-3`); all seven screenshot links (two Unity/C# images, three sorting images, two news images); Get in touch (`contact.html`). Test every screenshot normally and with Ctrl/Cmd-click for its direct image destination. | Every occurrence works at both sizes; screenshots open the matching gallery image normally and direct image with modified activation. | Not run — record Pass or Fail. |
| T28 | Every Skills navigation link | Run N on `skills.html`: shared links; anchors `#skill-chapter-1`, `#skill-chapter-2`, `#skill-chapter-3`; both Pexels credit links; Heroes for Mental Health full-image link; C++ to `projects.html#chapter-2`; C# and Unity separately to `projects.html#chapter-1`; Python to `projects.html#chapter-3`; Explore the projects (`projects.html`). | Every occurrence reaches its intended destination at both sizes, including links inside expanded details. | Not run — record Pass or Fail. |
| T29 | Every Contact navigation link | Run N on `contact.html`: shared links; LinkedIn profile; direct `mailto:LV285@njit.edu`; More about me (`about.html`); Return home (`index.html`); dynamically revealed Open draft in email app link after valid submission. | Every occurrence works at both sizes; email links address Louis and the draft includes the supplied form values. No email is sent by the website. | Not run — record Pass or Fail. |

### Every page on phone and laptop

Procedure R: Set the exact viewport in CSS pixels, reload the named page, and scroll from top to footer in both dark and light themes. Inspect headings, text, images, navigation, buttons, and all page-specific content. Open available menus, details, galleries, and the contact form. Check for horizontal scrolling, clipping, overlap, unreadable text, or controls outside the viewport. Save a screenshot and record the viewport with the result.

| Test ID | What you are testing | Steps to run the test | Expected result | Actual result (Pass or Fail) |
| --- | --- | --- | --- | --- |
| T30 | Home on a phone | Run R on `index.html` at 375 x 812; inspect hero, character, chapters, and footer. | Content stacks clearly; menu and all content fit without horizontal scrolling or overlap. | Not run — record Pass or Fail. |
| T31 | Home on a laptop | Run R on `index.html` at 1366 x 768; inspect hero, character, chapters, and footer. | Desktop navigation is visible and all content remains readable and aligned. | Not run — record Pass or Fail. |
| T32 | About on a phone | Run R on `about.html` at 375 x 812; inspect all four chapters and images. | Chapters and images fit; text and links remain readable without horizontal scrolling. | Not run — record Pass or Fail. |
| T33 | About on a laptop | Run R on `about.html` at 1366 x 768; inspect all four chapters and images. | Desktop layout fits and no text or imagery overlaps. | Not run — record Pass or Fail. |
| T34 | Projects on a phone | Run R on `projects.html` at 375 x 812; open screenshots for all three projects. | Project panels stack; gallery image and controls fit the phone viewport. | Not run — record Pass or Fail. |
| T35 | Projects on a laptop | Run R on `projects.html` at 1366 x 768; open screenshots for all three projects. | Project panels and gallery remain readable with accessible controls. | Not run — record Pass or Fail. |
| T36 | Skills on a phone | Run R on `skills.html` at 375 x 812; expand every details item. | Expanded skills, images, and links fit without clipping or horizontal scrolling. | Not run — record Pass or Fail. |
| T37 | Skills on a laptop | Run R on `skills.html` at 1366 x 768; expand every details item. | Skill sections stay aligned and expanded content remains readable. | Not run — record Pass or Fail. |
| T38 | Contact on a phone | Run R on `contact.html` at 375 x 812; trigger errors, then prepare a valid draft. | Fields, errors, and draft link fit; character stacks below the form without covering controls. | Not run — record Pass or Fail. |
| T39 | Contact on a laptop | Run R on `contact.html` at 1366 x 768; trigger errors, then prepare a valid draft. | Character appears beside the form; fields, errors, and draft link remain unobstructed. | Not run — record Pass or Fail. |

### Tab and Enter on every page

Procedure K: Repeat at phone and laptop sizes with the mouse unused. Reload, press Tab to focus Skip to content, and press Enter. Use Tab and Shift+Tab through every reachable control and link, pressing Enter to activate each; return as needed. Operate language, theme, and motion buttons. At phone size, open Menu with Enter, navigate its links, then test Escape. Verify visible focus, logical order, meaningful labels, no focus trap outside an open modal, and no hidden content receiving focus. Use Space as an additional button check; Enter is required for this procedure.

| Test ID | What you are testing | Steps to run the test | Expected result | Actual result (Pass or Fail) |
| --- | --- | --- | --- | --- |
| T40 | Home keyboard navigation | Run K on `index.html`, including every chapter link and notebook image link. | Tab reaches all controls; Enter follows links/activates buttons; chapter targets remain visible. | Not run — record Pass or Fail. |
| T41 | About keyboard navigation | Run K on `about.html`, including all chapter and continuation links. | All links and controls work with Tab/Enter; focus stays visible through revealed content. | Not run — record Pass or Fail. |
| T42 | Projects keyboard navigation | Run K on `projects.html`; open each screenshot with Enter. Inside the modal, Tab/Shift+Tab through controls, use Enter for previous/next/close, and also test arrows and Escape. | Modal keeps focus inside while open, every control works, and closing returns focus to its opener. | Not run — record Pass or Fail. |
| T43 | Skills keyboard navigation | Run K on `skills.html`; Tab to every summary, press Enter to expand/collapse, and activate its nested links. | Details work with Enter; expanded links become reachable; collapsed content does not receive focus. | Not run — record Pass or Fail. |
| T44 | Contact keyboard navigation | Run K on `contact.html`; Tab through all fields, submit empty values with Enter on Prepare email, correct them, submit valid values, then Tab to and activate the draft link with Enter without sending. | Invalid submission focuses the first invalid field; valid submission exposes a reachable draft link; labels, errors, and focus are clear. | Not run — record Pass or Fail. |

### Lighthouse Accessibility on every page

Procedure L: Serve the site over localhost and open the named page in Chrome. In Developer Tools > Lighthouse, select Accessibility and Navigation mode. Run once with Mobile and once with Desktop device settings, using English/dark mode and a fresh page load for each audit. Record each numeric Accessibility score out of 100, Chrome/Lighthouse versions, date, commit, audit device mode, and saved HTML report path. Proposed acceptance target: **at least 90/100 in both modes**. Mark Fail if either score is below 90; record failed audits and retest after fixes. A tool error is unexecuted, not a zero score. Lighthouse results supplement the manual keyboard and layout checks; they do not establish complete accessibility.

| Test ID | What you are testing | Steps to run the test | Expected result | Actual result (Pass or Fail) |
| --- | --- | --- | --- | --- |
| T45 | Home Lighthouse Accessibility | Run L on `index.html`; save reports and enter Mobile __/100 and Desktop __/100. | Accessibility score is at least 90/100 in both modes. | Not run — record Pass or Fail and both scores. |
| T46 | About Lighthouse Accessibility | Run L on `about.html`; save reports and enter Mobile __/100 and Desktop __/100. | Accessibility score is at least 90/100 in both modes. | Not run — record Pass or Fail and both scores. |
| T47 | Projects Lighthouse Accessibility | Run L on `projects.html`; save reports and enter Mobile __/100 and Desktop __/100. | Accessibility score is at least 90/100 in both modes. | Not run — record Pass or Fail and both scores. |
| T48 | Skills Lighthouse Accessibility | Run L on `skills.html`; save reports and enter Mobile __/100 and Desktop __/100. | Accessibility score is at least 90/100 in both modes. | Not run — record Pass or Fail and both scores. |
| T49 | Contact Lighthouse Accessibility | Run L on `contact.html`; save reports and enter Mobile __/100 and Desktop __/100. | Accessibility score is at least 90/100 in both modes. | Not run — record Pass or Fail and both scores. |

### JavaScript feature coverage

Run the referenced tests on every page listed, not just the first page. Keep the Console open and record any uncaught exception as a failure.

| Script | Features to exercise | Test cases |
| --- | --- | --- |
| `js/navigation.js` | Mobile toggle, expanded state, closing on selection/Escape, breakpoint changes and focus transfer | T14, T25-T29, T40-T44 |
| `js/theme.js` | Dark/light switching, switch state, reload/navigation persistence, storage-unavailable fallback | T19, T30-T39, T53 |
| `js/language.js` | English/Spanish text, title/description and accessible text, document language, switch state, saved preference, storage fallback, language-change events | T20, T53-T54 |
| `js/hud-motion.js` | Pause/resume state and labels, reduced-motion preference changes, language-change labels | T23, T50, T54 |
| `js/projects-story.js` | Scroll reveals, active chapter, reading progress, resize updates, focus reveal, pause/reduced motion, missing-observer fallback on Home/About/Projects/Skills | T24, T40-T43, T50-T51 |
| `js/project-gallery.js` | Every opener, next/previous wrapping, keyboard controls, close/scroll restoration, swipe handling, modified clicks, translated captions, no-dialog fallback | T21, T27, T42, T52, T54 |
| `js/contact.js` | Empty/whitespace/malformed input, error correction/focus, length limits, valid encoded draft, stale draft reset, translated errors and drafts | T16-T18, T38-T39, T44, T54-T55 |

| Test ID | What you are testing | Steps to run the test | Expected result | Actual result (Pass or Fail) |
| --- | --- | --- | --- | --- |
| T50 | Story scrolling and motion controls | On Home, About, Projects, and Skills, scroll every chapter into view, resize, follow chapter links, and Tab into reveal content. Inspect active chapter and reading progress. Pause/resume using the footer. Toggle reduced motion while the page remains open. Repeat motion controls on Contact. | Reveals and chapter/progress indicators track content, focus reveals its target, pause stops motion, and preference changes immediately suppress motion without hiding content. Pause state and button labels agree. | Not run — record Pass or Fail. |
| T51 | Story fallback without IntersectionObserver | Using a browser init-script/debugger override before page scripts execute, make `window.IntersectionObserver` unavailable. Reload Home, About, Projects, and Skills and follow chapter links and Tab through content. Remove the override afterward. | Core content and links remain visible/usable and no uncaught error occurs when story enhancement exits early. | Not run — record Pass or Fail. |
| T52 | Gallery touch and unsupported-dialog fallback | On Projects, try a clear horizontal swipe, a vertical swipe, a short swipe, and a multitouch/cancelled gesture. Then reload with `HTMLDialogElement.prototype.showModal` unavailable through a pre-script override and activate each screenshot link. Restore the browser afterward. | Only a qualifying horizontal swipe changes the image; other gestures do not accidentally advance. Without dialog support, screenshot links open the original image and no uncaught error occurs. | Not run — record Pass or Fail. |
| T53 | Theme/language storage fallback | In a temporary browser profile, block site storage or override localStorage access to throw before scripts execute. On all five pages, reload and operate theme/language controls; inspect Console. Restore storage afterward. | Pages load and controls still work for the current page without uncaught storage errors. Persistence across reload is not required while storage is blocked. | Not run — record Pass or Fail. |
| T54 | Language-change event integration | On every page, change language after selecting light mode and pausing motion; inspect control labels and states, title, description, and meaningful image/link accessible text. On Projects change language with gallery open. On Contact change language once with validation errors visible and again with a valid prepared draft. | UI labels reflect the selected language while theme/pause states and form values remain intact; gallery caption and current errors/status/draft update without stale language or duplicate submission. | Not run — record Pass or Fail. |
| T55 | Programmatic oversized-input validation | On Contact, use DevTools to set name to 101 characters, email to a syntactically valid address longer than 254 characters, and message to 2,001 characters, one field at a time while others are valid. Submit each time. Reset to valid values and prepare a draft. | JavaScript rejects each oversized value with the appropriate error and no draft link; corrected valid values produce a draft. This tests the validation branch beyond native typing limits in T18. | Not run — record Pass or Fail. |

## Browser execution record

For each browser run, record:

- Date, tester, commit, browser/version, operating system, and viewport(s).
- Test IDs executed and their Pass/Fail results.
- For failures: observed behavior, reproduction details, and a screenshot or console message when useful.
- Retest date and outcome after a fix.
