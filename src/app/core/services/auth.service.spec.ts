import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    let storage = {} as any;

    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in storage ? storage[key] : '';
      },
      setItem: (key: string, value: string): void => {
        storage[key] = `${value}`;
      },
      removeItem: (key: string): void => {
        delete storage[key];
      },
      clear: (): void => {
        storage = {};
      }
    };

    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    localStorage.setItem('currentUser', 'usr');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserInfo', () => {
    it('should verify method for normal call', () => {
      const user = {
        admin: true,
        audit: false,
        name: 'aaa',
        user: {}
      };

      localStorage.setItem('userInfo', JSON.stringify(user));

      const result = service.getUserInfo();

      expect(result).toEqual(user);
    });
  });

  describe('login', () => {
    it('allow user to login', done => {
      const param = {
        username: 'aaa',
        secret: '111',
        funcional: '123'
      };
      const user = {
        admin: true,
        audit: false,
        name: 'aaa',
        userInfo: {
          user: {
            memberOf: ['ACTIVITY_EDITOR']
          }
        }
      };

      service.login(param).subscribe(response => {
        expect(response).toEqual(param);
        done();
      });

      const request = httpController.expectOne(`${environment.loginUrl}/v1/security/login`);
      expect(request.request.method).toBe('POST');
      request.flush(user);

      httpController.verify();
    });

    it('does not allow user without group to logon', done => {
      const param = {
        username: 'aaa',
        secret: '111',
        funcional: '123'
      };
      const user = {
        admin: true,
        audit: false,
        name: 'aaa',
        userInfo: {
          user: {
            memberOf: []
          }
        }
      };

      service.login(param).subscribe({
        next: (res) => ({}),
        error: (err) => {
          expect(err).toEqual(new Error('Acesso negado. Para obter acesso solicitar o grupo ACTIVITY_EDITOR'));
          done();
        }
      });

      const request = httpController.expectOne(`${environment.loginUrl}/v1/security/login`);
      expect(request.request.method).toEqual('POST');
      request.flush(user);

      httpController.verify();
    });
  });

  describe('Logout', () => {
    it('should remove token', () => {
      localStorage.setItem('userInfo', 'anotherToken');
      service.logout();
      expect(localStorage.getItem('userInfo')).toBeFalsy();
    });
  });
});
