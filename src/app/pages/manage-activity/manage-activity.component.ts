import { Component } from '@angular/core';
import { SchedulerModule, SchedulerViewType } from 'smart-webcomponents-angular/scheduler';

@Component({
  selector: 'app-manage-activity',
  standalone: true,
  imports: [SchedulerModule],
  templateUrl: './manage-activity.component.html',
  styleUrl: './manage-activity.component.scss'
})
export class ManageActivityComponent {
  handleCalendarChange(event: Event) {
    console.log("event: ", event)
  }
  view: SchedulerViewType = 'month';
  views: any[] = ['day',
    {
      type: 'month',
      hideWeekend: true,
    }, 'agenda',
  ];
  today = new Date();
  firstDayOfWeek: number = 1;

  disableDateMenu: boolean = true;

  currentTimeIndicator: boolean = true;
  nonworkingDays: number[] = this.getPastThreeWeekdays(this.today.getDay());
  
  getPastThreeWeekdays(weekday: number) {
    let weekdays = [];

    for (let i = 0; i < 3; i++) {
      weekdays.push((weekday - i + 7) % 7);
    }

    return weekdays;
  }
  dataSource = (() => {
    const currentDate = this.today.getDate(),
      currentYear = this.today.getFullYear(),
      currentMonth = this.today.getMonth();
    return [
      {
        label: 'Brochure Design Review',
        dateStart: new Date(currentYear, currentMonth, 10, 13, 15),
        dateEnd: new Date(currentYear, currentMonth, 12, 16, 15),
        status: 'tentative',
        class: 'event'
      }, {
        label: 'Website Re-Design Plan',
        dateStart: new Date(currentYear, currentMonth, 16, 16, 45),
        dateEnd: new Date(currentYear, currentMonth, 18, 11, 15),
        class: 'event'
      }
    ]
  })()

  handleDateChange(event: Event) {
    console.log(event)
  }

  updateData(event: Event) {
    console.log(event)
  }
}
