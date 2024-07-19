export interface Activity{
    month: Date,
    year: Date,
    dailyActivties: Array<DailyActivity>
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