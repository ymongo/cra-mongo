// In your test file `activity.effects.spec.ts`
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ActivityEffects } from './effects';
import { ActivityActions } from './actions';
import { Observable, of } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { Action } from '@ngrx/store';
import { Activity, ActivityType } from '@models/activity';
import { Role } from '@models/user';
import { mockUserData } from '@shared/tests-utils';

const mockUser = { id: 'agent_XXX', label: 'Agent XXX' , role: Role.AGENT}
const mockActivity: Activity = { 
    id: '1', 
    label: 'Test Activity', 
    dateStart: new Date(), 
    dateEnd: new Date(),
    activityType:ActivityType.MISSION1,
    user: mockUser
    
};
describe('ActivityEffects', () => {
    let actions$: Observable<Action>;
    let effects: ActivityEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ActivityEffects,
                provideMockActions(() => actions$),
                provideMockStore({})
            ]
        });

        effects = TestBed.inject(ActivityEffects);

        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
            },
            writable: true
        });

    });
    // x test to be reviewed for localStorage issue
    xdescribe('createActivity$', () => {
        it('should store activity in localStorage', marbles((m) => {
            const activity: Activity = mockActivity;
            (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify([]));

            const action$ = m.hot('-a-', { a: ActivityActions.create({ activity, user:mockUser }) });
            actions$ = action$;

            effects.createActivity$.subscribe();

            m.flush(); 

            expect(localStorage.setItem).toHaveBeenCalledWith(
                'activities',
                JSON.stringify([activity], expect.any(Function))
            );
        }));
    });

    xdescribe('updateActivity$', () => {
        it('should update activity in localStorage', marbles((m) => {
            const activity: Activity = {...mockActivity, label: "Updated"};
            const initialActivities: Activity[] = [{ ...mockActivity, label : 'Test Activity'}];

            (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(initialActivities));

            const action$ = m.hot('-b-', { b: ActivityActions.update({ activity, user:mockUser  }) });
            actions$ = action$;

            effects.updateActivity$.subscribe();

            m.flush(); 
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'activities',
                JSON.stringify([activity], expect.any(Function))
            );
        }));
    });

    xdescribe('deleteActivity$', () => {
        it('should remove activity from localStorage', marbles((m) => {
            const activity: Activity = mockActivity;
            const initialActivities: Activity[] = [activity];

            (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(initialActivities));

            const action$ = m.hot('-c-', { c: ActivityActions.delete({ activity, user:mockUser  }) });
            actions$ = action$;

            effects.deleteActivity$.subscribe();

            m.flush();

            expect(localStorage.setItem).toHaveBeenCalledWith(
                'activities',
                JSON.stringify([], expect.any(Function))
            );
        }));
    });

    describe('loadActivities$', () => {
        it('should load activities from localStorage', marbles((m) => {
            const initialActivities: Activity[] = [mockActivity];

            (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(initialActivities));

            const action$ = m.hot('-d-', { d: ActivityActions.load() });
            const expected = m.cold('-e-', { e: ActivityActions.getAll({ activities: initialActivities }) });

            actions$ = action$;

            m.expect(effects.loadActivities$).toBeObservable(expected);
        }));
    });
});
