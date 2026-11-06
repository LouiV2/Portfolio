$ErrorActionPreference = 'Stop'
$repository = Split-Path $PSScriptRoot -Parent
$pages = @('index.html', 'about.html', 'projects.html', 'skills.html', 'contact.html')
$contents = @{}
foreach ($name in $pages) {
    $contents[$name] = [IO.File]::ReadAllText((Join-Path $repository $name))
}

$checks = [ordered]@{}
$checks.T1 = @($pages | Where-Object { !(Test-Path (Join-Path $repository $_)) }).Count -eq 0
$checks.T2 = @($pages | Where-Object { $contents[$_] -notmatch '<meta name="viewport" content="width=device-width, initial-scale=1.0">' }).Count -eq 0
$checks.T3 = @($pages | Where-Object { [regex]::Matches($contents[$_], '<h1(?:\s|>)').Count -ne 1 }).Count -eq 0
$checks.T4 = @($pages | Where-Object { $contents[$_] -notmatch 'class="skip-link" href="#main"' -or $contents[$_] -notmatch '<main id="main"' }).Count -eq 0
$checks.T5 = @($pages | Where-Object { $contents[$_] -notmatch '<footer>' }).Count -eq 0
$checks.T6 = @($pages | Where-Object { $contents[$_] -notmatch ('href="' + [regex]::Escape($_) + '" aria-current="page"') }).Count -eq 0
$missing = @()
foreach ($name in $pages) {
    foreach ($match in [regex]::Matches($contents[$name], '(?:src|href)="([^"#]+)"')) {
        $target = ($match.Groups[1].Value -split '[?#]')[0]
        if ($target -notmatch '^[a-z]+:' -and !(Test-Path -LiteralPath (Join-Path $repository $target))) {
            $missing += "$name : $target"
        }
    }
}
$checks.T7 = $missing.Count -eq 0
$checks.T8 = @($pages | Where-Object {
    $text = $contents[$_]
    @($pages | Where-Object { $text -notmatch ('href="' + [regex]::Escape($_) + '"') }).Count -gt 0
}).Count -eq 0
$checks.T9 = $contents['contact.html'].Contains('href="mailto:LV285@njit.edu"')
$checks.T10 = @('name', 'email', 'message' | Where-Object {
    $contents['contact.html'] -notmatch ('<label for="contact-' + $_ + '"') -or
    $contents['contact.html'] -notmatch ('id="contact-' + $_ + '"[^>]*required')
}).Count -eq 0
$checks.T11 = @('name', 'email', 'message' | Where-Object {
    $contents['contact.html'] -notmatch ('id="' + $_ + '-error"')
}).Count -eq 0
$checks.T12 = [regex]::Matches($contents['projects.html'], 'class="code-project').Count -ge 3

$resultPath = Join-Path $PSScriptRoot 'results/browser-results.json'
if (Test-Path $resultPath) {
    $results = Get-Content $resultPath -Raw | ConvertFrom-Json
    foreach ($entry in $checks.GetEnumerator()) {
        $status = if ($entry.Value) { 'Pass' } else { 'Fail' }
        $results.cases | Add-Member -Force -NotePropertyName $entry.Key -NotePropertyValue @{
            status = $status
            detail = 'PowerShell source check; see TESTING.md for the assertion.'
        }
    }
    [IO.File]::WriteAllText($resultPath, ($results | ConvertTo-Json -Depth 40) + "`n", [Text.UTF8Encoding]::new($false))
}
foreach ($entry in $checks.GetEnumerator()) {
    Write-Output "$($entry.Key): $(if ($entry.Value) { 'Pass' } else { 'Fail' })"
}
if ($checks.Values -contains $false) { throw "Source checks failed. Missing paths: $missing" }
