import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActivityActions } from './actions';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { Role } from '@models/user';

@Injectable()
export class ActivityEffects {
    createActivity$
    updateActivity$
    deleteActivity$
    getAllActivities$

    constructor(
        private actions$: Actions,
        private router: Router
    ) {
        this.createActivity$ = createEffect(() => this.actions$.pipe(
            ofType(ActivityActions.create),
            tap(({activity}) => {
                console.log(activity)
            })
        ), { dispatch: false });

        this.updateActivity$ = createEffect(() => this.actions$.pipe(
            ofType(ActivityActions.update),
            tap(({activity}) => {
                console.log(activity)
            })
        ), { dispatch: false });

        this.deleteActivity$ = createEffect(() => this.actions$.pipe(
            ofType(ActivityActions.delete),
            tap(({activity}) => {
                console.log(activity)
            })
        ), { dispatch: false });

        this.getAllActivities$ = createEffect(() => this.actions$.pipe(
            ofType(ActivityActions.getAll),
            tap(({user}) => {
                console.log(user)
            })
        ), { dispatch: false });
    }
}