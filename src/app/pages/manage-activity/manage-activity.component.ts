import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { localeFr, MbscCalendarEvent, MbscEventcalendarOptions, MbscModule, Notifications, setOptions } from '@mobiscroll/angular';
import { ActivityType } from '@models/activity';
import { User } from '@models/user';
import { Store } from '@ngrx/store';
import { mapActivityToEvent } from '@shared/activity-utils';
import { ActivityActions } from '@state/activity/actions';
import { selectManagerActivityFeature, selectUserFeature } from '@state/selectors';
import { map, Observable, take, tap } from 'rxjs';

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
    private notify: Notifications,

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
      ),
      tap(data => {
        const daysOffConcList = this.getDaysOffConcurrency(data)
        if (daysOffConcList.length) {
          daysOffConcList.map(d => this.notify.toast({
            message: `Conflit de jours de congé le ${(d as Date).toLocaleDateString()}`,
          }) )
        }
        return data
      })
      )
    this.store.select(selectUserFeature).pipe(take(1)).subscribe(
      (user) => {
        this.user = user
      }
    )
    this.store.dispatch(ActivityActions.load())
  }
  
  getDaysOffConcurrency(data: MbscCalendarEvent[]) {
    let daysOffList = data.filter(d => d['activityType'] == ActivityType.DAY_OFF)
    const daysOFfConcurrencyList =[]
    while(daysOffList.length){
      const dayOff = daysOffList[0]
      const sameDateDaysOff = daysOffList.filter(d => (d.start as Date).toISOString() === (dayOff.start as Date).toISOString())
      if (sameDateDaysOff.length === 3){
        daysOFfConcurrencyList.push(dayOff.start)
      }
      daysOffList = daysOffList.filter(d => !sameDateDaysOff.includes(d))
    }
    return daysOFfConcurrencyList
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
