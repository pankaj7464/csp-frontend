import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService, Role } from '../../services/authorization.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
export interface ClientFeedback {
  feedbackDate: Date;
  feedbackType: FeedbackType;
  details: string;
}
enum FeedbackType {
  Suggestion = 'Suggestion',
  Complaint = 'Complaint',
}
@Component({
  selector: 'app-client-feedback',
  templateUrl: './client-feedback.component.html',
  styleUrl: './client-feedback.component.css'
})
export class ClientFeedbackComponent {
  dataSource: ClientFeedback[] = [
   
  ];
  displayedColumns: string[] = ['feedbackDate', 'feedbackType', 'details', 'action'];
  editDataId!: string;
  form!: FormGroup;
  feedbacks: any = ["Bug Found", "Project Deadline"]
  constructor(private apiService: ApiService, private route: ActivatedRoute, private fb: FormBuilder, private authorizationService: AuthorizationService) { }

  token!: string;
  ngOnInit(): void {
    let id = localStorage.getItem('projectId');
    if (id) {
      this.token = id;
    }
    this.getClientData(this.token);
    this.form = this.fb.group({
      feedbackDate: ['', Validators.required],
      feedbackType: ['', Validators.required],
      details: ['', Validators.required],
      projectId: [id || '', Validators.required]
    });
  }
  getClientData(token: string) {
    this.apiService.getClientFeedback(token).subscribe(data => {
      this.dataSource = data;
      console.log(data);
    });
  }

  submitForm() {
    if (this.form.valid) {
      if (!this.editDataId) {

        this.apiService.postClientFeedback(this.form.value).subscribe(data => {
          console.log(data);
          this.getClientData(this.token);
          this.apiService.showSuccessToast("Client Feedback added successfully");
        });
      }
      else {
        this.apiService.updateClientFeedback(this.editDataId, this.form.value).subscribe(data => {
          console.log(data);
          this.getClientData(this.token);
          this.apiService.showSuccessToast("Client Feedback updated successfully");
        });
      }
    } else {
      // Mark all fields as touched to trigger validation messages

    }
  }
  editItem(data: any) {

    this.editDataId = data.id;

    this.form.patchValue(data);
  }
  deleteItem(id: any) {
    this.apiService.deleteClientFeedback(id).subscribe(
      (res) => {
        this.getClientData(this.token)
        this.apiService.showSuccessToast('Deleted Successfully');
      },
      (error) => {
        this.apiService.showSuccessToast('Error deleting ' + id + ': ' + error);
      }
    );
  }
  isManager(): boolean {
    const userRole = this.authorizationService.getCurrentUser()?.role;
    return userRole === Role.Admin || userRole === Role.Manager;
  }
}
