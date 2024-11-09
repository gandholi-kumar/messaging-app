import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
  private posts: Post[] = [];
  private postsSubject = new BehaviorSubject<Post[]>([]);

  constructor(private http: HttpClient) { }

  /**
   * Fetches the posts from the server and updates the local posts array.
   * Notifies any subscribers of the postsSubject of the new posts.
   * Saves the new posts to local storage.
   * @returns An observable that emits the posts array.
   */
  fetchPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.POSTS_URL).pipe(
      map(posts => {
        this.posts = posts;
        this.postsSubject.next(this.posts);
        this.savePostsToLocalStorage();
        return this.posts;
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
    return this.postsSubject.asObservable();
  }

  /**
   * Adds a new post to the beginning of the posts array.
   * Assigns a unique ID to the post using generatePostId().
   * Notifies any subscribers of the postsSubject of the updated posts array.
   * Saves the updated posts array to local storage.
   * @param post - The post to be added.
   */
  addPost(post: Post) {
    post.id = this.generatePostId();
    this.posts.unshift(post);
    this.postsSubject.next(this.posts);
    this.savePostsToLocalStorage();
  }

  /**
   * Updates a post in the posts array.
   * If the post is found in the posts array, it is replaced with the updated post.
   * Notifies any subscribers of the postsSubject of the updated posts array.
   * Saves the updated posts array to local storage.
   * @param updatedPost - The post to be updated.
   */
  updatePost(updatedPost: Post) {
    const index = this.posts.findIndex(post => post.id === updatedPost.id);
    if (index !== -1) {
      this.posts[index] = updatedPost;
      this.postsSubject.next(this.posts);
      this.savePostsToLocalStorage();
    }
  }

  /**
   * Deletes a post from the posts array.
   * If the post is found in the posts array, it is removed.
   * Notifies any subscribers of the postsSubject of the updated posts array.
   * Saves the updated posts array to local storage.
   * @param id - The ID of the post to be deleted.
   */
  deletePost(id: number) {
    this.posts = this.posts.filter(post => post.id !== id);
    this.postsSubject.next(this.posts);
    this.savePostsToLocalStorage();
  }

  /**
   * Load posts from local storage. If local storage has no posts, load posts from server.
   */
  loadPostsFromLocalStorage() {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      this.posts = JSON.parse(storedPosts);
      this.postsSubject.next(this.posts);
    } else {
      this.fetchPosts().subscribe();
    }
  }

  /**
   * Save posts to local storage. This is called whenever the posts array changes.
   */
  private savePostsToLocalStorage() {
    localStorage.setItem('posts', JSON.stringify(this.posts));
  }

  /**
   * Generates a unique ID for a new post by finding the current highest post ID
   * in the posts array and adding 1 to it. If the posts array is empty, the ID
   * is set to 1.
   */
  private generatePostId(): number {
    return this.posts.length > 0 ? Math.max(...this.posts.map(p => p.id)) + 1 : 1;
  }
}
