import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  posts: Post[] = [];
  users: User[] = [];
  currentPage = 1;
  pageSize = 10;
  loggedIn = false;
  user: any;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    console.log('Home como')
    this.apiService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
    this.apiService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }


}