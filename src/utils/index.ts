import { Context } from "oak";
import { type Error } from "@/const/error.ts";

export function checkParams(ctx: Context, params: string[]): { [key: string]: string } | false {
	const queryParams = ctx.request.url.searchParams;
	const res: { [key: string]: string } = {};
	for (const param of params) {
		const val = queryParams.get(param);
		if (!val) return false;
		else res[param] = val;
	}
	return res;
}
export function setError(ctx: Context, error: Error) {
	ctx.response.body = {
		code: error.code,
		msg: error.msg,
	};
}
export function setResponse(ctx: Context, code: number, data: any, msg: string) {
	ctx.response.body = {
		code,
		msg,
		data,
	};
}
