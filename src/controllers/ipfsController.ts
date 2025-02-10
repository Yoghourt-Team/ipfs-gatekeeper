import { type Context } from "oak";
import cidService from "@/services/cidService.ts";
import { setError } from "@/utils/index.ts";
import error from "@/const/error.ts";
import config from "@/config/index.ts";

export default {
	async get(ctx: Context) {
		// 检查参数
		const cid = ctx.request.url.pathname.replace("/ipfs/", "").replace("/", "");
		if (!cid) {
			setError(ctx, error.ParamError);
			return;
		}

		// 判断是否在白名单中
		const data = cidService.getWhiteList(cid);
		if (!data && config.whitelist.api) {
			const headers = new Headers();
			if (config.whitelist.token) {
				headers.set("Authorization", config.whitelist.token);
			}

			// 请求接口，确认是否在白名单中
			const res = await fetch(config.whitelist.api + "?cid=" + cid, {
				method: "GET",
				headers,
			});

			const whiteStatus = await res.json();

			if (whiteStatus) {
				// 添加到白名单
				cidService.setWhiteList(cid);
			} else {
				// 拒绝访问
				setError(ctx, error.FileNotAuthorized);
				return;
			}
		}

		// ipfs转发
		const { request } = ctx;
		const { method, url, headers } = request;

		// 构建转发的 URL
		const forwardUrl = new URL(url.pathname, `http://${config.kuboHost}:8080`);

		// 构建转发请求的选项
		const forwardRequestInit: RequestInit = {
			method,
			headers: new Headers(headers),
			redirect: "manual",
		};

		// 发送请求
		const response = await fetch(forwardUrl.toString(), forwardRequestInit);

		// 设置响应头
		ctx.response.headers = new Headers(response.headers);
		ctx.response.status = response.status;

		// 设置响应体
		ctx.response.body = response.body;
	},
};
