$fontFiles = @(
    "ZVVBrownNarrowWeb-Regular.woff2",
    "ZVVBrownNarrowWeb-Regular.woff",
    "ZVVBrownNarrowWeb-Bold.woff2",
    "ZVVBrownNarrowWeb-Bold.woff",
    "ZVVBrownNarrowSWeb-Regular.woff2",
    "ZVVBrownNarrowSWeb-Regular.woff",
    "ZVVBrownNarrowSWeb-Bold.woff2",
    "ZVVBrownNarrowSWeb-Bold.woff"
)

$baseUrl = "https://raw.githubusercontent.com/muraschal/boilerplate/main/assets/zvv/font"
$outputDir = "public/fonts"

# Erstelle den Ausgabeordner, falls er nicht existiert
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

# Lade jede Datei herunter
foreach ($file in $fontFiles) {
    $url = "$baseUrl/$file"
    $outputPath = "$outputDir/$file"
    Write-Host "Lade $file herunter..."
    Invoke-WebRequest -Uri $url -OutFile $outputPath
}

Write-Host "Alle Schriftarten wurden heruntergeladen." 