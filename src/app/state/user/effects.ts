import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserActions } from './actions';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable()
export class UserEffects {
    navigateToRoot$

    constructor(
        private actions$: Actions,
        private router: Router
    ) {
        this.navigateToRoot$ = createEffect(() => this.actions$.pipe(
            ofType(UserActions.login),
            tap(() => this.router.navigate(['activity']))
        ), { dispatch: false });
    }
}