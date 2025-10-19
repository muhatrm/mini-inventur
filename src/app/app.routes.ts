import { Routes } from '@angular/router';
import { App } from './app';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth-guard';
import {RegisterComponent} from './components/register/register.component';
import {TermsComponent} from './components/terms/terms.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'home',
    title: 'Home',
    component: App
  },
  {
    path: 'login', title: 'Login', component: LoginComponent
  },
  {
    path: 'register', title: 'Register', component: RegisterComponent
  },
  {
    path: 'terms', title: 'Terms', component: TermsComponent
  },
  {
    path: 'dashboard', title: 'Dashboard', component: DashboardComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
