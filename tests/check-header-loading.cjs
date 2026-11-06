// Uses the same temporary Playwright installation as run-browser-tests.cjs.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require(
  path.join(process.env.TEST_TOOLS, "node_modules/playwright-core"),
);
const root = path.resolve(__dirname, "..");
const pages = [
  "index.html",
  "about.html",
  "projects.html",
  "skills.html",
  "contact.html",
];
const results = [];
const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
const server = http.createServer((request, response) => {
  if (request.url === "/favicon.ico") {
    response.writeHead(204).end();
    return;
  }
  const filename = path.resolve(
    root,
    "." + new URL(request.url, "http://localhost").pathname,
  );
  if (!filename.startsWith(root + path.sep)) {
    response.writeHead(403).end();
    return;
  }
  fs.readFile(filename, (error, body) => {
    response.writeHead(error ? 404 : 200, {
      "Content-Type":
        mime[path.extname(filename)] || "application/octet-stream",
    });
    response.end(error ? "" : body);
  });
});

(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  try {
    for (const page of pages) {
      for (const mode of [
        "delayed-mobile",
        "delayed-desktop",
        "no-javascript",
        "failed-navigation",
      ]) {
        const width = mode === "delayed-desktop" ? 1366 : 375;
        const context = await browser.newContext({
          viewport: { width, height: 812 },
          javaScriptEnabled: mode !== "no-javascript",
        });
        const tab = await context.newPage();
        const errors = [];
        tab.on("pageerror", (error) => errors.push(error.message));
        tab.on("console", (message) => {
          if (message.type() !== "error") return;
          const expectedAbort =
            mode === "failed-navigation" &&
            /\/js\/navigation\.js(?:\?|$)/.test(message.location().url);
          if (!expectedAbort) errors.push(message.text());
        });
        const result = { page, mode, width };
        try {
          if (mode.startsWith("delayed-")) {
            // Hold scripts until the test has inspected the pre-initialization layout.
            let releaseScripts;
            const scriptsReady = new Promise((resolve) => {
              releaseScripts = resolve;
            });
            await tab.route("**/js/*.js*", async (route) => {
              await scriptsReady;
              await route.continue();
            });
            try {
              await tab.goto(
                `http://127.0.0.1:${server.address().port}/${page}`,
                { waitUntil: "commit" },
              );
              await tab.waitForFunction(
                () =>
                  document.querySelector(".theme-toggle") &&
                  document.styleSheets.length > 0,
              );
              await tab.evaluate(() => document.fonts.ready);
              for (const selector of [".theme-toggle", ".language-toggle"]) {
                const control = tab.locator(selector);
                assert(
                  await control.isHidden(),
                  "Uninitialized control must not be visible",
                );
                assert(
                  await control.evaluate(
                    (element) =>
                      element.offsetWidth > 0 && element.offsetHeight > 0,
                  ),
                  "Control space was not reserved",
                );
                assert(
                  await control.evaluate((element) => {
                    element.focus();
                    return document.activeElement !== element;
                  }),
                  "Hidden control received keyboard focus",
                );
              }
              if (width <= 850)
                assert(
                  await tab.locator("#main-navigation").isHidden(),
                  "Mobile navigation appeared before initialization",
                );
              const before = await tab
                .locator(".site-header")
                .evaluate((header) => header.getBoundingClientRect().height);
              releaseScripts();
              await tab.waitForLoadState("load");
              await tab.waitForFunction(
                () =>
                  !document.querySelector(".theme-toggle").hidden &&
                  !document.querySelector(".language-toggle").hidden,
              );
              const after = await tab
                .locator(".site-header")
                .evaluate((header) => header.getBoundingClientRect().height);
              assert(
                Math.abs(before - after) < 0.1,
                `Header height changed: ${before} -> ${after}`,
              );
              result.headerHeightBefore = before;
              result.headerHeightAfter = after;
              if (width <= 850) {
                await tab.locator(".menu-toggle").click();
                assert(
                  await tab.locator("#main-navigation").isVisible(),
                  "Ready menu did not open",
                );
                await tab.keyboard.press("Escape");
                assert(
                  await tab.locator("#main-navigation").isHidden(),
                  "Menu did not close",
                );
                assert(
                  await tab
                    .locator(".menu-toggle")
                    .evaluate((button) => button === document.activeElement),
                  "Escape did not return focus",
                );
              } else {
                await tab.locator("#main-navigation a").first().focus();
                await tab.setViewportSize({ width: 375, height: 812 });
                await tab.waitForFunction(
                  () =>
                    document.activeElement ===
                    document.querySelector(".menu-toggle"),
                  null,
                  { timeout: 3000 },
                );
                result.resizeFocusReturned = true;
              }
            } finally {
              releaseScripts();
            }
          } else {
            if (mode === "failed-navigation")
              await tab.route("**/js/navigation.js*", (route) =>
                route.abort("failed"),
              );
            await tab.goto(`http://127.0.0.1:${server.address().port}/${page}`);
            assert(
              await tab.locator("#main-navigation").isVisible(),
              "Fallback navigation is hidden",
            );
            assert.equal(await tab.locator("#main-navigation a").count(), 5);
            assert.equal(
              await tab.locator("html").getAttribute("data-js"),
              null,
              "Enhancement marker was not cleared",
            );
            if (mode === "no-javascript") {
              assert(await tab.locator(".theme-toggle").isHidden());
              assert(await tab.locator(".language-toggle").isHidden());
            }
          }
          assert.deepEqual(errors, []);
          result.status = "Pass";
        } catch (error) {
          result.status = "Fail";
          result.detail = error.message;
        } finally {
          await context.close();
        }
        results.push(result);
        console.log(page, mode, result.status);
      }
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(
    path.join(root, "tests/results/header-loading.json"),
    JSON.stringify({ cases: results }, null, 2) + "\n",
  );
  if (results.some((result) => result.status === "Fail")) process.exitCode = 1;
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => server.close());
