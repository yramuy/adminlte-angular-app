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
import { EmployeeComponent } from './back-end/pages/employee/employee.component';
import { MainLayoutComponent } from './back-end/layout/main-layout/main-layout.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './back-end/pages/login/login.component';

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
    WebsiteFooterComponent
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
