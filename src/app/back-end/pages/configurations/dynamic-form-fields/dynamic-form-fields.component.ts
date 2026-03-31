import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dynamic-form-fields',
  templateUrl: './dynamic-form-fields.component.html',
  styleUrls: ['./dynamic-form-fields.component.scss'],
})
export class DynamicFormFieldsComponent {
  formFields: any[] = [];
  isMessage: boolean = false;
  message: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const state = history.state;

    if (state.message) {
      this.message = state.message;
      this.isMessage = true;

      // Clear History
      history.replaceState({}, '');

      setTimeout(() => {
        this.isMessage = false;
      }, 3000);
    }
    
    this.loadDynamicFormFields();
  }

  loadDynamicFormFields() {
    this.apiService.request('GET', '/allDynamicFormFields').subscribe({
      next: (res: any) => {
        this.formFields = res.formFields || [];
        setTimeout(() => {
          this.initializeDataTable();
        }, 0);
        console.log('Form Field', this.formFields);
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

  initializeDataTable() {
    if ($.fn.DataTable.isDataTable('#formFieldsTable')) {
      $('#formFieldsTable').DataTable().destroy();
    }

    $('#formFieldsTable').DataTable({
      dom: 'Bfrtip',
      buttons: ['excelHtml5', 'pdfHtml5'],
    });
  }

  addFieldBtn() {
    this.router.navigate(['/admin/form-fields/add']);
  }

  showMessage(msg: string) {
    this.message = msg;
    this.isMessage = true;

    setTimeout(() => {
      this.isMessage = false;
    }, 3000);
  }
}
