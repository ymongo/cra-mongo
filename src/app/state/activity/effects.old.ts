import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, ReplaySubject } from 'rxjs';
import { ActivityEffects } from './effects';
import { ActivityActions } from './actions';
import { Activity, ActivityType } from '@models/activity';
import { Actions } from '@ngrx/effects';
import { Role } from '@models/user';

// Mock Data
const mockUser = { id: 'agent_XXX', label: 'Agent XXX' , role: Role.AGENT}
const mockActivity: Activity = { 
    id: '1', 
    label: 'Test Activity', 
    dateStart: new Date(), 
    dateEnd: new Date(),
    activityType:ActivityType.MISSION1,
    user: mockUser
};
const mockActivities: Activity[] = [mockActivity];

describe('ActivityEffects', () => {
    let actions$: Observable<any>;
    let effects: ActivityEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ActivityEffects,
                provideMockActions(() => actions$),
            ],
        });

        effects = TestBed.inject(ActivityEffects);
    });

    function getMockLocalStorage() {
        let store: { [key: string]: string } = {}; // Define store with string keys
        return {
            getItem: (key: string): string | null => (key in store ? store[key] : null),
            setItem: (key: string, value: string) => (store[key] = `${value}`),
            removeItem: (key: string) => delete store[key],
            clear: () => (store = {}),
        };
    }

    beforeEach(() => {
        global.localStorage = getMockLocalStorage() as any;
    });

    describe('createActivity$', () => {
        it('should handle create activity action and save activity to localStorage', (done) => {
            const action = ActivityActions.create({ activity: mockActivity , user: mockUser});
            const actionsSubject = new ReplaySubject(1);
            actionsSubject.next(action);
            actions$ = actionsSubject.asObservable();

            effects.createActivity$.subscribe(() => {
                const activities = JSON.parse(localStorage.getItem('activities')!);
                expect(activities).toContainEqual(mockActivity);
                done();
            });
        });
    });

    describe('updateActivity$', () => {
        it('should handle update activity action and update activity in localStorage', (done) => {
            const initialActivities = [mockActivity];
            localStorage.setItem('activities', JSON.stringify(initialActivities));

            const updatedActivity: Activity = { ...mockActivity, label: 'Updated Activity' };
            const action = ActivityActions.update({ activity: updatedActivity , user: mockUser});
            const actionsSubject = new ReplaySubject(1);
            actionsSubject.next(action);
            actions$ = actionsSubject.asObservable();

            effects.updateActivity$.subscribe(() => {
                const activities = JSON.parse(localStorage.getItem('activities')!);
                expect(activities).toContainEqual(updatedActivity);
                expect(activities).not.toContainEqual(mockActivity);
                done();
            });
        });
    });

    describe('deleteActivity$', () => {
        it('should handle delete activity action and remove activity from localStorage', (done) => {
            const initialActivities = [mockActivity];
            localStorage.setItem('activities', JSON.stringify(initialActivities));

            const action = ActivityActions.delete({ activity: mockActivity, user: mockUser });
            const actionsSubject = new ReplaySubject(1);
            actionsSubject.next(action);
            actions$ = actionsSubject.asObservable();

            effects.deleteActivity$.subscribe(() => {
                const activities = JSON.parse(localStorage.getItem('activities')!);
                expect(activities).not.toContainEqual(mockActivity);
                done();
            });
        });
    });

    describe('loadActivities$', () => {
        it('should handle load action and retrieve activities from localStorage', (done) => {
            const initialActivities = [mockActivity];
            localStorage.setItem('activities', JSON.stringify(initialActivities));

            const action = ActivityActions.load();
            const actionsSubject = new ReplaySubject(1);
            actionsSubject.next(action);
            actions$ = actionsSubject.asObservable();

            effects.loadActivities$.subscribe((result) => {
                expect(result).toEqual(ActivityActions.getAll({ activities: initialActivities }));
                done();
            });
        });

        it('should handle load action and return an empty array if no activities in localStorage', (done) => {
            const action = ActivityActions.load();
            const actionsSubject = new ReplaySubject(1);
            actionsSubject.next(action);
            actions$ = actionsSubject.asObservable();

            effects.loadActivities$.subscribe((result) => {
                expect(result).toEqual(ActivityActions.getAll({ activities: [] }));
                done();
            });
        });
    });
});
