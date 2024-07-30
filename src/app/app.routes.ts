import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { canActivateAgentActivityPage, canActivateManagertActivityPage } from './pages/routes.guard';

export const routes: Routes = [

    {
        path: "login",
        loadComponent: () => import('./pages/login/login.component')
            .then((m) => m.LoginComponent),
    },
    {
        path: "activity",
        canMatch: [canActivateAgentActivityPage],
        loadComponent: () => import('./pages/activity/activity.component')
            .then((m) => m.ActivityComponent)
    },
    {
        path: "activity",
        canActivate: [canActivateManagertActivityPage],
        loadComponent: () => import('./pages/manage-activity/manage-activity.component')
            .then((m) => m.ManageActivityComponent)
    },
    {
        path: "",
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
// teste

