import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HideAfterDirective } from '../../directives/hide-after.directive';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { NotifcationService } from '../../services/notification.service';
import { TableComponent } from '../shared-components/table/table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HideAfterDirective, TableComponent],
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
    private authService: AuthService,
    private notificationService: NotifcationService
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
    this.notification$ = this.notificationService.getNotification$;
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