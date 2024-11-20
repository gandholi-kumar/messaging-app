import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
  private postsSubject$ = new BehaviorSubject<Post[]>([]);

  constructor(private http: HttpClient) { }

  /**
   * Fetches the posts from the server and updates the local posts array.
   * Notifies any subscribers of the postsSubject of the new posts.
   * Saves the new posts to local storage.
   * @returns An observable that emits the posts array.
   */
  fetchPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.POSTS_URL).pipe(
      tap(posts => {
        this.postsSubject$.next(posts);
        this.savePostsToLocalStorage();
      })
    );
  }

  /**
   * Returns an observable that emits the current posts array.
   * This observable does not fetch the posts from the server, it
   * simply returns the current value of the posts array. If you
   * want to fetch the posts from the server, use the fetchPosts()
   * method.
   * @returns An observable that emits the posts array.
   */
  getPosts(): Observable<Post[]> {
    return this.postsSubject$.asObservable();
  }

  /**
   * Adds a new post to the beginning of the posts array.
   * Assigns a unique ID to the post using generatePostId().
   * Notifies any subscribers of the postsSubject$ of the updated posts array.
   * Saves the updated posts array to local storage.
   * @param post - The post to be added.
   */
  addPost(post: Post) {
    post.id = this.generatePostId();
    const currentPosts = this.getCurrentPostsValue();
    currentPosts.unshift(post);
    this.postsSubject$.next(currentPosts);
    this.savePostsToLocalStorage();
  }

  /**
   * Updates a post in the posts array.
   * If the post is found in the posts array, it is replaced with the updated post.
   * Notifies any subscribers of the postsSubject$ of the updated posts array.
   * Saves the updated posts array to local storage.
   * @param updatedPost - The post to be updated.
   */
  updatePost(updatedPost: Post) {
    const currentPosts = this.getCurrentPostsValue();
    const index = currentPosts.findIndex(post => post.id === updatedPost.id);
    if (index !== -1) {
      currentPosts[index] = updatedPost;
      this.postsSubject$.next(currentPosts);
      this.savePostsToLocalStorage();
    }
  }

  /**
   * Deletes a post from the posts array.
   * If the post is found in the posts array, it is removed.
   * Notifies any subscribers of the postsSubject$ of the updated posts array.
   * Saves the updated posts array to local storage.
   * @param id - The ID of the post to be deleted.
   */
  deletePost(id: number) {
    const currentPosts = this.getCurrentPostsValue();
    const filteredPosts = currentPosts.filter(post => post.id !== id);
    this.postsSubject$.next(filteredPosts);
    this.savePostsToLocalStorage();
  }

  /**
   * Load posts from local storage. If local storage has no posts, load posts from server.
   */
  loadPostsFromLocalStorage() {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      const posts = JSON.parse(storedPosts);
      this.postsSubject$.next(posts);
    } else {
      this.fetchPosts().subscribe();
    }
  }

  /**
   * Save posts to local storage. This is called whenever the posts array changes.
   */
  private savePostsToLocalStorage() {
    const currentPosts = this.getCurrentPostsValue();
    localStorage.setItem('posts', JSON.stringify(currentPosts));
  }

  /**
   * Generates a unique ID for a new post by finding the current highest post ID
   * in the posts array and adding 1 to it. If the posts array is empty, the ID
   * is set to 1.
   */
  private generatePostId(): number {
    const currentPosts = this.getCurrentPostsValue();   
    return currentPosts.length > 0 ? Math.max(...currentPosts.map(p => p.id)) + 1 : 1;
  }

  /**
   * Returns list of current posts.
   * @returns list of Post
   */
  private getCurrentPostsValue(): Post[] {
    return this.postsSubject$.getValue(); 
  }
}
