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

  constructor() {
    this.loadUserFromLocalStorage();
  }

  login(user: User) {
    this.currentUser = user;
    this.currentUser$.next(user);
    localStorage.setItem(this.localStorageKey, JSON.stringify(user));
  }

  logout() {
    this.currentUser = null;
    this.currentUser$.next(null);
    localStorage.removeItem(this.localStorageKey);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  setNotification(notifyText: string) {
    this.notification$.next(notifyText);
    setTimeout(() => {
      this.notification$.next('');
    }, 1000);
  }

  private loadUserFromLocalStorage() {
    const storedUser = localStorage.getItem(this.localStorageKey);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.currentUser$.next(JSON.parse(storedUser));
    }
  }
}
