import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from './custom-button/custom-button.component';
import { CustomPanelComponent } from './custom-panel/custom-panel.component';
import { CustomCardComponent } from './custom-card/custom-card.component';
import { CustomAlertComponent } from './custom-alert/custom-alert.component';



@NgModule({
  declarations: [
    CustomButtonComponent,
    CustomPanelComponent,
    CustomCardComponent,
    CustomAlertComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
