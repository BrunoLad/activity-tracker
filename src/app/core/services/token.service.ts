import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  public name: string;

  constructor(private readonly jwtService: JwtHelperService) {
    this.name = 'token';
  }

  public isTokenValid() {
      return this.hasToken() && this.jwtService.isTokenExpired(this.getToken());
  }

  public getExpirationDate(): Date | null {
    return this.jwtService.getTokenExpirationDate(this.getToken());
  }

  public decode() {
    return this.hasToken() ? this.getToken() : '';
  }

  public hasToken(): boolean {
    return !!localStorage.getItem(this.name)
      && localStorage.getItem(this.name) != null;
  }

  public getToken(): string {
    return localStorage.getItem(this.name) ?? '';
  }

  public setToken(token: string): void {
    localStorage.setItem(this.name, token);
  }

  public removeToken(): void {
    localStorage.removeItem(this.name);
  }
}
