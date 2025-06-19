import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { TodoService } from '../../services/todo';
import { TodoItemModel } from '../../models/todo.model';

@Component({
  selector: 'app-todo-detail',
  imports: [
    CommonModule,
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  templateUrl: './todo-detail.html',
  styleUrls: ['./todo-detail.scss'],
})
export class TodoDetailComponent implements OnInit {
  todoItem$!: Observable<TodoItemModel | undefined>;
  todoItemId!: string;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private todoService = inject(TodoService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.todoItemId = this.route.snapshot.paramMap.get('id')!;
    this.todoItem$ = this.todoService.getTodoItem(this.todoItemId);
  }

  goBack(): void {
    this.router.navigate(['/todo']);
  }

  editTodo(): void {
    this.router.navigate(['/todo/edit', this.todoItemId]);
  }

  deleteTodoItem(): void {
    this.todoItem$.subscribe((todoItem) => {
      if (
        todoItem &&
        confirm(`Are you sure you want to delete "${todoItem.name}"?`)
      ) {
        this.todoService.deleteTodoItem(this.todoItemId).then(() => {
          this.snackBar.open('TODO Item deleted successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/todo']);
        });
      }
    });
  }

  markComplete(): void {
    const today = new Date().toISOString().split('T')[0];
    this.todoService.markTodoItemComplete(this.todoItemId, today).then(() => {
      this.snackBar.open('TODO Item  marked as complete!', 'Close', {
        duration: 3000,
      });
      this.todoItem$ = this.todoService.getTodoItem(this.todoItemId);
    });
  }

  isCompletedToday(todoItem: TodoItemModel): boolean {
    const today = new Date().toISOString().split('T')[0];
    return todoItem.completedDates.includes(today);
  }

  getRecentDates(todoItem: TodoItemModel): string[] {
    return todoItem.completedDates
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, 10);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
