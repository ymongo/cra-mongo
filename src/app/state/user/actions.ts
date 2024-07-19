import { User } from '@models/user';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

  export const UserActions = createActionGroup({
    source: 'User',
    events: {
      'Login': props<{user: User}>(),
      'Login Success': emptyProps,
      'Login Failure': props<{ error: string }>(),
      'Logout': emptyProps(),
      'Logout Success': emptyProps(),
      'Logout Failure': props<{ error: string }>(),
    },
  });