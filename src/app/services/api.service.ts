import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, forkJoin, of, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = `${environment.API_URL}/api/app/`;
  private loadingSubject: Subject<boolean> = new Subject<boolean>();

  menu: { role: string[], path: string }[] = [

  ]


  escalationType: string[] = ['Operational', ' Financial', 'Technical'];
  levels: string[] = ['Level1', 'Level2', 'Level3', 'Level4', 'Level5'];
  phaseMilestoneStatus: string[] = [
    'NotStarted',
    'InProgress',
    'Completed',
    'OnHold',
    'Cancelled',
    'Deferred',
    'Delayed',
    'OnTrack',
    'SignOffPending',
    'InvoicePending',
    'PaymentPending',
    'PaymentReceived',
    'PaymentDelayed',
  ];
  projectType: string[] = ['FixedBidget', 'ManMonth']

  riskTypes: string[] = [
    'Financial',
    'Operational',
    'Technical',
    'HumanResource',
    'External',
    'Legal',
    'Reputational',
  ];
  severities: string[] = ['Low', 'Medium', 'High'];
  impacts: string[] = ['Low', 'Medium', 'High'];
  sprintStatuses: string[] = [
    "InProgress",
    "Completed",
    "Delayed",
    "OnTrack",
    "SignOffPending"
  ];
  AuditStatuses: string[] = [
    'InProgress',
    'Completed',
    'Delayed',
    'OnTrack',
    'SignOffPending',
  ]
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
  }


  private showLoader(): void {
    this.loadingSubject.next(true);
  }

  private hideLoader(): void {
    this.loadingSubject.next(false);
  }
  isLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  showSuccessToast(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }


  // Get Role API service 
  postRole(data: any): Observable<any> {
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'user/role?roleName=' + data, {}, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }

  // Get Role API service 
  updateRole(id: any, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'role/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }

  deleteRoles(id: any): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'user/role/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }

  // Register API services

  userProfile(): Observable<any> {
    this.showLoader();
    return this.http
      .get<any>(environment.API_URL + '/api/account/my-profile', {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  // Register API services

  createUser(data: any): Observable<any> {
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'user', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }

  deleteUser(id: any): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'user/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  // Login API services
  exchangeToken(__raw: any): Observable<any> {
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'user/login-with-auth0Token?token=' + __raw, {
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }


  login(data: any): Observable<any> {

    console.log(data);

    this.showLoader();
    return this.http
      .get<any>(this.apiUrl + `user/user-by-username-and-email?username=${data.username}&email=${data.email}`, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }

  // All user API services

  getAllUsers(): Observable<any> {
    this.showLoader();
    return this.http
      .get<any>(this.apiUrl + 'user/users-with-roles', {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getAllUser(): Observable<any> {
    this.showLoader();
    return this.http
      .get<any>(this.apiUrl + 'user/users', {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getAllUserByRole(role: string): Observable<any> {
    this.showLoader();
    return this.http
      .get<any>(this.apiUrl + 'user/users-by-role?roleName=' + role, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getAllRole(): Observable<any> {
    this.showLoader();
    return this.http
      .get<any>(this.apiUrl + "user/roles", {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  // Update API services

  deleteProject(id: string): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'project/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  deleteClientFeedback(id: string): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'client-feedback/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  deleteApprovedTeam(id: string): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'approved-team/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  deleteProjectUpdate(id: string): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'project-update/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  deleteMeetingMinute(id: string): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'meeting-minute/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  deleteResources(id: string): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'resource/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  deleteAuditHistory(id: string): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'audit-history/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  deleteVersionHistory(id: string): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'version-history/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  deleteEscalationMatrix(id: string): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'escalation-matrix/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  deletePhaseMilestone(id: string): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'phase-milestone/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  deleteProjectBudget(id: string): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'project-budget/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  deleteRiskProfile(id: string): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'risk-profile/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  deleteSprint(id: string): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'sprint/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  deleteStakeholder(id: string): Observable<any> {
    this.showLoader();
    return this.http
      .delete<any>(this.apiUrl + 'stakeholder/' + id, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }

  // Update API services

  updateAuditHistory(id: string, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'audit-history/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  updateApprovedTeam(id: string, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'approved-team/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  updateResources(id: string, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'resource/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  updateMeetingMinute(id: string, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'meeting-minute/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  updateProjectUpdate(id: string, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'project-update/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  updateVersionHistory(id: string, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'version-history/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  updateEscalationMatrix(id: string, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'escalation-matrix/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  updatePhaseMilestone(id: string, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'phase-milestone/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  updateProjectBudget(id: string, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'project-budget/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  updateRiskProfile(id: string, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'risk-profile/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  updateSprint(id: string, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'sprint/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  updateStakeholder(id: string, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'stakeholder/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  updateClientFeedback(id: string, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'client-feedback/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  updateProject(id: string, data: any): Observable<any> {
    this.showLoader();
    return this.http
      .put<any>(this.apiUrl + 'project/' + id, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }

  // Update API Services
  updateUserRole(data: any): Observable<any> {
    console.log(data);
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + `user/assign-role`, data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  toggleUserActiveStatus(id: string, status: boolean): Observable<any> {
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + `user/toggle-user-account-status/${id}?isActive=${status}`, {}, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  // Post API Services
  postMeetingMenute(data: any): Observable<any> {
    console.log(data);
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'meeting-minute', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }

  postClientFeedback(data: any): Observable<any> {
    console.log(data);
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'client-feedback', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  postProjectUdpate(data: any): Observable<any> {
    console.log(data);
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'project-update', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  postResources(data: any): Observable<any> {
    console.log(data);
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'resource', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  postApprovedTeam(data: any): Observable<any> {
    console.log(data);
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'approved-team', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  postAuditHistory(data: any): Observable<any> {
    console.log(data);
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'audit-history', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  postVersionHistory(data: any): Observable<any> {
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'version-history', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  postEscalationMatrix(data: any): Observable<any> {
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'escalation-matrix', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  postPhaseMilestone(data: any): Observable<any> {
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'phase-milestone', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  postProjectBudget(data: any): Observable<any> {
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'project-budget', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  postRiskProfile(data: any): Observable<any> {
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'risk-profile', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  postSprint(data: any): Observable<any> {
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'sprint', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  postStakeholder(data: any): Observable<any> {
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'stakeholder', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  postProject(data: any): Observable<any> {
    this.showLoader();
    return this.http
      .post<any>(this.apiUrl + 'project', data, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }

  // Get API Service
  getResources(id: string): Observable<any[]> {
    this.showLoader();
    return this.http
      .get<any[]>(this.apiUrl + 'resource/resources-by-project-id/' + id)
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getProjectUpdate(id: string): Observable<any[]> {
    this.showLoader();
    return this.http
      .get<any[]>(this.apiUrl + 'project-update/project-updates-by-project-id/' + id)
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }

  getMeetingMenute(id: string): Observable<any[]> {
    this.showLoader();
    return this.http
      .get<any[]>(this.apiUrl + 'meeting-minute/meeting-minute-by-project-id/' + id)
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getClientFeedback(id: string): Observable<any[]> {
    this.showLoader();
    return this.http
      .get<any[]>(this.apiUrl + 'client-feedback/client-feedback-by-project-id/' + id)
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getApprovedTeam(id: string): Observable<any[]> {
    this.showLoader();
    return this.http
      .get<any[]>(this.apiUrl + 'approved-team/approved-teams-by-project-id/' + id)
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }

  getProject(): Observable<any> {

    this.showLoader();
    return this.http
      .get<any>(this.apiUrl + 'project')
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getProjectBudgets(id: string): Observable<any[]> {
    this.showLoader();
    return this.http
      .get<any[]>(this.apiUrl + 'project-budget/project-budget-by-project-id/' + id)
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getAllAuditHistory(id: string): Observable<any[]> {
    console.log(this.apiUrl + 'audit-history/audit-histories-by-project-id/' + id);
    console.log(id);
    this.showLoader();
    return this.http
      .get<any[]>(this.apiUrl + 'audit-history/audit-histories-by-project-id/' + id)
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getAllVersionHistory(id: string): Observable<any[]> {
    this.showLoader();
    return this.http
      .get<any[]>(this.apiUrl + 'version-history/version-histories-by-project-id/' + id)
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getAllStakeholder(id: string): Observable<any[]> {
    this.showLoader();
    return this.http
      .get<any[]>(this.apiUrl + 'stakeholder/stakeholders-by-project-id/' + id)
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }

  getAllPhaseMilestone(id: string): Observable<any[]> {
    this.showLoader();
    return this.http
      .get<any[]>(this.apiUrl + 'phase-milestone/phase-milestone-by-project-id/' + id)
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getAllEscalationMatrix(id: string): Observable<any[]> {
    this.showLoader();
    return this.http
      .get<any[]>(this.apiUrl + 'escalation-matrix/escalationmatrices-by-project-id/' + id)
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getAllRiskProfile(id: string): Observable<any[]> {
    this.showLoader();
    return this.http
      .get<any[]>(this.apiUrl + 'risk-profile/risk-profiles-by-project-id/' + id)
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getAllSprint(id: string): Observable<any[]> {
    this.showLoader();
    return this.http
      .get<any[]>(this.apiUrl + 'sprint/sprints-by-project-id/' + id)
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getAllProject(): Observable<any> {
    this.showLoader();
    return this.http
      .get<any>(this.apiUrl + 'project')
      .pipe(finalize(() => {
        this.hideLoader();
      }));
  }
  getAllDataForPdf(id: string): Observable<any> {
    const apiCalls = [
      this.getProjectBudgets(id),
      this.getAllAuditHistory(id),
      this.getAllVersionHistory(id),
      this.getAllStakeholder(id),
      this.getAllPhaseMilestone(id),
      this.getAllEscalationMatrix(id),
      this.getAllRiskProfile(id),
      this.getAllSprint(id),
      this.getApprovedTeam(id),
      this.getClientFeedback(id),
      this.getMeetingMenute(id),
      this.getResources(id),
      this.getProjectUpdate(id),
    ];

    return forkJoin(apiCalls.map(apiCall =>
      apiCall.pipe(
        catchError(error => {
          console.error('Error fetching data:', error);
          return of(null);
        })
      )
    )).pipe(
      map(([projectBudgets, auditHistory, versionHistory, stakeholder, phaseMilestone,
        escalationMatrix, riskProfile, sprint, team, clientFeedback, meetingMinute, resource, projectUpdate]) => {
        return {
          projectBudgets,
          auditHistory,
          versionHistory,
          stakeholder,
          phaseMilestone,
          escalationMatrix,
          riskProfile,
          sprint,
          team, clientFeedback,
          meetingMinute, resource, projectUpdate
        };
      }
      )
    );
  }
}
