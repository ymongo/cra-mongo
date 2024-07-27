import { createReducer, on } from '@ngrx/store';
import { User } from '@models/user';
import { ActivityActions, UserActions } from './actions';
import { Activity } from '@models/activity';

export interface ActivityState {
    activities: Array<Activity>
}

const initialState: ActivityState = {} as ActivityState


export const userReducer = createReducer(initialState,
    on(ActivityActions.create, (state, { activity }): ActivityState => {
        if (state.activities.some(k => k.id === activity.id)) {
            return state;
        }
        return { ...state, activities: [...state.activities, activity] }
    }
    ),
    on(ActivityActions.update, (state, { activity }): ActivityState => {
        const id = state.activities.findIndex(a => a.id === activity.id)
        state.activities[id] = activity
        return { ...state, activities: [...state.activities] }
    }
    ),
    on(ActivityActions.delete, (state, { activity }): ActivityState => {
        return { ...state, activities: state.activities.filter(a => a.id !== activity.id) }
    }),
    on(ActivityActions.getAll, (state, {activities, user}) => ({ ...state, ...activities })),
);