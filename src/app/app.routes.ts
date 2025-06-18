import { Routes } from '@angular/router';
import { HabitListComponent } from './components/habit-list/habit-list';
import { HabitDetailComponent } from './components/habit-detail/habit-detail';
import { HabitFormComponent } from './components/habit-form/habit-form';

export const routes: Routes = [
  { path: '', redirectTo: '/habits', pathMatch: 'full' },
  { path: 'habits', component: HabitListComponent },
  { path: 'habits/new', component: HabitFormComponent },
  { path: 'habits/edit/:id', component: HabitFormComponent },
  { path: 'habits/:id', component: HabitDetailComponent },
  { path: '**', redirectTo: '/habits' },
];
