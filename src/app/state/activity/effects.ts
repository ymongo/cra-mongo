import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActivityActions } from './actions';
import { Router } from '@angular/router';
import { exhaustMap, map, of, tap } from 'rxjs';
import { Role } from '@models/user';
import { Activity } from '@models/activity';

@Injectable()
export class ActivityEffects {
    createActivity$
    updateActivity$
    deleteActivity$
    loadActivities$

    constructor(
        private actions$: Actions,
        private router: Router
    ) {
        this.createActivity$ = createEffect(() => this.actions$.pipe(
            ofType(ActivityActions.create),
            tap(({ activity }) => {
                console.log("coucou storageee", activity)
                const activities = jParseToActivityArray(localStorage.getItem('activities')!)
                console.log("before stringify", activities, activity)
                localStorage['activities'] = JSON.stringify([...activities || [], activity],stringifyDate)
            })
        ), { dispatch: false });

        this.updateActivity$ = createEffect(() => this.actions$.pipe(
            ofType(ActivityActions.update),
            tap(({ activity }) => {
                const activities = jParseToActivityArray(localStorage.getItem('activities')!)
                .filter(a => a.id !== activity.id)
                localStorage['activities'] = JSON.stringify([...activities || [], activity],stringifyDate)
                console.log("update", activity)
            })
        ), { dispatch: false });

        this.deleteActivity$ = createEffect(() => this.actions$.pipe(
            ofType(ActivityActions.delete),
            tap(({ activity }) => {
                const activities = jParseToActivityArray(localStorage.getItem('activities')!)
                .filter(a => a.id !== activity.id)
                localStorage['activities'] = JSON.stringify([...activities],stringifyDate)
                console.log("delete", activity)
            })
        ), { dispatch: false });

        this.loadActivities$ = createEffect(
            (actions$ = inject(Actions)) => {
                return actions$.pipe(
                    ofType(ActivityActions.load),
                    exhaustMap(() =>
                        of(jParseToActivityArray(localStorage.getItem('activities')!))
                            .pipe(
                                map((activities) => {
                                    if (activities !== null) {
                                        console.log("all activities", activities)
                                        return ActivityActions.getAll({ activities })
                                    } else {
                                        return ActivityActions.getAll({ activities: [] })
                                    }
                                }),
                            )
                    )
                );
            },
            { functional: true }
        );
    }
}

function parseDate(key: string, value: string): any {
    if (key.indexOf('date') > -1) {
        return new Date(value)
    }
    return value
}

function stringifyDate(key: any, value: any): any {
    if (key.indexOf('date') > -1) {
       return new Date(value).toDateString()
    }
    
    return value;
 }

function jParseToActivityArray(data: string) {
    console.log("data to parse", data)
    return JSON.parse(data, parseDate) as Array<Activity>
}
