import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menuIdSource = new BehaviorSubject<any>(null);
  currentMenuId$ = this.menuIdSource.asObservable();

  constructor() { }

  setMenuId(menuId: any) {
    this.menuIdSource.next(menuId);
  }

  getMenuId() {
    return this.menuIdSource.value;
  }
}
