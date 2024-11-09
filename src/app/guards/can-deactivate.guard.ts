import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  /**
   * This guard is used to prevent the user from navigating away from a component
   * without a confirmation, if the component has unsaved changes.
   *
   * The component must implement the canDeactivate method. 
   * The canDeactivate method should return true or a UrlTree 
   * if the component can be deactivated, or false if the component cannot
   * be deactivated.
   *
   * The guard will call the canDeactivate method of the component and return the
   * result. If the component does not implement the CanComponentDeactivate interface,
   * the guard will return true.
   *
   * @param component The component to be deactivated.
   * @param currentRoute The ActivatedRouteSnapshot of the component.
   * @param currentState The RouterStateSnapshot of the component.
   * @param nextState The RouterStateSnapshot of the route the user wants to navigate to.
   * @returns A boolean, a UrlTree or an Observable or a Promise of a boolean or UrlTree indicating whether the component can be deactivated.
   */
  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
