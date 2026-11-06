# Portfolio Test Plan

This plan covers Home, About Me, Projects, Skills, and Contact.

## Recorded results — November 5, 2026

**52 Pass, 0 Fail, 3 Blocked.** All 55 cases were addressed: T1-T12 by source checks and T13-T55 by browser assertions or aggregate results. Blocked cases T13, T28, and T29 include external sites that rejected automated requests; their local-link portions passed. There are no confirmed site defects from this run. Test-runner indexing, event timing, and popup-event issues were corrected and the affected cases rerun before recording these results.

- Tested revision: `135e241` (site files unchanged during testing).
- Environment: Windows, headless Chrome 156.0.8078.81, Playwright Core 1.65.0, Lighthouse 12.8.2, Node 22.14.0; local HTTP server.
- Phone: 375 x 812 CSS pixels; laptop: 1366 x 768. Layout screenshots captured in dark and light themes. Lighthouse ran its Mobile preset and the configured Desktop mode separately.
- Every page scored **100/100 Accessibility in both Lighthouse modes** (10 audits). This is not a claim of complete accessibility or a manual assistive-technology audit.
- Evidence: [machine-readable results](tests/results/browser-results.json), [ten archived Lighthouse HTML reports](tests/results/lighthouse-reports.zip), and [runner instructions](tests/README.md). Screenshots remain in `%TEMP%/portfolio-browser-testing/reports` on the test machine.
- Limits: phone sizes are emulated; touch events are synthetic; representative screenshots were visually reviewed, not every possible UI state. Mailto recipient/body were inspected without launching an email app or sending messages. Fresh Chrome navigation also reproduced the Pexels challenge pages (HTTP 403) and LinkedIn block (HTTP 999). These require a normal-browser recheck; neither is established as a broken portfolio URL.

## Running and recording tests

- Use the current repository checkout. Open the site through a local static server or the IDE's preview server for browser tests.
- Test in a current desktop browser and a mobile browser or responsive device emulator. Record the browser/version, viewport, operating system, date, and commit when recording browser results.
- Start browser tests in English and dark mode unless the test says otherwise. Enable JavaScript except for T22.
- Enter **Pass** only when every expected result is observed; otherwise enter **Fail** and describe the discrepancy. Retest failures after fixes.
- Use fictional form values, such as `Test Visitor` and `visitor@example.com`. Review email drafts without sending them.

## Completed source checks

Executed November 5, 2026 against site revision `135e241` using PowerShell file, regular-expression, and local-path checks. These results verify the source only; they do not establish browser rendering, keyboard behavior, or JavaScript execution.

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

Executed in headless Chrome using real browser navigation, DOM assertions, and keyboard events. Results below describe the automated scope. External anti-bot responses are marked **Blocked**, not Pass or Fail; those destinations need a normal-browser recheck.

