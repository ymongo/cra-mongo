import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MbscCalendarEvent, MbscEventcalendarOptions, Notifications, setOptions, localeFr, MbscPopup, MbscPopupOptions } from '@mobiscroll/angular';
import { MbscModule } from '@mobiscroll/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivityType } from '@models/activity';

setOptions({
  locale: localeFr,
  theme: 'ios',
  themeVariant: 'light',
});

@Component({
  selector: 'app-activity-new',
  standalone: true,
  imports: [MbscModule,FormsModule ],
  providers: [Notifications],
  templateUrl: './activity-new.component.html',
  styleUrl: './activity-new.component.scss'
})
export class ActivityNewComponent implements OnInit {
  constructor(
    // private http: HttpClient,
    private notify: Notifications,
  ) { }
  @ViewChild('editEventPopup', { static: false })
  editEventPopup!: MbscPopup;
  tempEvent!: MbscCalendarEvent;
  isEdit: boolean = false;
  
  popupEventTitle: string | undefined
  popupEventDescription: string =""
  popupAnchor: HTMLElement | undefined;

  popupButtons: any = [];
  popupHeaderText!: string;
  popupEventDates : any = []
  popupEventAllDay = true

  popupActivity = 0 
  activityTypeList: Array<{label: string, type:ActivityType}> = [

    { label: "Mission 1", type: ActivityType.MISSION1},
    { label: "Mission 2", type: ActivityType.MISSION2},
    { label: "Mission 3", type: ActivityType.MISSION3},
    { label: "Congé", type: ActivityType.DAY_OFF},
  ]
  calendarSelectedDate: any = new Date();

  popupEditButtons = [
    {
        handler: () => {
          this.editEventPopup.close();
        },
        keyCode: 'Esc',
        text: 'X',
        cssClass: 'mbsc-popup-button-primary',
      },
  ];

  myEvents: MbscCalendarEvent[] = [];
  eventSettings: MbscEventcalendarOptions = {
    clickToCreate: true,
    dragToCreate: false,
    dragToMove: false,
    dragToResize: false,
    eventDelete: true,
    view: {
      calendar: {
        type: 'month', 
        // popover: true,
        count: true,
      },
      agenda: { type: 'month' },
    },
    onEventClick: (args) => {
      this.isEdit = true;
      this.tempEvent = args.event;

      // fill popup form with event data
      this.loadPopupForm(args.event);
      // set popup options
      this.popupHeaderText = 'Nouvelle activité';
      this.popupButtons = this.popupEditButtons;
      this.popupAnchor = args.domEvent.currentTarget;
      // open the popup
      this.editEventPopup.open();



      // this.notify.toast({
      //   message: args.event.title,
      // });
    },
  };

  popupOptions: MbscPopupOptions = {
    display: 'bottom',
    contentPadding: false,
    fullScreen: true,
    onClose: () => {
      if (!this.isEdit) {
        // refresh the list, if add popup was canceled, to remove the temporary event
        this.myEvents = [...this.myEvents];
      }
    },
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
    // this.http.jsonp<MbscCalendarEvent[]>('https://trial.mobiscroll.com/events/?vers=5', 'callback').subscribe((resp) => {
    //   this.myEvents = resp;
    // });
  }

  loadPopupForm(event: MbscCalendarEvent): void {
    this.popupEventTitle = event.title;
    this.popupEventDescription = event['description'];
    this.popupEventDates = [event.start, event.end];
  }

  saveEvent(): void {
    this.tempEvent.title = this.popupEventTitle;
    this.tempEvent['description'] = this.popupEventDescription;
    this.tempEvent.start = this.popupEventDates[0];
    this.tempEvent.end = this.popupEventDates[1];
    this.tempEvent.allDay = true
    if (this.isEdit) {
      // update the event in the list
      console.log("save", this.tempEvent)
      const index = this.myEvents.findIndex(e => e.id == this.tempEvent.id)
      this.myEvents[index]= this.tempEvent
      // this.myEvents = [...this.myEvents];
      // here you can update the event in your storage as well
      // ...
      console.log("save")
    } else {
      // add the new event to the list
      this.myEvents = [...this.myEvents, this.tempEvent];
      // here you can add the event to your storage as well
      // ...
    }
    // navigate the calendar
    this.calendarSelectedDate = this.popupEventDates[0];
    // close the popup
    this.editEventPopup.close();
  }

  onDeleteClick() {
    console.log("delete")
  }

}
