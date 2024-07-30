import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, USERS } from '@models/user';
import { Store } from '@ngrx/store';
import { UserState } from '@state/user/reducers';
import { UserActions } from '../../state/user/actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  constructor(
    private store: Store<UserState>
  ){}
  usersList:Array<User> = []
  selectedUser : User|number = 99
  
  ngOnInit() {
    this.usersList = USERS
  }

  login() {
    this.store.dispatch(UserActions.login({user: this.selectedUser as User}));
  }

}
