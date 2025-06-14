import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => categories.id),
  category: text("category").notNull(), // Mantido para compatibilidade
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  date: text("date").notNull(),
  time: text("time").notNull(),
  completed: boolean("completed").notNull().default(false),
  reminderEnabled: boolean("reminder_enabled").notNull().default(false),
  reminderTime: text("reminder_time"), // 15min, 1hour, 1day
  isRecurring: boolean("is_recurring").notNull().default(false),
  recurringType: text("recurring_type"), // daily, weekly, monthly
  tags: text("tags").array(), // Tags para busca avançada
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  categoryId: integer("category_id").references(() => categories.id),
  priority: text("priority").notNull().default("medium"),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  reminderEnabled: boolean("reminder_enabled").notNull().default(false),
  reminderTime: text("reminder_time"),
  isRecurring: boolean("is_recurring").notNull().default(false),
  recurringType: text("recurring_type"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  tasks: many(tasks),
  appointments: many(appointments),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  category: one(categories, {
    fields: [appointments.categoryId],
    references: [categories.id],
  }),
}));

// Schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  reminderTime: z.enum(["15min", "1hour", "1day"]).optional(),
  recurringType: z.enum(["daily", "weekly", "monthly"]).optional(),
  tags: z.array(z.string()).optional(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  reminderTime: z.enum(["15min", "1hour", "1day"]).optional(),
  recurringType: z.enum(["daily", "weekly", "monthly"]).optional(),
  tags: z.array(z.string()).optional(),
});

// Types
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
