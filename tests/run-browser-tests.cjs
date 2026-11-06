// Run with a Node runtime and TEST_TOOLS pointing to a temporary tools directory
// containing playwright-core and lighthouse. No site dependencies are required.
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { pathToFileURL } = require("node:url");
const assert = require("node:assert/strict");
const tools = process.env.TEST_TOOLS;
const { chromium } = require(path.join(tools, "node_modules/playwright-core"));
const root = path.resolve(__dirname, "..");
const out = path.join(root, "tests/results");
const artifacts = path.join(tools, "reports");
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(artifacts, { recursive: true });
const pages = [
  "index.html",
  "about.html",
  "projects.html",
  "skills.html",
  "contact.html",
];
const selected = process.env.TEST_CASES?.split(",");
const results =
  selected && fs.existsSync(path.join(out, "browser-results.json"))
    ? JSON.parse(fs.readFileSync(path.join(out, "browser-results.json")))
    : {
        revision: require("node:child_process")
          .execSync("git rev-parse HEAD")
          .toString()
          .trim(),
        date: new Date().toISOString(),
        cases: {},
        links: [],
        lighthouse: {},
        errors: [],
      };
const check = (value, message) => assert.ok(value, message);
function save() {
  fs.writeFileSync(
    path.join(out, "browser-results.json"),
    JSON.stringify(results, null, 2) + "\n",
  );
}
async function test(id, fn) {
  if (selected && !selected.includes(id)) return;
  try {
    const detail = (await fn()) || "Assertions passed.";
    results.cases[id] = {
      status: detail.startsWith("BLOCKED") ? "Blocked" : "Pass",
      detail,
    };
  } catch (e) {
    results.cases[id] = { status: "Fail", detail: e.message };
  }
  console.log(id, results.cases[id].status, results.cases[id].detail);
  save();
}
const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
};
const server = http.createServer((req, res) => {
  const filename = path.resolve(
    root,
    "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
  );
  if (!filename.startsWith(root + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  fs.readFile(filename, (err, data) => {
    res.writeHead(err ? 404 : 200, {
      "Content-Type":
        mime[path.extname(filename)] || "application/octet-stream",
    });
    res.end(err ? "" : data);
  });
});
let browser, base;
async function context(options = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    ...options,
  });
  return ctx;
}
async function goto(page, file) {
  await page.goto(base + file);
  await page.evaluate(() => document.fonts.ready);
}
async function fill(page) {
  await page.locator("#contact-name").fill("Test Visitor");
  await page.locator("#contact-email").fill("visitor@example.com");
  await page
    .locator("#contact-message")
    .fill("Hello Louis! Can we discuss C++ & Python?");
}
async function submit(page) {
  await page.locator("button[type=submit]").click();
}
async function keyboardActivate(locator, page) {
  await locator.focus();
  await page.keyboard.press("Enter");
}
(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}/`;
  browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  results.browser = browser.version();
  results.platform = process.platform;
  for (let i = 0; i < pages.length; i++) {
    await test("T" + (25 + i), async () => {
      const blocked = [];
      for (const width of [375, 1366]) {
        const ctx = await context({
          viewport: { width, height: width === 375 ? 812 : 768 },
        });
        const p = await ctx.newPage();
        await goto(p, pages[i]);
        if (i === 4) {
          await fill(p);
          await submit(p);
        }
        const links = await p.locator("a[href]").evaluateAll((items) =>
          items.map((a, index) => ({
            index,
            href: a.getAttribute("href"),
            text:
              a.textContent.trim() ||
              a.getAttribute("aria-label") ||
              a.querySelector("img")?.alt,
          })),
        );
        for (const link of links) {
          await goto(p, pages[i]);
          if (i === 4) {
            await fill(p);
            await submit(p);
          }
          const a = p.locator("a[href]").nth(link.index);
          await a.evaluate((el) => {
            const d = el.closest("details");
            if (d) d.open = true;
          });
          if (
            (await a.evaluate((el) => !!el.closest("#main-navigation"))) &&
            width === 375
          )
            await p.locator(".menu-toggle").click();
          if (await a.evaluate((el) => el.classList.contains("skip-link")))
            await a.focus();
          if (/^mailto:/.test(link.href)) {
            check(
              link.href.startsWith("mailto:LV285@njit.edu"),
              "Wrong email recipient",
            );
            results.links.push({
              page: pages[i],
              width,
              ...link,
              result: "Recipient verified; email app not opened",
            });
            continue;
          }
          if (/^https?:/.test(link.href)) {
            try {
              const response = await ctx.request.get(link.href, {
                timeout: 15000,
              });
              if (!response.ok())
                blocked.push(`${link.href}: HTTP ${response.status()}`);
            } catch (e) {
              blocked.push(`${link.href}: ${e.message.split("\n")[0]}`);
            }
            results.links.push({
              page: pages[i],
              width,
              ...link,
              result: "External request attempted; see case detail",
            });
            continue;
          }
          await a.press("Enter");
          if (link.href.startsWith("#"))
            check(
              await p.locator(link.href).count(),
              "Missing fragment " + link.href,
            );
          else if (link.href.startsWith("images/") && i === 2) {
            check(
              await p.locator(".project-gallery").evaluate((d) => d.open),
              "Gallery did not open",
            );
            check(
              (await p.locator(".gallery-image").getAttribute("src")).endsWith(
                link.href,
              ),
              "Wrong gallery image",
            );
            const response = await ctx.request.get(base + link.href);
            check(response.ok(), "Missing screenshot");
            await p.keyboard.press("Escape");
            const popupPromise = ctx.waitForEvent("page", { timeout: 5000 });
            await a.click({ modifiers: ["Control"] });
            const popup = await popupPromise;
            await popup.waitForLoadState();
            check(
              popup.url().endsWith(link.href),
              "Modified screenshot link failed",
            );
            await popup.close();
          } else {
            check(
              p.url().endsWith(link.href),
              "Wrong destination " + link.href,
            );
          }
          results.links.push({
            page: pages[i],
            width,
            ...link,
            result: "Pass",
          });
        }
        await ctx.close();
      }
      if (blocked.length)
        return `BLOCKED external checks: ${blocked.join("; ")}. All local link activations passed at both sizes.`;
      if (i === 4)
        return "Every local link occurrence activated at both sizes; email recipients/draft checked without opening OS email app.";
      return "Every local link occurrence activated at phone/laptop sizes.";
    });
  }
  for (let i = 0; i < pages.length; i++)
    for (let size = 0; size < 2; size++) {
      await test("T" + (30 + i * 2 + size), async () => {
        const width = size ? 1366 : 375,
          height = size ? 768 : 812;
        const ctx = await context({ viewport: { width, height } });
        const p = await ctx.newPage();
        await goto(p, pages[i]);
        for (const theme of ["dark", "light"]) {
          if (theme === "light") await p.locator(".theme-toggle").click();
          await p
            .locator("details")
            .evaluateAll((ds) => ds.forEach((d) => (d.open = true)));
          if (i === 4) {
            await submit(p);
            await fill(p);
            await submit(p);
          }
          for (
            let y = 0,
              total = await p.evaluate(() => document.body.scrollHeight);
            y < total;
            y += height / 2
          ) {
            await p.evaluate((y) => scrollTo(0, y), y);
            await p.waitForTimeout(30);
            check(
              await p.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth,
              ),
              `Horizontal overflow at ${width}/${theme}/${y}`,
            );
          }
          await p.screenshot({
            path: path.join(artifacts, `${pages[i]}-${width}-${theme}.png`),
            fullPage: true,
          });
          check(
            await p
              .locator("img[src]")
              .evaluateAll((imgs) =>
                imgs.every(
                  (img) =>
                    !img.getAttribute("src") ||
                    (img.complete && img.naturalWidth > 0),
                ),
              ),
            "Broken image",
          );
          if (i === 2) {
            await p.locator(".project-screenshot a").first().click();
            check(
              await p.locator(".gallery-close").isVisible(),
              "Gallery close invisible",
            );
            await p.keyboard.press("Escape");
          }
        }
        await ctx.close();
        return `No horizontal overflow or broken images at ${width}x${height} in both themes; screenshots captured. Visual readability not fully assessed.`;
      });
    }
  for (let i = 0; i < pages.length; i++)
    await test("T" + (40 + i), async () => {
      for (const width of [375, 1366]) {
        const ctx = await context({ viewport: { width, height: 812 } });
        const p = await ctx.newPage();
        await goto(p, pages[i]);
        await p.keyboard.press("Tab");
        check(
          await p
            .locator(".skip-link")
            .evaluate((a) => a === document.activeElement),
          "Skip link not first",
        );
        await p.keyboard.press("Enter");
        check(p.url().endsWith("#main"), "Skip link Enter failed");
        await goto(p, pages[i]);
        const visited = new Set();
        for (let n = 0; n < 120; n++) {
          await p.keyboard.press("Tab");
          // Focus can reveal a lazy image; wait for its layout before measuring.
          await p.waitForFunction(
            () => {
              const element = document.activeElement;
              const bounds = element.getBoundingClientRect();
              return (
                element === document.body ||
                (bounds.width > 0 && bounds.height > 0)
              );
            },
            null,
            { timeout: 3000 },
          );
          const active = await p.evaluate(() => {
            const a = document.activeElement,
              s = getComputedStyle(a),
              r = a.getBoundingClientRect();
            return {
              tag: a.tagName,
              key: a.outerHTML.slice(0, 200),
              visible: r.width > 0 && r.height > 0 && s.visibility !== "hidden",
              focus: a.matches(":focus-visible"),
              outline: s.outlineStyle,
              href: a.getAttribute("href"),
            };
          });
          if (active.tag === "BODY") break;
          check(
            active.visible && active.focus,
            "Invisible keyboard focus: " + active.key,
          );
          visited.add(active.key);
          if (
            active.tag === "BUTTON" &&
            (await p
              .locator(".menu-toggle")
              .evaluate((b) => b === document.activeElement))
          ) {
            await p.keyboard.press("Enter");
            check(
              (await p
                .locator(".menu-toggle")
                .getAttribute("aria-expanded")) === "true",
              "Menu Enter failed",
            );
          }
          if (active.tag === "SUMMARY") {
            await p.keyboard.press("Enter");
            check(
              await p.evaluate(() => document.activeElement.parentElement.open),
              "Details Enter failed",
            );
          }
        }
        check(visited.size >= 8, "Too few keyboard stops");
        await p.locator(".theme-toggle").focus();
        await p.keyboard.press("Shift+Tab");
        check(
          await p.evaluate(
            () =>
              document.activeElement !== document.body &&
              document.activeElement.matches(":focus-visible"),
          ),
          "Reverse keyboard traversal lost visible focus",
        );
        for (const selector of [
          ".theme-toggle",
          ".language-toggle",
          ".motion-toggle",
        ]) {
          if (await p.locator(selector).isVisible())
            await keyboardActivate(p.locator(selector), p);
        }
        if (i === 2) {
          const a = p.locator(".project-screenshot a").first();
          await keyboardActivate(a, p);
          await p.keyboard.press("Tab");
          check(
            await p.evaluate(() => !!document.activeElement.closest("dialog")),
            "Modal focus escaped",
          );
          await p.keyboard.press("Escape");
          check(
            await a.evaluate((a) => a === document.activeElement),
            "Gallery focus not restored",
          );
        }
        if (i === 4) {
          await keyboardActivate(p.locator("[type=submit]"), p);
          check(
            await p
              .locator("#contact-name")
              .evaluate((a) => a === document.activeElement),
            "Invalid field focus missing",
          );
          await fill(p);
          await keyboardActivate(p.locator("[type=submit]"), p);
          check(
            await p.locator("#email-draft").isVisible(),
            "No keyboard draft",
          );
        }
        await ctx.close();
      }
      return "Tab traversal, visible-focus state, Enter buttons/details, and page-specific keyboard assertions passed at both sizes. Email app not launched.";
    });
  const ctx = await context();
  const p = await ctx.newPage();
  await goto(p, "index.html");
  await test("T16", async () => {
    await goto(p, "contact.html");
    await submit(p);
    check(
      (await p.locator("[aria-invalid=true]").count()) === 3,
      "Expected 3 errors",
    );
    await fill(p);
    await p.locator("#contact-email").fill("invalid-email");
    await submit(p);
    check(
      (await p.locator("#contact-email").getAttribute("aria-invalid")) ===
        "true",
      "Malformed email accepted",
    );
    for (const field of ["name", "message"]) {
      await fill(p);
      await p.locator("#contact-" + field).fill("   ");
      await submit(p);
      check(
        (await p.locator("#contact-" + field).getAttribute("aria-invalid")) ===
          "true",
        "Whitespace accepted",
      );
    }
    await fill(p);
    await submit(p);
    check(
      (await p.locator("[aria-invalid=true]").count()) === 0,
      "Errors not cleared",
    );
  });
  await test("T17", async () => {
    await goto(p, "contact.html");
    await fill(p);
    await submit(p);
    const href = await p.locator("#email-draft").getAttribute("href");
    check(href.startsWith("mailto:LV285@njit.edu?"), "Wrong mailto");
    check(
      decodeURIComponent(href).includes("C++ & Python?"),
      "Punctuation encoding lost",
    );
    await p.locator("#contact-name").fill("Edited");
    check(await p.locator("#email-draft").isHidden(), "Stale draft visible");
    return "Encoded draft and stale reset verified; OS email app intentionally not launched.";
  });
  await test("T18", async () => {
    await goto(p, "contact.html");
    for (const [field, max] of [
      ["name", 100],
      ["email", 254],
      ["message", 2000],
    ]) {
      await p.locator("#contact-" + field).fill("x".repeat(max + 1));
      check(
        (await p.locator("#contact-" + field).inputValue()).length === max,
        "Length limit failed",
      );
    }
  });
  await test("T55", async () => {
    for (const [field, value] of [
      ["name", "x".repeat(101)],
      ["email", "x".repeat(245) + "@example.com"],
      ["message", "x".repeat(2001)],
    ]) {
      await goto(p, "contact.html");
      await fill(p);
      await p.locator("#contact-" + field).evaluate((el, v) => {
        el.value = v;
      }, value);
      await submit(p);
      check(
        (await p.locator("#contact-" + field).getAttribute("aria-invalid")) ===
          "true",
        "Oversize accepted: " + field,
      );
      check(await p.locator("#email-draft").isHidden(), "Oversize draft");
    }
    await fill(p);
    await submit(p);
    check(await p.locator("#email-draft").isVisible(), "Correction failed");
  });
  await test("T19", async () => {
    for (const file of pages) {
      await goto(p, file);
      await p.evaluate(() => localStorage.clear());
      await p.reload();
      await p.locator(".theme-toggle").click();
      check(
        (await p.locator("html").getAttribute("data-theme")) === "light",
        "Theme failed",
      );
      await p.reload();
      check(
        (await p.locator("html").getAttribute("data-theme")) === "light",
        "Theme not saved",
      );
      await goto(p, "contact.html");
      check(
        (await p.locator("html").getAttribute("data-theme")) === "light",
        "Theme lost across pages",
      );
    }
  });
  await test("T20", async () => {
    for (const file of pages) {
      await goto(p, file);
      await p.evaluate(() => localStorage.clear());
      await p.reload();
      await p.locator(".language-toggle").click();
      check(
        (await p.locator("html").getAttribute("lang")) === "es",
        "Language failed",
      );
      await p.reload();
      check(
        (await p.locator("html").getAttribute("lang")) === "es",
        "Language not saved",
      );
    }
    await goto(p, "contact.html");
    await fill(p);
    await p.locator(".language-toggle").click();
    check(
      (await p.locator("#contact-name").inputValue()) === "Test Visitor",
      "Form values lost",
    );
  });
  await p.evaluate(() => localStorage.clear());
  await test("T14", async () => {
    await p.setViewportSize({ width: 375, height: 812 });
    for (const file of pages) {
      await goto(p, file);
      await p.locator(".menu-toggle").click();
      check(await p.locator("#main-navigation").isVisible(), "Menu hidden");
      await p.keyboard.press("Escape");
      check(
        await p
          .locator(".menu-toggle")
          .evaluate((b) => b === document.activeElement),
        "Escape focus",
      );
      await p.locator(".menu-toggle").click();
      await p.locator("#main-navigation a").first().focus();
      await p.setViewportSize({ width: 1366, height: 768 });
      check(
        await p.locator("#main-navigation").isVisible(),
        "Desktop nav hidden",
      );
      await p.setViewportSize({ width: 375, height: 812 });
      await p.waitForTimeout(100);
      check(
        await p
          .locator(".menu-toggle")
          .evaluate((b) => b === document.activeElement),
        "Resize focus",
      );
    }
    await p.setViewportSize({ width: 1366, height: 768 });
  });
  await test("T21", async () => {
    await goto(p, "projects.html");
    const links = p.locator(".project-screenshot a");
    for (let i = 0; i < (await links.count()); i++) {
      await links.nth(i).click();
      check(
        (await p.locator(".gallery-count").textContent()).startsWith(
          String(i + 1) + " /",
        ),
        "Wrong count",
      );
      await p.keyboard.press("Escape");
    }
    await links.first().click();
    await p.locator(".gallery-previous").click();
    check(
      (await p.locator(".gallery-count").textContent()).startsWith("7 /"),
      "Previous wrap",
    );
    await p.keyboard.press("ArrowRight");
    check(
      (await p.locator(".gallery-count").textContent()).startsWith("1 /"),
      "Next wrap",
    );
    await p.keyboard.press("ArrowLeft");
    await p.locator(".gallery-next").click();
    await p.locator(".gallery-close").click();
    check(
      !(await p
        .locator("html")
        .evaluate((h) => h.classList.contains("gallery-open"))),
      "Scroll lock remains",
    );
  });
  await test("T22", async () => {
    const c = await context({ javaScriptEnabled: false });
    const q = await c.newPage();
    for (const file of pages) {
      await goto(q, file);
      check(
        await q.locator("#main-navigation").isVisible(),
        "No-JS nav hidden",
      );
      if (file === "contact.html") {
        check(
          await q.locator("#contact-form").isHidden(),
          "No-JS form visible",
        );
        check(await q.locator("noscript").isVisible(), "No-JS notice hidden");
      }
      if (file === "projects.html") {
        await q.locator(".project-screenshot a").first().click();
        check(
          q.url().includes("project-1-unity-game.png"),
          "No-JS screenshot failed",
        );
      }
    }
    await c.close();
  });
  await test("T23", async () => {
    for (const file of ["index.html", "contact.html"]) {
      await goto(p, file);
      check(
        (await p
          .locator(".character-balloon")
          .evaluate((e) => getComputedStyle(e).animationName)) ===
          "balloon-sway",
        "No sway",
      );
      await p.locator(".motion-toggle").click();
      check(
        (await p
          .locator(".character-balloon")
          .evaluate((e) => getComputedStyle(e).animationPlayState)) ===
          "paused",
        "Pause failed",
      );
      await p.locator(".motion-toggle").click();
      await p.emulateMedia({ reducedMotion: "reduce" });
      await p.waitForTimeout(100);
      check(
        (await p
          .locator(".character-balloon")
          .evaluate((e) => getComputedStyle(e).animationName)) === "none",
        "Reduced motion sway",
      );
      await p.emulateMedia({ reducedMotion: "no-preference" });
    }
  });
  await test("T50", async () => {
    for (const file of pages.slice(0, 4)) {
      await goto(p, file);
      const chapters = p.locator(
        ".code-project, .skill-list article, .story-chapter",
      );
      for (let i = 0; i < (await chapters.count()); i++) {
        await chapters.nth(i).scrollIntoViewIfNeeded();
        await p.waitForTimeout(100);
      }
      check(
        (await p.locator(".chapter-nav [aria-current=step]").count()) === 1,
        "Active chapter missing",
      );
      check(
        await p
          .locator("body")
          .evaluate(
            () =>
              !!document
                .querySelector(
                  ".projects-page,.skills-page,.home-page,.about-page",
                )
                .style.getPropertyValue("--reading-progress"),
          ),
        "No progress",
      );
      await p.locator(".motion-toggle").click();
      check(
        (await p.locator(".story-motion").count()) === 0,
        "Pause story failed",
      );
      await p.locator(".motion-toggle").click();
      await p.emulateMedia({ reducedMotion: "reduce" });
      await p.waitForTimeout(100);
      check(
        (await p.locator(".story-motion").count()) === 0,
        "Reduced motion story failed",
      );
      await p.emulateMedia({ reducedMotion: "no-preference" });
    }
  });
  await test("T51", async () => {
    const c = await context();
    await c.addInitScript(() => {
      window.IntersectionObserver = undefined;
    });
    const q = await c.newPage();
    for (const file of pages.slice(0, 4)) {
      await goto(q, file);
      check(await q.locator("main").isVisible(), "Fallback main hidden");
      check(
        (await q.locator(".story-motion").count()) === 0,
        "Fallback enhancement active",
      );
    }
    await c.close();
  });
  await test("T52", async () => {
    await goto(p, "projects.html");
    await p.locator(".project-screenshot a").first().click();
    async function swipe(dx, dy, multi = false, cancel = false) {
      await p.locator(".gallery-stage").evaluate(
        (el, { dx, dy, multi, cancel }) => {
          const t = { identifier: 1, target: el, clientX: 100, clientY: 100 };
          el.dispatchEvent(
            new TouchEvent("touchstart", {
              touches: multi
                ? [new Touch(t), new Touch({ ...t, identifier: 2 })]
                : [new Touch(t)],
            }),
          );
          if (cancel) el.dispatchEvent(new TouchEvent("touchcancel"));
          el.dispatchEvent(
            new TouchEvent("touchend", {
              touches: [],
              changedTouches: [
                new Touch({ ...t, clientX: 100 + dx, clientY: 100 + dy }),
              ],
            }),
          );
        },
        { dx, dy, multi, cancel },
      );
    }
    await swipe(-100, 0);
    check(
      (await p.locator(".gallery-count").textContent()).startsWith("2 /"),
      "Swipe failed",
    );
    for (const args of [
      [0, 100],
      [10, 0],
      [-100, 0, true],
      [-100, 0, false, true],
    ]) {
      await swipe(...args);
      check(
        (await p.locator(".gallery-count").textContent()).startsWith("2 /"),
        "Ignored gesture advanced",
      );
    }
    await p.keyboard.press("Escape");
    const c = await context();
    await c.addInitScript(() => {
      HTMLDialogElement.prototype.showModal = undefined;
    });
    const q = await c.newPage();
    for (let i = 0; i < 7; i++) {
      await goto(q, "projects.html");
      const a = q.locator(".project-screenshot a").nth(i),
        href = await a.getAttribute("href");
      await a.click();
      check(q.url().endsWith(href), "Dialog fallback failed");
    }
    await c.close();
    return "Synthetic touch gestures and all seven unsupported-dialog links passed; physical-device touch not tested.";
  });
  await test("T53", async () => {
    const c = await context();
    await c.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("Blocked storage");
        },
      });
    });
    const q = await c.newPage();
    const errors = [];
    q.on("pageerror", (e) => errors.push(e.message));
    for (const file of pages) {
      await goto(q, file);
      await q.locator(".theme-toggle").click();
      await q.locator(".language-toggle").click();
      check(
        (await q.locator("html").getAttribute("lang")) === "es",
        "Storage language fallback",
      );
      check(
        (await q.locator("html").getAttribute("data-theme")) === "light",
        "Storage theme fallback",
      );
    }
    check(!errors.length, errors.join(";"));
    await c.close();
  });
  await test("T54", async () => {
    await p.emulateMedia({ reducedMotion: "no-preference" });
    for (const file of pages) {
      await goto(p, file);
      await p.evaluate(() => localStorage.clear());
      await p.reload();
      await p.locator(".theme-toggle").click();
      await p.locator(".motion-toggle").click();
      await p.locator(".language-toggle").click();
      check(
        (await p.locator("html").getAttribute("data-theme")) === "light",
        "Theme changed with language",
      );
      check(
        await p
          .locator("html")
          .evaluate((h) => h.hasAttribute("data-hud-paused")),
        "Pause lost",
      );
      check(
        (await p.locator(".motion-toggle").textContent()).includes("Reanudar"),
        "Pause label not translated",
      );
    }
    await goto(p, "contact.html");
    await submit(p);
    const before = await p.locator("#name-error").textContent();
    await p.locator(".language-toggle").click();
    check(
      (await p.locator("#name-error").textContent()) !== before,
      "Errors untranslated",
    );
    await fill(p);
    await submit(p);
    const href = await p.locator("#email-draft").getAttribute("href");
    await p.locator(".language-toggle").click();
    check(
      (await p.locator("#email-draft").getAttribute("href")) !== href,
      "Draft untranslated",
    );
    await goto(p, "projects.html");
    await p.locator(".project-screenshot a").first().click();
    const caption = await p.locator(".gallery-caption").textContent();
    await p.evaluate(() => document.querySelector(".language-toggle").click());
    check(
      (await p.locator(".gallery-caption").textContent()) !== caption,
      "Gallery caption untranslated",
    );
  });
  await test("T24", async () => {
    const c = await context();
    const q = await c.newPage();
    const errors = [];
    q.on("pageerror", (e) => errors.push(e.message));
    q.on("response", (r) => {
      if (r.url().startsWith(base) && r.status() >= 400)
        errors.push(`${r.status()} ${r.url()}`);
    });
    for (const file of pages) {
      await goto(q, file);
      await q
        .locator("img")
        .evaluateAll((imgs) => imgs.forEach((i) => (i.loading = "eager")));
      await q.waitForTimeout(300);
      await q.locator(".theme-toggle").click();
      await q.locator(".language-toggle").click();
      await q.locator(".motion-toggle").click();
    }
    check(!errors.length, errors.join(";"));
    await c.close();
    return "No uncaught errors or failed local asset responses during page/control smoke test.";
  });
  await ctx.close();
  // Aggregate overlapping cases only from observed browser checks.
  for (const [id, deps] of Object.entries({
    T13: ["T25", "T26", "T27", "T28", "T29"],
    T15: ["T40", "T41", "T42", "T43", "T44"],
  }))
    results.cases[id] = {
      status: deps.some((d) => results.cases[d]?.status === "Fail")
        ? "Fail"
        : deps.some((d) => results.cases[d]?.status === "Blocked")
          ? "Blocked"
          : "Pass",
      detail: "See " + deps.join(", "),
    };
  await browser.close();
  browser = null;
  const lighthouse = (
    await import(
      pathToFileURL(path.join(tools, "node_modules/lighthouse/core/index.js"))
        .href
    )
  ).default;
  const chromeLauncher = await import(
    pathToFileURL(
      path.join(tools, "node_modules/chrome-launcher/dist/index.js"),
    ).href
  );
  for (let i = 0; i < pages.length; i++)
    await test("T" + (45 + i), async () => {
      const scores = {};
      for (const mode of ["mobile", "desktop"]) {
        const chrome = await chromeLauncher.launch({
          chromePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
          chromeFlags: [
            "--headless=new",
            "--no-first-run",
            "--no-default-browser-check",
          ],
        });
        try {
          const run = await lighthouse(base + pages[i], {
            port: chrome.port,
            onlyCategories: ["accessibility"],
            output: "html",
            logLevel: "error",
            ...(mode === "desktop"
              ? {
                  formFactor: "desktop",
                  screenEmulation: {
                    mobile: false,
                    width: 1366,
                    height: 768,
                    deviceScaleFactor: 1,
                    disabled: false,
                  },
                }
              : {}),
          });
          const score = Math.round(
            run.lhr.categories.accessibility.score * 100,
          );
          scores[mode] = score;
          fs.writeFileSync(
            path.join(artifacts, `${pages[i]}-${mode}-lighthouse.html`),
            run.report,
          );
          results.lighthouse[`${pages[i]}-${mode}`] = {
            score,
            version: run.lhr.lighthouseVersion,
            failedAudits: Object.values(run.lhr.audits)
              .filter((a) => a.score !== null && a.score < 1)
              .map((a) => ({
                id: a.id,
                title: a.title,
                score: a.score,
                details: a.details?.items,
              })),
          };
        } finally {
          await chrome.kill();
        }
      }
      check(
        scores.mobile >= 90 && scores.desktop >= 90,
        JSON.stringify(scores),
      );
      return JSON.stringify(scores);
    });
  save();
  if (Object.values(results.cases).some((result) => result.status === "Fail")) {
    process.exitCode = 1;
  }
  console.log("Reports:", artifacts);
})()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    server.close();
    save();
  });
