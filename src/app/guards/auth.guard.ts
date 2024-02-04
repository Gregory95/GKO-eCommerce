import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { HelperFunctionsService } from '../services/helperFunctions.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private helperFunctions: HelperFunctionsService
  ) {}

  canActivate() {
    if (this.authService.checkIfUserLoggedIn()) {
      return true;
    } else {
      this.toastr.error(
        'You are not allowed to access this page',
        'Unauthorized Access',
        this.helperFunctions.toastrOptions
      );
      this.authService.logout();
      return false;
    }
  }
}
