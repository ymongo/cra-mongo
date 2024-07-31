import { MbscModule } from '@mobiscroll/angular';
import { FormsModule } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserFeature } from '@state/selectors';
import { Subject, take, takeUntil } from 'rxjs';
import { User } from '@models/user';
import { UserActions } from '@state/user/actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MbscModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,) { }
  private killSubs = new Subject<void>()

  user!: User

  ngOnInit(): void {
    this.store.select(selectUserFeature).pipe(takeUntil(this.killSubs)).subscribe(
      (user) => {
        this.user = user
      }
    )
  }

  ngOnDestroy(): void {
    this.killSubs.next()
    this.killSubs.complete()
  }

  logout() {
    this.store.dispatch(UserActions.logout())
  }
}
