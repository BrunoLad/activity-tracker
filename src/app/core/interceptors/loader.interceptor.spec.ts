import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, Subscription } from 'rxjs';

import { LoaderInterceptor } from './loader.interceptor';

describe('LoaderInterceptor', () => {
  let httpController: HttpTestingController;

  const loaderServiceStub = () => ({
    spinner$: of()
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoaderInterceptor,
          multi: true
        },
        {
          provide: loaderServiceStub,
          useFactoru: loaderServiceStub
        }
      ]
    });

    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const interceptor: LoaderInterceptor = TestBed.inject(LoaderInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('intercepts requests and displays loader', done => {
    const response = {};
    const httpClient = TestBed.inject(HttpClient);
    const spy = spyOn(Subscription.prototype, 'unsubscribe');

    httpClient.get('/route').subscribe({
      next: (res) => {
        expect(res).toEqual(response);
        done();
      },
      error: (err) => ({}),
      complete: () => {
        expect(spy).toHaveBeenCalledTimes(2);
      }
    });

    const request = httpController.expectOne('/route');
    expect(request.request.method).toBe('GET');
    request.flush(response);

    httpController.verify();
  });

  it('does not display loader for specific url', done => {
    const response = {};
    const http = TestBed.inject(HttpClient);
    const spy = spyOn(Subscription.prototype, 'unsubscribe');

    http.get('/running').subscribe({
      next: (res) => {
        expect(res).toEqual(response);
        done();
      },
      error: (err) => ({}),
      complete: () => {
        expect(spy).toHaveBeenCalledTimes(2);
      }
    });

    const request = httpController.expectOne('/running');
    expect(request.request.method).toBe('GET');
    request.flush(response);

    httpController.verify();
  })
});
