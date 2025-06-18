import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  docData,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { HabitModel } from '../models/habit.model';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private firestore = inject(Firestore);
  private habitsRef = collection(this.firestore, 'habits');

  getHabits(): Observable<HabitModel[]> {
    return collectionData(this.habitsRef, { idField: 'id' }) as Observable<
      HabitModel[]
    >;
  }

  getHabit(id: string): Observable<HabitModel> {
    const habitDoc = doc(this.firestore, `habits/${id}`);
    return docData(habitDoc, { idField: 'id' }) as Observable<HabitModel>;
  }

  async createHabit(
    habit: Omit<
      HabitModel,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'currentStreak'
      | 'longestStreak'
      | 'completedDates'
    >
  ): Promise<void> {
    const now = new Date();
    const newHabit: HabitModel = {
      ...habit,
      createdAt: now,
      updatedAt: now,
      currentStreak: 0,
      longestStreak: 0,
      completedDates: [],
      isActive: true,
    };
    await addDoc(this.habitsRef, newHabit);
  }

  async updateHabit(id: string, habit: Partial<HabitModel>): Promise<void> {
    const habitDocRef = doc(this.firestore, `habits/${id}`);

    const updatedHabit: Partial<HabitModel> = {
      ...habit,
      updatedAt: new Date(),
    };

    await updateDoc(habitDocRef, updatedHabit);
  }

  async deleteHabit(id: string): Promise<void> {
    const habitDoc = doc(this.firestore, `habits/${id}`);
    await deleteDoc(habitDoc);
  }

  async markHabitComplete(habitId: string, date: string): Promise<void> {
    const habitDocRef = doc(this.firestore, `habits/${habitId}`);
    const snapshot = await getDoc(habitDocRef);
    const habit = snapshot.data() as HabitModel;

    if (!habit.isActive || habit.completedDates.includes(date)) {
      return;
    }

    habit.completedDates.push(date);
    habit.completedDates.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    let streak = 1;
    for (let i = habit.completedDates.length - 1; i > 0; i--) {
      const curr = new Date(habit.completedDates[i]);
      const prev = new Date(habit.completedDates[i - 1]);

      const diff = Math.floor(
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diff === 1) {
        streak++;
      } else if (diff > 1) {
        break;
      }
    }

    habit.currentStreak = streak;
    habit.longestStreak = Math.max(habit.longestStreak, streak);

    habit.updatedAt = new Date();

    const { id, createdAt, ...updatableData } = habit;
    await updateDoc(habitDocRef, updatableData);
  }

  getHabitStats(): Observable<any> {
    return this.getHabits().pipe(
      map((habits) => {
        const totalHabits = habits.length;
        const activeHabits = habits.filter((h) => h.isActive).length;
        const today = new Date().toISOString().split('T')[0];
        const completedToday = habits.filter((h) =>
          h.completedDates.includes(today)
        ).length;
        const averageStreak =
          habits.reduce((sum, h) => sum + h.currentStreak, 0) /
          (totalHabits || 1);

        return {
          totalHabits,
          activeHabits,
          completedToday,
          averageStreak: Math.round(averageStreak * 10) / 10,
        };
      })
    );
  }

  async seedHabits(): Promise<void> {
    const now = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    const habits: Omit<HabitModel, 'id'>[] = [
      {
        name: 'Morning Run',
        description: 'Go for a 30-minute jog every morning.',
        category: 'Health',
        createdAt: now,
        updatedAt: now,
        currentStreak: 2,
        longestStreak: 3,
        isActive: true,
        completedDates: [
          formatDate(new Date(now.getTime() - 2 * 86400000)),
          formatDate(new Date(now.getTime() - 1 * 86400000)),
        ],
      },
      {
        name: 'Read a Book',
        description: 'Read 10 pages of a book each day.',
        category: 'Learning',
        createdAt: now,
        updatedAt: now,
        currentStreak: 3,
        longestStreak: 4,
        isActive: true,
        completedDates: [
          formatDate(new Date(now.getTime() - 3 * 86400000)),
          formatDate(new Date(now.getTime() - 2 * 86400000)),
          formatDate(new Date(now.getTime() - 1 * 86400000)),
        ],
      },
      {
        name: 'Meditate',
        description: '10 minutes meditation.',
        category: 'Wellness',
        createdAt: now,
        updatedAt: now,
        currentStreak: 0,
        longestStreak: 5,
        isActive: false,
        completedDates: [
          formatDate(new Date(now.getTime() - 11 * 86400000)),
          formatDate(new Date(now.getTime() - 10 * 86400000)),
          formatDate(new Date(now.getTime() - 9 * 86400000)),
          formatDate(new Date(now.getTime() - 8 * 86400000)),
          formatDate(new Date(now.getTime() - 7 * 86400000)),
        ],
      },
      {
        name: 'Write Journal',
        description: 'Write down 3 thoughts each day.',
        category: 'Productivity',
        createdAt: now,
        updatedAt: now,
        currentStreak: 1,
        longestStreak: 1,
        isActive: true,
        completedDates: [formatDate(new Date(now.getTime() - 1 * 86400000))],
      },
      {
        name: 'Drink Water',
        description: 'Drink at least 2 liters of water daily.',
        category: 'Health',
        createdAt: now,
        updatedAt: now,
        currentStreak: 0,
        longestStreak: 0,
        isActive: true,
        completedDates: [],
      },
    ];

    for (const habit of habits) {
      await addDoc(this.habitsRef, habit);
    }

    console.log('✅ Mock habits seeded');
  }
}
