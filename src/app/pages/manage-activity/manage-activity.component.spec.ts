import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageActivityComponent } from './manage-activity.component';
import { Store } from '@ngrx/store';
import { mockUserData, storeMock } from '@shared/tests-utils';
import { ActivityActions } from '@state/activity/actions';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const mockActivities = [{ id: 'test_id1' }, { id: 'test_id2' }];
const mockEvents = [
  { title: 'Event 1', start: new Date(), end: new Date(), allDay: true },
  { title: 'Event 2', start: new Date(), end: new Date(), allDay: true }
];

describe('ManageActivityComponent', () => {
  let component: ManageActivityComponent;
  let fixture: ComponentFixture<ManageActivityComponent>;
  let store: any;

  beforeEach(async () => {
    store = {
      dispatch: jest.fn(),
      select: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ManageActivityComponent],
      providers: [
        { provide: Store, useValue: storeMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageActivityComponent);
    component = fixture.componentInstance;
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
});
