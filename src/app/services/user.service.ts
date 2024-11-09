import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'https://jsonplaceholder.typicode.com/users';
  private users: User[] = [];

  constructor(private http: HttpClient) { }

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  setUsers(users: User[]) {
    this.users = users;
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find(user => user.username.toLowerCase() === username.toLowerCase());
  }
}
