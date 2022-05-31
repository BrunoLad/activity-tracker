import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly tokenService: TokenService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (this.tokenService.hasToken()) {
      if (!state.url) {
        this.router.navigateByUrl('dashboard');
      }

      return true;
    }

    this.tokenService.removeToken();

    return this.router.createUrlTree(['/login'], {
      queryParams: {
        returnUrl: state.url,
      },
    });
  }
}
