# Portfolio Project Guidelines

## Site and pages

This site is a personal portfolio for a midterm project. It will introduce me,
showcase my work and skills, and provide a way to contact me.

Planned pages:
- `index.html`: Home page with an introduction and links to featured projects.
- `about.html`: Background, interests, education, and skills.
- `projects.html`: Project descriptions, screenshots, and links to available work.
- `contact.html`: Contact information and relevant profile links.

Use consistent navigation and a footer across all pages. Do not invent personal
details, project accomplishments, or contact information; use clearly labeled
placeholders until I provide the content.

## Design

- Colors: off-white (`#F8FAFC`) page backgrounds, navy (`#0F172A`) text and
  navigation, teal (`#0F766E`) accents and buttons, and light gray (`#E2E8F0`)
  borders.
- Fonts: Arial, Helvetica, sans-serif for body text and headings. Use bold
  headings and a comfortable line height for readability.
- Style: clean, modern, and simple, with generous spacing, clear headings,
  restrained project cards, and consistent buttons.
- Layout: responsive pages that work on phones, tablets, and desktops.
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
