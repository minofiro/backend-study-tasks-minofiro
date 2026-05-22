export enum UserRole {
  CHECK_IN = 'CHECK_IN',
  APPRAISER = 'APPRAISER',
  CHECKOUT = 'CHECKOUT',
}

export enum AppraisalState {
  TAKE_IN = 'TAKE_IN',
  READY_FOR_APPRAISAL = 'READY_FOR_APPRAISAL',
  APPRAISAL_CLOSED = 'APPRAISAL_CLOSED',
  APPRAISAL_APPROVED = 'APPRAISAL_APPROVED',
  APPRAISAL_DENIED = 'APPRAISAL_DENIED',
}

export enum AppraisalAction {
  RELEASE_APPRAISAL = 'RELEASE_APPRAISAL',
  CLOSE_APPRAISAL = 'CLOSE_APPRAISAL',
  APPROVE_APPRAISAL = 'APPROVE_APPRAISAL',
  DENY_APPRAISAL = 'DENY_APPRAISAL',
}

export interface AppraisalFormData {
  customerName: string;
  vehicleType: string;
  licensePlate: string;
  damages: {
    windshield: boolean;
    paint: boolean;
    rim: boolean;
    technical: boolean;
  };
}

export interface Permissions {
  actions: {
    [action in AppraisalAction]: boolean;
  };
  fields: {
    customerName: boolean;
    vehicleType: boolean;
    licensePlate: boolean;
    damages: boolean;
    submitButton: boolean;
    rejectButton: boolean;
  };
}

export interface AppraisalData {
  state: AppraisalState;
  formData: AppraisalFormData;
  permissions: Permissions;
}

export interface ActionRequest {
  action: AppraisalAction;
  role: UserRole;
}

export interface UpdateRequest {
  formData: Partial<AppraisalFormData>;
}

export interface GetRequest {
  role: UserRole;
}