import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({
  name: 'companyName',
  standalone: true
})
export class CompanyNamePipe implements PipeTransform {

  /**
   * Returns the name of the company if the user is not undefined.
   * If the user is undefined, it returns an empty string.
   * @param users The user object to return the company name of.
   * @returns The name of the company, or an empty string if the user is undefined.
   */
  transform(users: User | undefined): string {
    return users?.company.name || '';
  }
}
