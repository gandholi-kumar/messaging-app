import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({
  name: 'user',
  standalone: true
})
export class UserPipe implements PipeTransform {

  /**
   * Returns the User object by finding with specified ID.
   * 
   * @param users - The array of User objects to search through.
   * @param userId - The ID of the user to find.
   * @returns The User object with the matching ID, or undefined if no user is found.
   */
  transform(users: User[], userId: number): User | undefined {
    return users.find(user => user.id === userId) || undefined;
  }
}
