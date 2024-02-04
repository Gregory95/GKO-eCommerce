import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, retry, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { HelperFunctionsService } from './helperFunctions.service';
import {
  MicrosoftLoginProvider,
  SocialAuthService,
  SocialUser,
} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { Token } from '@angular/compiler';
import { environment } from 'src/environments/environments';
import { ErrorObject } from '../models/generic/errorObject';
import { ExternalAuth } from '../models/user/externalAuth';
import { LoginModel } from '../models/user/login';
import { RegisterModel } from '../models/user/register';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseURL = environment.baseUrl;
  url = environment.url;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private currentUserSource = new ReplaySubject<LoginModel | any>(1);
  private authChangeSub = new Subject<boolean>();
  private extAuthChangeSub = new Subject<SocialUser>();

  public currentUser$ = this.currentUserSource.asObservable();
  public authChanged = this.authChangeSub.asObservable().pipe(take(1));
  public extAuthChanged = this.extAuthChangeSub.asObservable().pipe(take(1));

  constructor(
    private http: HttpClient,
    private helperFunctions: HelperFunctionsService,
    private router: Router,
    private externalAuthService: SocialAuthService
  ) {
    this.externalAuthService.authState.subscribe((user) => {
      this.extAuthChangeSub.next(user);
    });
  }

  /**
   * In the sigInWithGoogle function, we call the signIn function from the SocialAuthService class and pass a provider_id as a parameter.
   * The signIn function is going to fetch the User’s data from the Google provider and return it back to our Angular application.
   * Also, it emits an event to all the subscribers passing that user object and returns the Promise with the populated user object.
   * We will use it later on in our app.
   * The signOut function just removes the user and emits an event to all the subscribers passing null for the user’s value.
   */
  public signInWithGoogle = () => {
    this.externalAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  };

  public signInWithMicrosoft = () => {
    this.externalAuthService.signIn(MicrosoftLoginProvider.PROVIDER_ID);
  };

  login(credentials: FormGroup): any {
    const body = {
      email: credentials.controls['email'].value,
      password: credentials.controls['password'].value,
    };

    return this.http
      .post(
        `${environment.baseUrl}/authenticate/login`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(
        map((response: any) => {
          const loginResponse = response;
          if (loginResponse && loginResponse.tokenObj) {
            this.setCurrentUser(loginResponse);
          }
        })
      );
  }

  getAccessToken(credentials: FormGroup): any {
    const body = {
      email: credentials.controls['email'].value,
      password: credentials.controls['password'].value,
    };

    return this.http.post(
      `${environment.baseUrl}/authenticate/token`,
      JSON.stringify(body),
      this.httpOptions
    );
  }

  register(credentials: FormGroup): Observable<RegisterModel> {
    const body = {
      email: credentials.controls['email'].value,
      password: credentials.controls['password'].value,
    };

    return this.http
      .post<RegisterModel>(
        `${environment.baseUrl}/authenticate/register`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(retry(1));
  }

  googleLogin(body: ExternalAuth): Observable<any> {
    return this.http
      .post(`${environment.baseUrl}/authenticate/google-login`, body)
      .pipe(
        map((response: any) => {
          this.setCurrentUser(response);
        })
      );
  }

  microsoftLogin(body: ExternalAuth): Observable<any> {
    return this.http
      .post(`${environment.baseUrl}/authenticate/microsoft-login`, body)
      .pipe(
        map((response: any) => {
          this.setCurrentUser(response);
        })
      );
  }

  externalSignUp(body: ExternalAuth): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/authenticate/external-signup`,
      body
    );
  }

  reset(
    inputForm: FormGroup,
    userEmail: string,
    token: string
  ): Observable<any> {
    const body = {
      password: inputForm.controls['password'].value,
      confirmPassword: inputForm.controls['confirmPassword'].value,
      userEmail: userEmail,
      token: token,
    };

    return this.http
      .post(
        `${environment.baseUrl}/authenticate/reset-password`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(retry(1));
  }

  forgotPassword(inputForm: FormGroup): Observable<RegisterModel> {
    const body = {
      email: inputForm.controls['userEmail'].value,
    };

    return this.http
      .post<RegisterModel>(
        `${environment.baseUrl}/authenticate/forgot-password`,
        JSON.stringify(body),
        this.httpOptions
      )
      .pipe(retry(1));
  }

  signOut(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/authenticate/signout`,
      this.httpOptions
    );
  }

  setCurrentUser(user: any): any {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSource.next(user);
    }
  }

  getToken(): Token | undefined {
    let user = localStorage.getItem('user');
    if (user) {
      let userObj = JSON.parse(user);
      return userObj.tokenObj;
    } else return undefined;
  }

  checkIfTokenIsActive(expirationDate: Date) {
    let currentDateTime = new Date();

    if (expirationDate < currentDateTime) {
      return false;
    } else if (expirationDate.getTime() < currentDateTime.getTime()) {
      return false;
    }

    return true;
  }

  checkIfUserIsExternal(): boolean {
    let user = localStorage.getItem('user');

    if (user) {
      let userObj = JSON.parse(user);
      return userObj.isExternal;
    }

    return false;
  }

  checkIfUserLoggedIn(): boolean {
    let token: any = this.getToken();

    if (token) return this.checkIfTokenIsActive(new Date(token.expiration));
    else return false;
  }

  getLoggedInUserFullName(): string | undefined {
    let user = localStorage.getItem('user');
    if (user) {
      let userObj = JSON.parse(user);
      return `${userObj.firstName} ${userObj.lastName}`;
    } else return undefined;
  }

  logout(): any {
    localStorage.removeItem('user');
    localStorage.clear();
    sessionStorage.clear();
    this.currentUserSource.next(null);
    this.router.navigate(['/']);
  }

  validateExternalAuth(externalAuth: ExternalAuth | any) {
    if (externalAuth.provider.toLowerCase() == 'google') {
      const googleService: any = this.googleLogin(externalAuth).subscribe({
        next: (_) => {
          this.router.navigate(['/dashboard']);
        },
        complete: () => googleService.unsubscribe(),
        error: (err: ErrorObject) => {
          this.helperFunctions.displayErrorMessage(err);
          googleService.unsubscribe();
        },
      });
    } else if (externalAuth.provider.toLowerCase() == 'microsoft') {
      const microsoftService: any = this.microsoftLogin(externalAuth).subscribe(
        {
          next: (_) => {
            this.router.navigate(['/dashboard']);
          },
          complete: () => microsoftService.unsubscribe(),
          error: (err: ErrorObject) => {
            this.helperFunctions.displayErrorMessage(err);
            microsoftService.unsubscribe();
          },
        }
      );
    }
  }
}
