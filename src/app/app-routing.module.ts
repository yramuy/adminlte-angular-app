import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { EmployeeComponent } from './pages/employee/employee.component';
// import { LoginComponent } from './pages/login/login.component';
import { loginGuard } from './guards/login.guard';
import { authGuard } from './guards/auth.guard';
// import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './front-end/pages/home/home.component';
import { AboutComponent } from './front-end/pages/about/about.component';
import { ContactComponent } from './front-end/pages/contact/contact.component';
import { BlogComponent } from './front-end/pages/blog/blog.component';
import { WebsiteLayoutComponent } from './front-end/pages/website-layout/website-layout.component';
import { LoginComponent } from './back-end/pages/login/login.component';
import { MainLayoutComponent } from './back-end/layout/main-layout/main-layout.component';
import { DashboardComponent } from './back-end/pages/dashboard/dashboard.component';
import { EmployeeComponent } from './back-end/pages/employee/employee.component';

const routes: Routes = [

  // 🌐 WEBSITE
  {
    path: '',
    component: WebsiteLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'contact', component: ContactComponent }
    ]
  },

  // 🔐 ADMIN LOGIN (NO LAYOUT)
  {
    path: 'admin/login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },

  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees/list', component: EmployeeComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
