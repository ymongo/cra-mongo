import { inject, Injectable } from "@angular/core";
import { CanMatchFn, } from "@angular/router";
import { Role } from "@models/user";
import { Store } from "@ngrx/store";
import { UserState } from "@state/user/reducers";
import { map, Observable, take } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class PagesGuard {
    user$

    constructor(
        private store: Store<UserState>,
    ) {
        this.user$ = this.store.select(state => state.user)
    }

    private isUserLoggedInAndRole(role: Role): Observable<boolean> {
        return this.user$.pipe(
            map(user => {
                if (user && user.role == role) {
                    return true
                }
                return false
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


export const canMatchAgentActivityPage: CanMatchFn = () => {
    return inject(PagesGuard).isAgent()
}

export const canMatchManagertActivityPage: CanMatchFn = () => {
    return inject(PagesGuard).isManager()
}