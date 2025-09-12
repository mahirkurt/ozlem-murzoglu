# PowerShell script to update all resource pages to use global hero-section component

$resourcesPath = "src\app\pages\resources"
$htmlFiles = Get-ChildItem -Path $resourcesPath -Filter "*.component.html" -Recurse

$totalFiles = $htmlFiles.Count
$updatedFiles = 0

Write-Host "Found $totalFiles resource HTML files to process" -ForegroundColor Cyan

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if file already uses app-hero-section
    if ($content -like '*<app-hero-section*') {
        Write-Host "✓ $($file.Name) already uses global hero-section" -ForegroundColor Green
        continue
    }
    
    # Check if file has custom hero section
    if ($content -like '*<div class="resource-hero*' -or $content -like '*<section class="hero*') {
        Write-Host "Updating $($file.Name)..." -ForegroundColor Yellow
        
        # Extract title and category from TypeScript file
        $tsFile = $file.FullName -replace '\.html$', '.ts'
        if (Test-Path $tsFile) {
            $tsContent = Get-Content $tsFile -Raw
            
            # Extract component name
            $componentName = ""
            if ($tsContent -match 'export class (\w+)') {
                $componentName = $matches[1]
            }
            
            # Create new HTML content with global hero-section
            $newHtml = @'
<div class="resource-page">
  <!-- Hero Section using global component -->
  <app-hero-section
    [title]="title"
    [subtitle]="category"
    colorTheme="blue">
  </app-hero-section>
  
  <!-- Content Section -->
  <div class="resource-content">
    <div class="container">
'@
            
            # Find where the old hero ends and content begins
            if ($content -like '*<div class="action-bar-wrapper*') {
                $actionBarIndex = $content.IndexOf('<div class="action-bar-wrapper')
                $fromActionBar = $content.Substring($actionBarIndex)
                $newContent = $newHtml + "`n      " + $fromActionBar
            }
            elseif ($content -like '*<!-- Action Bar*') {
                $actionBarIndex = $content.IndexOf('<!-- Action Bar')
                $fromActionBar = $content.Substring($actionBarIndex)
                $newContent = $newHtml + "`n  " + $fromActionBar
            }
            else {
                Write-Host "  ⚠ Could not parse hero structure in $($file.Name)" -ForegroundColor Red
                continue
            }
            
            # Ensure HeroSectionComponent is imported in TypeScript
            if ($tsContent -notmatch "import.*HeroSectionComponent") {
                $importLine = "import { HeroSectionComponent } from '../../../../components/shared/hero-section/hero-section.component';"
                
                # Add import after other imports
                if ($tsContent -match '(import.*?\n)+') {
                    $lastImport = $matches[0]
                    $tsContent = $tsContent -replace [regex]::Escape($lastImport), "$lastImport$importLine`n"
                }
                
                # Add to imports array
                $importsPattern = 'imports:\s*\[([\s\S]*?)\]'
                if ($tsContent -match $importsPattern) {
                    $currentImports = $matches[1]
                    if ($currentImports -notmatch 'HeroSectionComponent') {
                        $newImports = $currentImports.TrimEnd() + ", HeroSectionComponent"
                        $oldImportsLine = "imports: [$currentImports]"
                        $newImportsLine = "imports: [$newImports]"
                        $tsContent = $tsContent.Replace($oldImportsLine, $newImportsLine)
                    }
                }
                
                Set-Content -Path $tsFile -Value $tsContent -NoNewline
                Write-Host "  ✓ Updated TypeScript imports" -ForegroundColor Green
            }
            
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            $updatedFiles++
            Write-Host "  ✓ Updated HTML" -ForegroundColor Green
        }
    }
}

Write-Host "`n Summary:" -ForegroundColor Cyan
Write-Host " - Total files: $totalFiles" -ForegroundColor White
Write-Host " - Updated: $updatedFiles" -ForegroundColor Green
Write-Host " - Already using global hero: $($totalFiles - $updatedFiles)" -ForegroundColor Yellow