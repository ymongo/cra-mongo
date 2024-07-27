import { User } from "./user"

export interface Activity{
    id: number,
    user: User
    label: string,
    activityType: ActivityType,
    dateStart: Date,
    dateEnd: Date,
}

export interface DailyActivity {
    date: Date, 
    type: ActivityType
}

export enum ActivityType {
    MISSION1,
    MISSION2,
    MISSION3,
    DAY_OFF
}