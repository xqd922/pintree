#!/bin/bash

# Pintree JSON 模式构建脚本
echo "🚀 开始构建 Pintree (JSON 模式)..."

# 检查数据文件是否存在
if [ ! -f "data/pintree.json" ]; then
    echo "❌ 错误: data/pintree.json 文件不存在"
    exit 1
fi

echo "✅ 数据文件检查通过"

# 运行 Next.js 构建
echo "🔨 运行 Next.js 构建..."
next build

echo "🎉 构建完成！"