import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { LoginService } from '../services/login.service';
import { FormsModule } from '@angular/forms';
import { UserActions } from '../../../state/user/actions';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { UserState } from '@state/user/reducers';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private store: Store<UserState>
  ){}
  usersList:Array<User> = []
  selectedUser : User|number = 0
  
  ngOnInit() {
    this.usersList=  this.loginService.getUsers()
  }

  login() {
    console.log("ho", this.selectedUser)

    this.store.dispatch(UserActions.login({user: this.selectedUser as User}));
  }

}
