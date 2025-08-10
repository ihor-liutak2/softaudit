# AuditApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.10.

## Deploy to Firebase Hosting

Sign in to Google, run:

```bash
firebase login
```

deploy your web app, run:

```bash
firebase deploy
```

`https://audit-9f24b.web.app`

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running vertex

Як автентифікуватися:
Через gcloud CLI:

gcloud auth application-default login
Потім отримати токен:


gcloud auth application-default print-access-token
І використати його в заголовку:


Authorization: Bearer <ACCESS_TOKEN>

# TODO
Що покрити в MVP (ЛР1: Формалізація та SRS)
Редактор SRS за шаблоном: загальні дані, предметна область, зацікавлені сторони, функц./нефункц. вимоги, класифікація (обов’язк./бажані/додаткові). Експорт «чернетки SRS». 

Перевірки якості вимог: підказки/валидації на SMART та IEEE 830 прямо під час введення. 

Довідник стандартів всередині модуля (ISO/IEC 25010, IEEE 830, ISO/IEC/IEEE 29148, 26514) з короткими вимогами та посиланнями на поля SRS. 
 
Автогенерація структури звіту (що саме має бути у звіті — секції заповнюються з даних системи). 

База запитань для самоконтролю (короткий квіз по темі SRS/ISO 25010). 