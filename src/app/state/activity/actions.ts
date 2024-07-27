import { Activity } from '@models/activity';
import { User } from '@models/user';
import { createActionGroup, props } from '@ngrx/store';

  export const ActivityActions = createActionGroup({
    source: 'Activity',
    events: {
      'Create': props<{activity: Activity, user: User}>(),
      'Update': props<{activity: Activity}>(),
      'Delete': props<{activity: Activity}>(),
      'GetAll': props<{activities: Array<Activity>, user:User}>(),
    },
  });