# Convert all vaccine resource components to use BaseResourceComponent

$vaccines = @(
    @{Name="meningokok-acwy-a-s-bilgi-f-y"; Key="MENINGOKOK_ACWY_VACCINE"},
    @{Name="meningokok-b-a-s-bilgi-f-y"; Key="MENINGOKOK_B_VACCINE"},
    @{Name="nfluenza-a-s-bilgi-f-y"; Key="INFLUENZA_VACCINE"},
    @{Name="rotavir-s-a-s-bilgi-f-y"; Key="ROTAVIRUS_VACCINE"}
)

foreach ($vaccine in $vaccines) {
    $path = "src\app\pages\resources\asilar\$($vaccine.Name)\$($vaccine.Name).component.ts"
    $className = ($vaccine.Name -replace '-', ' ' -replace ' ', '') + 'Component'
    $className = $className.Substring(0,1).ToUpper() + $className.Substring(1)
    
    $content = @"
import { Component } from '@angular/core';
import { BaseResourceComponent } from '../../base-resource/base-resource.component';

@Component({
  selector: 'app-$($vaccine.Name)',
  standalone: true,
  imports: [BaseResourceComponent],
  template: ``
    <app-base-resource
      resourceKey="$($vaccine.Key)"
      categoryKey="vaccines">
    </app-base-resource>
  ``,
  styles: []
})
export class $className {}
"@
    
    Set-Content -Path $path -Value $content
    Write-Host "Converted: $path"
}
