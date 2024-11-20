import { CommonModule } from '@angular/common';
import { CompanyNamePipe } from '../../../pipes/company-name.pipe';
import { CompanyWebsitePipe } from '../../../pipes/company-website.pipe';
import { Component, Input, TrackByFunction } from '@angular/core';
import { Post } from '../../../models/post.model';
import { RouterLink } from '@angular/router';
import { User } from '../../../models/user.model';
import { UserNamePipe } from '../../../pipes/user-name.pipe';
import { UserPipe } from '../../../pipes/user.pipe';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, CompanyNamePipe, CompanyWebsitePipe, UserNamePipe, UserPipe, RouterLink],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() posts: Post[] = [];
  @Input() users: User[] = [];
  @Input() currentUser!: User | null;

  /**
   * Tracks the posts by the index and the post ID.
   * This is used in the *ngFor to keep track of the posts in the array.
   * @param index - The index of the post in the array.
   * @param post - The post object.
   * @returns A string that represents the post that can be used in the *ngFor.
   */
  trackByBookId: TrackByFunction<Post> = (index: number, post: Post): string => {
    return `${index}-${post.id}`;
  };
}