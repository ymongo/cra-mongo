import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { localeFr, MbscCalendarEvent, MbscEventcalendarOptions, MbscModule, setOptions } from '@mobiscroll/angular';
import { User } from '@models/user';
import { Store } from '@ngrx/store';
import { mapActivityToEvent } from '@shared/activity-utils';
import { ActivityActions } from '@state/activity/actions';
import { selectManagerActivityFeature, selectUserFeature } from '@state/selectors';
import { map, Observable, take } from 'rxjs';

setOptions({
  locale: localeFr,
  theme: 'ios',
  themeVariant: 'light',
});

@Component({
  selector: 'app-manage-activity',
  standalone: true,
  imports: [MbscModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './manage-activity.component.html',
  styleUrl: './manage-activity.component.scss'
})
export class ManageActivityComponent implements OnInit {
  user!: User;

  constructor(
    private store: Store,
  ) { }

  events$!: Observable<MbscCalendarEvent[]>;
  calendarSelectedDate: any = new Date();

  eventSettings: MbscEventcalendarOptions = {
    clickToCreate: false,
    dragToCreate: false,
    dragToMove: false,
    dragToResize: false,
    eventDelete: false,
    eventOverlap: false,
    view: {
      calendar: {
        type: 'month',
        popover: true,
        labels: true,
        count: false,
      },
    },
    invalid: [{
      recurring: {
        repeat: 'weekly',
        weekDays: 'SA,SU'
      }
    }],
    extendDefaultEvent: (args) => {
      return {
        activityType: 0,
        user: undefined
      };
    }
  };

  ngOnInit(): void {
    this.events$ = this.store.select(selectManagerActivityFeature).pipe(
      map(activityData => {
        return activityData.map(a => {
          const event = mapActivityToEvent(a)
          this.setColorevent(event)
          return event
        })
      }
      ))
    this.store.select(selectUserFeature).pipe(take(1)).subscribe(
      (user) => {
        this.user = user
      }
    )
    this.store.dispatch(ActivityActions.load())
  }

  setColorevent(event: MbscCalendarEvent) {
    switch (event['user'].id) {
      case 'agent_1':
        event.color = 'yellow'
        break
      case 'agent_2':
        event.color = 'pink'
        break
      case 'agent_3':
        event.color = 'orange'
        break
    }
  }


}
