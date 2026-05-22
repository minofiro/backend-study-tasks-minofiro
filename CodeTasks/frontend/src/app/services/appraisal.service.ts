import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  AppraisalAction,
  AppraisalData,
  AppraisalFormData,
  UserRole,
} from '../models/appraisal.models';

@Injectable({ providedIn: 'root' })
export class AppraisalService {
  private readonly apiBase = 'http://localhost:3000';

  private _appraisalData = new BehaviorSubject<AppraisalData | null>(null);
  public appraisalData$ = this._appraisalData.asObservable();

  constructor(private http: HttpClient) {}

  loadAppraisal(role: UserRole): Observable<AppraisalData> {
    const params = new HttpParams().set('role', role);
    return this.http
      .get<AppraisalData>(`${this.apiBase}/appraisal`, { params })
      .pipe(tap((data) => this._appraisalData.next(data)));
  }

  performAction(
    action: AppraisalAction,
    role: UserRole
  ): Observable<{ success: boolean; message: string; data?: AppraisalData }> {
    return this.http
      .post<{ success: boolean; message: string; data?: AppraisalData }>(
        `${this.apiBase}/appraisal/action`,
        { action, role }
      )
      .pipe(
        tap((result) => {
          if (result.success && result.data) {
            this._appraisalData.next(result.data);
          }
        })
      );
  }

  updateFormData(
    patch: Partial<AppraisalFormData>
  ): Observable<{ formData: AppraisalFormData }> {
    return this.http.post<{ formData: AppraisalFormData }>(
      `${this.apiBase}/appraisal/update`,
      { formData: patch }
    );
  }

  resetAppraisal(): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.apiBase}/appraisal/reset`, {})
      .pipe(tap(() => this._appraisalData.next(null)));
  }
}
