import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  const jwtHelperServiceStub = () => ({
    isTokenExpired: () => {},
    getTokenExpirationDate: () => {}
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        JwtModule.forRoot({})
      ],
      providers: [
        TokenService,
        {
          provide: JwtHelperService,
          useFactory: jwtHelperServiceStub
        }
      ]
    });

    let store = {} as any;

    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : '';
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);

    service = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('SetToken', () => {
    it('should set token', () => {
      service.setToken('sometoken');
      expect(localStorage.getItem('token')).toEqual('sometoken');
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      service.setToken('abc');
      expect(localStorage.getItem(service.name)).toEqual('abc');
      service.removeToken();
      expect(localStorage.getItem(service.name)).toBeFalsy();
    });
  });

  describe('getToken', () => {
    it('should return empty string', () => {
      expect(service.getToken()).toBe('');
    });
  });

  describe('hasToken', () => {
    it('should return true when token present', () => {
      service.setToken('abc');
      expect(service.hasToken()).toBeTruthy();
    });

    it('should return false when token not present', () => {
      expect(service.hasToken()).toBeFalsy();
    });
  });

  describe('decode', () => {
    it('decode should return empty string', () => {
      spyOn(service, 'hasToken').and.returnValue(false);

      expect(service.decode()).toBe('');
    });

    it('decode should return token', () => {
      service.setToken('abc');

      expect(service.decode()).toBe('abc');
    });
  });

  describe('isTokenValid', () => {
    it('should verify token is valid', () => {
      const jwtService = TestBed.inject(JwtHelperService);
      spyOn(jwtService, 'isTokenExpired').and.returnValue(true);

      service.setToken('abc');

      expect(service.isTokenValid()).toBeTruthy();
      expect(jwtService.isTokenExpired).toHaveBeenCalled();
    });
  });

  describe('getExpirationDate', () => {
    it('should return valid date instance', () => {
      const jwtService = TestBed.inject(JwtHelperService);
      spyOn(jwtService, 'getTokenExpirationDate').and.returnValue(new Date());

      expect(service.getExpirationDate()).toBeInstanceOf(Date);
      expect(jwtService.getTokenExpirationDate).toHaveBeenCalled();
    });

    it('should return null', () => {
      const jwtService = TestBed.inject(JwtHelperService);
      spyOn(jwtService, 'getTokenExpirationDate').and.returnValue(null);

      expect(service.getExpirationDate()).toBeNull();
      expect(jwtService.getTokenExpirationDate).toHaveBeenCalled();
    })
  });
});
