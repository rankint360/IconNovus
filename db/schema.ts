import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const marketplaceIcons = sqliteTable(
  "marketplace_icons",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    category: text("category").notNull(),
    style: text("style").notNull(),
    priceCents: integer("price_cents").notNull().default(100),
    formats: text("formats").notNull(),
    creatorId: text("creator_id").notNull(),
    creatorEmail: text("creator_email").notNull(),
    portfolioUrl: text("portfolio_url"),
    description: text("description"),
    objectKey: text("object_key").notNull(),
    originalFilename: text("original_filename").notNull(),
    contentType: text("content_type").notNull(),
    status: text("status", { enum: ["pending", "published", "rejected"] }).notNull().default("pending"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    reviewedAt: text("reviewed_at"),
  },
  (table) => [
    index("idx_marketplace_icons_status_created").on(table.status, table.createdAt),
    index("idx_marketplace_icons_creator").on(table.creatorId),
  ],
);
