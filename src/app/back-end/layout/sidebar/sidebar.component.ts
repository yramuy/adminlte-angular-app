import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MenuContextService } from 'src/app/services/menu-context.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {

  isLoggedIn = false;
  user: any;
  menus: any[] = [];
  isMessage: boolean = false;
  message: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService,
    public loader: LoaderService,
    private menuService: MenuService,
    private menuContextService: MenuContextService
  ) { }

  ngOnInit() {
    this.authService.loadUserFromStorage();
    this.isLoggedIn = this.authService.isLoggedIn();

    this.authService.user$.subscribe((user) => {
      this.user = user;

      if (this.user && this.user.roleId) {
        this.loadMenus('0');
      }
    });
  }

  // ✅ API CALL
  loadMenus(parentId: string) {
    this.loader.show();
    const payload = JSON.stringify({
      parent_id: parentId,
      user_role_id: this.user.roleId,
    });

    this.apiService.request('POST', '/menus', payload).subscribe({
      next: (response: any) => {
        this.menus = response.menus || [];
        this.loader.hide();
        console.log('Menus:', this.menus);
      },
      error: (err) => {
        if (err.status === 401) {
          this.showMessage('Token expired');
          this.authService.setLoginStatus(false);
        } else if (err.status === 400) {
          this.showMessage('Invalid request data');
        } else if (err.status === 500) {
          this.showMessage('Server error. Please try again later');
        } else {
          this.showMessage('Something went wrong. Please try again later');
        }
        this.loader.hide();
      }
    });
  }

  showMessage(msg: string) {
    this.message = msg;
    this.isMessage = true;

    setTimeout(() => {
      this.isMessage = false;
    }, 3000);
  }

  // ✅ TOGGLE MENU
  toggleMenu(menu: any, event: Event) {

    // ✅ store plugin, feature, screen
    this.menuContextService.setContext({
      plugin_id: menu.super_parent_id,
      feature_id: menu.parent_id,
      screen_id: menu.id
    });

    // existing logic
    if (menu.children?.length) {
      event.preventDefault();
      menu.isOpen = !menu.isOpen;
    }
  }

  // ✅ ROUTE FIX
  getRoute(menu: any): any[] | null {
    if (!menu.menu_url) return null;

    return ['/admin/' + menu.menu_url];
  }

  // ✅ ACTIVE MENU
  isActive(menu: any): boolean {
    if (!menu.menu_url) return false;

    const url = '/admin/' + menu.menu_url;
    return this.router.url.includes(url);
  }
}