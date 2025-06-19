# 🧠 TODO List

A todo list application built with **Angular**, **Firebase Firestore**, and **Angular Material**. Users can create, update, delete and complete own stuff.

## 🚀 Features

- Create, view, edit, and delete stuff (CRUD)
- Mark stuff as complete for today
- Responsive UI using **Angular Material**
- Data persistence using **Firebase Firestore**
- Built with **Standalone Angular Components** (Angular 17+)

## 🔐 Firebase Configuration

Before running the application, make sure to configure your Firebase credentials in `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-api-key",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id",
  },
};
```

## 🛠 Development Setup

To run the app locally:

```bash
npm install
ng serve
```

Then visit [`http://localhost:4200`](http://localhost:4200)

## 🧪 Mock Data Seeding

You can seed example todo list (with categories, dates, etc.) by calling this method in `TodoService`:

```ts
this.todoService.seedTodoList();
```

This is helpful for local testing and UI development. Remember to remove the call after seeding to prevent duplicate records.

## 🔨 Build

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## 📦 Tech Stack

- **Angular 20+** with Standalone Components
- **Angular Material**
- **Firebase Firestore** for NoSQL persistence
- **RxJS** for reactive state management
- **SCSS** for modular styling

## 📘 Resources

- [Angular Standalone Components](https://angular.dev/guide/standalone-components)
- [Angular Material Docs](https://material.angular.io/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [RxJS Guide](https://rxjs.dev/guide/overview)
