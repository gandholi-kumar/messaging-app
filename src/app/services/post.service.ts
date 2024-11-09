import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsUrl = 'https://jsonplaceholder.typicode.com/posts';
  private posts: Post[] = [];
  private postsSubject = new BehaviorSubject<Post[]>([]);

  constructor(private http: HttpClient) { }

  fetchPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl).pipe(
      map(posts => {
        this.posts = posts;
        this.postsSubject.next(this.posts);
        this.savePostsToLocalStorage();
        return this.posts;
      })
    );
  }

  getPosts(): Observable<Post[]> {
    return this.postsSubject.asObservable();
  }

  addPost(post: Post) {
    post.id = this.generatePostId();
    this.posts.unshift(post);
    this.postsSubject.next(this.posts);
    this.savePostsToLocalStorage();
  }

  updatePost(updatedPost: Post) {
    const index = this.posts.findIndex(post => post.id === updatedPost.id);
    if (index !== -1) {
      this.posts[index] = updatedPost;
      this.postsSubject.next(this.posts);
      this.savePostsToLocalStorage();
    }
  }

  deletePost(id: number) {
    this.posts = this.posts.filter(post => post.id !== id);
    this.postsSubject.next(this.posts);
    this.savePostsToLocalStorage();
  }

  loadPostsFromLocalStorage() {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      this.posts = JSON.parse(storedPosts);
      this.postsSubject.next(this.posts);
    } else {
      this.fetchPosts().subscribe();
    }
  }

  private savePostsToLocalStorage() {
    localStorage.setItem('posts', JSON.stringify(this.posts));
  }

  private generatePostId(): number {
    return this.posts.length > 0 ? Math.max(...this.posts.map(p => p.id)) + 1 : 1;
  }
}
