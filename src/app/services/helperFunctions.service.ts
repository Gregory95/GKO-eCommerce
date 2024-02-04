import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastrOptions } from '../models/generic/toastrOptions';

// !TODO Discuss of how to handle Errors properly

@Injectable({
  providedIn: 'root',
})
export class HelperFunctionsService {
  toastrOptions: ToastrOptions;

  public initials: string = '';

  //* View gets two possible values => grid and list
  //* By default we set it as grid and the active button will be the one that sets the view as grid.
  public view: string = 'grid';

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) {
    this.toastrOptions = new ToastrOptions();
  }

  /**
   * Observable function that will update the users initials
   * @param {input} FullName Logged in user`s full name
   */
  updateInitials(input: string): Observable<any> {
    return new Observable((observer) => {
      if (input) {
        const fullName: any = input.split(' ');
        const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
        this.initials = initials.toUpperCase();
      } else {
        this.initials = 'N/A';
      }

      observer.next(this.initials);
    });
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    this.toastr.error(errorMessage, 'Authentication Error', this.toastrOptions);

    return throwError(() => {
      return errorMessage;
    });
  }

  displayCustomErrorMessage(description: string) {
    this.toastr.error(description, 'Error', this.toastrOptions);
  }

  displayErrorMessage(error: any) {
    if (error && error.error) {
      // Get server-side unauthorized error
      this.toastr.error(
        error.error.description,
        `${error.error.title} - ${error.status}`,
        this.toastrOptions
      );
    } else if (error && error.status == '401') {
      this.toastr.error(
        'You have no longer access to this module, please login or restore your account.',
        `Unauthorized - ${error.status}`,
        this.toastrOptions
      );
      this.authService.logout();
    } else {
      this.toastr.error(
        'Error',
        `Something went wrong - ${error.status}`,
        this.toastrOptions
      );
    }
  }

  displayErrorMessageAndNavigateToErrorPage(error: any, code: any) {
    if (error && error.error) {
      this.toastr.error(
        error.error.description,
        `${error.error.title} - ${error.status}`,
        this.toastrOptions
      );
      this.router.navigate([`/survey/${code}/error`]);
    }
  }

  displaySuccessMessage(
    title: string,
    message: string,
    currentlyActive: number = 10
  ) {
    if (this.toastr.currentlyActive < currentlyActive)
      this.toastr.success(message, title, this.toastrOptions);
  }

  displayInfoMessage(title: string, message: string) {
    if (this.toastr.currentlyActive < 1)
      this.toastr.info(message, title, this.toastrOptions);
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl | any) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null
        : { isMatching: true };
    };
  }

  checkPassword(password: string): boolean {
    var isCorrect = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
    return isCorrect.test(password);
  }

  viewSurveySubmission(userSurveyCode: string, surveyCode: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/survey/${surveyCode}/userSurveyAnswers/${userSurveyCode}`,
      ])
    );
    window.open(url, '_blank');
  }
}
