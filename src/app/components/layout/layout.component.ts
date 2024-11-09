import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit, OnDestroy {
  pageTitle: string = '';
  currentUser$!: Observable<User | null>;
  private isComponentDestroyed$: Subject<boolean> = new Subject();
  private subscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService) { }

  /**
   * Initializes the component.
   * Sets the currentUser$ observable to the observable of the current user.
   * Calls getPageTitle to update the pageTitle based on the current route.
   */
  ngOnInit(): void {
    this.currentUser$ = this.authService.getCurrentUser$;
    this.getPageTitle();
  }

  /**
   * Cleanup just before Angular destroys to avoid memory leaks
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.isComponentDestroyed$.next(true);
    this.isComponentDestroyed$.complete();
  }

  /**
   * Logs out the user and navigates to the root page.
   * Clears the user's authentication.
   * Navigates to the root page.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  /**
   * Sets the pageTitle to the title of the current route.
   * The title is retrieved from the route's data property.
   */
  getPageTitle() {
    this.subscription = this.router.events
      .pipe(takeUntil(this.isComponentDestroyed$))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          const currentRoute = this.router.routerState.root.firstChild;
          this.pageTitle = currentRoute?.snapshot.data['title'];
        }
      })
  }
}
