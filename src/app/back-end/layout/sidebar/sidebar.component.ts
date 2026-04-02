import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  isLoggedIn = false;
  user: any;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authService.loadUserFromStorage();

    this.isLoggedIn = this.authService.isLoggedIn();

    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.bindMenuClick();
    }, 300);
  }

  bindMenuClick() {
    const sidebar = $('.nav-sidebar');

    sidebar.off('click', '.nav-item.has-treeview > .nav-link');

    sidebar.on('click', '.nav-item.has-treeview > .nav-link', (e: Event) => {
      e.preventDefault();

      const target = e.currentTarget as HTMLElement;
      const parent = $(target).parent();

      const submenu = parent.children('.nav-treeview');

      // close others (accordion)
      parent.siblings('.nav-item').removeClass('menu-open');
      parent.siblings('.nav-item').children('.nav-treeview').slideUp();

      // toggle current
      parent.toggleClass('menu-open');

      if (parent.hasClass('menu-open')) {
        submenu.stop(true, true).slideDown(200);
      } else {
        submenu.stop(true, true).slideUp(200);
      }
    });
  }

  isConfigActive(path: string): boolean {
    return this.router.url.includes(path);
  }
}
