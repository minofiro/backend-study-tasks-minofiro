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
    // TODO Story 1: Implement state transitions
  ];

  isActionAllowed(
    currentState: AppraisalState,
    action: AppraisalAction,
    userRoles: UserRole[]
  ): boolean {
    // TODO Story 1: Implement logic to check if action is allowed
    return false;
  }

  getNextState(
    currentState: AppraisalState,
    action: AppraisalAction,
    userRoles: UserRole[]
  ): AppraisalState | null {
    // TODO Story 1: Implement logic to return next state
    return null;
  }
}