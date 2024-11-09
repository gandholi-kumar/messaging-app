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

  /**
   * Initializes the component.
   * If the user is not logged in, navigates to the root page.
   * If the route parameter 'id' is present, loads the post to be edited.
   * Subscribes to the route parameter observable and updates the post ID and edit mode flag accordingly.
   * Starts tracking the dirty state of the form.
   */
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

  /**
   * Cleanup just before Angular destroys to avoid memory leaks
   */
  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
    this.isComponentDestroyed$.next(true);
    this.isComponentDestroyed$.complete();
  }

  /**
   * Loads the post with the specified ID and populates the form with the post's data.
   * If the post is not found or the user is not the owner of the post, navigates to the root page.
   * @param id - The ID of the post to be edited.
   */
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

  /**
   * Submits the form, by updating the post if it is in edit mode,
   * or creating a new post if it is not in edit mode.
   * If the form is invalid, does nothing.
   * else navigates to the root page and 
   * shows a notification about the successful creation or update of a post.
   */
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

  /**
   * Deletes the post being edited if the user confirms they want to delete the post.
   * If the user does not confirm, does nothing.
   * If the post is deleted, navigates to the root page and shows a notification about the successful deletion of a post.
   */
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

  /**
   * Cancels the editing of a post.
   * If the post was being edited, reloads the original post from the server.
   * If the post was being created, resets the form to its original state.
   */
  onCancel() {
    if (this.postId) {
      this.loadPost(this.postId);
    } else {
      this.postForm.reset();
    }
  }

  /**
   * Returns a boolean indicating whether the user can deactivate the current route.
   * If there are unsaved changes, the user is prompted to confirm whether they want to leave.
   * If the user confirms, true is returned, otherwise false is returned.
   * If there are no unsaved changes, true is returned immediately.
   * @returns boolean
   */
  canDeactivate(): boolean {
    if (this.unsavedChanges) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }

  /**
   * Gets the form control for the title input field.
   * @returns The form control for the title input field.
   */
  get title() {
    return this.postForm.get('title');
  }

  /**
   * Gets the form control for the body input field.
   * @returns The form control for the body input field.
   */
  get body() {
    return this.postForm.get('body');
  }

  /**
   * Tracks changes to the form and sets the `unsavedChanges` property to true 
   * if the form values do not match the original post.
   * If the user has not made any changes, sets `unsavedChanges` to false.
   * The `unsavedChanges` property is used by the `canDeactivate` guard to determine whether 
   * the user can leave the page without saving their changes.
   * @returns void
   */
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
