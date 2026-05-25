import { AppraisalAction, AppraisalState, UserRole } from './interfaces';

class Transition {
  constructor(
    public state: AppraisalState,
    public action: AppraisalAction,
    public nextState: AppraisalState,
    public allowedRoles: UserRole[]
  ) {}
}

export class StateMachine {
  private transitions: Transition[] = [
    // TAKE_IN -> READY_FOR_APPRAISAL
    new Transition(
      AppraisalState.TAKE_IN, 
      AppraisalAction.RELEASE_APPRAISAL, 
      AppraisalState.READY_FOR_APPRAISAL, 
      [UserRole.CHECK_IN]
    ),
    // READY_FOR_APPRAISAL -> APPRAISAL_CLOSED
    new Transition(
      AppraisalState.READY_FOR_APPRAISAL, 
      AppraisalAction.CLOSE_APPRAISAL, 
      AppraisalState.APPRAISAL_CLOSED, 
      [UserRole.APPRAISER]
    ),
    // APPRAISAL_CLOSED -> APPRAISAL_APPROVED
    new Transition(
      AppraisalState.APPRAISAL_CLOSED, 
      AppraisalAction.APPROVE_APPRAISAL, 
      AppraisalState.APPRAISAL_APPROVED, 
      [UserRole.CHECKOUT]
    ),
    // APPRAISAL_CLOSED -> APPRAISAL_DENIED
    new Transition(
      AppraisalState.APPRAISAL_CLOSED, 
      AppraisalAction.DENY_APPRAISAL, 
      AppraisalState.APPRAISAL_DENIED, 
      [UserRole.CHECKOUT]
    )
  ];

  isActionAllowed(
    currentState: AppraisalState,
    action: AppraisalAction,
    userRoles: UserRole[]
  ): boolean {
    if (!currentState || !action ||
    !userRoles) {
      return false;
    }

    return this.transitions.some(
      (t) =>
        t.state === currentState &&
        t.action === action &&
        // Prüft, ob mindestens eine Rolle des Nutzers in den erlaubten Rollen der Transition enthalten ist
        userRoles.some(role => t.allowedRoles.includes(role)) 
    );
  }

  getNextState(
    currentState: AppraisalState,
    action: AppraisalAction,
    userRoles: UserRole[]
  ): AppraisalState | null {
    const transition = this.transitions.find(
      (t) =>
        t.state === currentState &&
        t.action === action &&
        // Gleiche Prüfung wie oben
        userRoles.some(role => t.allowedRoles.includes(role))
    );
    
    return transition ? transition.nextState : null;
  }
}
