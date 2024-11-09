import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({
  name: 'user',
  standalone: true
})
export class UserPipe implements PipeTransform {

  transform(users: User[], userId: number): User | undefined {
    return users.find(user => user.id === userId) || undefined;
  }
}
