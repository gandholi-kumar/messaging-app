import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private USERS_URL = 'https://jsonplaceholder.typicode.com/users';
  private users: User[] = [];

  constructor(private http: HttpClient) { }

  /**
   * Fetches the users from the server.
   * @returns An observable that emits an array of User objects.
   */
  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.USERS_URL);
  }

  /**
   * Sets the users array to the given array of User objects.
   * @param users The array of User objects to set.
   */
  setUsers(users: User[]) {
    this.users = users;
  }

  /**
   * Returns the array of User objects.
   * @returns An array of User objects.
   */
  getUsers(): User[] {
    return this.users;
  }

  /**
   * Finds a User object in the users array with the given username, case-insensitive.
   * @param username The username to search for.
   * @returns The User object found, or undefined if not found.
   */
  getUserByUsername(username: string): User | undefined {
    return this.users.find(user => user.username.toLowerCase() === username.toLowerCase());
  }
}
