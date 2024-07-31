import { MbscCalendarEvent } from "@mobiscroll/angular";
import { Activity } from "@models/activity";

export function mapActivityToEvent(activity: Activity): MbscCalendarEvent {
  return {
    id: activity.id,
    title: activity.label,
    start: activity.dateStart,
    allDay: true,
    activityType: activity.activityType,
    user: activity.user
  }
}