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
import { HabitService } from '../../services/habit';
import { HabitModel } from '../../models/habit.model';

@Component({
  selector: 'app-habit-detail',
  imports: [
    CommonModule,
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  templateUrl: './habit-detail.html',
  styleUrls: ['./habit-detail.scss'],
})
export class HabitDetailComponent implements OnInit {
  habit$!: Observable<HabitModel | undefined>;
  habitId!: string;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private habitService = inject(HabitService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.habitId = this.route.snapshot.paramMap.get('id')!;
    this.habit$ = this.habitService.getHabit(this.habitId);
  }

  goBack(): void {
    this.router.navigate(['/habits']);
  }

  editHabit(): void {
    this.router.navigate(['/habits/edit', this.habitId]);
  }

  deleteHabit(): void {
    this.habit$.subscribe((habit) => {
      if (
        habit &&
        confirm(`Are you sure you want to delete "${habit.name}"?`)
      ) {
        this.habitService.deleteHabit(this.habitId).then(() => {
          this.snackBar.open('Habit deleted successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/habits']);
        });
      }
    });
  }

  markComplete(): void {
    const today = new Date().toISOString().split('T')[0];
    this.habitService.markHabitComplete(this.habitId, today).then(() => {
      this.snackBar.open('Habit  marked as complete!', 'Close', {
        duration: 3000,
      });
      this.habit$ = this.habitService.getHabit(this.habitId);
    });
  }

  isCompletedToday(habit: HabitModel): boolean {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  }

  getRecentDates(habit: HabitModel): string[] {
    return habit.completedDates
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
