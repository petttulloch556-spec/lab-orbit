import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { parse, compileScript } from '@vue/compiler-sfc'

describe('HomeView National Day Flag integration', () => {
  const filePath = path.resolve(__dirname, 'HomeView.vue')
  const content = fs.readFileSync(filePath, 'utf8')

  it('compiles HomeView script setup and provides isNationalDay binding', () => {
    const parsed = parse(content)
    const compiled = compileScript(parsed.descriptor, { id: 'test-homeview-nationalday' })
    const bindings = compiled.bindings || {}

    expect(bindings.isNationalDay).toBeDefined()
  })

  it('contains national flag badge element next to group name with waving animation', () => {
    expect(content).toContain('national-day-flag-badge')
    expect(content).toContain('/assets/icons/national-flag.svg')
    expect(content).toContain('alt="国庆红旗"')
    expect(content).toContain('Zeng Group')
    expect(content).toContain('@keyframes national-day-flag-wave')
  })
})
