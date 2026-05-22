import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentInfo } from '../models/appraisal.models';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly apiBase = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  listDocuments(fin: string): Observable<DocumentInfo[]> {
    const params = new HttpParams().set('fin', fin);
    return this.http.get<DocumentInfo[]>(`${this.apiBase}/documents`, { params });
  }

  downloadAppraisalReport(fin: string): void {
    const params = new HttpParams().set('fin', fin);
    this.http
      .get(`${this.apiBase}/documents/download`, {
        params,
        responseType: 'blob',
        observe: 'response',
      })
      .subscribe({
        next: (response) => {
          const blob = response.body!;
          const disposition = response.headers.get('Content-Disposition') ?? '';
          const match = disposition.match(/filename="?([^"]+)"?/);
          const filename = match ? match[1] : `Bewertungsprotokoll_${fin}.pdf`;

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        },
        error: () =>
          alert('Kein Bewertungsprotokoll für diese FIN gefunden.'),
      });
  }
}
