import { Application } from "oak";
import router from "./routes/index.ts";
import unauthenticatedRouter from "./routes/unauthenticated.ts";

const port = 8000;
const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.use(unauthenticatedRouter.routes());
app.use(unauthenticatedRouter.allowedMethods());

// 错误处理中间件
app.use((ctx) => {
	ctx.response.status = 404;
	ctx.response.body = "Not Found";
});

app.addEventListener("listen", () => {
	console.log(`Listening on localhost:${port}`);
});

await app.listen({ port });
