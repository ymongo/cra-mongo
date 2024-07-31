import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityComponent } from './activity.component';
import { Store } from '@ngrx/store';
import { Notifications } from '@mobiscroll/angular';
import { of } from 'rxjs';
import { selectUserActivityFeature, selectUserFeature } from '@state/selectors';
import { ActivityActions } from '@state/activity/actions';
import { mapActivityToEvent } from '@shared/activity-utils';
import { ActivityType } from '@models/activity';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ActivityComponent', () => {
  let component: ActivityComponent;
  let fixture: ComponentFixture<ActivityComponent>;
  let store: jest.Mocked<Store>;
  let notify: jest.Mocked<Notifications>;
  let mockUserActivityData: any[];
  let mockUserData: any;
  let editEventPopup: any;
  let mockEvent: any
  let spyPopupClose: any

  beforeEach(async () => {
    mockUserActivityData = [{
      id: 'test_id1',
      label: "Test Label 1",
      activityType: ActivityType.MISSION1,
      dateStart: new Date,
      dateEnd: new Date,
    }];
    mockUserData = { id: 'agent_XXX', label: 'Agent XXX' };
    mockEvent = { title: 'Mock Event', start: new Date(), end: new Date(), allDay: true, id: "test_id1"  };

    const storeMock = {
      select: jest.fn().mockImplementation(selector => {
        if (selector === selectUserActivityFeature) {
          return of(mockUserActivityData);
        }
        if (selector === selectUserFeature) {
          return of(mockUserData);
        }
        return of();
      }),
      dispatch: jest.fn().mockReturnValue(of({}))
    };

    const notifyMock = {
      toast: jest.fn()
    };

    editEventPopup = {
      close: jest.fn(),
    };


    await TestBed.configureTestingModule({
      imports: [ActivityComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: Notifications, useValue: notifyMock }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ActivityComponent);
    component = fixture.componentInstance;
    component.tempEvent = { ...mockEvent };
    component.popupEventDates = [new Date(), new Date()];
    component.editEventPopup = editEventPopup;
    store = TestBed.inject(Store) as jest.Mocked<Store>;
    notify = TestBed.inject(Notifications) as jest.Mocked<Notifications>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load data correctly', () => {
    // Given
    const getDayOffCountSpy = jest.spyOn(component, 'getDayOffCount');
    jest.mock('@shared/activity-utils', () => ({
      mapActivityToEvent: jest.fn()
    }));

    // When
    fixture.detectChanges();

    // Then
    expect(store.select).toHaveBeenCalledWith(selectUserActivityFeature);
    expect(store.select).toHaveBeenCalledWith(selectUserFeature);
    expect(store.dispatch).toHaveBeenCalledWith(ActivityActions.load());

    component.myEvents$.subscribe(events => {
      expect(getDayOffCountSpy).toHaveBeenCalledWith(mockUserActivityData);
      expect(events).toEqual(mockUserActivityData.map(a => mapActivityToEvent(a)));
    });

    expect(component.user).toEqual(mockUserData);
  });


  it('should save a new event', () => {
    // Given
    component.isEdit = false;
    component.popupActivity = 0
    const spyActionCreate = jest.spyOn(ActivityActions, 'create')
    spyPopupClose = jest.spyOn((component as any).editEventPopup as any, 'close')

    // When
    fixture.detectChanges();
    component.saveEvent();

    // Then
    expect(component.tempEvent.title).toBe('Mission 1');
    expect(component.tempEvent.allDay).toBe(true);
    expect(spyActionCreate).toHaveBeenCalled()
    expect(component.calendarSelectedDate).toBe(component.popupEventDates[0]);
    expect(spyPopupClose).toHaveBeenCalled();
  });

  it('should update an existing event', () => {
    // Given
    component.isEdit = true;
    component.popupActivity = 0
    const spyActionUpdate= jest.spyOn(ActivityActions, 'update')
    spyPopupClose = jest.spyOn((component as any).editEventPopup as any, 'close')

    // When
    fixture.detectChanges();
    component.saveEvent();

    expect(component.tempEvent.title).toBe('Mission 1');
    expect(component.tempEvent.allDay).toBe(true);
    expect(spyActionUpdate).toHaveBeenCalled()
    expect(component.calendarSelectedDate).toBe(component.popupEventDates[0]);
    expect(spyPopupClose).toHaveBeenCalled();

  })

  it('should show a toast notification if days off are exhausted', () => {
    // Given
    jest.spyOn(component, 'hasRemainingDaysOff').mockReturnValue(false);
    const spyNotify = jest.spyOn((component as any).notify as any, 'toast')
    spyPopupClose = jest.spyOn((component as any).editEventPopup as any, 'close')

    // When
    fixture.detectChanges();
    const result = component.saveEvent();

    // Then
    expect(spyNotify).toHaveBeenCalledWith({ message: 'Jours de congé épuisés' });
    expect(result).toBe(false);
    expect(spyPopupClose).not.toHaveBeenCalled();
  });

  it('should delete an event', () => {
    // Given
    const spyActionDelete= jest.spyOn(ActivityActions, 'delete')
    const spyMapEventToActivity= jest.spyOn(component, 'mapEventToActivity')

    spyPopupClose = jest.spyOn((component as any).editEventPopup as any, 'close')

    // When
    fixture.detectChanges();
    component.deleteEvent();

    // Then
    expect(spyMapEventToActivity).toHaveBeenCalledWith(component.tempEvent);
    expect(spyActionDelete).toHaveBeenCalled();
    expect(spyPopupClose).toHaveBeenCalled();
  });
});
