import { Routes } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list';
import { TodoDetailComponent } from './components/todo-detail/todo-detail';
import { TodoFormComponent } from './components/todo-form/todo-form';

export const routes: Routes = [
  { path: '', redirectTo: '/todo', pathMatch: 'full' },
  { path: 'todo', component: TodoListComponent },
  { path: 'todo/new', component: TodoFormComponent },
  { path: 'todo/edit/:id', component: TodoFormComponent },
  { path: 'todo/:id', component: TodoDetailComponent },
  { path: '**', redirectTo: '/todo' },
];
