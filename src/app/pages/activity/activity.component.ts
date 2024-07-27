import { Component, ViewChild } from '@angular/core';
import { Rating } from 'smart-webcomponents-angular';
import { SchedulerComponent, SchedulerModule, SchedulerViewType } from 'smart-webcomponents-angular/scheduler';
import { DropDownListComponent, DropDownListModule } from 'smart-webcomponents-angular/dropdownlist';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [SchedulerModule, DropDownListModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent {
  @ViewChild('scheduler', { read: SchedulerComponent, static: false }) scheduler!: SchedulerComponent;

  view: SchedulerViewType = 'month';
  // views: any[] = [
  //   {
  //     type: 'month',
  //     hideWeekend: true,
  //   }
  // ];
  today = new Date();
  firstDayOfWeek: number = 1;

  disableDateMenu: boolean = false;

  currentTimeIndicator: boolean = true;

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
        class: 'event',
        activity: "0"
      }, {
        label: 'Website Re-Design Plan',
        dateStart: new Date(currentYear, currentMonth, 16, 16, 45),
        dateEnd: new Date(currentYear, currentMonth, 18, 11, 15),
        class: 'event',
        activity: "2"

      }
    ]
  })()
  insertItem(event: CustomEvent) {
    // event.detail.item[]
    console.log(event)
  }


  handleDateChange(event: Event) {
    console.log(event)
  }

  updateData(event: Event) {
    console.log("updated, lets see", event)
  }

  windowCustomizationFunction() {

  }

  handleActivityChange(event: CustomEvent, bgColorElem: any, labelElem: any) {
    console.log("option changed", event)
    console.log("color picker", bgColorElem)
    const detail = event?.detail
    if (detail?.selected && detail?.value) {
      switch (detail.value) {
        case "0":
          bgColorElem.querySelector('[event-editor]').value = "#F6BF26"
          break
        case "1":
          bgColorElem.querySelector('[event-editor]').value = "#E67C73"
          break
        case "2":
          bgColorElem.querySelector('[event-editor]').value = "#F4511E"
          break
      }
      labelElem.querySelector('[event-editor]').value = detail.label

    }
  }

  handleEditDialogOpen(event: CustomEvent) {
    const scheduler = this.scheduler,
      editors = event.detail.editors;
    console.log("editor detail", event)
    if (!editors) {
      return;
    }

    const schedulerEvent = event.detail.item,
      allDayEditor = editors.allDay,
      backgroundColorEditor = editors.backgroundColor,
      labelEditor = editors.label,

      editorsContainer = editors.description.parentElement;

    allDayEditor.querySelector('[event-editor]').checked = true
    allDayEditor.querySelector('[event-editor]').disabled = true

    const unusedElems = ['allDay', 'label', 'repeat', 'description', 'notifications', 'conference', 'status']
    for (let item of unusedElems) {
      editors[item].classList.add('smart-hidden')
    }

    let activityElement = editorsContainer.querySelector('#eventActivity');

    if (!activityElement) {
      const elementContainer = document.createElement('div'),
        label = document.createElement('label');

      label.textContent = 'Activité: ';
      elementContainer.classList.add('smart-scheduler-window-editor');

      elementContainer.appendChild(label);

      activityElement = document.createElement('smart-drop-down-list');
      elementContainer.setAttribute('type', 'activity')
      activityElement.addEventListener('change', ($event: CustomEvent) => this.handleActivityChange($event, backgroundColorEditor, labelEditor));
      activityElement.id = 'eventActivity';

      const activityList = [{ label: 'Mission 1', value: "0" }, { label: 'Mission 2', value: "1" }, { label: 'Mission 3', value: "2" }]
      for (let item of activityList) {
        const activityItem = document.createElement('smart-list-item')
        activityItem.setAttribute('value', item.value)
        activityItem.append(item.label)
        activityElement.append(activityItem)
      }
      elementContainer.append(activityElement);
      editorsContainer.prepend(elementContainer);
    } 
    console.log("schedulerevent", schedulerEvent)
    if (schedulerEvent.activity){
      activityElement.value = schedulerEvent.activity
    } else {
      activityElement.clearSelection()
    }
    activityElement.value = schedulerEvent.activity? schedulerEvent.activity : undefined

  


    // activityElement.value = schedulerEvent.activity || null;
  }


}
