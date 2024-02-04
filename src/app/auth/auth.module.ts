import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { NgxSpinnerModule } from 'ngx-spinner';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
    CommonModule,
    RouterModule.forRoot([{ path: 'login', component: LoginComponent }]),
  ],
  declarations: [
    LoginComponent
  ],
  providers: [],
  bootstrap: [],
})
export class AuthModule {}
