import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CanComponentDeactivate } from '../../guards/can-deactivate.guard';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.scss'
})
export class PostEditComponent implements OnInit, OnDestroy, CanComponentDeactivate {

  postForm: FormGroup;
  isEditMode: boolean = false;
  postId: number | null = null;
  currentUser: User | null = null;
  originalPost: Post | null = null;
  unsavedChanges: boolean = false;

  private formSubscription!: Subscription;
  private isComponentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      body: ['', [Validators.required, Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/']);
      return;
    }

    this.formSubscription = this.route.paramMap
      .pipe(takeUntil(this.isComponentDestroyed$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode = true;
          this.postId = +id;
          this.loadPost(this.postId);
        }
      });

    this.trackChanges();
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
    this.isComponentDestroyed$.next(true);
    this.isComponentDestroyed$.complete();
  }

  loadPost(id: number): void {
    this.formSubscription = this.postService.getPosts()
      .pipe(takeUntil(this.isComponentDestroyed$))
      .subscribe(posts => {
        const post = posts.find(p => p.id === id);
        if (post && post.userId === this.currentUser?.id) {
          this.originalPost = post;
          this.postForm.patchValue({
            title: post.title,
            body: post.body
          });
        } else {
          this.router.navigate(['/']);
        }
      });
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }

    const formValue = this.postForm.value;
    if (this.isEditMode && this.originalPost) {
      const updatedPost: Post = {
        ...this.originalPost,
        title: formValue.title,
        body: formValue.body
      };
      this.postService.updatePost(updatedPost);
      this.authService.setNotification('Post was updated successfully');
    } else {
      const newPost: Post = {
        userId: this.currentUser!.id,
        id: 0,
        title: formValue.title,
        body: formValue.body
      };
      this.postService.addPost(newPost);
      this.authService.setNotification('A new post was saved successfully');
    }

    this.unsavedChanges = false;
    this.router.navigate(['/']);
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this post?')) {
      if (this.postId) {
        this.postService.deletePost(this.postId);
        this.authService.setNotification('Post was deleted successfully');
        this.router.navigate(['/']);
      }
    } else {
      this.authService.setNotification('');
    }
  }

  onCancel() {
    if (this.postId) {
      this.loadPost(this.postId);
    } else {
      this.postForm.reset();
    }
  }

  canDeactivate(): boolean {
    if (this.unsavedChanges) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }

  get title() {
    return this.postForm.get('title');
  }

  get body() {
    return this.postForm.get('body');
  }

  trackChanges(): void {
    this.formSubscription = this.postForm.valueChanges
      .pipe(takeUntil(this.isComponentDestroyed$))
      .subscribe((val) => {
        const { body, title } = this.originalPost ?? { body: '', title: '' };
        const { body: valBody, title: valTitle } = val;

        if (body === valBody && title === valTitle) {
          this.unsavedChanges = false;
          return;
        }
        this.unsavedChanges = true;
      });
  }
}
