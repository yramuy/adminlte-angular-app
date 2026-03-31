import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadFormFields();
  }

  loadFormFields() {
    let payload = JSON.stringify({
      plugin_id: '3',
      feature_id: '880',
    });
    this.apiService.request('POST', '/dynamicFormFields', payload).subscribe({
      next: (res: any) => {
        this.fields = res.formFields || [];
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
      },
    });
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

    console.log('Form Fields', this.formData);
  }

  showMessage(msg: string) {
    this.message = msg;
    this.isMessage = true;

    setTimeout(() => {
      this.isMessage = false;
    }, 3000);
  }
}
