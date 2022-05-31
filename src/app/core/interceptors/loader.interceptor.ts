import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable, Subscription } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isIgnoreReqs(request))
      return next.handle(request);
    
    const spinnerSubscription: Subscription = this.loaderService.spinner$.subscribe();
    
    return next.handle(request).pipe(finalize(() => spinnerSubscription.unsubscribe()));
  }

  private isIgnoreReqs(request: HttpRequest<unknown>): boolean {
    return !!request.url.match(/(\/running)|(\/activities\/all)$/);
  }
}
