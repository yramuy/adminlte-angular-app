import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.scss'],
})
export class AddemployeeComponent {
  formFields: any[] = [];
  formData: any = {};
  message: string = '';
  isMessage: boolean = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadDynamicFormFields();
  }

  loadDynamicFormFields() {
    const body = JSON.stringify({
      plugin_id: '3',
      feature_id: '4',
    });

    this.apiService.request('POST', '/dynamicFormFields', body).subscribe({
      next: (res: any) => {
        this.formFields = res.formFields || [];
        this.loadControlValue();
        console.log('Form Fields ', this.formFields);
      },

      error: (err: any) => {
        if (err.status === 401) {
          this.showMessage('Failed to load Dynamic Form');
          this.authService.setLoginStatus(false);
        } else {
          this.showMessage('Something went wrong. Please try again');
        }
      },
    });
  }

  loadControlValue() {
    this.formFields.forEach((field) => {
      if (field.control_value) {
        this.formData[field.field_name] = field.control_value;
      }
    });
  }

  saveEmployee(form: NgForm) {
    if (form.invalid) {
      // mark all controls as touched
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    this.apiService.request('POST', '/saveEmployee', this.formData).subscribe({
      next: (res: any) => {
        this.showMessage(res?.message || 'Employee saved successfully');
        this.router.navigate(['/admin/employees/list'], {
          state: { message: res?.message || 'Employee saved successfully' },
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

    console.log('Save Body', this.formData);
  }

  showMessage(msg: string) {
    this.message = msg;
    this.isMessage = true;

    setTimeout(() => {
      this.isMessage = false;
    }, 3000);
  }

  handleBackBtn() {
    this.router.navigate(['/admin/employees/list']);
  }
}
