import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MenuContextService } from 'src/app/services/menu-context.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.scss'],
})
export class AddFieldComponent {
  fields: any[] = [];
  isMessage: boolean = false;
  message: string = '';
  formData: any = {};
  featureMaster: any[] = [];
  fieldId: any = '0';
  fieldData: any = {};
  menuID: any = "";

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    public loader: LoaderService,
    private route: ActivatedRoute,
    private menuService: MenuService,
    private menuContextService: MenuContextService
  ) { }

  ngOnInit() {
    this.loadNewFormFields();
    
    this.menuID = this.menuService.getMenuId();

    this.fieldId = this.route.snapshot.paramMap.get('id')
      ? this.route.snapshot.paramMap.get('id')
      : '0';
    // ✅ always set field_id
    this.formData.field_id = this.fieldId;

    if (this.fieldId != '0') {
      this.loadEditFormFields();
    }

    
  }

  loadEditFormFields() {
    this.loader.show();
    this.apiService
      .request('GET', `/formFieldDataById/${this.fieldId}`)
      .subscribe({
        next: (res: any) => {
          const data = res.fieldData[0] || {};
          this.fieldData = data;

          // ✅ convert checkbox values
          Object.keys(data).forEach((key) => {
            if (data[key] == '1') {
              data[key] = true;
            } else if (data[key] == '0') {
              data[key] = false;
            }
          });

          this.formData = {
            ...data,
            field_id: data.id || this.fieldId, // ✅ ensure always present
          };
          this.loadFeatures(this.fieldData['plugin_id']);
          this.loadScreens(this.fieldData['feature_id']);
          this.loader.hide();

          console.log('Field data: ', this.fieldData);
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
        },
      });
  }

  loadNewFormFields() {

    const ctx = this.menuContextService.getContext();
    this.loader.show();

    let payload = {
      plugin_id: '4',
      feature_id: '22',
      screen_id: '24'
    };

    console.log('Payload : ',payload);

    this.apiService.request('POST', '/dynamicFormFields', payload).subscribe({
      next: (res: any) => {
        this.fields = res.formFields || [];
        this.loader.hide();
        console.log('Fields', res.formFields);
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
      },
    });
  }

  handleBack() {
    this.router.navigate(['/admin/form-fields/list']);
  }

  onDropdownChange(fieldName: string, value: any) {
    if (fieldName === 'plugin_id') {
      this.formData.feature_id = null;
      this.formData.screen_id = null;

      this.loadFeatures(value);
    }

    if (fieldName === 'feature_id') {
      this.formData.screen_id = null;

      this.loadScreens(value);
    }
  }

  // ✅ Load Features
  loadFeatures(pluginId: any) {
    const payload = JSON.stringify({ parent_id: pluginId });

    this.apiService.request('POST', '/dependance_master', payload)
      .subscribe((res: any) => {

        const featureList = res.dependanceMaster || [];

        this.fields.forEach(field => {
          if (field.field_name === 'feature_id') {
            field.entity_data = featureList;
          }
        });
        
      });
  }

  // ✅ Load Screens
  loadScreens(featureId: any) {
    const payload = JSON.stringify({ parent_id: featureId });

    this.apiService.request('POST', '/dependance_master', payload)
      .subscribe((res: any) => {

        const screenList = res.dependanceMaster || [];

        this.fields.forEach(field => {
          if (field.field_name === 'screen_id') {
            field.entity_data = screenList;
          }
        });
      });
  }

  saveField(form: NgForm) {
    if (form.invalid) {
      // mark all controls as touched
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    this.apiService
      .request('POST', '/saveFormFields', this.formData)
      .subscribe({
        next: (res: any) => {
          this.showMessage(res?.message || 'Fields saved successfully');
          this.router.navigate(['/admin/form-fields/list'], {
            state: { message: res?.message || 'Fields saved successfully' },
          });
        },
        error: (err: any) => {
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
        },
      });

    console.log('Save Payload', this.formData);
  }

  showMessage(msg: string) {
    this.message = msg;
    this.isMessage = true;

    setTimeout(() => {
      this.isMessage = false;
    }, 3000);
  }
}
