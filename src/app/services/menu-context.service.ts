import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuContextService {

  private contextSource = new BehaviorSubject<any>({
    plugin_id: null,
    feature_id: null,
    screen_id: null
  });

  context$ = this.contextSource.asObservable();

  constructor() {
    // ✅ Load from localStorage (after refresh)
    const saved = localStorage.getItem('menu_context');
    if (saved) {
      this.contextSource.next(JSON.parse(saved));
    }
  }

  // ✅ Set context
  setContext(data: any) {
    const context = {
      plugin_id: data.plugin_id || null,
      feature_id: data.feature_id || null,
      screen_id: data.screen_id || null
    };

    localStorage.setItem('menu_context', JSON.stringify(context));
    this.contextSource.next(context);
  }

  // ✅ Get context
  getContext() {
    return this.contextSource.value;
  }

  // ✅ Clear (optional)
  clearContext() {
    localStorage.removeItem('menu_context');
    this.contextSource.next({
      plugin_id: null,
      feature_id: null,
      screen_id: null
    });
  }
}
