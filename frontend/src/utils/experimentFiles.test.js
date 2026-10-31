import { describe, it, expect } from 'vitest'
import { buildExperimentContext, firstLines, storeDemoFile, validateFile } from './experimentFiles'
import { DEMO_EXPERIMENTS, DEMO_INSTRUMENTS } from '../mock/demoData'

describe('实验附件与 AI 上下文', () => {
  it('支持允许的扩展名，拒绝超限和不允许类型', () => {
    for (const ext of ['pdf', 'png', 'jpg', 'webp', 'gif', 'tif', 'csv', 'tsv', 'txt', 'dat', 'xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt', 'opj', 'opju', 'zip']) expect(() => validateFile({ name: `x.${ext}`, size: 50 * 1024 * 1024 })).not.toThrow()
    expect(() => validateFile({ name: 'x.exe', size: 1 })).toThrow('类型')
    expect(() => validateFile({ name: 'x.dat', size: 50 * 1024 * 1024 + 1 })).toThrow('50 MB')
  })
  it('200 KB 以内文本保存内容；其他文件仅保存元数据', async () => {
    const user = { id: 2, name: 'Daisy' }, file = { name: 'a.DAT', size: 200 * 1024, type: 'text/plain', text: async () => 'a\nb' }
    expect((await storeDemoFile(file, user, 1)).content).toBe('a\nb')
    expect((await storeDemoFile({ ...file, size: file.size + 1 }, user, 2)).content).toBeUndefined()
    expect((await storeDemoFile({ ...file, name: 'x.png' }, user, 3)).content).toBeUndefined()
  })
  it('文本预览限制 200 行，AI 上下文包含元数据及仪器名称', () => {
    expect(firstLines(Array.from({ length: 201 }, (_, i) => i).join('\n')).split('\n')).toHaveLength(200)
    const context = buildExperimentContext(DEMO_EXPERIMENTS[0], DEMO_INSTRUMENTS)
    for (const value of ['CrSBr/Pt', 'PPMS', 'CP-07', 'T_K', 'R_xy_ohm']) expect(context).toContain(value)
  })
  it('AI 上下文最多约 20000 字符，逐附件与总量截断有提示，二进制仅发送文件名', () => {
    const record = structuredClone(DEMO_EXPERIMENTS[0])
    record.attachments = [{ name: 'a.txt', content: Array.from({ length: 201 }, (_, i) => `line${i}`).join('\n') }, { name: 'b.png', content: 'binary-secret' }]
    const context = buildExperimentContext(record, DEMO_INSTRUMENTS)
    expect(context).toContain('已截断')
    expect(context).not.toContain('line200')
    expect(context).toContain('b.png')
    expect(context).not.toContain('binary-secret')
    record.content = '长'.repeat(22000)
    expect(buildExperimentContext(record, []).length).toBeLessThanOrEqual(20000)
    expect(buildExperimentContext(record, [])).toContain('已截断')
  })
})
