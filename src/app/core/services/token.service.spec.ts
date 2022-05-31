import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { JwtModule } from '@auth0/angular-jwt';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        JwtModule.forRoot({})
      ],
      providers: [
        TokenService
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
});
