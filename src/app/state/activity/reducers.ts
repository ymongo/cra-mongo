import { Activity } from '@models/activity';
import { createReducer, on } from '@ngrx/store';
import { ActivityActions } from './actions';

export interface ActivityState {
    activities: Array<Activity>
}

const initialState: ActivityState = {
    activities : []
}


export const activityReducer = createReducer(initialState,
    on(ActivityActions.create, (state, { activity }): ActivityState => {
        if (state.activities?.some(k => k.id === activity.id)) {
            return state;
        }
        return { ...state, activities: [...state.activities, activity] }
    }
    ),
    on(ActivityActions.update, (state, { activity }): ActivityState => {
        const notUpdatedActivities= state.activities.filter(a => a.id !== activity.id)
        return { ...state, activities: [...notUpdatedActivities, activity] }
    }
    ),
    on(ActivityActions.delete, (state, { activity }): ActivityState => {
        return { ...state, activities: state.activities.filter(a => a.id !== activity.id) }
    }),
    on(ActivityActions.getAll, (state, {activities}) => ({ ...state, activities:activities})),
);