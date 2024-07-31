import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserActions } from './actions';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { Role } from '@models/user';

@Injectable()
export class UserEffects {
    navigateToActivity$
    navigateToLogin$

    constructor(
        private actions$: Actions,
        private router: Router
    ) {
        this.navigateToActivity$ = createEffect(() => this.actions$.pipe(
            ofType(UserActions.login),
            tap(() => {
                this.router.navigate(['activity'])
            })
        ), { dispatch: false });

        this.navigateToLogin$ = createEffect(() => this.actions$.pipe(
            ofType(UserActions.logout),
            tap(() => {
                this.router.navigate(['login'])

            })
        ), { dispatch: false });
    }
}