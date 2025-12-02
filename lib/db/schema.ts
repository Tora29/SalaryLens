import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, decimal } from 'drizzle-orm/pg-core';

// UUID生成用ヘルパー
const generateId = () => crypto.randomUUID();

// ========================================
// Users テーブル
// ========================================
export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId()),
  email: text('email').notNull().unique(),
  name: text('name'),
  hashedPassword: text('hashed_password'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ========================================
// Salaries テーブル
// ========================================
export const salaries = pgTable('salaries', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  paymentMonth: timestamp('payment_month', { withTimezone: true }).notNull(),
  grossAmount: decimal('gross_amount', { precision: 10, scale: 0 }).notNull(),
  netAmount: decimal('net_amount', { precision: 10, scale: 0 }).notNull(),
  overtimePay: decimal('overtime_pay', { precision: 10, scale: 0 }),
  pdfUrl: text('pdf_url'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ========================================
// Deductions テーブル
// ========================================
export const deductions = pgTable('deductions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId()),
  salaryId: text('salary_id')
    .notNull()
    .references(() => salaries.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'health_insurance', 'pension', 'tax', etc
  amount: decimal('amount', { precision: 10, scale: 0 }).notNull(),
  note: text('note'),
});

// ========================================
// リレーション定義
// ========================================
export const usersRelations = relations(users, ({ many }) => ({
  salaries: many(salaries),
}));

export const salariesRelations = relations(salaries, ({ one, many }) => ({
  user: one(users, {
    fields: [salaries.userId],
    references: [users.id],
  }),
  deductions: many(deductions),
}));

export const deductionsRelations = relations(deductions, ({ one }) => ({
  salary: one(salaries, {
    fields: [deductions.salaryId],
    references: [salaries.id],
  }),
}));
