import { inject, Injectable } from "@angular/core";
import { CanActivateFn, CanMatchFn, Router, } from "@angular/router";
import { Role, User } from "@models/user";
import { Store } from "@ngrx/store";
import { UserState } from "@state/user/reducers";
import { map, Observable, take } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class PagesGuard {
    user$: Observable<User>

    constructor(
        private store: Store<UserState>,
        private router: Router,

    ) {
        this.user$ = this.store.select((state) => state.user)
    }

    private isUserLoggedInAndRole(role: Role | null = null): Observable<boolean> {
        return this.user$.pipe(
            map(user => {
                if (Object.keys(user).length) {
                    if (user.role === role) {
                        return true
                    }
                    return false
                } else {
                    this.router.navigate([''])
                    return false
                }
            }),
            take(1)
        )
    }

    isAgent() {
        return this.isUserLoggedInAndRole(Role.AGENT)
    }

    isManager() {
        return this.isUserLoggedInAndRole(Role.MANAGER)
    }
}


export const canActivateAgentActivityPage: CanMatchFn = () => {
    console.log("ohé isAgent", Role.AGENT)
    return inject(PagesGuard).isAgent()
}

export const canActivateManagertActivityPage: CanActivateFn = () => {
    console.log("ohé isManager ", Role.MANAGER)
    return inject(PagesGuard).isManager()
}
