import { SqlTable } from "sqlite-orm";
import orm from "../index.ts";

@orm.model()
class Whitelist extends SqlTable {
	public cid = "";
}
orm.modelsLoaded();

export default Whitelist;
