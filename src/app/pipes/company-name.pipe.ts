import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';

@Pipe({
  name: 'companyName',
  standalone: true
})
export class CompanyNamePipe implements PipeTransform {

  transform(users: User | undefined): string {
    return users?.company.name || '';
  }
}
