import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideState, provideStore } from '@ngrx/store';
import { userReducer } from '@state/user/reducers';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from '@state/user/effects';
import { activityReducer } from '@state/activity/reducers';
import * as activityEffects from '@state/activity/effects' ;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore(),
    provideState('user', userReducer),
    provideState('activity', activityReducer),
    provideEffects(activityEffects.ActivityEffects),

    provideEffects(UserEffects)
]
};
