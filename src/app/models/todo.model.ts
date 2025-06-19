export interface TodoItemModel {
  id?: string;
  name: string;
  description: string;
  category: string;
  completedDates: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
