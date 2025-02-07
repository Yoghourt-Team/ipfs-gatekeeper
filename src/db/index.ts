import { SqliteOrm } from "sqlite-orm";
const orm = new SqliteOrm({
	dbPath: "./src/db/database.db",
});
export default orm;
