import { type Context } from "oak";
import kuboService from "@/services/kuboService.ts";
import { setResponse, setError, checkParams } from "@/utils/index.ts";
import error from "@/const/error.ts";
import config from "@/config/index.ts";

export default {
	pull: async (ctx: Context) => {
		const params = checkParams(ctx, ["tag"]);
		if (!params) {
			setError(ctx, error.ParamError);
			return;
		}

		const stream = await kuboService.pullImage(params.tag);

		ctx.response.body = stream;
	},
	create: async (ctx: Context) => {
		const params = checkParams(ctx, ["tag"]);
		if (!params) {
			setError(ctx, error.ParamError);
			return;
		}

		// 删除容器
		const kuboContainer = await kuboService.checkKuboContainer();
		if (kuboContainer) {
			await kuboService.stopKuboContainer(kuboContainer.Id);
			await kuboService.removeContainer(kuboContainer.Id);
		}

		// 创建容器
		const container = await kuboService.createAndStartContainer(params.tag);
		setResponse(ctx, 200, container, "success");
	},
	getConfig: async (ctx: Context) => {
		const kuboContainer = await kuboService.checkKuboContainer();
		if (!kuboContainer) {
			setError(ctx, error.ContainerNotFound);
			return;
		}

		const config = await kuboService.getKuboConfig(kuboContainer.Id);
		setResponse(ctx, 200, config, "success");
	},
	overrideConfig: async (ctx: Context) => {
		const params = await ctx.request.body.json();
		if (!params.id || !params.content) {
			setError(ctx, error.ParamError);
			return;
		}

		// 验证content是否是正确的json格式
		try {
			JSON.parse(params.content);
		} catch (_err) {
			setError(ctx, error.ParamError);
			return;
		}

		await kuboService.overrideKuboConfig(params.id, params.content);
		setResponse(ctx, 200, {}, "success");
	},
	start: async (ctx: Context) => {
		const kuboContainer = await kuboService.checkKuboContainer();
		if (!kuboContainer) {
			setError(ctx, error.ContainerNotFound);
			return;
		}

		await kuboService.startKuboContainer(kuboContainer.Id);
		setResponse(ctx, 200, {}, "success");
	},
	stop: async (ctx: Context) => {
		const kuboContainer = await kuboService.checkKuboContainer();
		if (!kuboContainer) {
			setError(ctx, error.ContainerNotFound);
			return;
		}

		await kuboService.stopKuboContainer(kuboContainer.Id);
		setResponse(ctx, 200, {}, "success");
	},
	container: async (ctx: Context) => {
		const list = await kuboService.checkKuboContainer();
		return setResponse(ctx, 200, list, "success");
	},
	images: async (ctx: Context) => {
		const data = await kuboService.getImageList();

		setResponse(ctx, 200, data, "success");
	},
	removeImage: async (ctx: Context) => {
		const params = checkParams(ctx, ["id"]);
		if (!params) {
			setError(ctx, error.ParamError);
			return;
		}

		await kuboService.removeImage(params.id);
		setResponse(ctx, 200, {}, "success");
	},
	forward: async (context: Context) => {
		const { request } = context;
		const { method, url, headers } = request;

		// 构建转发的 URL
		const forwardUrl = new URL(
			url.pathname.replace(/^\/kubo-proxy/, "") + url.search,
			`http://${config.kuboHost}:5001`
		);

		// 构建转发请求的选项
		const forwardRequestInit: RequestInit = {
			method,
			headers: new Headers(headers),
			// @ts-ignore 忽略类型检查
			body: request.body,
		};

		// 发送请求到本地端口 5001
		const response = await fetch(forwardUrl.toString(), forwardRequestInit);

		// 设置响应头
		context.response.headers = new Headers(response.headers);
		context.response.status = response.status;

		// 设置响应体
		context.response.body = response.body;
	},
};
