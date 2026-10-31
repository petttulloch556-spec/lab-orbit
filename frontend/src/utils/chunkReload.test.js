import { describe, it, expect, vi } from 'vitest'
import { isChunkLoadError, reloadForFreshBuild } from '../utils/chunkReload.js'

function memoryStorage() {
  const data = {}
  return { getItem: k => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v) } }
}

describe('stale build chunk recovery', () => {
  it('recognises chunk load failures from different browsers', () => {
    expect(isChunkLoadError(new TypeError('Failed to fetch dynamically imported module: https://x/assets/ExperimentsView-abc.js'))).toBe(true)
    expect(isChunkLoadError(new TypeError('Importing a module script failed.'))).toBe(true)
    expect(isChunkLoadError(new Error('error loading dynamically imported module'))).toBe(true)
    expect(isChunkLoadError(new Error('Unable to preload CSS for /assets/a.css'))).toBe(true)
    expect(isChunkLoadError(new Error('Network Error'))).toBe(false)
    expect(isChunkLoadError(null)).toBe(false)
  })

  it('reloads the target page once, then backs off to avoid loops', () => {
    const storage = memoryStorage()
    const locationRef = { href: 'https://example.github.io/lab-orbit/', assign: vi.fn() }
    expect(reloadForFreshBuild('/experiments', storage, locationRef)).toBe(true)
    expect(locationRef.assign).toHaveBeenCalledTimes(1)
    const url = new URL(locationRef.assign.mock.calls[0][0])
    expect(url.pathname.endsWith('/experiments')).toBe(true)
    expect(url.searchParams.get('_v')).toBeTruthy()
    expect(reloadForFreshBuild('/experiments', storage, locationRef)).toBe(false)
    expect(locationRef.assign).toHaveBeenCalledTimes(1)
  })
})
