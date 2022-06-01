import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private readonly loginUrlPattern: RegExp = /login\/?/i;

  constructor(
    private readonly router: Router,
    private readonly tokenService: TokenService,
    private dialog: MatDialog,
    private readonly toastrService: ToastrService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token: string = this.tokenService.decode();

    if (token) {
      const headers: HttpHeaders = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      const clonedRequest = request.clone({
        headers,
        withCredentials: true
      });

      return next.handle(clonedRequest).pipe(catchError(
        (err: any) => this.handleError(err)));
    }

    return next
        .handle(request)
        .pipe();
  }

  private handleError(error: any) {
    const url: string = this.router.routerState.snapshot.url;

    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        this.tokenService.removeToken();

        if (!this.loginUrlPattern.test(url) && url) {
          this.router.navigate(['/login'], {
            queryParams: {
              returnUrl: url
            }
          });
        }
      } else {
        this.openErrorDialog(error.error.message);
      }
    }

    return throwError(() => error);
  }

  private openErrorDialog(msg: string) {
    this.toastrService.clear();
    this.toastrService.error(msg, '' , { disableTimeOut: true,  closeButton: true });
  }
}
