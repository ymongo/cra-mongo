import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActivityActions } from './actions';
import { exhaustMap, map, of, tap } from 'rxjs';
import { Activity } from '@models/activity';

@Injectable()
export class ActivityEffects {
    createActivity$
    updateActivity$
    deleteActivity$
    loadActivities$

    constructor(
        private actions$: Actions,
    ) {
        this.createActivity$ = createEffect(() => this.actions$.pipe(
            ofType(ActivityActions.create),
            tap(({ activity }) => {
                const activities = jParseToActivityArray(localStorage.getItem('activities')!)
                localStorage['activities'] = JSON.stringify([...activities || [], activity],stringifyDate)
            })
        ), { dispatch: false });

        this.updateActivity$ = createEffect(() => this.actions$.pipe(
            ofType(ActivityActions.update),
            tap(({ activity }) => {
                const activities = jParseToActivityArray(localStorage.getItem('activities')!)
                .filter(a => a.id !== activity.id)
                localStorage['activities'] = JSON.stringify([...activities || [], activity],stringifyDate)
            })
        ), { dispatch: false });

        this.deleteActivity$ = createEffect(() => this.actions$.pipe(
            ofType(ActivityActions.delete),
            tap(({ activity }) => {
                const activities = jParseToActivityArray(localStorage.getItem('activities')!)
                .filter(a => a.id !== activity.id)
                localStorage['activities'] = JSON.stringify([...activities],stringifyDate)
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
                                        return ActivityActions.getAll({ activities })
                                    } else {
                                        return ActivityActions.getAll({ activities: [] })
                                    }
                                }),
                            )
                    )
                );
            }
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
    return JSON.parse(data, parseDate) as Array<Activity>
}
