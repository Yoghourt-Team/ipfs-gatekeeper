import { Application } from "oak";
import router from "./routes/index.ts";
import unauthenticatedRouter from "./routes/unauthenticated.ts";

const port = 8000;
const app = new Application();

// 错误处理中间件
app.use(async (ctx, next) => {
	try {
		await next();
		if (!ctx.response.body && !["HEAD", "OPTIONS"].includes(ctx.request.method)) {
			ctx.response.status = 404;
			ctx.response.body = "Not Found";
		}
	} catch (err) {
		console.log(err);
		ctx.response.status = 500;
		ctx.response.body = "Internal Server Error";
	}
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(unauthenticatedRouter.routes());
app.use(unauthenticatedRouter.allowedMethods());

app.addEventListener("listen", () => {
	console.log(`Listening on localhost:${port}`);
});

await app.listen({ port });
