import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  isLoggedIn = false;
  user: any;
  level1Menus: any[] = [];
  level2Menus: { [key: string]: any[] } = {};
  level3Menus: { [key: string]: any[] } = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.authService.loadUserFromStorage();

    this.isLoggedIn = this.authService.isLoggedIn();

    this.authService.user$.subscribe((user) => {
      this.user = user;

      if (this.user && this.user.roleId) {
        this.loadMenus('0', 1); // ✅ now roleId is available
      }
    });
  }

  loadMenus(parentId: string, level: number, parentKey?: string) {
    const payload = JSON.stringify({
      parent_id: parentId,
      user_role_id: this.user.roleId,
    });

    this.apiService.request('POST', '/menus', payload).subscribe({
      next: (response: any) => {
        const menus = response.menus || [];

        if (level === 1) {
          this.level1Menus = menus;
        } else if(level === 2 && parentKey) {
          this.level2Menus[parentKey] = menus;
        } else if(level === 3  && parentKey) {
          this.level3Menus[parentKey] = menus;
        }
        
      },
      error: (err) => {

      }
    });

    console.log('Menus : ', this.level1Menus);
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
