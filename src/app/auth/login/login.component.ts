import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  authenticationMode: string = 'login';

  constructor() {}

  ngOnInit(): void {
    this.authenticationMode = 'login';
  }

  handleFormsTransition(state: string): any {
    if (state === 'login') this.authenticationMode = 'login';
    else this.authenticationMode = 'register';
  }
}
