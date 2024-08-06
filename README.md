# Angular Technical Test

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.0.

Key libraries and tools:
- PrimeNG: A library of UI components for Angular applications, providing various pre-designed components to enhance the user interface.
- Tailwind CSS: A utility-first CSS framework used for styling the application, enabling rapid UI development with custom design utilities.
- ngx-translate: For internationalization and localization, allowing easy translation of the application into multiple languages.
- JSON Server: Used for setting up a mock backend server to handle API requests during development.

## Deploy Development Backend

Run `npm run start:json-server` to start the JSON server. 

- http://localhost:3000/songs - View song data.
- http://localhost:3000/artists - View artist data.
- http://localhost:3000/companies - View record labels data.

## Deploy Development Frontend

Once the backend is set up and ready to receive requests, start the development server by running `npm start`. Then, open your browser and go to `http://localhost:4200/`.

The application will automatically reload if you make changes to any of the source files.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
