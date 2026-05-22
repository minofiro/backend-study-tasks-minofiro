import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppraisalService } from './services/appraisal.service';
import { DocumentService } from './services/document.service';
import {
  AppraisalAction,
  AppraisalData,
  AppraisalFormData,
  DocumentInfo,
  UserRole,
} from './models/appraisal.models';
import { AppraisalFormComponent } from './components/appraisal-form/appraisal-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, AppraisalFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  activeTab: 'aufgabe1' | 'aufgabe2' = 'aufgabe1';

  // ── Aufgabe 1 ──────────────────────────────────────────────────────────────
  roles = Object.values(UserRole);
  selectedRole: UserRole = UserRole.CHECK_IN;
  appraisalData: AppraisalData | null = null;

  // ── Aufgabe 2 ──────────────────────────────────────────────────────────────
  fin: string = '';
  documents: DocumentInfo[] = [];
  documentsLoaded = false;

  constructor(
    private appraisalService: AppraisalService,
    private documentService: DocumentService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onRoleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as UserRole;
    this.selectedRole = value;
    this.loadData();
  }

  onAction(action: AppraisalAction): void {
    this.appraisalService.performAction(action, this.selectedRole).subscribe({
      next: (result) => {
        if (!result.success) {
          alert(result.message);
        }
        this.loadData();
      },
      error: () => alert('Fehler beim Ausführen der Aktion.'),
    });
  }

  onFormChange(patch: Partial<AppraisalFormData>): void {
    this.appraisalService.updateFormData(patch).subscribe({
      next: () => this.loadData(),
    });
  }

  onReset(): void {
    this.loadData();
  }

  private loadData(): void {
    this.appraisalService.loadAppraisal(this.selectedRole).subscribe({
      next: (data) => (this.appraisalData = data),
      error: () => console.error('Fehler beim Laden der Daten.'),
    });
  }

  // ── Aufgabe 2 ──────────────────────────────────────────────────────────────
  onLoadDocuments(): void {
    if (!this.fin.trim()) {
      alert('Bitte eine FIN eingeben.');
      return;
    }
    this.documentService.listDocuments(this.fin.trim()).subscribe({
      next: (docs) => {
        this.documents = docs;
        this.documentsLoaded = true;
      },
      error: () => alert('Fehler beim Laden der Dokumente.'),
    });
  }

  onDownloadReport(): void {
    if (!this.fin.trim()) {
      alert('Bitte eine FIN eingeben.');
      return;
    }
    this.documentService.downloadAppraisalReport(this.fin.trim());
  }
}
