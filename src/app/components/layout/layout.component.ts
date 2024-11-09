import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
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

  ngOnInit(): void {
    this.currentUser$ = this.authService.getCurrentUser$;
    this.getPageTitle();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.isComponentDestroyed$.next(true);
    this.isComponentDestroyed$.complete();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

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
