import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  errorMessage: string = '';

  private subscription!: Subscription;
  private isComponentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.userService.getUsers().length === 0) {
      this.subscription = this.userService.fetchUsers()
        .pipe(takeUntil(this.isComponentDestroyed$))
        .subscribe(users => {
          this.userService.setUsers(users);
        });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }    
    this.isComponentDestroyed$.next(true);
    this.isComponentDestroyed$.complete();
  }

  onSubmit(): void {
    const username = this.loginForm.value.username;
    const user = this.userService.getUserByUsername(username);
    if (user) {
      this.authService.login(user);
      this.router.navigate(['/']);
    } else {
      this.errorMessage = 'Not a valid user name!';
    }
  }

  get username() {
    return this.loginForm.get('username');
  }
}
