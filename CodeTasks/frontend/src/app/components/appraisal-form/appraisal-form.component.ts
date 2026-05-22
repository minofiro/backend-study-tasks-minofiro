import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AppraisalAction,
  AppraisalData,
  AppraisalFormData,
  UserRole,
} from '../../models/appraisal.models';
import { AppraisalService } from '../../services/appraisal.service';

@Component({
  selector: 'app-appraisal-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appraisal-form.component.html',
  styleUrl: './appraisal-form.component.css',
})
export class AppraisalFormComponent {
  @Input() data!: AppraisalData;
  @Input() selectedRole!: UserRole;
  @Output() actionTriggered = new EventEmitter<AppraisalAction>();
  @Output() formChanged = new EventEmitter<Partial<AppraisalFormData>>();
  @Output() resetTriggered = new EventEmitter<void>();

  constructor(private appraisalService: AppraisalService) {}

  triggerAction(action: string): void {
    this.actionTriggered.emit(action as AppraisalAction);
  }

  onFieldBlur(field: 'customerName' | 'vehicleType' | 'licensePlate', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.formChanged.emit({ [field]: value });
  }

  onDamageChange(
    damage: keyof AppraisalFormData['damages'],
    event: Event
  ): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.formChanged.emit({ damages: { ...this.data.formData.damages, [damage]: checked } });
  }

  onSubmit(): void {
    console.log('Absenden geklickt', this.data.formData);
    this.actionTriggered.emit(AppraisalAction.APPROVE_APPRAISAL);
  }

  onReject(): void {
    console.log('Ablehnen geklickt', this.data.formData);
    this.actionTriggered.emit(AppraisalAction.DENY_APPRAISAL);
  }

  onReset(): void {
    this.appraisalService.resetAppraisal().subscribe({
      next: () => this.resetTriggered.emit(),
      error: () => console.error('Fehler beim Reset.'),
    });
  }
}
