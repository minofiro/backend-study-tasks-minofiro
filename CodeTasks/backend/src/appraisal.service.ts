import {
  AppraisalAction,
  AppraisalData,
  AppraisalFormData,
  AppraisalState,
  Permissions,
  UserRole,
} from './interfaces';
import { StateMachine } from './state-machine';

const stateMachine = new StateMachine();

let currentState: AppraisalState = AppraisalState.TAKE_IN;
let formData: AppraisalFormData = {
  customerName: '',
  vehicleType: '',
  licensePlate: '',
  damages: {
    windshield: false,
    paint: false,
    rim: false,
    technical: false,
  },
};

function buildPermissions(role: UserRole): Permissions {
  // TODO Story 1: Implement permission logic according to the current state and role
  return {
    actions: {
      [AppraisalAction.RELEASE_APPRAISAL]: false,
      [AppraisalAction.CLOSE_APPRAISAL]: false,
      [AppraisalAction.APPROVE_APPRAISAL]: false,
      [AppraisalAction.DENY_APPRAISAL]: false,
    },
    fields: {
      customerName: false,
      vehicleType: false,
      licensePlate: false,
      damages: false,
      submitButton: false,
      rejectButton: false,
    },
  };
}

export function getAppraisal(role: UserRole): AppraisalData {
  return {
    state: currentState,
    formData,
    permissions: buildPermissions(role),
  };
}

export function performAction(
  action: AppraisalAction,
  role: UserRole
): { success: boolean; message: string; data?: AppraisalData } {
  // TODO Story 1: Implement state transition execution
  return {
    success: false,
    message: 'Not implemented',
  };
}

export function updateFormData(
  patch: Partial<AppraisalFormData>
): AppraisalFormData {
  formData = {
    ...formData,
    ...patch,
    damages: {
      ...formData.damages,
      ...(patch.damages ?? {}),
    },
  };
  return formData;
}

export function resetAppraisal(): void {
  currentState = AppraisalState.TAKE_IN;
  formData = {
    customerName: '',
    vehicleType: '',
    licensePlate: '',
    damages: {
      windshield: false,
      paint: false,
      rim: false,
      technical: false,
    },
  };
}