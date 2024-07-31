# CraMongo Application

CraMongo is a web application designed to demonstrate proefficiency in using Angular and NgRx.
The purpose of the excercice is to manage the working activity of a team of agents and supervize it.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)

## Features
- Utilizes Angular for a dynamic and robust front-end experience, NgRx to manage the state in the app
- Styled using Tailwind CSS and DaisyUI for rapid UI development.
- Utilizes Mobiscroll library for the calendat UI component

## Prerequisites
- Latest Node.js and npm installed on your machine. (v22)
- Latest Angular CLI installed globally. (v18)
  ```sh
  npm install -g @angular/cli
  ```
## Installation
- Clone the repository:
    ```sh
    git clone https://github.com/ymongo/cra-mongo
    ```
- Navigate to the project directory:
    ```sh
    cd cra-mongo
    ```
- Install the dependencies:
    ```sh
    npm install
    ```
## Running the Application

Run with: 
 ```sh
 npm start
```
Navigate to http://localhost:4200/ in your web browser to see the application in action.

On Login page chose a user: Manager or one the 3 Agents

On Activity page: 
- Agents can add, edit, delete their daily activities
- Manager can view all agents daily activities and check for days off conccurency

Activity data is saved in localStorage. To clean up data:
 ```sh
 localStorage.removeItem('activities')
```