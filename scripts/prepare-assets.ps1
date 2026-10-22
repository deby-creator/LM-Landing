$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$assetRoot = Join-Path $projectRoot 'public\assets'
Add-Type -AssemblyName System.Drawing
$photo = [System.Drawing.Image]::FromFile((Join-Path $assetRoot 'hero-liqui-moly-station.png'))
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]88)
try {
  foreach ($width in @(960, 1920)) {
    $height = [int][Math]::Round($photo.Height * $width / $photo.Width)
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.DrawImage($photo, 0, 0, $width, $height)
      $bitmap.Save((Join-Path $assetRoot "hero-station-$width.jpg"), $codec, $encoderParams)
    } finally { $graphics.Dispose(); $bitmap.Dispose() }
  }
} finally { $photo.Dispose(); $encoderParams.Dispose() }
Copy-Item -LiteralPath (Join-Path $projectRoot 'Assets\2x\img - App@2x.png') -Destination (Join-Path $assetRoot 'app-mobile-screens@2x.png') -Force
Copy-Item -LiteralPath (Join-Path $projectRoot 'Assets\2x\img - Map@2x.png') -Destination (Join-Path $assetRoot 'world-presence-map@2x.png') -Force
Copy-Item -LiteralPath (Join-Path $projectRoot 'Assets\2x\ico - Pipa@2x.png') -Destination (Join-Path $assetRoot 'icon-fuel-truck@2x.png') -Force
Copy-Item -LiteralPath (Join-Path $projectRoot 'Assets\2x\ico - Handshake@2x.png') -Destination (Join-Path $assetRoot 'icon-handshake@2x.png') -Force
Copy-Item -LiteralPath (Join-Path $projectRoot 'Assets\2x\Recurso 12@2x.png') -Destination (Join-Path $assetRoot 'quality-box@2x.png') -Force
Get-ChildItem -LiteralPath $assetRoot | Where-Object { $_.Name -match '(jpg|@2x)' } | Select-Object Name, Length
