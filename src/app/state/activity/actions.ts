import { Activity } from '@models/activity';
import { User } from '@models/user';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

  export const ActivityActions = createActionGroup({
    source: 'Activity',
    events: {
      'Create': props<{activity: Activity, user: User}>(),
      'Update': props<{activity: Activity, user: User}>(),
      'Delete': props<{activity: Activity, user: User}>(),
      'Load': emptyProps(),
      'GetAll':props<{activities: Array<Activity>}>(),
    },
  });