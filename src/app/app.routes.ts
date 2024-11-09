import { AuthGuard } from './guards/auth.guard';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PostEditComponent } from './components/post-edit/post-edit.component';
import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: '', component: HomeComponent, data: { title: 'Home' } },
    { path: 'login', component: LoginComponent, data: { title: 'Login' } },
    {
        path: 'post-edit',
        component: PostEditComponent,
        data: { title: 'New Post' },
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard]
    },
    {
        path: 'post-edit/:id',
        component: PostEditComponent,
        data: { title: 'Edit Post' },
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard]
    },
    { path: '**', component: PageNotFoundComponent, data: { title: 'Page not found' }, },
];
