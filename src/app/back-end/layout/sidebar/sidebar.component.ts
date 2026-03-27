import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements AfterViewInit {

  isLoggedIn = false;
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.loadUserFromStorage();

    this.isLoggedIn = this.authService.isLoggedIn();

    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  ngAfterViewInit(): void {
    $('[data-widget="treeview"]').Treeview();
  }

}