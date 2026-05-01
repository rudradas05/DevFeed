import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

/* =========================
   USERS
========================= */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: text("password").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   POSTS
========================= */
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),

  caption: text("caption"),
  image: text("image"),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   COMMENTS
========================= */
export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),

  text: text("text").notNull(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow(),
});

/* =========================
   LIKES (many-to-many)
========================= */
export const likes = pgTable(
  "likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueLike: unique().on(table.userId, table.postId),
  })
);

/* =========================
   🔁 FOLLOWS (user ↔ user)
========================= */
export const follows = pgTable(
  "follows",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    followingId: uuid("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueFollow: unique().on(table.followerId, table.followingId),
  })
);