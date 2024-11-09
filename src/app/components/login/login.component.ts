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

  /**
   * If there are no users in local storage, fetches the users from the server.
   * Sets the users array to the fetched users.
   */
  ngOnInit(): void {
    if (this.userService.getUsers().length === 0) {
      this.subscription = this.userService.fetchUsers()
        .pipe(takeUntil(this.isComponentDestroyed$))
        .subscribe(users => {
          this.userService.setUsers(users);
        });
    }
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
   * Submits the form, by logging in the user if the entered username is valid.
   * If the username is valid, navigates to the home page.
   * If the username is invalid, sets an error message.
   */
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

  /**
   * Gets the form control for the username input field.
   * @returns The form control for the username input field.
   */
  get username() {
    return this.loginForm.get('username');
  }
}
