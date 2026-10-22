# Portfolio Project Guidelines

## Site and pages

This site is a personal portfolio for a midterm project. It will introduce me,
showcase my work and skills, and provide a way to contact me.

Planned pages:
- `index.html`: Home page with an introduction and links to featured projects.
- `about.html`: Background, interests, and education.
- `projects.html`: Project descriptions, screenshots, and links to available work.
- `skills.html`: Technical skills grouped by type; do not invent proficiency ratings.
- `contact.html`: Contact information and relevant profile links.

Use consistent navigation and a footer across all pages. Do not invent personal
details, project accomplishments, or contact information; use clearly labeled
placeholders until I provide the content.

The owner is Louis Valderrama, an NJIT Software and Data Engineering student.
The Projects page must eventually include at least three real projects, each
with a description, image or screenshot, and a link if applicable. Clearly
labeled placeholders are temporary until Louis supplies the project details.
Contact uses a direct email link to LV285@njit.edu. A form is optional; if added,
validate it with JavaScript and direct visitors to email without claiming it sends.

## Design

- Direction: a sleek personal portfolio inspired by Batman's main computer in
  the Batcave: dark, precise, technical, and cinematic. Keep Louis's identity,
  education, and work as the focus of the experience.
- Colors: near-black (`#080B10`) page backgrounds, charcoal (`#111820`) panels,
  steel gray (`#334155`) borders, off-white (`#E5E7EB`) primary text, and cool
  gray (`#94A3B8`) secondary text. Use signal yellow (`#FACC15`) sparingly for
  active navigation, key actions, and keyboard focus.
- Fonts: Arial, Helvetica, sans-serif for readable body copy and bold headings.
  Use Consolas, Courier New, monospace for small console-style labels and section
  numbers. Keep long paragraphs in the body font.
- Style: organized command-console panels, thin borders, crisp alignment,
  subtle grid backgrounds, and mostly square corners. Use generous spacing and
  clear hierarchy so the interface feels polished and remains easy to scan.
- Details: use restrained glows, small technical labels, and geometric accents.
  Keep decorative details subtle and create them with CSS or simple local SVGs.
  Avoid clutter, fake system alerts, invented live metrics, and distracting
  terminal text. Navigation labels should still clearly name the portfolio pages.
- Motion: keep hover and focus transitions brief and subtle. Respect
  `prefers-reduced-motion`; avoid flashing, constant animation, and effects that
  interfere with reading.
- Layout: responsive pages that work on phones, tablets, and desktops. Console
  panels should stack naturally on smaller screens without horizontal scrolling.
- Accessibility: semantic HTML, descriptive image alt text, visible keyboard
  focus, readable contrast, and labels for form controls. Do not rely on color
  alone to convey meaning.

## Implementation rules

- Use plain HTML, CSS, and JavaScript only. No frameworks, component libraries,
  CSS frameworks, or build tools.
- Use relative file paths for internal links, stylesheets, scripts, and images.
  External website and contact links may use their appropriate URLs.
- Keep shared styles in `css/style.css`, scripts in `js/`, and images in
  `images/`.
- Prefer semantic HTML and CSS for layout; use JavaScript only when interaction
  requires it.
- Keep code readable, consistently indented, and easy to maintain.
- Check navigation, asset paths, keyboard access, and mobile layouts after
  relevant changes. Check the browser console when changing JavaScript.
- Do not make a contact form appear to send messages without a working service.

## Git workflow

- After each completed task, review the diff and perform the relevant checks.
- Stage only files related to that task. Never commit secrets or credentials.
- Commit after each task with a clear, descriptive message, such as
  `Add responsive portfolio navigation`.
- After committing, push the commit to GitHub on the current working branch.
- If a commit or push fails, report the failure and preserve the local work.
  Do not force-push or discard changes to resolve it.

## Owner review

This document is a draft. I must personally review and edit the site plan and
design choices before treating them as my final project guidelines.
