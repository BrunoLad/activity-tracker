import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { TokenService } from '../services/token.service';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  const tokenServiceStub = () => ({
    hasToken: () => jasmine.any(Boolean),
    removeToken: () => null
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        JwtModule
      ],
      providers: [
        { provide: TokenService, useFactory: tokenServiceStub }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true and navigate to dashboard', () => {
      const tokenService = TestBed.inject(TokenService);
      const router = TestBed.inject(Router);
      spyOn(tokenService, 'hasToken').and.returnValue(true);
      spyOn(router, 'navigateByUrl');

      const response = guard.canActivate({} as any, { url: '' } as any);

      expect(router.navigateByUrl).toHaveBeenCalledWith('dashboard');
      expect(response).toBeTruthy();
    });

    it('should remove Token and navigate to login with param', () => {
      const tokenService = TestBed.inject(TokenService);
      const router = TestBed.inject(Router);
      spyOn(tokenService, 'hasToken').and.returnValue(false);
      const spy = spyOn(tokenService, 'removeToken').and.stub();
      spyOn(router, 'createUrlTree').and.returnValue(new UrlTree());

      const response = guard.canActivate({} as any, { url: 'abc' } as any);

      expect(spy).toHaveBeenCalled();
      expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], {
        queryParams: {
          returnUrl: 'abc'
        }
      });
      expect(response).toBeInstanceOf(UrlTree);
    });
  });
});