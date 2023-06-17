import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { TokenService } from '../services/token.service';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let httpController: HttpTestingController;

  const tokenServiceStub = {
    removeToken: () => null,
    decode: () => 'aaa'
  };

  const routerStub = () => ({
    navigate: (commands: any, extras: any) => ({}),
    routerState: {
      snapshot: {
        url: ''
      }
    }
  });

  const toastrServiceStub = () => ({
    clear: () => ({}),
    error: (message: any, title: any, override: Partial<IndividualConfig>) => ({})
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      },
      {
        provide: TokenService,
        useValue: tokenServiceStub
      },
      {
        provide: Router,
        useFactory: routerStub
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {}
      },
      {
        provide: MatDialogRef,
        useValue: {}
      },
      {
        provide: ToastrService,
        useFactory: toastrServiceStub
      },
      MatDialog
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule
      ]
    });

    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it(`Given a valid url
  and auth token has expired or no token
  should redirect to login component
  with returnUrl param`, done => {
    const httpClient = TestBed.inject(HttpClient);
    const router = TestBed.inject(Router);
    const tokenService = TestBed.inject(TokenService);

    const unauthResponse = { type: 'ERROR', status: 401, statusText: 'Unauthorized'};
    const expectedRoute = ['/login'];
    const expectedParam = {
      queryParams: {
        returnUrl: '/somePath?action=ab&time=12:00'
      }
    };

    let spy: jasmine.Spy
    router.routerState.snapshot.url = 'baseUrl/somePath?action=ab&time=12:00';

    httpClient.get('/error').subscribe({
      next: (response) => {
        spy = spyOn(router, 'navigate');
        expect(router.navigate).toHaveBeenCalled();
        const route = spy.calls.first().args[0];
        const param = spy.calls.first().args[1];

        expect(route).toBe(expectedRoute);
        expect(param).toBe(expectedParam);
        spyOn(tokenService, 'decode').and.returnValue('');
      },
      error: (err) => {
        expect(err).toBeInstanceOf(HttpErrorResponse);
        done();
      }
    });

    const request: TestRequest = httpController.expectOne('/error');
    request.flush({}, unauthResponse);
    httpController.verify();
  });

  it('expect token gets injected', done => {
    const res = {};

    const tokenService = TestBed.inject(TokenService);
    const httpClient = TestBed.inject(HttpClient);

    httpClient.get('/data').subscribe(response => {
      spyOn(tokenService, 'decode').and.callFake(tokenServiceStub.decode);
      expect(response).toEqual(res);
      done();
    });

    const request = httpController.expectOne('/data');
    expect(request.request.method).toBe('GET');
    request.flush(res);
    expect(request.request.headers.has('Authorization')).toBeTruthy();
    expect(request.request.headers.get('Authorization')).toBe(`Bearer aaa`);

    httpController.verify();
  });
});
