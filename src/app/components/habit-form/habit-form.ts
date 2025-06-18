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
import { HabitService } from '../../services/habit';

@Component({
  selector: 'app-habit-form',
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
  templateUrl: './habit-form.html',
  styleUrl: './habit-form.scss',
})
export class HabitFormComponent implements OnInit {
  habitForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  habitId?: string;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private habitService = inject(HabitService);

  ngOnInit(): void {
    this.initForm();

    this.habitId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEditMode = !!this.habitId;

    if (this.isEditMode && this.habitId) {
      this.loadHabit(this.habitId);
    }
  }

  private initForm(): void {
    this.habitForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      category: ['Health', Validators.required],
      isActive: [true],
    });
  }

  private loadHabit(id: string): void {
    this.habitService.getHabit(id).subscribe((habit) => {
      if (habit) {
        this.habitForm.patchValue({
          name: habit.name,
          description: habit.description,
          category: habit.category,
          isActive: habit.isActive,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.habitForm.valid) {
      this.isSubmitting = true;
      const formValue = this.habitForm.value;

      if (this.isEditMode && this.habitId) {
        this.habitService
          .updateHabit(this.habitId, formValue)
          .then(() => {
            this.snackBar.open('Habit updated successfully!', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/habits']);
          })
          .catch(() => {
            this.snackBar.open('Error updating habit', 'Close', {
              duration: 3000,
            });
            this.isSubmitting = false;
          });
      } else {
        this.habitService
          .createHabit(formValue)
          .then(() => {
            this.snackBar.open('Habit created successfully!', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/habits']);
          })
          .catch(() => {
            this.snackBar.open('Error creating habit', 'Close', {
              duration: 3000,
            });
            this.isSubmitting = false;
          });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/habits']);
  }
}
