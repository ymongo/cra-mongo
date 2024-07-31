import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageActivityComponent } from './manage-activity.component';
import { Store } from '@ngrx/store';
import { mockUserData } from '@shared/tests-utils';
import { ActivityActions } from '@state/activity/actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Notifications } from '@mobiscroll/angular';
import { of } from 'rxjs';
import { selectUserActivityFeature } from '@state/selectors';
import { ActivityType } from '@models/activity';

const mockActivities = [{ id: 'test_id1' }, { id: 'test_id2' }];
const mockEvents = [
  { title: 'Event 1', start: new Date(), end: new Date(), allDay: true },
  { title: 'Event 2', start: new Date(), end: new Date(), allDay: true }
];

describe('ManageActivityComponent', () => {
  let component: ManageActivityComponent;
  let fixture: ComponentFixture<ManageActivityComponent>;
  let store: any;
  let storeMock: any 
  let notify: any

  beforeEach(async () => {
    store = {
      dispatch: jest.fn(),
      select: jest.fn()
    };

    const notifyMock = {
      toast: jest.fn()
    };

    storeMock = {
      select: jest.fn().mockImplementation(selector => {
        if (selector === selectUserActivityFeature) {
          return of([
            {
              id: 'test_id1',
              label: "Test Label 1",
              activityType: ActivityType.DAY_OFF,
              dateStart: new Date,
              dateEnd: new Date,
            },
            {
              id: 'test_id2',
              label: "Test Label 2",
              activityType: ActivityType.DAY_OFF,
              dateStart: new Date,
              dateEnd: new Date,
            }
          ]);
        }

        return of();
      }),
      dispatch: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [ManageActivityComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: Notifications, useValue: notifyMock }

      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageActivityComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as jest.Mocked<Store>;
    notify = TestBed.inject(Notifications) as jest.Mocked<Notifications>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly initialize on ngOnInit', () => {
    // Given
    const spyStore = jest.spyOn((component as any).store, 'dispatch')

    // When
    component.ngOnInit();

    // Then
    component.events$.subscribe(events => {
      expect(events.length).toBe(mockActivities.length);
      events.forEach((event, index) => {
        expect(event).toEqual(mockEvents[0]);
        expect(component.setColorevent).toHaveBeenCalledWith(mockEvents[0]);
      });
    });

    expect(component.user).toBe(mockUserData);
    expect(spyStore).toHaveBeenCalledWith(ActivityActions.load());
  });

  xit('should toast days off conflicts when 3 days off on same date', () => {
    // Given
    const spyToast = jest.spyOn((component as any).notify, 'toast')
  
    // When
    component.ngOnInit();

    // Then
    expect(spyToast).toHaveBeenCalled();
  });


});
