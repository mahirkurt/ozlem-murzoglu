# Convert general info resource components to use BaseResourceComponent

$resources = @(
    @{Name="bebe-inizi-emzirmek"; Key="BREASTFEEDING_YOUR_BABY"; Category="general"},
    @{Name="emzirme-pu-lar-s-t-saklama"; Key="BREASTFEEDING_MILK_STORAGE"; Category="general"},
    @{Name="emzirme-pu-lar-yerle-me-ve-kavrama"; Key="BREASTFEEDING_POSITIONING"; Category="general"},
    @{Name="g-venli-uyku-ve-bebe-iniz-ani-bebek-l-m-sendromu"; Key="SAFE_SLEEP_SIDS"; Category="general"},
    @{Name="tuvalet-e-itimi"; Key="TOILET_TRAINING"; Category="general"},
    @{Name="emzik-b-rakma"; Key="PACIFIER_WEANING"; Category="general"}
)

foreach ($resource in $resources) {
    $path = "src\app\pages\resources\genel-bilgiler\$($resource.Name)\$($resource.Name).component.ts"
    
    if (Test-Path $path) {
        # Create proper class name
        $className = ($resource.Name -replace '-', ' ').Split(' ') | ForEach-Object { 
            $_.Substring(0,1).ToUpper() + $_.Substring(1).ToLower() 
        }
        $className = ($className -join '') + 'Component'
        
        $content = @"
import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-$($resource.Name)',
  standalone: true,
  imports: [BaseResourceComponent],
  template: ``
    <app-base-resource
      resourceKey="$($resource.Key)"
      categoryKey="$($resource.Category)">
    </app-base-resource>
  ``,
  styles: []
})
export class $className {}
"@
        
        Set-Content -Path $path -Value $content
        Write-Host "Converted: $($resource.Name)"
    } else {
        Write-Host "File not found: $path"
    }
}
