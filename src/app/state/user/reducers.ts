import { createReducer, on } from '@ngrx/store';
import { User } from '@models/user';
import { UserActions } from './actions';

export interface UserState {
    user: User | null
}

const initialState: UserState = {
    user : null
}

export const userReducer = createReducer(initialState,
    on(UserActions.login, (state, action) =>({...state,...action.user})),
    on(UserActions.loginSuccess, (state) => ({ ...state })),
    on(UserActions.loginFailure, (state, { error }) => ({ ...state, error })),
    on(UserActions.logoutSuccess, (state) => ({ ...state })),
    on(UserActions.logoutFailure, (state, { error }) => ({ ...state, error })),
);