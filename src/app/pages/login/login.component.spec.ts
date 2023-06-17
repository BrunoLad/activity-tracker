import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenService } from 'src/app/core/services/token.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store = {} as any;
  const paramMapManager = {
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    }
  };
  const tokenServiceStub = () => ({
    isTokenValid: () => false,
    hasToken: () => false
  });

  beforeEach(async () => {
    const authServiceStub = () => ({
      login: (user: any) => of(),
      logout: () => null
    });
    const routerStub = () => ({ navigateByUrl: (param: any) => ({}) });
    const toastrServiceStub = () => ({ warning: (error: any, param: any) => ({}) });
    const mockQueryParamMap = {
      get: (key: string): string => {
        return key in store ? store[key] : null;
      }
    };
    const activatedRouteStub = () => ({ snapshot: { queryParamMap: mockQueryParamMap } });

    await TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ LoginComponent ],
      imports: [
        ReactiveFormsModule,
        MatButtonModule
      ],
      providers: [
        { provide: AuthService, useFactory: authServiceStub },
        { provide: Router, useFactory: routerStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: TokenService, useFactory: tokenServiceStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('typewriterText has default value', () => {
    expect(component.typeWriterText).toEqual('Activity Tracker');
  });

  it('getControls should be truthy', () => {
    expect(component.getControls).toBeTruthy();
  });

  it('should login', () => {
    const service = TestBed.inject(AuthService);
    spyOn(service, 'login').and.returnValue(of(true));
    const email = 'abc@email.com';
    const value = '12345';
    component.loginForm.patchValue({ email, secret: value });
    component.login();
    expect(service.login).toHaveBeenCalled();
  });

  it('should return name to Dashboard/Home', inject([Router], (router: Router) => {
    const service = TestBed.inject(AuthService);
    spyOn(service, 'login').and.returnValue(of(true));
    const email = 'abc@email.com';
    const value = '12345';
    component.loginForm.patchValue({ email, secret: value });

    const spy = spyOn(router, 'navigateByUrl');

    component.login();

    const url = spy.calls.first().args[0];
    expect(url).toBe('/');
  }));

  it('should return to specific url described in returnUrl param', inject([Router], (router: Router) => {
    // Sets up data for activatedRoute stub
    const expectedRoute = 'aaa';
    paramMapManager.setItem('returnUrl', expectedRoute);

    // Creates new fixture so that data in stub gets set in component constructor
    // particularly returnUrl
    const newFixture = TestBed.createComponent(LoginComponent);
    const newComponent = newFixture.componentInstance;

    const service = TestBed.inject(AuthService);
    spyOn(service, 'login').and.returnValue(of(true));

    const email = 'abc@email.com';
    const value = '123456';
    newComponent.loginForm.patchValue({ email, secret: value });

    const spy = spyOn(router, 'navigateByUrl');

    newComponent.login();

    const url = spy.calls.first().args[0];
    expect(url).toBe(expectedRoute);
  }));

  describe('ngOnInit', () => {
    it('makes expected call', () => {
      spyOn(component, 'typingCallback').and.callThrough();

      component.ngOnInit();

      expect(component.typingCallback).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    // Clears up used paramMapManager in specs
    paramMapManager.clear();
  });
});
