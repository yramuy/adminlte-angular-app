import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

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

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    public loader: LoaderService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.fieldId = this.route.snapshot.paramMap.get('id')
      ? this.route.snapshot.paramMap.get('id')
      : '0';
    // ✅ always set field_id
    this.formData.field_id = this.fieldId;

    this.loadFormFields();

    if (this.fieldId != '0') {
      this.loadFormFieldData();
    }
  }

  loadFormFieldData() {
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
          this.handleDependance(this.fieldData['plugin_id']);
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

  loadFormFields() {
    this.loader.show();
    let payload = JSON.stringify({
      plugin_id: '4',
      feature_id: '22',
      screen_id: '24'
    });
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

  handleDependance(value: any) {
    // alert(value);
    let payload = JSON.stringify({
      plugin_id: value,
    });
    this.apiService.request('POST', '/dependance_master', payload).subscribe({
      next: (res: any) => {
        this.featureMaster = res.dependanceMaster || [];
        console.log('Fields', res.dependanceMaster);
      },
      error: (err) => {
        if (err.status === 401) {
          this.showMessage('Token expired');
          this.authService.setLoginStatus(false);
        } else if (err.status === 400) {
          this.showMessage('Invalid request data');
        } else if (err.status === 400) {
          this.showMessage('Request not dound');
        } else if (err.status === 500) {
          this.showMessage('Server error. Please try again later');
        } else {
          this.showMessage('Something went wrong. Please try again later');
        }
      },
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
