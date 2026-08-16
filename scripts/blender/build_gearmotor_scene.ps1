param(
    [string]$AssetPath = "$HOME\Downloads\K77_DRN90L4_external_assembly.glb"
)

$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$BaseScript = Join-Path $PSScriptRoot "k77_scene_setup.py"
$InternalScript = Join-Path $PSScriptRoot "add_schematic_internals.py"

if (-not (Test-Path $AssetPath)) {
    Write-Host ""
    Write-Host "ERROR: source GLB belum ditemukan." -ForegroundColor Red
    Write-Host "Expected: $AssetPath"
    Write-Host ""
    Write-Host "Simpan file dengan nama: K77_DRN90L4_external_assembly.glb"
    Write-Host "Default folder: Downloads"
    exit 1
}

$BlenderRoot = "C:\Program Files\Blender Foundation"
$BlenderExe = $null

if (Test-Path $BlenderRoot) {
    $BlenderExe = Get-ChildItem $BlenderRoot -Directory |
        Sort-Object Name -Descending |
        ForEach-Object { Join-Path $_.FullName "blender.exe" } |
        Where-Object { Test-Path $_ } |
        Select-Object -First 1
}

if (-not $BlenderExe) {
    $Command = Get-Command blender.exe -ErrorAction SilentlyContinue
    if ($Command) {
        $BlenderExe = $Command.Source
    }
}

if (-not $BlenderExe) {
    Write-Host ""
    Write-Host "ERROR: Blender tidak ditemukan." -ForegroundColor Red
    Write-Host "Install Blender 4.x terlebih dahulu, lalu jalankan command ini lagi."
    exit 1
}

$AssetDirectory = Split-Path $AssetPath -Parent
$SceneV1 = Join-Path $AssetDirectory "CBL_unbranded_gearmotor_scene_v1.blend"
$SceneV2 = Join-Path $AssetDirectory "CBL_unbranded_gearmotor_scene_v2_schematic.blend"

Write-Host ""
Write-Host "CBL Gearmotor Scene Builder" -ForegroundColor Cyan
Write-Host "Blender : $BlenderExe"
Write-Host "Asset   : $AssetPath"
Write-Host "Repo    : $RepoRoot"
Write-Host ""

# The base Blender script searches common folders for this exact source filename.
# Running Blender from the asset directory keeps discovery deterministic.
Push-Location $AssetDirectory
try {
    Write-Host "[1/2] Building unbranded external scene..." -ForegroundColor Yellow
    & $BlenderExe --background --python $BaseScript
    if ($LASTEXITCODE -ne 0) {
        throw "Base Blender scene build failed with exit code $LASTEXITCODE"
    }

    if (-not (Test-Path $SceneV1)) {
        throw "Expected scene was not created: $SceneV1"
    }

    Write-Host "[2/2] Adding schematic drivetrain internals..." -ForegroundColor Yellow
    & $BlenderExe --background $SceneV1 --python $InternalScript
    if ($LASTEXITCODE -ne 0) {
        throw "Schematic internal scene build failed with exit code $LASTEXITCODE"
    }

    if (-not (Test-Path $SceneV2)) {
        throw "Expected final scene was not created: $SceneV2"
    }
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "SUCCESS" -ForegroundColor Green
Write-Host "Final Blender scene:"
Write-Host $SceneV2 -ForegroundColor Green
Write-Host ""
Write-Host "Public visual mode: UNBRANDED"
Write-Host "Internal visual mode: SCHEMATIC_DRIVETRAIN_PRINCIPLE"
