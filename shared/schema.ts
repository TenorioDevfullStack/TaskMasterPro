import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  completed: boolean("completed").notNull().default(false),
  reminderEnabled: boolean("reminder_enabled").notNull().default(false),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  reminderEnabled: boolean("reminder_enabled").notNull().default(false),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
