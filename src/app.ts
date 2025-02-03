import { Application } from "oak";
import router from "./routes/index.ts";

const port = 8000;
const app = new Application();

app.use(async (ctx, next) => {
	try {
		await next();
		if (!ctx.response.body) {
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

app.addEventListener("listen", () => {
	console.log(`Listening on localhost:${port}`);
});

await app.listen({ port });
