import { User } from '@models/user';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '@state/user/reducers';
import { ActivityState } from './activity/reducers';
import { Activity } from '@models/activity';


export const selectUserState = createFeatureSelector<UserState>('user');
export const selectActivityState = createFeatureSelector<ActivityState>('activity');

export const selectUserFeature = createSelector(
  selectUserState,
  (state: UserState) =>  state.user
);

export const selectUserActivityFeature = createSelector(
  selectUserState,
  selectActivityState,
  (userState: UserState, activityState: ActivityState) => {
    if (userState.user && activityState.activities?.length) {
      return activityState.activities.filter((a: Activity) => a.user.id === userState.user.id)|| [];
    } else {
      return []
    }
  }
);

export const selectManagerActivityFeature = createSelector(
  selectActivityState,
  (activityState: ActivityState) => {
   return activityState.activities
  }
);