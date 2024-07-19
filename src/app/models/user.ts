export interface User {
    id: string
    role: Role
    label: string
}

export enum Role {
    MANAGER,
    AGENT, 
}