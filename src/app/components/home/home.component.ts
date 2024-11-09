import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { CompanyNamePipe } from '../../pipes/company-name.pipe';
import { CompanyWebsitePipe } from '../../pipes/company-website.pipe';
import { Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { HideAfterDirective } from '../../directives/hide-after.directive';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user.model';
import { UserNamePipe } from '../../pipes/user-name.pipe';
import { UserPipe } from '../../pipes/user.pipe';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CompanyNamePipe, CompanyWebsitePipe, HideAfterDirective, RouterLink, UserNamePipe, UserPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  users: User[] = [];
  displayedPosts: Post[] = [];
  currentPage: number = 1;
  postsPerPage: number = 10;
  totalPages: number = 1;
  currentUser$!: Observable<User | null>;
  notification$!: Observable<string | null>;
  private isComponentDestroyed$: Subject<boolean> = new Subject();
  private subscription!: Subscription;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  /**
   * Initializes the component.
   * If there are no users in local storage, fetches the users from the server.
   * Sets the users array to the fetched users.
   * Loads the posts.
   * Sets the currentUser$ observable to the observable of the current user.
   * Sets the notification$ observable to the observable of the current notification.
   */
  ngOnInit(): void {
    if (this.userService.getUsers().length === 0) {
      this.subscription = this.userService.fetchUsers()
        .pipe(takeUntil(this.isComponentDestroyed$))
        .subscribe(users => {
          this.userService.setUsers(users);
          this.users = users;
        });
    } else {
      this.users = this.userService.getUsers();
    }

    this.loadPosts();
    this.currentUser$ = this.authService.getCurrentUser$;
    this.notification$ = this.authService.getNotification$;
  }

  /**
   * Cleanup just before Angular destroys to avoid memory leaks
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.isComponentDestroyed$.next(true);
    this.isComponentDestroyed$.complete();
  }

  /**
   * Loads the posts. If there are posts in local storage, it uses those posts.
   * If not, it fetches the posts from the server. 
   * Then it displays the first page of posts.
   */
  loadPosts(): void {
    this.postService.loadPostsFromLocalStorage();
    this.subscription = this.postService.getPosts()
      .pipe(takeUntil(this.isComponentDestroyed$))
      .subscribe(posts => {
        this.posts = posts;
        this.totalPages = Math.ceil(this.posts.length / this.postsPerPage);
        this.displayPage(this.currentPage);
      });
  }

  /**
   * Displays the posts for the specified page number. Updates the current page and sets
   * the displayedPosts array to contain only the posts for the current page.
   * 
   * @param page - The page number to display.
   */
  displayPage(page: number): void {
    this.currentPage = page;
    const start = (page - 1) * this.postsPerPage;
    const end = start + this.postsPerPage;
    this.displayedPosts = this.posts.slice(start, end);
  }

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

  /**
   * If the current page is less than the total number of pages, it increments the current page by 1 and
   * displays the new page of posts.
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.displayPage(this.currentPage + 1);
    }
  }

  /**
   * If the current page is greater than 1, it decrements the current page by 1 and
   * displays the new page of posts.
   */
  prevPage(): void {
    if (this.currentPage > 1) {
      this.displayPage(this.currentPage - 1);
    }
  }
}