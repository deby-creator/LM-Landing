$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$fontRoot = Join-Path $projectRoot 'public\fonts'
New-Item -ItemType Directory -Path $fontRoot -Force | Out-Null
$url = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600;700&display=swap'
$response = Invoke-WebRequest -UseBasicParsing -Uri $url -UserAgent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
$blocks = [regex]::Matches($response.Content, '/\* latin \*/\s*(@font-face\s*\{[^}]+\})')
if ($blocks.Count -ne 7) { throw "Expected 7 Latin Barlow font faces; received $($blocks.Count)." }
$styles = @('// Original project fonts, hosted locally; Latin subset includes Spanish accents.')
foreach ($block in $blocks) {
  $rule = $block.Groups[1].Value
  $family = [regex]::Match($rule, "font-family: '([^']+)'").Groups[1].Value.ToLower().Replace(' ', '-')
  $weight = [regex]::Match($rule, 'font-weight: (\d+)').Groups[1].Value
  $sourceUrl = [regex]::Match($rule, 'url\(([^)]+)\)').Groups[1].Value
  $filename = "$family-$weight.woff2"
  Invoke-WebRequest -UseBasicParsing -Uri $sourceUrl -OutFile (Join-Path $fontRoot $filename)
  $styles += $rule.Replace($sourceUrl, "/fonts/$filename")
}
[System.IO.File]::WriteAllText((Join-Path $projectRoot 'src\styles\_fonts.scss'), ($styles -join "`n"), [System.Text.UTF8Encoding]::new($false))
Write-Output "Downloaded $($blocks.Count) original Barlow font faces."
