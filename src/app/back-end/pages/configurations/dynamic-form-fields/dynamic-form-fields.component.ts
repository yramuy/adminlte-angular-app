import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

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
    public loader: LoaderService,
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
    this.loader.show();
    this.apiService.request('GET', '/allDynamicFormFields').subscribe({
      next: (res: any) => {
        this.formFields = res.formFields || [];
        this.loader.hide();
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
        this.loader.hide();
      },
    });
  }

  initializeDataTable() {
    $('#formFieldsTable').DataTable();
  }

  addFieldBtn() {
    this.router.navigate(['/admin/form-fields/add']);
  }

  handleEdit(id: string) {
    // alert(id);
    this.router.navigate(['/admin/form-fields/add', id]);
  }

  confirmDelete(id: string) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.deleteField(id);
    }
  }

  deleteField(id: string) {
    console.log('Delete ', id);
    this.apiService.request('DELETE', `/deleteformFieldById/${id}`).subscribe({
      next: (res: any) => {
        console.log(res.message);
        this.showMessage(res.message);
        this.loadDynamicFormFields(); // refresh list
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  showMessage(msg: string) {
    this.message = msg;
    this.isMessage = true;

    setTimeout(() => {
      this.isMessage = false;
    }, 3000);
  }
}
