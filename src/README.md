# EE Life Design · 门店营运台

家具销售管理系统原型（React + Vite）。

## 本地开发

```bash
npm install
npm run dev
```

## 部署到 Vercel

1. 把这个专案上传到 GitHub（见下方步骤）
2. 到 https://vercel.com → Add New Project → 选这个仓库 → Deploy
3. Vercel 会自动侦测到这是 Vite 专案，不需要额外设定

## 目前状态

这是纯前端原型，所有资料（订单、账号、佣金等）只存在浏览器当下的记忆体里，重新整理页面会重置回种子资料。要正式使用，需要接上真正的后端数据库（如 Supabase）。
