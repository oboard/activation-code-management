# 激活码管理系统

一个基于 Nuxt 3 和 Redis 的激活码管理系统，用于生成、管理和验证激活码。

## 功能特点

- 生成唯一的5位激活码（大写字母和数字组合）
- 批量生成激活码（最多100个）
- 验证和使用激活码
- 分页显示激活码列表
- 一键复制激活码
- 密码保护的管理界面
- 美观的 UI 界面（基于 Tailwind CSS）

## 技术栈

- Nuxt 3
- TypeScript
- Redis (Upstash)
- Pinia (状态管理)
- Tailwind CSS (样式)

## 环境要求

- Node.js 16.x 或更高版本
- Redis 数据库（推荐使用 Upstash）

## 安装

1. 克隆仓库：
```bash
git clone [仓库地址]
cd activation-code-management
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：

创建 `.env` 文件并添加以下配置：
```env
# Redis 配置
KV_REST_API_URL=你的_REDIS_URL
KV_REST_API_TOKEN=你的_REDIS_TOKEN

# 管理界面密码（默认：admin123）
ADMIN_PASSWORD=你的管理密码
```

## 开发

启动开发服务器：
```bash
npm run dev
```

## 构建和部署

1. 构建生产版本：
```bash
npm run build
```

2. 启动生产服务器：
```bash
npm run preview
```

## API 接口

### 生成激活码
- 端点：`POST /api/add`
- 请求体：
```json
{
  "amount": number // 要生成的激活码数量，默认为1
}
```
- 响应：
```json
{
  "success": true,
  "data": ["ABC12", "XY3Z9", ...]
}
```

### 获取激活码列表
- 端点：`GET /api/list`
- 响应：
```json
{
  "success": true,
  "data": [
    {
      "code": "ABC12",
      "createdAt": "2024-01-20T12:00:00Z"
    },
    ...
  ]
}
```

### 验证激活码
- 端点：`POST /api/validate`
- 请求体：
```json
{
  "code": "ABC12"
}
```
- 响应：
```json
{
  "success": true,
  "message": "Code validated and consumed successfully"
}
```

## 许可证

MIT 