# 使用 Deno 官方提供的轻量级镜像
FROM denoland/deno:alpine-2.1.1

# 更新包列表并安装 git
RUN apk add --no-cache git

# 设置工作目录
WORKDIR /app

# 复制依赖项和项目文件到工作目录
COPY . .

# 设置 Deno 缓存以提升后续构建效率
ENV NPM_CONFIG_REGISTRY https://registry.npmmirror.com/

RUN deno cache --reload --unstable --importmap=import_map.json *.ts */*.ts 

# 强制 Deno 预加载 SQLite 依赖
RUN DENO_ENV=build deno run --allow-net --allow-read --allow-run --allow-ffi --allow-env --allow-write src/app.ts 

# 暴露应用服务端口（假设应用在 8000 端口上运行）
EXPOSE 8000

# 使用 deno task 启动应用
CMD ["task", "start"]
