import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';
import { HabitModel } from '../../models/habit.model';
import { HabitService } from '../../services/habit';

@Component({
  selector: 'app-habit-list',
  imports: [
    CommonModule,
    AsyncPipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  templateUrl: './habit-list.html',
  styleUrl: './habit-list.scss',
})
export class HabitListComponent implements OnInit {
  habits$!: Observable<HabitModel[]>;
  stats$!: Observable<any>;

  private habitService = inject(HabitService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    // this.habitService.seedHabits();
    this.habits$ = this.habitService.getHabits();
    this.stats$ = this.habitService.getHabitStats();
  }

  createHabit(): void {
    this.router.navigate(['/habits/new']);
  }

  viewHabit(id: string): void {
    this.router.navigate(['/habits', id]);
  }

  editHabit(id: string): void {
    this.router.navigate(['/habits/edit', id]);
  }

  deleteHabit(id: string, name: string): void {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      this.habitService.deleteHabit(id).then(() => {
        this.snackBar.open('Habit deleted successfully', 'Close', {
          duration: 3000,
        });
      });
    }
  }

  markComplete(id: string): void {
    const today = new Date().toISOString().split('T')[0];
    this.habitService.markHabitComplete(id, today).then(() => {
      this.snackBar.open('Habit marked as complete!', 'Close', {
        duration: 3000,
      });
    });
  }

  isCompletedToday(habit: HabitModel): boolean {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  }
}
