import { Application } from 'oak';
import router from './routes/index.ts';

if (Deno.env.get('DENO_ENV') === 'build') {
	console.log('Building...');
	Deno.exit(0);
}
// 从环境变量中获取端口号，如果没有设置，则默认使用8000
const port = Number(Deno.env.get('PORT') ?? 8000);
const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

// 错误处理中间件
app.use((ctx) => {
	ctx.response.status = 404;
	ctx.response.body = 'Not Found';
});

app.addEventListener('listen', () => {
	console.log(`Listening on localhost:${port}`);
});

await app.listen({ port });
