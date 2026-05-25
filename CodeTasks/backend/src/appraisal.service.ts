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
  const roles = [role];

  // Evaluiert exakt, ob die Aktion im aktuellen Zustand mit dieser Rolle erlaubt ist
  const canRelease = stateMachine.isActionAllowed(currentState, AppraisalAction.RELEASE_APPRAISAL, roles);
  const canClose = stateMachine.isActionAllowed(currentState, AppraisalAction.CLOSE_APPRAISAL, roles);
  const canApprove = stateMachine.isActionAllowed(currentState, AppraisalAction.APPROVE_APPRAISAL, roles);
  const canDeny = stateMachine.isActionAllowed(currentState, AppraisalAction.DENY_APPRAISAL, roles);

  return {
    actions: {
      [AppraisalAction.RELEASE_APPRAISAL]: canRelease,
      [AppraisalAction.CLOSE_APPRAISAL]: canClose,
      [AppraisalAction.APPROVE_APPRAISAL]: canApprove,
      [AppraisalAction.DENY_APPRAISAL]: canDeny,
    },
    fields: {
      // KORREKTUR: Felder sind nur editierbar, wenn der State stimmt UND die aktuelle Rolle die Rechte für die nächste Aktion hat.
      customerName: currentState === AppraisalState.TAKE_IN && canRelease,
      vehicleType: currentState === AppraisalState.TAKE_IN && canRelease,
      licensePlate: currentState === AppraisalState.TAKE_IN && canRelease,
      damages: currentState === AppraisalState.READY_FOR_APPRAISAL && canClose,
      
      submitButton: canApprove,
      rejectButton: canDeny,
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
  const nextState = stateMachine.getNextState(currentState, action, [role]);

  if (nextState !== null && nextState !== undefined) {
    currentState = nextState;
    return {
      success: true,
      message: `Aktion erfolgreich. Neuer Zustand: ${currentState}`,
      data: getAppraisal(role),
    };
  }

  return {
    success: false,
    message: `Aktion abgelehnt. Aktueller Zustand (${currentState}) oder Rolle (${role}) nicht berechtigt für Aktion (${action}).`,
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