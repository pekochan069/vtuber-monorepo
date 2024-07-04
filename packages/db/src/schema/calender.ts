import { sql } from "drizzle-orm";
import { sqliteView, text } from "drizzle-orm/sqlite-core";
import { vtubers } from "./vtuber";

export const calenderView = sqliteView("view_calender", {
  id: text("id").primaryKey().notNull(),
  kr: text("kr").notNull(),
  date: text("date").notNull(),
  type: text("type").notNull(),
  icon: text("icon").notNull(),
}).as(
  sql`select id, kr, date, type, icon from (select id, kr, strftime('%m-%d', debut, 'unixepoch') as date, "d" as type, retired, icon from vtuber_vtubers where vtuber_vtubers.retired = 0 union select id, kr, strftime('%m-%d', birthday, 'unixepoch') as date, "b" as type, retired, icon from vtuber_vtubers where vtuber_vtubers.retired = 0) group by date`,
);
