# 🧠 Habit Tracker

A habit-tracking application built with **Angular**, **Firebase Firestore**, and **Angular Material**. Users can create, update, track, and complete habits with a focus on consistency and long-term progress.

## 🚀 Features

- Create, view, edit, and delete habits (CRUD)
- Track **current** and **longest** streaks
- Mark habits as complete for today
- Auto-deactivates habits once target streak is reached
- Dashboard with habit statistics
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

You can seed example habits (with pre-filled streaks, completed dates, etc.) by calling this method in `HabitService`:

```ts
this.habitService.seedHabits();
```

This is helpful for local testing and UI development. Remember to remove the call after seeding to prevent duplicate records.

## 🧱 Project Structure

```
src/
├── app/
│   ├── components/         # UI components (dashboard, habit list, form, detail)
│   ├── models/             # Habit model interface
│   ├── services/           # Firestore habit service
│   └── app.routes.ts       # Routing configuration
```

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
