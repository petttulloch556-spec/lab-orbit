// 重新部署后旧页面引用的分包文件已被删除，懒加载会失败、点击链接没有反应。
// 遇到这种情况直接整页加载目标地址，拿到最新版本；10 秒内只重试一次，避免死循环。
const CHUNK_RELOAD_KEY = 'laborbit_chunk_reload_at'

export function isChunkLoadError(error) {
  const message = String(error?.message || error || '')
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading (CSS )?chunk .* failed|Unable to preload CSS/i.test(message)
}

export function reloadForFreshBuild(targetPath, storage = window.sessionStorage, locationRef = window.location) {
  const now = Date.now()
  const last = Number(storage.getItem(CHUNK_RELOAD_KEY) || 0)
  if (now - last < 10000) return false
  storage.setItem(CHUNK_RELOAD_KEY, String(now))
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  const url = new URL(base + (targetPath || '/'), locationRef.href)
  url.searchParams.set('_v', String(now))
  locationRef.assign(url.toString())
  return true
}
