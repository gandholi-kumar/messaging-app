import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  /**
   * This guard is used to prevent users from navigating to routes that require authentication,
   * if the user is not logged in.
   *
   * If the user is logged in, true is returned and the navigation is allowed.
   * If the user is not logged in, the user is redirected to the login page and false is returned.
   *
   * @param route The ActivatedRouteSnapshot of the route the user wants to navigate to.
   * @param state The RouterStateSnapshot of the route the user wants to navigate to.
   * @returns True if the user is logged in, false if the user is not logged in.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
