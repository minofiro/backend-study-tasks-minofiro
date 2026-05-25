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
  // Verpackt die Rolle in ein Array, da die StateMachine für potenziell mehrere Rollen ausgelegt ist
  const roles = [role];

  // Evaluiert dynamisch, welche Aktion im aktuellen Zustand mit der übergebenen Rolle erlaubt ist
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
      // Logische Ableitung: Felder sind nur dann bearbeitbar, wenn der Nutzer in der jeweiligen Phase das Recht dazu hat.
      customerName: currentState === AppraisalState.TAKE_IN && role === UserRole.CHECK_IN,
      vehicleType: currentState === AppraisalState.TAKE_IN && role === UserRole.CHECK_IN,
      licensePlate: currentState === AppraisalState.TAKE_IN && role === UserRole.CHECK_IN,
      damages: currentState === AppraisalState.READY_FOR_APPRAISAL && role === UserRole.APPRAISER,
      submitButton: canRelease || canClose || canApprove,
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
  // Übergibt den aktuellen Zustand, die Aktion und die Rolle an die State Machine
  const nextState = stateMachine.getNextState(currentState, action, [role]);

  if (nextState) {
    currentState = nextState;
    return {
      success: true,
      message: `Aktion erfolgreich. Neuer Zustand: ${currentState}`,
      data: getAppraisal(role),
    };
  }

  // Fallback, wenn die Aktion für die Rolle oder den Zustand nicht gestattet ist
  return {
    success: false,
    message: 'Aktion abgelehnt: Entweder falsche Rolle oder ungültiger Zustand.',
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