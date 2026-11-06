# Running the portfolio checks

The site still uses plain HTML, CSS, and JavaScript. The scripts here are separate QA tools, not runtime dependencies or a build step.

The recorded run used Windows, headless Chrome 156.0.8078.81, Node 22.14.0, Playwright Core 1.65.0, and Lighthouse 12.8.2. Browser tests use phone (375 x 812) and laptop (1366 x 768) CSS-pixel viewports; Lighthouse uses its Mobile preset and the runner's Desktop configuration. Phone testing is emulation, not a physical device.

Install `playwright-core` and `lighthouse` into a temporary directory outside the repository using npm. Set `TEST_TOOLS` to that directory, then run from the repository root:

```powershell
$env:TEST_TOOLS = Join-Path $env:TEMP 'portfolio-browser-testing'
# If Node/npm are installed, prepare the temporary tools once:
npm install --prefix $env:TEST_TOOLS --no-audit --no-fund playwright-core@1.65.0 lighthouse@12.8.2
node tests/run-browser-tests.cjs
powershell -NoProfile -ExecutionPolicy Bypass -File tests/check-source.ps1
```

The runner expects Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`; adjust the two executable paths for another installation. It serves the repository on an ephemeral loopback port and stops its server and owned browser processes afterward. It does not send emails or change site content.

To rerun selected browser cases while retaining other results:

```powershell
$env:TEST_CASES = 'T14,T50,T54'
node tests/run-browser-tests.cjs
Remove-Item Env:TEST_CASES
```

`results/browser-results.json` contains case outcomes, link observations, and Lighthouse scores/version data. Source checks merge T1-T12 into that file after the browser run. Browser screenshots and full Lighthouse HTML reports are written to `$env:TEST_TOOLS/reports`. The checked-in `results/lighthouse-reports.zip` preserves the ten HTML reports from the recorded run; extract it to view them. Updating the archive and the human-readable results in `TESTING.md` is an explicit review step after rerunning.

Assertions cover actual DOM behavior and browser keyboard events. Touch gestures are synthetic. The automated checks and reviewed screenshots do not replace physical-device testing, assistive-technology testing, or a full manual accessibility audit. External sites may block automation; a blocked destination is not recorded as a passing link. Email recipient and encoded draft content are checked without launching an OS email application.
