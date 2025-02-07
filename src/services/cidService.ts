import orm from "@/db/index.ts";
import Whitelist from "../db/model/whitelist.ts";
export default {
	getWhiteList(cid: string) {
		try {
			const res = orm.findOne(Whitelist, {
				where: {
					clause: "cid = ?",
					values: [cid],
				},
			});
			return res;
		} catch (_err) {
			return null;
		}
	},
	setWhiteList(cid: string) {
		try {
			const obj = new Whitelist();
			obj.cid = cid;
			const res = orm.save(obj);
			return res;
		} catch (_err) {
			return null;
		}
	},
};
