import { sql } from "drizzle-orm";
import { sqliteView, text } from "drizzle-orm/sqlite-core";
import { vtubers } from "./vtuber";

export const calenderView = sqliteView("view_calendar", {
  id: text("id").primaryKey().notNull(),
  kr: text("kr").notNull(),
  date: text("date").notNull(),
  type: text("type").notNull(),
  icon: text("icon").notNull(),
}).as(
  sql`create view view_calendar as select id, kr, date, type, small_icon as icon from (select id, kr, strftime('%m-%d', debut, 'unixepoch') as date, "d" as type, retired, small_icon from vtuber_vtubers where vtuber_vtubers.retired = 0 union select id, kr, strftime('%m-%d', birthday, 'unixepoch') as date, "b" as type, retired, small_icon from vtuber_vtubers where vtuber_vtubers.retired = 0) group by date`,
);
