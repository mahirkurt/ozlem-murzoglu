$files = Get-ChildItem -Path "D:\GitHub Repos\ozlem-murzoglu\src\app\pages\resources" -Filter "*.component.html" -Recurse

$replacements = @(
    @{
        old = '<span>Bilgi Merkezi</span>'
        new = "<span>{{ 'RESOURCES.INFO_CENTER' | translate }}</span>"
    },
    @{
        old = '<span>Bilgi Dökümanı</span>'
        new = "<span>{{ 'RESOURCES.INFO_DOCUMENT' | translate }}</span>"
    },
    @{
        old = '<span>Yazdır</span>'
        new = "<span>{{ 'ACTIONS.PRINT' | translate }}</span>"
    },
    @{
        old = '<span>Paylaş</span>'
        new = "<span>{{ 'ACTIONS.SHARE' | translate }}</span>"
    },
    @{
        old = '<span>Orijinal Dökümanı İndir</span>'
        new = "<span>{{ 'RESOURCES.DOWNLOAD_ORIGINAL' | translate }}</span>"
    },
    @{
        old = '<h3>İçindekiler</h3>'
        new = "<h3>{{ 'RESOURCES.TABLE_OF_CONTENTS' | translate }}</h3>"
    }
)

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    foreach ($replacement in $replacements) {
        $content = $content -replace [regex]::Escape($replacement.old), $replacement.new
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $count++
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "`nTotal files updated: $count"