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
  imports: [CommonModule, UserNamePipe, CompanyNamePipe, CompanyWebsitePipe, UserPipe, RouterLink, HideAfterDirective],
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.isComponentDestroyed$.next(true);
    this.isComponentDestroyed$.complete();
  }

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

  displayPage(page: number): void {
    this.currentPage = page;
    const start = (page - 1) * this.postsPerPage;
    const end = start + this.postsPerPage;
    this.displayedPosts = this.posts.slice(start, end);
  }

  trackByBookId: TrackByFunction<Post> = (index: number, post: Post): string => {
    return `${index}-${post.id}`;
  };

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.displayPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.displayPage(this.currentPage - 1);
    }
  }
}