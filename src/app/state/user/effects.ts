import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserActions } from './actions';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { Role } from '@models/user';

@Injectable()
export class UserEffects {
    navigateToRoot$

    constructor(
        private actions$: Actions,
        private router: Router
    ) {
        this.navigateToRoot$ = createEffect(() => this.actions$.pipe(
            ofType(UserActions.login),
            tap(({user}) => {
                if (user.role==Role.AGENT) {
                    this.router.navigate(['activity'])
                } else {
                    this.router.navigate(['activity'])
                }
            })
        ), { dispatch: false });
    }
}