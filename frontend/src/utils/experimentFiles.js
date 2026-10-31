export const FILE_ACCEPT = '.pdf,.png,.jpg,.jpeg,.webp,.gif,.tif,.csv,.tsv,.txt,.dat,.xlsx,.xls,.docx,.doc,.pptx,.ppt,.opj,.opju,.zip'
// Binary images are available for thumbnails only until the browser reloads.
// Only metadata is serialized to demo storage.
const sessionImages = new Map()
export const getDemoImageBlob = id => sessionImages.get(id)
export const isTextAttachment = file => /\.(csv|tsv|txt|dat)$/i.test(file.name || '')
export const firstLines = text => String(text || '').split(/\r?\n/).slice(0, 200).join('\n')
export function validateFile(file) {
  if (!file || !FILE_ACCEPT.split(',').includes(`.${file.name?.split('.').pop().toLowerCase()}`)) throw new Error('不支持的文件类型')
  if (file.size > 50 * 1024 * 1024) throw new Error('单个文件不得超过 50 MB')
}
export async function storeDemoFile(file, user, id) {
  validateFile(file)
  const result = { id, name: file.name, size: file.size, type: file.type || 'application/octet-stream', author_id: user.id, author_name: user.real_name || user.name, created_at: new Date().toISOString() }
  if (isTextAttachment(file) && file.size <= 200 * 1024) result.content = await file.text()
  if (file instanceof Blob && /\.(png|jpe?g|webp|gif|tif)$/i.test(file.name)) sessionImages.set(id, file)
  return result
}
export function buildExperimentContext(record, instruments = []) {
  const text = [`标题：${record.title}`, `日期：${record.date}`, `样品：${record.sample}`, `仪器：${record.instrument_ids.map(id => instruments.find(i => String(i.id) === String(id))?.name || id).join('、')}`, `标签：${record.tags.join('、')}`, record.content,
    ...record.attachments.map(file => `附件：${file.name}${isTextAttachment(file) && typeof file.content === 'string' ? `\n${firstLines(file.content)}${file.content.split(/\r?\n/).length > 200 ? '\n[已截断：仅前 200 行]' : ''}` : ''}`)].join('\n\n')
  return text.length > 20000 ? `${text.slice(0, 19980)}\n[已截断]` : text
}
