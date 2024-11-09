import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({
  name: 'companyWebsite',
  standalone: true
})
export class CompanyWebsitePipe implements PipeTransform {

  /**
   * Transforms the user's website URL into a full HTTP URL.
   * If the user or website is undefined, it returns an empty string.
   * @param users The user object from which to extract the website URL.
   * @returns The full HTTP URL of the user's website, or an empty string if undefined.
   */
  transform(users: User | undefined): string {
    const website = users?.website || '';
    return `http://${website}`;
  }

}
