import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { canMatchAgentActivityPage, canMatchManagertActivityPage } from './pages/routes.guard';

export const routes: Routes = [

    {
        path: "login",
        loadComponent: () => import('./pages/login/components/login.component')
            .then((m) => m.LoginComponent),
    },
    {
        path: "activity",
        canMatch: [canMatchAgentActivityPage],
        loadComponent: () => import('./pages/activity/components/activity/activity.component')
            .then((m) => m.ActivityComponent)
    },
    {
        path: "activity",
        canMatch: [canMatchManagertActivityPage],
        loadComponent: () => import('./pages/manage-activity/manage-activity.component')
            .then((m) => m.ManageActivityComponent)
    },
    {
        path: "",
        pathMatch: 'full',
        redirectTo: "login"
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
