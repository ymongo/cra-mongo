import { createReducer, on } from '@ngrx/store';
import { User } from '@models/user';
import { UserActions } from './actions';

export interface UserState {
    user: User
}

const initialState: UserState = {} as UserState


export const userReducer = createReducer(initialState,
    on(UserActions.login, (state, {user}): UserState => {
        state = {...state,user:user}
        return  state
    }
    ),
    on(UserActions.logout, () => ({ ...initialState })),
);