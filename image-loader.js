export default function myImageLoader({ src, width, quality }) {
  // 直接返回原始 URL，完全繞過優化
  return src;
}