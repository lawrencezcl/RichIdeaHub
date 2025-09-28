import { generateSEOMetadata } from './seo'
import type { Metadata } from 'next'

// Favorites page metadata
export function generateFavoritesPageMetadata(): Metadata {
  return generateSEOMetadata({
    title: "我的收藏 - 副业案例收藏夹",
    description: "管理您收藏的副业案例，快速访问感兴趣的赚钱项目。个性化的案例收藏功能，帮助您追踪和学习最有价值的副业项目。",
    keywords: ["收藏", "副业案例", "赚钱项目", "个人收藏", "案例管理"],
    ogType: 'website',
    canonical: '/favorites',
    locale: 'zh-CN'
  })
}

// Admin page metadata
export function generateAdminPageMetadata(): Metadata {
  return generateSEOMetadata({
    title: "管理后台 - 副业案例管理系统",
    description: "管理后台界面，用于管理副业案例数据、触发数据抓取、审批发布内容等管理功能。",
    keywords: ["管理后台", "案例管理", "数据抓取", "内容管理", "系统管理"],
    ogType: 'website',
    canonical: '/admin',
    locale: 'zh-CN',
    noIndex: true // Admin pages should not be indexed
  })
}

// Admin login page metadata
export function generateAdminLoginPageMetadata(): Metadata {
  return generateSEOMetadata({
    title: "管理员登录 - Rich Idea Hub",
    description: "管理员登录页面，请使用正确的凭据访问管理后台。",
    keywords: ["管理员登录", "后台管理", "系统登录"],
    ogType: 'website',
    canonical: '/admin/login',
    locale: 'zh-CN',
    noIndex: true // Login pages should not be indexed
  })
}

// Test page metadata
export function generateTestPageMetadata(): Metadata {
  return generateSEOMetadata({
    title: "测试页面 - 功能测试与验证",
    description: "系统测试页面，用于验证网站功能和性能表现。",
    keywords: ["测试", "功能测试", "性能验证", "开发测试"],
    ogType: 'website',
    canonical: '/test',
    locale: 'zh-CN',
    noIndex: true // Test pages should not be indexed
  })
}