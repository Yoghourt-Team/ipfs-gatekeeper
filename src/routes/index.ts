import { Router } from "oak";
import kuboController from "../controllers/kuboController.ts";
import ipfsController from "../controllers/ipfsController.ts";
import config from "@config";

const router = new Router();

// ipfs获取文件
router.get("/ipfs/(.*)", ipfsController.get);

router.options("/kubo-proxy/(.*)", (ctx) => {
	ctx.response.status = 200;
});

// 验证token中间件
router.use(async (ctx, next) => {
	// 验证token
	if (ctx.request.headers.get("Authorization") !== config.token) {
		ctx.response.status = 401;
		ctx.response.body = "Unauthorized";
		return;
	}
	await next();
});

// 转发路由
router.all("/kubo-proxy/(.*)", kuboController.forward);

// 获取镜像列表
router.get("/images", kuboController.images);

// 删除镜像
router.get("/remove-image", kuboController.removeImage);

// 获取容器信息
router.get("/container", kuboController.container);

// 拉取镜像
router.get("/pull", kuboController.pull);

// 创建并启动容器
router.get("/create", kuboController.create);

// 启动容器
router.get("/start", kuboController.start);

// 停止容器
router.get("/stop", kuboController.stop);

// 获取配置信息
router.get("/config", kuboController.getConfig);

// 修改配置信息
router.put("/config", kuboController.overrideConfig);

export default router;
