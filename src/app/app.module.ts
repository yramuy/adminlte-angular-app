import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { HeaderComponent } from './layout/header/header.component';
// import { SidebarComponent } from './layout/sidebar/sidebar.component';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { EmployeeComponent } from './pages/employee/employee.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './front-end/pages/home/home.component';
import { AboutComponent } from './front-end/pages/about/about.component';
import { ContactComponent } from './front-end/pages/contact/contact.component';
import { BlogComponent } from './front-end/pages/blog/blog.component';
import { WebsiteLayoutComponent } from './front-end/pages/website-layout/website-layout.component';
import { WebsiteHeaderComponent } from './front-end/pages/website-header/website-header.component';
import { WebsiteFooterComponent } from './front-end/pages/website-footer/website-footer.component';
import { HeaderComponent } from './back-end/layout/header/header.component';
import { SidebarComponent } from './back-end/layout/sidebar/sidebar.component';
import { DashboardComponent } from './back-end/pages/dashboard/dashboard.component';
import { MainLayoutComponent } from './back-end/layout/main-layout/main-layout.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './back-end/pages/login/login.component';
import { EmployeeComponent } from './back-end/pages/employees/employee/employee.component';
import { AddemployeeComponent } from './back-end/pages/employees/addemployee/addemployee.component';
import { DynamicFormFieldsComponent } from './back-end/pages/configurations/dynamic-form-fields/dynamic-form-fields.component';
import { AddFieldComponent } from './back-end/pages/configurations/add-field/add-field.component';
import { PersonalDetailsComponent } from './back-end/pages/myInfo/personal-details/personal-details.component';
import { ContactDetailsComponent } from './back-end/pages/myInfo/contact-details/contact-details.component';
import { JobDetailsComponent } from './back-end/pages/myInfo/job-details/job-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    EmployeeComponent,
    LoginComponent,
    MainLayoutComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    BlogComponent,
    WebsiteLayoutComponent,
    WebsiteHeaderComponent,
    WebsiteFooterComponent,
    AddemployeeComponent,
    DynamicFormFieldsComponent,
    AddFieldComponent,
    PersonalDetailsComponent,
    ContactDetailsComponent,
    JobDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
