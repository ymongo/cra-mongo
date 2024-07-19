import { Injectable } from '@angular/core';
import { Role, User } from '@models/user';
import { of } from 'rxjs';

const USERS: Array<User> = [
  {
    id:"manager_0",
    role: Role.MANAGER,
    label:"Manager - Nick Fury"
  },
  {
    id:"agent_1",
    role: Role.AGENT,
    label:"Agent 1 - C. America"
  },
  {
    id:"agent_2",
    role: Role.AGENT,
    label:"Agent 2 - B. Widow"
  },
  {
    id:"agent_3",
    role: Role.AGENT,
    label:"Agent 3  - Hulk"
  }
]

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }
  
  getUsers() {
    return USERS
  }
}
