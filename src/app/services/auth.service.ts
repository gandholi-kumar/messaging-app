import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private localStorageKey = 'currentUser';
  private currentUser: User | null = null;
  private currentUser$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private notification$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  getCurrentUser$ = this.currentUser$.asObservable();
  getNotification$ = this.notification$.asObservable();

  /**
   * Constructor. Loads the user from local storage.
   */
  constructor() {
    this.loadUserFromLocalStorage();
  }

  /**
   * Logs in the user and saves the user to local storage.
   * Updates the currentUser$ observable with the given user.
   * @param user The user to log in.
   */
  login(user: User) {
    this.currentUser = user;
    this.currentUser$.next(user);
    localStorage.setItem(this.localStorageKey, JSON.stringify(user));
  }

  /**
   * Logs out the user and removes the user from local storage.
   * Clears the currentUser$ observable and removes the user from local storage.
   * 
   * @returns void
   */
  logout() {
    this.currentUser = null;
    this.currentUser$.next(null);
    localStorage.removeItem(this.localStorageKey);
  }

  /**
   * Checks if a user is logged in.
   * 
   * @returns True if a user is logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Returns the current user, or null if no user is logged in.
   * 
   * @returns The current user, or null
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

/**
 * Sets a notification message to be displayed.
 * The notification message is cleared after 1 second.
 * 
 * @param notifyText - The notification message to be set.
 */
  setNotification(notifyText: string) {
    this.notification$.next(notifyText);
    setTimeout(() => {
      this.notification$.next('');
    }, 3000);
  }

  /**
   * Loads the user from local storage if it exists.
   * If local storage contains a user, it is parsed from JSON and set as the current user.
   * The current user observable is also updated with the loaded user.
   */
  private loadUserFromLocalStorage() {
    const storedUser = localStorage.getItem(this.localStorageKey);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.currentUser$.next(JSON.parse(storedUser));
    }
  }
}
