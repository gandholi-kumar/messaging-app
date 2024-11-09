import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({
  name: 'userName',
  standalone: true
})
export class UserNamePipe implements PipeTransform {

  /**
   * Returns the name of the user if the user is not undefined.
   * If the user is undefined, it returns an empty string.
   * @param users The user object to return the name of.
   * @returns The name of the user, or an empty string if the user is undefined.
   */
  transform(users: User | undefined): string {
    return users?.name || '';
  }
}
