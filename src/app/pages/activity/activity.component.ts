import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { localeFr, MbscCalendarEvent, MbscEventcalendarOptions, MbscModule, MbscPopup, MbscPopupOptions, Notifications, setOptions } from '@mobiscroll/angular';
import { Activity, ActivityType } from '@models/activity';
import { User } from '@models/user';
import { Store } from '@ngrx/store';
import { ActivityActions } from '@state/activity/actions';
import { selectUserActivityFeature, selectUserFeature } from '@state/selectors';
import { map, Observable, take, tap } from 'rxjs';

setOptions({
  locale: localeFr,
  theme: 'ios',
  themeVariant: 'light',
});

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [MbscModule, FormsModule, CommonModule, ReactiveFormsModule,
  ],
  providers: [Notifications],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent implements OnInit {
  constructor(
    private store: Store,
    private notify: Notifications,
  ) { }
  @ViewChild('editEventPopup', { static: false })
  editEventPopup!: MbscPopup;

  tempEvent!: MbscCalendarEvent;
  isEdit: boolean = false;
  dayOffCount: number = 0
  user: User = {} as User;

  popupEventTitle: string | undefined
  popupAnchor: HTMLElement | undefined;
  popupHeaderText: string = "Editer activité";
  popupEventDates: any = []
  popupActivity: any | number = 0
  activityOptions = [
    {
      text: 'Mission 1',
      value: ActivityType.MISSION1
    },
    {
      text: 'Mission 2',
      value: ActivityType.MISSION2
    },
    {
      text: 'Mission 3',
      value: ActivityType.MISSION3
    },
    {
      text: 'Congé',
      value: ActivityType.DAY_OFF
    },
  ];

  calendarSelectedDate: any = new Date();

  popupButtons: any = [
    {
      handler: () => {
        this.editEventPopup.close();
      },
      keyCode: 'Esc',
      text: 'X',
      cssClass: 'mbsc-popup-button-primary',
    }
  ];
  
  myEvents$!: Observable<MbscCalendarEvent[]>;

  eventSettings: MbscEventcalendarOptions = {
    clickToCreate: 'double',
    dragToCreate: false,
    dragToMove: false,
    dragToResize: false,
    eventDelete: true,
    eventOverlap: false,
    view: {
      calendar: {
        type: 'month',
        popover: false,
        labels: true,
        count: false,
      },
      agenda: { type: 'month' },
    },
    invalid: [{
      recurring: {
        repeat: 'weekly',
        weekDays: 'SA,SU'
      }
    }],
    onEventClick: (args) => {
      this.editOrCreateEvent(true, args.event, args.domEvent.currentTarget)
    },
    onEventCreated: (args) => {
      setTimeout(() => {
        this.editOrCreateEvent(false, args.event, args.target)
      });
    },
    extendDefaultEvent: (args) => {
      return {
        activityType: 99
      };
    }
  };

  editOrCreateEvent(isEdit: boolean, event: MbscCalendarEvent, target: any) {
    this.isEdit = isEdit;
    console.log("event", event)
    this.popupActivity = event['activityType']
    this.tempEvent = event;
    this.popupEventDates = [event.start, event.end];
    this.popupAnchor = target;

    this.editEventPopup.open();
  }

  popupOptions: MbscPopupOptions = {
    display: 'bottom',
    contentPadding: false,
    fullScreen: true,
    responsive: {
      medium: {
        display: 'anchored',
        width: 400,
        fullScreen: false,
        touchUi: false,
      },
    },
  };

  ngOnInit(): void {
    this.myEvents$ = this.store.select(selectUserActivityFeature).pipe(
      tap(activityData => this.getDayOffCount(activityData)),
      map(activityData => {
        return activityData.map(a => this.mapActivityToEvent(a))
      }
      ))
    this.store.select(selectUserFeature).pipe(take(1)).subscribe(
      (user) => {
        this.user = user
      }
    )
    this.store.dispatch(ActivityActions.load())
  }

  getDayOffCount(activities: Array<Activity>) {
    this.dayOffCount = activities.filter(a => a.activityType === ActivityType.DAY_OFF).length
  }

  mapActivityToEvent(activity: Activity): MbscCalendarEvent {
    return {
      id: activity.id,
      title: activity.label,
      start: activity.dateStart,
      end: activity.dateEnd,

      allDay: true,
      activityType: activity.activityType
    }
  }

  getActivityOptionFromEvent() {
    return this.activityOptions.find(d => d.value == this.popupActivity)!
  }

  mapEventToActivity(event: MbscCalendarEvent): Activity {
    return {
      user: this.user,
      id: event.id!.toString(),
      label: event.title!,
      activityType: this.getActivityOptionFromEvent()?.value || 0,
      dateStart: event.start as Date,
      dateEnd: event.end as Date,
    };
  }

  hasRemainingDaysOff(activity: Activity) {
    if (activity.activityType === ActivityType.DAY_OFF && this.dayOffCount === 5) {
      return false
    }
    return true
  }

  saveEvent(): void | false {
    this.tempEvent.title = this.getActivityOptionFromEvent().text;
    this.tempEvent.start = this.popupEventDates[0];
    this.tempEvent.end = this.popupEventDates[1];
    this.tempEvent.allDay = true
    const activityData = this.mapEventToActivity(this.tempEvent)
    if (!this.hasRemainingDaysOff(activityData)) {
      this.notify.toast({
        message: "Jours de congé épuisés",
      });
      return false
    }
    if (this.isEdit) {
      this.store.dispatch(ActivityActions.update({ user: this.user, activity: activityData }));
    } else {
      this.store.dispatch(ActivityActions.create({ user: this.user, activity: activityData }));
    }
    this.calendarSelectedDate = this.popupEventDates[0];
    this.editEventPopup.close();
  }

  deleteEvent() {
    const activityData = this.mapEventToActivity(this.tempEvent)
    this.store.dispatch(ActivityActions.delete({ user: this.user, activity: activityData }));
    this.editEventPopup.close();

  }
}