| Test ID | What you are testing | Steps to run the test | Expected result | Actual result (Pass or Fail) |
| --- | --- | --- | --- | --- |
| T13 | Navigation and page loading | From Home, follow each main navigation link. Repeat from the other pages; use the brand link and footer Contact link. | Correct pages open, the current-page indicator follows navigation, and no page is missing. | Blocked — local navigation passed; Pexels returned HTTP 403 and LinkedIn HTTP 999. See T25-T29. |
| T14 | Mobile menu and responsive layout | At 375, 768, and 1280 CSS pixels wide, inspect all pages. At widths up to 850px, open Menu, press Escape, reopen it, and choose a page. Resize across 850px with keyboard focus in the navigation. | Content fits without horizontal scrolling or overlapping controls. Mobile menu opens/closes, Escape returns focus to Menu, links navigate, and desktop navigation becomes visible on resize. | Pass — mobile open/close, Escape focus return, and desktop/mobile breakpoint focus checks passed. |
| T15 | Keyboard access and skip link | On every page, reload and press Tab to reveal Skip to content; activate it. Continue with Tab/Shift+Tab through links, controls, and form fields. Activate buttons with the keyboard. | Skip link reaches main content; focus remains visible, order is logical, and controls can be operated without a mouse. | Pass — Tab traversal and Enter activation checked on all five pages at both sizes; see T40-T44. |
| T16 | Empty and invalid contact submissions | On Contact, submit empty fields. Then enter `Test Visitor`, `invalid-email`, and a message; submit again. Also try a name or message containing only spaces. Correct each invalid field. | Submission is blocked; relevant errors appear, the first invalid field receives focus, errors clear when corrected, and no email draft is offered for invalid data. | Pass — empty, malformed-email, and whitespace-only inputs rejected; corrected inputs cleared errors. |
| T17 | Valid email draft and stale draft removal | Enter `Test Visitor`, `visitor@example.com`, and `Hello Louis! Can we discuss C++ & Python?`. Prepare the email and inspect the draft link; optionally open it in a configured email app. Return and edit any field. | Draft targets `LV285@njit.edu` with the supplied details and punctuation preserved. Status says no message has been sent. Editing hides the stale draft link until another valid submission. The website sends nothing itself. | Pass — recipient, encoded punctuation, and stale draft reset verified; OS email app not launched. |
| T18 | Contact input length limits | Attempt to type/paste 101 name characters, 255 email characters, and 2,001 message characters. Inspect resulting values and prepare an email only with otherwise valid inputs. | Controls enforce maximum lengths of 100, 254, and 2,000 respectively; no oversized value is included in a draft. | Pass — typed/pasted values limited to 100, 254, and 2,000 characters. |
| T19 | Theme switching and persistence | Toggle Light mode on each page. Reload, navigate to another page, then switch back to dark mode. Inspect text, controls, and keyboard focus in both themes. | Theme changes, remains selected across reload/navigation when storage is available, and content and focus indicators remain readable. Switch state matches the theme. | Pass — light theme selection and reload/cross-page persistence verified on all pages; both themes rendered. |
| T20 | Language switching and form preservation | Toggle English/Spanish on each page; reload and navigate. On Contact, enter form data, trigger an error or prepare a valid draft, then change language. | Translatable content and controls update; document language reflects the selection; preference persists when storage is available. Form values remain intact and current validation/draft status updates in the selected language. | Pass — English/Spanish switching and saved preference verified on all pages; form values preserved. |
| T21 | Screenshot gallery | On Projects, open a screenshot. Use next/previous buttons and Left/Right arrows, including at the first/last image. Close with Escape and the close button. On mobile, swipe horizontally. | Images, captions, and counts update together; navigation wraps; closing restores normal page scrolling and keyboard focus to the opener. Swipes change the image. | Pass — all seven openers, counts, previous/next wrapping, arrows, closing, and scroll-lock removal verified; synthetic swipes tested in T52. |
| T22 | JavaScript-disabled fallback | Disable JavaScript, reload all pages, follow navigation and project screenshot links, and inspect Contact. Re-enable JavaScript afterward. | Core content and navigation remain usable. Screenshots open as image links. Contact offers the direct email link and a JavaScript notice without presenting a working draft form. | Pass — all pages retained navigation without JavaScript; screenshot links and Contact fallback worked. |
| T23 | Balloon animation, pause, and reduced motion | With reduced motion off, open Home and Contact and observe the balloon. Use Pause HUD motion and Resume HUD motion. Enable the browser/OS reduced-motion preference, then revisit both pages at desktop and mobile widths. | Balloon sways while its character stays still; pause/resume works. Reduced motion disables sway. Artwork never covers form controls or creates horizontal scrolling. | Pass — sway, pause/resume, and reduced-motion styles verified on Home and Contact. |
| T24 | Browser console, images, and chapter links | With Developer Tools open, reload each page and exercise its controls. Inspect Console and Network, scroll through all content, and follow each chapter link and Skills-to-Projects link. | No uncaught script errors or failed local asset requests occur; images load; anchor links reach the correct visible content; scrolling does not hide readable content. | Pass — no uncaught errors or failed local asset responses in the page/control smoke run; link targets tested in T25-T29. |

