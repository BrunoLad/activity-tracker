import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { UserInfo } from 'src/app/shared/models/user-info';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public loginUrl: string;
  public httpOptions: any;

  constructor(
    private readonly http: HttpClient
  ) {
    this.setHttpOptions();

    let user = {} as User;
    if (localStorage.getItem('currentUser')) {
      user = JSON.parse(localStorage.getItem('currentUser')!);
    }
    this.currentUserSubject = new BehaviorSubject<User>(user);
    this.currentUser = this.currentUserSubject.asObservable();
    this.loginUrl = environment.loginUrl;
  }

  public getUserInfo(): UserInfo {
    const key = 'userInfo';
    return JSON.parse(localStorage.getItem(key)!);
  }

  public login(user: User) {
    const body = new HttpParams()
      .set('username', user.username)
      .set('secret', user.secret);

    return this.http
      .post<User>(`${this.loginUrl}/v1/security/login`, body, this.httpOptions)
      .pipe(
        map((response: any) => {
          const data = response.body;
          if (data.userInfo.user.memberOf
            .filter((group: any) => group.toUpperCase() === 'ACTIVITY_EDITOR').length === 0) {
              throw('Acesso negado. Para obter acesso solicitar o grupo ACTIVITY_EDITOR');
            }

          this.setSession(data);
          this.currentUserSubject.next(response.userInfo);
          return user;
        }),
        catchError((error: any) => this.handleError(error)));
  }

  private setHttpOptions(): void {
    this.httpOptions = {
      observe: 'response',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
  }

  private handleError(data: any): Observable<any> {
    let errorMessage = '';

    if (data.error instanceof ErrorEvent) {
      errorMessage = `Error ${data.error.message}`;
    } else if (data.status >= 400 && data.status < 500) {
      errorMessage = data.error.error;
      return throwError(() => new Error(errorMessage));
    } else if (typeof data === 'string') {
      errorMessage = data;
    } else {
      errorMessage = `Error code: ${data.status}\nMessage: ${data.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  private setSession(authResult: any): void {
    localStorage.setItem('token', authResult.access_token);
    localStorage.setItem('userInfo', JSON.stringify(authResult.userInfo));
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  }
}
