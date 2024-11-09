import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({
  name: 'companyWebsite',
  standalone: true
})
export class CompanyWebsitePipe implements PipeTransform {

  transform(users: User | undefined): string {
    const website = users?.website || '';
    return `http://${website}`;
  }

}
