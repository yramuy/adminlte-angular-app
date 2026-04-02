import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { loginGuard } from './guards/login.guard';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './front-end/pages/home/home.component';
import { AboutComponent } from './front-end/pages/about/about.component';
import { ContactComponent } from './front-end/pages/contact/contact.component';
import { BlogComponent } from './front-end/pages/blog/blog.component';
import { WebsiteLayoutComponent } from './front-end/pages/website-layout/website-layout.component';
import { LoginComponent } from './back-end/pages/login/login.component';
import { MainLayoutComponent } from './back-end/layout/main-layout/main-layout.component';
import { DashboardComponent } from './back-end/pages/dashboard/dashboard.component';
import { EmployeeComponent } from './back-end/pages/employees/employee/employee.component';
import { AddemployeeComponent } from './back-end/pages/employees/addemployee/addemployee.component';
import { DynamicFormFieldsComponent } from './back-end/pages/configurations/dynamic-form-fields/dynamic-form-fields.component';
import { AddFieldComponent } from './back-end/pages/configurations/add-field/add-field.component';
import { PersonalDetailsComponent } from './back-end/pages/myInfo/personal-details/personal-details.component';
import { ContactDetailsComponent } from './back-end/pages/myInfo/contact-details/contact-details.component';
import { JobDetailsComponent } from './back-end/pages/myInfo/job-details/job-details.component';

const routes: Routes = [

  // ADMIN LOGIN (NO LAYOUT)
  {
    path: 'admin/login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },

  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // ✅ FIX
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees/list', component: EmployeeComponent },
      { path: 'employees/add', component: AddemployeeComponent },

      { path: 'form-fields/list', component: DynamicFormFieldsComponent },
      { path: 'form-fields/add', component: AddFieldComponent },
      { path: 'form-fields/add/:id', component: AddFieldComponent },

      { path: 'myInfo/personal-details', component: PersonalDetailsComponent },
      { path: 'myInfo/contact-details', component: ContactDetailsComponent },
      { path: 'myInfo/job-details', component: JobDetailsComponent },
    ],
  },
  // ❌ OPTIONAL: 404 fallback
  {
    path: '**',
    redirectTo: '',
  },
  // 🌐 WEBSITE
  {
    path: '',
    component: WebsiteLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'contact', component: ContactComponent },
    ],
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
