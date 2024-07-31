export interface User {
    id: string
    role: Role
    label: string
}

export enum Role {
    MANAGER,
    AGENT, 
}

export const USERS: Array<User> = [
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
      label:"Agent 3  - I. Hulk"
    }
  ]