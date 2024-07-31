import { ActivityType } from "@models/activity";
import { selectUserActivityFeature, selectUserFeature } from "@state/selectors";
import { of } from "rxjs";

export const mockUserActivityData = [{
    id: 'test_id1',
    label: "Test Label 1",
    activityType: ActivityType.MISSION1,
    dateStart: new Date,
    dateEnd: new Date,
  }];
export const mockUserData = { id: 'agent_XXX', label: 'Agent XXX' };
export const mockEvent = { title: 'Mock Event', start: new Date(), end: new Date(), allDay: true, id: "test_id1"  };

export const storeMock = {
  select: jest.fn().mockImplementation(selector => {
    if (selector === selectUserActivityFeature) {
      return of(mockUserActivityData);
    }
    if (selector === selectUserFeature) {
      return of(mockUserData);
    }
    return of();
  }),
  dispatch: jest.fn().mockReturnValue(of({}))
};