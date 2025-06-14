import { tasks, appointments, categories, type Task, type Appointment, type Category, type InsertTask, type InsertAppointment, type InsertCategory } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Task operations
  getTasks(filters?: TaskFilters): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  searchTasks(query: string): Promise<Task[]>;
  
  // Appointment operations
  getAppointments(filters?: AppointmentFilters): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  searchAppointments(query: string): Promise<Appointment[]>;
}

export interface TaskFilters {
  category?: string;
  priority?: string;
  completed?: boolean;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  sortBy?: 'date' | 'priority' | 'title' | 'created';
  sortOrder?: 'asc' | 'desc';
}

export interface AppointmentFilters {
  category?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  sortBy?: 'date' | 'priority' | 'title' | 'created';
  sortOrder?: 'asc' | 'desc';
}

export class DatabaseStorage implements IStorage {
  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();
    return category || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Task operations with advanced filtering
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    let query = db.select().from(tasks);
    
    if (filters) {
      const conditions = [];
      
      if (filters.category) {
        conditions.push(eq(tasks.category, filters.category));
      }
      
      if (filters.priority) {
        conditions.push(eq(tasks.priority, filters.priority));
      }
      
      if (filters.completed !== undefined) {
        conditions.push(eq(tasks.completed, filters.completed));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      // Apply sorting
      if (filters.sortBy) {
        const order = filters.sortOrder === 'asc' ? asc : desc;
        switch (filters.sortBy) {
          case 'date':
            query = query.orderBy(order(tasks.date));
            break;
          case 'priority':
            query = query.orderBy(order(tasks.priority));
            break;
          case 'title':
            query = query.orderBy(order(tasks.title));
            break;
          case 'created':
            query = query.orderBy(order(tasks.createdAt));
            break;
          default:
            query = query.orderBy(desc(tasks.createdAt));
        }
      } else {
        query = query.orderBy(desc(tasks.createdAt));
      }
    } else {
      query = query.orderBy(desc(tasks.createdAt));
    }
    
    return await query;
  }

  async searchTasks(searchQuery: string): Promise<Task[]> {
    return await db.select().from(tasks).where(
      or(
        ilike(tasks.title, `%${searchQuery}%`),
        ilike(tasks.description, `%${searchQuery}%`),
        ilike(tasks.category, `%${searchQuery}%`)
      )
    ).orderBy(desc(tasks.createdAt));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }

  async updateTask(id: number, updateData: Partial<InsertTask>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();
    return task || undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount > 0;
  }

  // Appointment operations
  async getAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments);
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values(insertAppointment)
      .returning();
    return appointment;
  }

  async updateAppointment(id: number, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set(updateData)
      .where(eq(appointments.id, id))
      .returning();
    return appointment || undefined;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
