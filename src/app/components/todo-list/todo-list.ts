import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { trigger, transition, style, animate } from '@angular/animations';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';
import { TodoItemModel } from '../../models/todo.model';
import { TodoService } from '../../services/todo';
import { TodoListItemComponent } from '../todo-list-item/todo-list-item';

@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    AsyncPipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
    TodoListItemComponent,
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'none' })),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class TodoListComponent implements OnInit {
  todo$!: Observable<TodoItemModel[]>;
  stats$!: Observable<any>;

  private todoService = inject(TodoService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    // Important! Uncomment the following line to seed the todo list with initial data
    // this.todoService.seedTodoList();
    this.todo$ = this.todoService.getTodoItems();
    this.stats$ = this.todoService.getTodoListStats();
  }

  createTodoItem(): void {
    this.router.navigate(['/todo/new']);
  }

  viewTodo(id: string): void {
    this.router.navigate(['/todo', id]);
  }

  editTodo(id: string): void {
    this.router.navigate(['/todo/edit', id]);
  }

  deleteTodoItem(id: string, name: string): void {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      this.todoService.deleteTodoItem(id).then(() => {
        this.snackBar.open('TODO Item deleted successfully', 'Close', {
          duration: 3000,
        });
      });
    }
  }

  markComplete(id: string): void {
    const today = new Date().toISOString().split('T')[0];
    this.todoService.markTodoItemComplete(id, today).then(() => {
      this.snackBar.open('TODO Item marked as complete!', 'Close', {
        duration: 3000,
      });
    });
  }

  isCompletedToday(todoItem: TodoItemModel): boolean {
    const today = new Date().toISOString().split('T')[0];
    return todoItem.completedDates.includes(today);
  }

  trackById(_: number, item: TodoItemModel): string {
    return item.id!;
  }
}
