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
import { TodoItemModel } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private firestore = inject(Firestore);
  private todoListRef = collection(this.firestore, 'habits');

  getTodoItems(): Observable<TodoItemModel[]> {
    return collectionData(this.todoListRef, { idField: 'id' }) as Observable<
      TodoItemModel[]
    >;
  }

  getTodoItem(id: string): Observable<TodoItemModel> {
    const todoDoc = doc(this.firestore, `habits/${id}`);
    return docData(todoDoc, { idField: 'id' }) as Observable<TodoItemModel>;
  }

  async createTodoItem(
    todoItem: Omit<
      TodoItemModel,
      'id' | 'createdAt' | 'updatedAt' | 'completedDates'
    >
  ): Promise<void> {
    const now = new Date();
    const newTodoItem: TodoItemModel = {
      ...todoItem,
      createdAt: now,
      updatedAt: now,
      completedDates: [],
      isActive: true,
    };
    await addDoc(this.todoListRef, newTodoItem);
  }

  async updateTodoItem(
    id: string,
    todoItem: Partial<TodoItemModel>
  ): Promise<void> {
    const todoItemDocRef = doc(this.firestore, `habits/${id}`);

    const updatedTodoItem: Partial<TodoItemModel> = {
      ...todoItem,
      updatedAt: new Date(),
    };

    await updateDoc(todoItemDocRef, updatedTodoItem);
  }

  async deleteTodoItem(id: string): Promise<void> {
    const todoDoc = doc(this.firestore, `habits/${id}`);
    await deleteDoc(todoDoc);
  }

  async markTodoItemComplete(todoItemId: string, date: string): Promise<void> {
    const todoItemDocRef = doc(this.firestore, `habits/${todoItemId}`);
    const snapshot = await getDoc(todoItemDocRef);
    const todoItem = snapshot.data() as TodoItemModel;

    if (!todoItem.isActive || todoItem.completedDates.includes(date)) {
      return;
    }

    todoItem.completedDates.push(date);
    todoItem.completedDates.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    for (let i = todoItem.completedDates.length - 1; i > 0; i--) {
      const curr = new Date(todoItem.completedDates[i]);
      const prev = new Date(todoItem.completedDates[i - 1]);

      const diff = Math.floor(
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diff > 1) {
        break;
      }
    }

    todoItem.updatedAt = new Date();

    const { id, createdAt, ...updatableData } = todoItem;
    await updateDoc(todoItemDocRef, updatableData);
  }

  getTodoListStats(): Observable<any> {
    return this.getTodoItems().pipe(
      map((todoList) => {
        const totalTodoItems = todoList.length;
        const activeTodoItems = todoList.filter((item) => item.isActive).length;
        const today = new Date().toISOString().split('T')[0];
        const completedToday = todoList.filter((item) =>
          item.completedDates.includes(today)
        ).length;

        return {
          totalTodoItems,
          activeTodoItems,
          completedToday,
        };
      })
    );
  }

  async seedTodoList(): Promise<void> {
    const now = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    const todoList: Omit<TodoItemModel, 'id'>[] = [
      {
        name: 'Morning Run',
        description: 'Go for a 30-minute jog every morning.',
        category: 'Health',
        createdAt: now,
        updatedAt: now,
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
        isActive: true,
        completedDates: [formatDate(new Date(now.getTime() - 1 * 86400000))],
      },
      {
        name: 'Drink Water',
        description: 'Drink at least 2 liters of water daily.',
        category: 'Health',
        createdAt: now,
        updatedAt: now,
        isActive: true,
        completedDates: [],
      },
    ];

    for (const item of todoList) {
      await addDoc(this.todoListRef, item);
    }

    console.log('✅ Mock todo stuff seeded');
  }
}
