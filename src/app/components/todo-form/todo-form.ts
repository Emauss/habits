import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TodoService } from '../../services/todo';

@Component({
  selector: 'app-todo-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.scss',
})
export class TodoFormComponent implements OnInit {
  todoForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  todoItemId?: string;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private todoService = inject(TodoService);

  ngOnInit(): void {
    this.initForm();

    this.todoItemId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEditMode = !!this.todoItemId;

    if (this.isEditMode && this.todoItemId) {
      this.loadTodo(this.todoItemId);
    }
  }

  private initForm(): void {
    this.todoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      category: ['Health', Validators.required],
      isActive: [true],
    });
  }

  private loadTodo(id: string): void {
    this.todoService.getTodoItem(id).subscribe((todoItem) => {
      if (todoItem) {
        this.todoForm.patchValue({
          name: todoItem.name,
          description: todoItem.description,
          category: todoItem.category,
          isActive: todoItem.isActive,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      this.isSubmitting = true;
      const formValue = this.todoForm.value;

      if (this.isEditMode && this.todoItemId) {
        this.todoService
          .updateTodoItem(this.todoItemId, formValue)
          .then(() => {
            this.snackBar.open('TODO Item updated successfully!', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/todo']);
          })
          .catch(() => {
            this.snackBar.open('Error updating todo item', 'Close', {
              duration: 3000,
            });
            this.isSubmitting = false;
          });
      } else {
        this.todoService
          .createTodoItem(formValue)
          .then(() => {
            this.snackBar.open('TODO Item created successfully!', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/todo']);
          })
          .catch(() => {
            this.snackBar.open('Error creating todo item', 'Close', {
              duration: 3000,
            });
            this.isSubmitting = false;
          });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/todo']);
  }
}