## Required page-by-page coverage

The cases below make the required coverage explicit and supplement T13-T24. Browser assertions were executed at the stated sizes; screenshots were captured for both themes, with representative phone/laptop screenshots reviewed for each page. Source checks and browser checks are reported separately.

### Every navigation link on every page

Procedure N: At both 375 x 812 (phone) and 1366 x 768 (laptop) CSS pixels, start on the named page. Activate **each link occurrence** listed below, returning to the starting page after each navigation. Open the mobile menu and expand Skills details as needed. Include repeated links to the same destination; the brand, main navigation Home, and footer Contact are separate checks. Check the destination URL and visible page/section/image. For external links, verify the intended destination loads (record authentication/network blocks separately); for email links, inspect the recipient without sending. Prepare a valid Contact draft before testing its dynamically revealed link. A row passes only if every link occurrence passes at both sizes; record a failed link's label and destination.

Every page's shared links: Skip to content (`#main`), brand (`index.html`), all five main navigation links (`index.html`, `about.html`, `projects.html`, `skills.html`, `contact.html`), and footer Contact (`contact.html`).

| Test ID | What you are testing | Steps to run the test | Expected result | Actual result (Pass or Fail) |
| --- | --- | --- | --- | --- |
| T25 | Every Home navigation link | Run N on `index.html`: shared links; Follow the story and chapter Perspective (each `#perspective`); chapter People (`#people`); chapter Work (`#work`); Explore my background and Meet Louis (each `about.html`); toolkit (`skills.html`); Visit the projects page (`projects.html`); notebook image (`images/work-ahead-api-notebook.png`). | Every occurrence opens its intended page, section, or image at both sizes; no broken destination. | Pass — every local link occurrence activated with Enter at phone and laptop sizes. |
| T26 | Every About navigation link | Run N on `about.html`: shared links; Follow my path and chapter Background (each `#background`); chapter Education and Explore the education behind it (each `#education`); chapter Public service and From education to public service (each `#service`); chapter Outside of work and its continuation link (each `#interests`); Explore my skills (`skills.html`). | Every occurrence opens its intended page or visible section at both sizes. | Pass — every local link occurrence activated with Enter at phone and laptop sizes. |
| T27 | Every Projects navigation link | Run N on `projects.html`: shared links; all three chapter anchors (`#chapter-1`, `#chapter-2`, `#chapter-3`); all seven screenshot links (two Unity/C# images, three sorting images, two news images); Get in touch (`contact.html`). Test every screenshot normally and with Ctrl/Cmd-click for its direct image destination. | Every occurrence works at both sizes; screenshots open the matching gallery image normally and direct image with modified activation. | Pass — all local links, all seven gallery openers, and Ctrl-click direct-image destinations verified at both sizes. |
| T28 | Every Skills navigation link | Run N on `skills.html`: shared links; anchors `#skill-chapter-1`, `#skill-chapter-2`, `#skill-chapter-3`; both Pexels credit links; Heroes for Mental Health full-image link; C++ to `projects.html#chapter-2`; C# and Unity separately to `projects.html#chapter-1`; Python to `projects.html#chapter-3`; Explore the projects (`projects.html`). | Every occurrence reaches its intended destination at both sizes, including links inside expanded details. | Blocked — all local links passed at both sizes; both Pexels credit destinations returned HTTP 403. |
| T29 | Every Contact navigation link | Run N on `contact.html`: shared links; LinkedIn profile; direct `mailto:LV285@njit.edu`; More about me (`about.html`); Return home (`index.html`); dynamically revealed Open draft in email app link after valid submission. | Every occurrence works at both sizes; email links address Louis and the draft includes the supplied form values. No email is sent by the website. | Blocked — local links and email URI/draft checks passed at both sizes; LinkedIn returned HTTP 999. OS email app not launched. |

### Every page on phone and laptop

Procedure R: Set the exact viewport in CSS pixels, reload the named page, and scroll from top to footer in both dark and light themes. Inspect headings, text, images, navigation, buttons, and all page-specific content. Open available menus, details, galleries, and the contact form. Check for horizontal scrolling, clipping, overlap, unreadable text, or controls outside the viewport. Save a screenshot and record the viewport with the result.

| Test ID | What you are testing | Steps to run the test | Expected result | Actual result (Pass or Fail) |
| --- | --- | --- | --- | --- |
| T30 | Home on a phone | Run R on `index.html` at 375 x 812; inspect hero, character, chapters, and footer. | Content stacks clearly; menu and all content fit without horizontal scrolling or overlap. | Pass — 375 x 812; both themes captured, no horizontal overflow or broken assigned images; interactive content opened. |
| T31 | Home on a laptop | Run R on `index.html` at 1366 x 768; inspect hero, character, chapters, and footer. | Desktop navigation is visible and all content remains readable and aligned. | Pass — 1366 x 768; both themes captured, no horizontal overflow or broken assigned images; interactive content opened. |
| T32 | About on a phone | Run R on `about.html` at 375 x 812; inspect all four chapters and images. | Chapters and images fit; text and links remain readable without horizontal scrolling. | Pass — 375 x 812; both themes captured, no horizontal overflow or broken assigned images; interactive content opened. |
| T33 | About on a laptop | Run R on `about.html` at 1366 x 768; inspect all four chapters and images. | Desktop layout fits and no text or imagery overlaps. | Pass — 1366 x 768; both themes captured, no horizontal overflow or broken assigned images; interactive content opened. |
| T34 | Projects on a phone | Run R on `projects.html` at 375 x 812; open screenshots for all three projects. | Project panels stack; gallery image and controls fit the phone viewport. | Pass — 375 x 812; both themes captured, no horizontal overflow or broken assigned images; interactive content opened. |
| T35 | Projects on a laptop | Run R on `projects.html` at 1366 x 768; open screenshots for all three projects. | Project panels and gallery remain readable with accessible controls. | Pass — 1366 x 768; both themes captured, no horizontal overflow or broken assigned images; interactive content opened. |
| T36 | Skills on a phone | Run R on `skills.html` at 375 x 812; expand every details item. | Expanded skills, images, and links fit without clipping or horizontal scrolling. | Pass — 375 x 812; both themes captured, no horizontal overflow or broken assigned images; interactive content opened. |
| T37 | Skills on a laptop | Run R on `skills.html` at 1366 x 768; expand every details item. | Skill sections stay aligned and expanded content remains readable. | Pass — 1366 x 768; both themes captured, no horizontal overflow or broken assigned images; interactive content opened. |
| T38 | Contact on a phone | Run R on `contact.html` at 375 x 812; trigger errors, then prepare a valid draft. | Fields, errors, and draft link fit; character stacks below the form without covering controls. | Pass — 375 x 812; both themes captured, no horizontal overflow or broken assigned images; interactive content opened. |
| T39 | Contact on a laptop | Run R on `contact.html` at 1366 x 768; trigger errors, then prepare a valid draft. | Character appears beside the form; fields, errors, and draft link remain unobstructed. | Pass — 1366 x 768; both themes captured, no horizontal overflow or broken assigned images; interactive content opened. |

### Tab and Enter on every page

Procedure K: Repeat at phone and laptop sizes with the mouse unused. Reload, press Tab to focus Skip to content, and press Enter. Use Tab and Shift+Tab through every reachable control and link, pressing Enter to activate each; return as needed. Operate language, theme, and motion buttons. At phone size, open Menu with Enter, navigate its links, then test Escape. Verify visible focus, logical order, meaningful labels, no focus trap outside an open modal, and no hidden content receiving focus. Use Space as an additional button check; Enter is required for this procedure.

| Test ID | What you are testing | Steps to run the test | Expected result | Actual result (Pass or Fail) |
| --- | --- | --- | --- | --- |
| T40 | Home keyboard navigation | Run K on `index.html`, including every chapter link and notebook image link. | Tab reaches all controls; Enter follows links/activates buttons; chapter targets remain visible. | Pass — Tab traversal, visible-focus state, Enter controls/details, and page-specific keyboard assertions passed at both sizes. Link Enter checks also covered in T25-T29. |
| T41 | About keyboard navigation | Run K on `about.html`, including all chapter and continuation links. | All links and controls work with Tab/Enter; focus stays visible through revealed content. | Pass — Tab traversal, visible-focus state, Enter controls/details, and page-specific keyboard assertions passed at both sizes. Link Enter checks also covered in T25-T29. |
| T42 | Projects keyboard navigation | Run K on `projects.html`; open each screenshot with Enter. Inside the modal, Tab/Shift+Tab through controls, use Enter for previous/next/close, and also test arrows and Escape. | Modal keeps focus inside while open, every control works, and closing returns focus to its opener. | Pass — Tab traversal, visible-focus state, Enter controls/details, and page-specific keyboard assertions passed at both sizes. Link Enter checks also covered in T25-T29. |
| T43 | Skills keyboard navigation | Run K on `skills.html`; Tab to every summary, press Enter to expand/collapse, and activate its nested links. | Details work with Enter; expanded links become reachable; collapsed content does not receive focus. | Pass — Tab traversal, visible-focus state, Enter controls/details, and page-specific keyboard assertions passed at both sizes. Link Enter checks also covered in T25-T29. |
| T44 | Contact keyboard navigation | Run K on `contact.html`; Tab through all fields, submit empty values with Enter on Prepare email, correct them, submit valid values, then Tab to and activate the draft link with Enter without sending. | Invalid submission focuses the first invalid field; valid submission exposes a reachable draft link; labels, errors, and focus are clear. | Pass — Tab traversal, visible-focus state, Enter controls/details, and page-specific keyboard assertions passed at both sizes. Link Enter checks also covered in T25-T29. |

### Lighthouse Accessibility on every page

Procedure L: Serve the site over localhost and open the named page in Chrome. In Developer Tools > Lighthouse, select Accessibility and Navigation mode. Run once with Mobile and once with Desktop device settings, using English/dark mode and a fresh page load for each audit. Record each numeric Accessibility score out of 100, Chrome/Lighthouse versions, date, commit, audit device mode, and saved HTML report path. Proposed acceptance target: **at least 90/100 in both modes**. Mark Fail if either score is below 90; record failed audits and retest after fixes. A tool error is unexecuted, not a zero score. Lighthouse results supplement the manual keyboard and layout checks; they do not establish complete accessibility.

| Test ID | What you are testing | Steps to run the test | Expected result | Actual result (Pass or Fail) |
| --- | --- | --- | --- | --- |
| T45 | Home Lighthouse Accessibility | Run L on `index.html`; save reports and enter Mobile __/100 and Desktop __/100. | Accessibility score is at least 90/100 in both modes. | Pass — Mobile 100/100; Desktop 100/100. Full reports saved in tests/results/lighthouse-reports.zip. |
| T46 | About Lighthouse Accessibility | Run L on `about.html`; save reports and enter Mobile __/100 and Desktop __/100. | Accessibility score is at least 90/100 in both modes. | Pass — Mobile 100/100; Desktop 100/100. Full reports saved in tests/results/lighthouse-reports.zip. |
| T47 | Projects Lighthouse Accessibility | Run L on `projects.html`; save reports and enter Mobile __/100 and Desktop __/100. | Accessibility score is at least 90/100 in both modes. | Pass — Mobile 100/100; Desktop 100/100. Full reports saved in tests/results/lighthouse-reports.zip. |
| T48 | Skills Lighthouse Accessibility | Run L on `skills.html`; save reports and enter Mobile __/100 and Desktop __/100. | Accessibility score is at least 90/100 in both modes. | Pass — Mobile 100/100; Desktop 100/100. Full reports saved in tests/results/lighthouse-reports.zip. |
| T49 | Contact Lighthouse Accessibility | Run L on `contact.html`; save reports and enter Mobile __/100 and Desktop __/100. | Accessibility score is at least 90/100 in both modes. | Pass — Mobile 100/100; Desktop 100/100. Full reports saved in tests/results/lighthouse-reports.zip. |

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
| T50 | Story scrolling and motion controls | On Home, About, Projects, and Skills, scroll every chapter into view, resize, follow chapter links, and Tab into reveal content. Inspect active chapter and reading progress. Pause/resume using the footer. Toggle reduced motion while the page remains open. Repeat motion controls on Contact. | Reveals and chapter/progress indicators track content, focus reveals its target, pause stops motion, and preference changes immediately suppress motion without hiding content. Pause state and button labels agree. | Pass — chapter selection/progress, scroll updates, pause/resume, and live reduced-motion changes verified on all four story pages. |
| T51 | Story fallback without IntersectionObserver | Using a browser init-script/debugger override before page scripts execute, make `window.IntersectionObserver` unavailable. Reload Home, About, Projects, and Skills and follow chapter links and Tab through content. Remove the override afterward. | Core content and links remain visible/usable and no uncaught error occurs when story enhancement exits early. | Pass — all four story pages remained visible with enhancements disabled when IntersectionObserver was unavailable. |
| T52 | Gallery touch and unsupported-dialog fallback | On Projects, try a clear horizontal swipe, a vertical swipe, a short swipe, and a multitouch/cancelled gesture. Then reload with `HTMLDialogElement.prototype.showModal` unavailable through a pre-script override and activate each screenshot link. Restore the browser afterward. | Only a qualifying horizontal swipe changes the image; other gestures do not accidentally advance. Without dialog support, screenshot links open the original image and no uncaught error occurs. | Pass — synthetic horizontal/ignored gestures and all seven unsupported-dialog fallback links passed; physical touch not tested. |
| T53 | Theme/language storage fallback | In a temporary browser profile, block site storage or override localStorage access to throw before scripts execute. On all five pages, reload and operate theme/language controls; inspect Console. Restore storage afterward. | Pages load and controls still work for the current page without uncaught storage errors. Persistence across reload is not required while storage is blocked. | Pass — all pages loaded and theme/language controls worked with localStorage access throwing; no uncaught errors. |
| T54 | Language-change event integration | On every page, change language after selecting light mode and pausing motion; inspect control labels and states, title, description, and meaningful image/link accessible text. On Projects change language with gallery open. On Contact change language once with validation errors visible and again with a valid prepared draft. | UI labels reflect the selected language while theme/pause states and form values remain intact; gallery caption and current errors/status/draft update without stale language or duplicate submission. | Pass — theme/pause state preserved; motion labels, visible errors, prepared drafts, and open gallery captions updated after language changes. |
| T55 | Programmatic oversized-input validation | On Contact, use DevTools to set name to 101 characters, email to a syntactically valid address longer than 254 characters, and message to 2,001 characters, one field at a time while others are valid. Submit each time. Reset to valid values and prepare a draft. | JavaScript rejects each oversized value with the appropriate error and no draft link; corrected valid values produce a draft. This tests the validation branch beyond native typing limits in T18. | Pass — programmatically oversized name, email, and message rejected; corrected valid data produced a draft. |

## Browser execution record

For each browser run, record:

- Date, tester, commit, browser/version, operating system, and viewport(s).
- Test IDs executed and their Pass/Fail results.
- For failures: observed behavior, reproduction details, and a screenshot or console message when useful.
- Retest date and outcome after a fix.

## Image and font optimization follow-up — November 5, 2026

This follow-up covers only optimized image assets, lower-page image loading, and font delivery. Original full-size images and project image links remain available. No animation CSS or JavaScript was changed. The historical 55-case results above refer to their original revision; the following checks cover the optimized working tree based on `5a02a10`.

- **Pass:** T21, T23, T24, T27, and T30-T39 rerun: gallery controls and original-image links, balloon behavior, local asset smoke checks, and all five pages at phone/laptop sizes in both themes.
- **Pass:** all 12 source checks rerun; local paths resolve. The new responsive profile candidates loaded successfully during browser layout checks.
- **Pass:** all five pages loaded Rajdhani from WOFF2, requested no TTF, and passed the font-loading/decoding check. The font check's local server returns an empty response to Chrome's optional favicon request; this does not assert that the deployed site has a favicon.
- Home Lighthouse comparison using the same local server setup, Lighthouse 12.8.2, a fresh Chrome profile per audit, and one run per device mode:

| Mode | Before Performance | After Performance | After Accessibility |
| --- | --- | --- | --- |
| Mobile | 54 | 94 | 100 |
| Desktop | 57 | 78 | 100 |

Home transferred about 4.36 MB before optimization versus 0.46 MB mobile / 0.52 MB desktop afterward. Mobile Largest Contentful Paint fell from about 23.3 s to 3.0 s; measured layout shift fell to zero in both modes. These are local lab measurements; they are not directly comparable to the owner's earlier score of 83, and scores vary across devices, throttling settings, hosting, and runs.

Evidence: [performance comparison](tests/results/performance-comparison.json), [four archived performance reports](tests/results/performance-reports.zip), [14 regression case results](tests/results/optimization-regression.json), and [font-loading checks](tests/results/optimized-font-checks.json). The WebP derivatives were generated with Sharp (quality 85-90 for photos/art, lossless compression for the resized Unity preview); WOFF2 was generated from the existing licensed TTF with wawoff2. Original assets and the font license are retained. These conversion tools are temporary development tools, not site dependencies.

## Critical-request loading follow-up — November 5, 2026

Limited to shared CSS cleanup and initial theme loading, based on revision `6fcd64c`. Removed selectors for unused earlier layouts and 60 declarations superseded by later rules. The readable shared stylesheet fell from 55,452 to 47,902 bytes (about 14%). Every page now selects its saved/default palette in a small inline head script, while `js/theme.js` is deferred and handles the controls. Asset URLs were versioned for the changed stylesheet and script. Animation keyframes and behavior were preserved.

- **Pass:** 60 computed-style comparisons (five pages, both themes, widths 375/580/768/850/1050/1366). Sampled layout, typography, colors, borders, and pseudo-elements matched the previous stylesheet after fonts/layout settled. Details were expanded; reduced motion froze animation for comparison. Keyframe definitions were identical. This is a sampled style-equivalence check, not an exhaustive visual-state audit.
- **Pass:** 25 initial-theme checks (all five pages with saved light, saved dark, invalid preference, no preference, or blocked storage). The expected theme was already applied when CSS was requested while the external control script was delayed 300 ms; the switch state agreed afterward. No script errors were recorded.
- **Pass:** T14, T19-T24, T40-T44, T53, and T54 rerun for navigation, keyboard controls, persistence, gallery behavior, reduced motion, no-JavaScript behavior, and storage/language integration. The keyboard runner now waits for focused lazy media to finish layout before measuring its bounds.
- **Pass:** T1-T12 source checks rerun; JavaScript syntax and diff checks passed.
- **Pass:** Lighthouse's render-blocking list no longer includes `js/theme.js`; it lists only the smaller stylesheet. The stylesheet remains render-blocking so initial content retains its correct layout.

| Local Home audit | Before Performance | After Performance | After Accessibility |
| --- | --- | --- | --- |
| Mobile | 94 | 95 | 100 |
| Desktop | 80 | 80 | 100 |

One fresh-profile Lighthouse 12.8.2 run per device mode before and after; scores are environment-dependent. These changes shorten loading dependencies without promising a particular score increase. Hosting compression and cache headers were not changed.

Evidence: [computed-style comparisons](tests/results/css-equivalence.json), [initial-theme checks](tests/results/theme-first-paint.json), [regression results](tests/results/critical-loading-regression.json), [performance and blocking-request comparison](tests/results/critical-request-comparison.json), and [four full Lighthouse reports](tests/results/critical-loading-reports.zip). Earlier test results above remain historical for their stated revisions.

## Stable header loading follow-up — November 5, 2026

The header now reserves space for language/theme controls before their scripts initialize. An early JavaScript marker lets CSS begin with mobile navigation closed; a navigation-ready marker ends that startup rule so subsequent resizing preserves keyboard focus. With JavaScript disabled, links remain visible and unavailable controls stay hidden. If the navigation script fails to load, its error handler restores the visible-link fallback. Shared styles and navigation script URLs were versioned. Font and animation behavior are unchanged.

The original issue was reproduced by delaying scripts 1,000 ms: the expanded navigation collapsed and controls appeared after the first paint, moving `main.home-page.story-motion`. That affected element was not proof that the story animation caused the shift.

| Home width (CSS pixels) | Delayed-script shift before | Delayed-script shift after | Delayed-font shift after |
| --- | --- | --- | --- |
| 375 | 0.225 | 0 | 0.010 |
| 768 | 0.231 | 0 | 0.017 |
| 1366 | 0.0047 | 0 | 0.0057 |

These are sums of non-input layout-shift entries observed during targeted local loads at 812px height, with fresh browser contexts. The font stress test delayed WOFF2 by 1,800 ms; small font-related shifts remain below 0.02. Normal-load observations were zero at all three widths. These measurements reproduce the reported mechanism but do not guarantee zero CLS under all devices, preferences, or hosting conditions.

- **Pass:** 20 header-loading cases across all five pages: pre-initialization control space, hidden-control focus exclusion, unchanged header height after scripts start, ready menu opening/Escape, resize focus return, no-JavaScript links, failed-navigation-script fallback, and console checks (expected aborted-script errors excluded).
- **Pass:** T14, T19, T20, T22, T24, T30-T44, T53, and T54 rerun for responsive pages, keyboard/mobile navigation, theme/language controls, storage fallback, no-JavaScript behavior, and local asset errors. T14 was rerun after the startup rule was limited to initialization.
- **Pass:** T1-T12 source checks, navigation JavaScript syntax, and diff checks.
- Final Home Lighthouse 12.8.2 runs: Performance **95 mobile / 80 desktop**, Accessibility **100 in both**, CLS **0 in both**. Each is one fresh-profile local audit; results may vary on the published site.

Evidence: [targeted shift comparison](tests/results/header-cls-comparison.json), [20 header-loading cases](tests/results/header-loading.json), [regression case outcomes](tests/results/header-regression.json), [Lighthouse metrics](tests/results/header-lighthouse.json), and [two complete Lighthouse reports](tests/results/header-lighthouse-reports.zip). Historical runs above retain their original revision scope.

## Service portrait follow-up — November 5, 2026

Replaced Home's oversized, absolutely positioned Service image and clipping wrapper with a normal-flow 480 x 600 portrait. The new WebP is cropped from `louis-public-service.png` at x=330, y=550, width=480, height=600 to match the previous framing. Its intrinsic dimensions and 4:5 styling reserve the image area while it loads. The original photograph remains available in the repository. The portrait is 38,220 bytes versus the previous full-frame WebP's 129,414 bytes.

**Pass:** Headless Chrome checks at widths 320, 375, 390, 430, 768, and 1366 verified reserved height with the image request held, successful decoding, matching before/after dimensions, normal-flow positioning, both themes, no horizontal overflow, and no console/script errors. The image remained visible with its CSS aspect ratio reset to `auto`; its natural dimensions still supply the portrait ratio. The 390px section screenshot was visually reviewed against the previous framing. Home's local links/assets resolve and the diff check passed.

The reported disappearance was not reproduced in the earlier Chrome check, and the owner's phone/browser was not identified. This removes the fragile positioning/crop dependency; physical-device confirmation is still needed. Evidence: [six portrait loading checks](tests/results/service-portrait-checks.json).
