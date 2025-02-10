# IPFS Gatekeeper

## 目录
- [简介](#简介)
- [功能](#功能)
- [安装](#安装)
- [使用方法](#使用方法)
  - [获取KUBO镜像列表](#获取kubo镜像列表)
  - [删除镜像](#删除镜像)
  - [获取KUBO容器信息](#获取kubo容器信息)
  - [拉取KUBO镜像](#拉取kubo镜像)
  - [创建并启动KUBO容器](#创建并启动kubo容器)
  - [启动KUBO容器](#启动kubo容器)
  - [停止KUBO容器](#停止kubo容器)
  - [获取KUBO配置信息](#获取kubo配置信息)
  - [修改KUBO配置信息](#修改kubo配置信息)
  - [KUBO API转发](#kubo-api转发)
  - [网关获取文件（白名单验证）](#网关获取文件白名单验证)

## 简介

`ipfs-gatekeeper` 是一个用于管理IPFS节点的应用程序。

## 功能

- 拉取 kubo 的 docker 镜像，创建 kubo 容器并运行；
- kubo 容器的启动和停止；
- kubo api 的转发；
- cid 白名单。

## 安装

在项目的根目录下执行以下命令

1. ```docker build -t ipfs-gatekeeper .```
2. ```docker run -p 8000:8000 ipfs-gatekeeper```

## 使用方法

#### 获取KUBO镜像列表
请求方法: ```GET```

路径: ```/images```

功能描述: 获取KUBO镜像的列表。

请求头:
- Authorization (string, required): 预设的令牌。

响应:
- 状态码: 200 OK
- 响应体: 镜像列表的 JSON 对象

#### 删除镜像
请求方法: ```GET```

路径: ```/remove-image```

功能描述: 删除指定的镜像。

请求头:
- Authorization (string, required): 预设的令牌。

查询参数:
- id (string, required): 镜像的 ID。

响应:
- 状态码: 200 OK
- 响应体: 删除成功的消息

#### 获取KUBO容器信息
请求方法: ```GET```

路径: ```/container```

功能描述: 获取KUBO容器的信息。

请求头:
- Authorization (string, required): 预设的令牌。

响应:
- 状态码: 200 OK
- 响应体: 容器信息的 JSON 对象

#### 拉取KUBO镜像
请求方法: ```GET```

路径: ```/pull```

功能描述: 从 Docker 仓库拉取KUBO镜像。

请求头:

- Authorization (string, required): 预设的令牌。
查询参数:

- tag (string, required): kubo镜像的tag。
响应:

- 状态码: 200 OK
- 响应体: 拉取成功的消息

#### 创建并启动KUBO容器
请求方法: ```GET```

路径: ```/create```

功能描述: 创建并启动一个KUBO容器（会移除旧的容器）。

请求头:
- Authorization (string, required): 预设的令牌。

查询参数:
- tag (string, required): kubo镜像的tag。

响应:
- 状态码: 200 OK
- 响应体: 创建成功的消息

#### 启动KUBO容器
请求方法: ```GET```

路径: ```/start```

功能描述: 启动KUBO容器。

请求头:
- Authorization (string, required): 预设的令牌。

响应:
- 状态码: 200 OK
- 响应体: 启动成功的消息

#### 停止KUBO容器
请求方法: ```GET```

路径: ```/stop```

功能描述: 停止KUBO容器。

请求头:
- Authorization (string, required): 预设的令牌。

响应:
- 状态码: 200 OK
- 响应体: 停止成功的消息

#### 获取KUBO配置信息
请求方法: ```GET```

路径: ```/config```

功能描述: 获取配置信息。

请求头:
- Authorization (string, required): 预设的令牌。

响应:
- 状态码: 200 OK
- 响应体: 配置信息的 JSON 对象

#### 修改KUBO配置信息
请求方法: ```PUT```

路径: ```/config```

功能描述: 修改配置信息。

请求头:
- Authorization (string, required): 预设的令牌。

请求体:
- JSON 格式的配置信息。

响应:
- 状态码: 200 OK
- 响应体: 修改成功的消息

#### KUBO API 转发
请求方法: ```ALL```

路径: ```/kubo-proxy/(.*)```

功能描述: 转发请求到 Kubo 服务。

请求头:
- Authorization (string, required): 预设的令牌。

响应:
- 状态码: 根据转发请求的结果
- 响应体: 转发请求的结果

#### 网关获取文件（白名单验证）
请求方法: ```GET```

路径: ```/ipfs/(.*)```

功能描述: 验证cid白名单，然后通过网关获取文件。

响应:
- 状态码: 根据转发请求的结果
- 响应体: 转发请求的结果