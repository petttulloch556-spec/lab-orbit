import { canView, canEdit, canDelete, canDiscuss, canDeletePost, canDeleteChat, canEditInstrument, canDeleteInstrument, isAdmin } from '../utils/experimentAccess.js'
import { storeDemoFile } from '../utils/experimentFiles.js'

function fail(status, detail) { const error = new Error(detail); error.response = { status, data: { detail } }; throw error }
const requireAccess = allowed => { if (!allowed) fail(403, '无权执行此操作') }
const required = (value, label) => { if (typeof value !== 'string' || !value.trim()) fail(422, `请填写${label}`); return value.trim() }
const visibility = value => { if (!['private', 'group'].includes(value)) fail(422, '可见性无效'); return value }
const nextId = items => Math.max(0, ...items.map(i => Number(i.id) || 0)) + 1
const stamp = user => ({ author_id: user.id, author_name: user.real_name || user.name, created_at: new Date().toISOString() })
function recordFields(body) {
  const date = required(body.date, '实验日期')
  const parsedDate = new Date(`${date}T12:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) fail(422, '实验日期无效')
  return { title: required(body.title, '标题'), date, sample: String(body.sample || ''), instrument_ids: Array.isArray(body.instrument_ids) ? body.instrument_ids : [], tags: Array.isArray(body.tags) ? body.tags.map(String) : [], content: String(body.content || ''), visibility: visibility(body.visibility ?? 'private') }
}

// Called by demoAxiosAdapter; all reads and writes enforce the same pure access rules as the UI.
export async function handleExperimentRequest({ config, cleanUrl, method, body, getParam, keys }) {
  if (!/^\/api\/(experiments|instruments)(\/|$)/.test(cleanUrl)) return null
  let user
  try { user = JSON.parse(localStorage.getItem('labhub_user') || 'null') } catch { /* unauthenticated */ }
  if (!user?.id || !localStorage.getItem('labhub_token')) fail(401, '请先登录')
  const read = key => JSON.parse(localStorage.getItem(key) || '[]')
  const experiments = read(keys.EXPERIMENTS), instruments = read(keys.INSTRUMENTS)
  const parts = cleanUrl.split('/').slice(2), kind = parts[0], id = parts[1], action = parts[2]
  const list = kind === 'experiments' ? experiments : instruments
  const persist = () => { try { localStorage.setItem(kind === 'experiments' ? keys.EXPERIMENTS : keys.INSTRUMENTS, JSON.stringify(list)) } catch { fail(507, '演示存储空间不足，未保存；请减少附件内容后重试') } }
  const done = data => ({ data: JSON.parse(JSON.stringify(data)), status: 200, statusText: 'OK', headers: {}, config })
  const files = async () => {
    const incoming = config.data instanceof FormData ? config.data.getAll('files').concat(config.data.getAll('file')) : []
    if (!incoming.length) fail(422, '请选择文件')
    return Promise.all(incoming.map((f, i) => storeDemoFile(f, user, globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}-${i}`)))
  }
  const makePost = async () => ({ id: Date.now(), ...stamp(user), content: required(body.content, '帖子内容'), attachments: [] })
  if (!id) {
    if (method === 'get') {
      if (kind === 'instruments') return done(list)
      const scope = getParam('scope') || 'mine'
      if (!['mine', 'group', 'all'].includes(scope)) fail(422, '记录范围无效')
      if (scope === 'all') requireAccess(isAdmin(user))
      const q = String(getParam('q') || '').toLowerCase()
      return done(list.filter(r => canView(r, user) && (scope !== 'mine' || canEdit(r, user)) && (scope !== 'group' || r.visibility === 'group')
        && (!getParam('instrument_id') || r.instrument_ids.some(i => String(i) === String(getParam('instrument_id'))))
        && (!getParam('author_id') || String(r.author_id) === String(getParam('author_id')))
        && (!getParam('year') || r.date.startsWith(String(getParam('year'))))
        && `${r.title} ${r.sample} ${r.tags.join(' ')} ${r.content}`.toLowerCase().includes(q)).sort((a, b) => b.date.localeCompare(a.date)))
    }
    if (method === 'post') {
      if (kind === 'instruments' && body.status !== undefined && !['正常', '维护中', '故障'].includes(body.status)) fail(422, '仪器状态无效')
      const item = kind === 'experiments'
        ? { id: nextId(list), ...stamp(user), ...recordFields(body), attachments: [], threads: [], ai_chats: [] }
        : { id: nextId(list), name: required(body.name, '仪器名称'), model: String(body.model || ''), manufacturer: String(body.manufacturer || ''), location: String(body.location || ''), manager: String(body.manager || ''), status: body.status || '正常', created_by: user.id, sections: {}, logs: [], files: [] }
      list.push(item); persist(); return done(item)
    }
    fail(405, '不支持的请求')
  }
  const item = list.find(r => String(r.id) === id)
  if (!item) fail(404, '记录不存在')
  if (kind === 'experiments') requireAccess(canView(item, user))
  if (!action && method === 'get') return done(kind === 'instruments' ? { ...item, related_experiments: experiments.filter(r => canView(r, user) && r.instrument_ids.some(i => String(i) === id)).sort((a, b) => b.date.localeCompare(a.date)) } : item)
  if (!action && method === 'delete') {
    requireAccess(kind === 'experiments' ? canDelete(item, user) : canDeleteInstrument(item, user))
    list.splice(list.indexOf(item), 1); persist(); return done({ success: true })
  }
  if (!action && method === 'put') {
    requireAccess(kind === 'experiments' ? canEdit(item, user) : canEditInstrument(item, user))
    if (kind === 'experiments') Object.assign(item, recordFields({ ...item, ...body }))
    else {
      if (body.name !== undefined) item.name = required(body.name, '仪器名称')
      for (const key of ['model', 'manufacturer', 'location', 'manager']) if (body[key] !== undefined) item[key] = String(body[key])
      if (body.status !== undefined) { if (!['正常', '维护中', '故障'].includes(body.status)) fail(422, '仪器状态无效'); item.status = body.status }
      for (const key of ['operation', 'precautions', 'faq']) if (typeof body.sections?.[key] === 'string') item.sections[key] = { content: body.sections[key], edited_by: user.real_name || user.name, edited_at: new Date().toISOString() }
    }
    persist(); return done(item)
  }
  if (kind === 'experiments') {
    if (action === 'visibility' && method === 'put') { requireAccess(canEdit(item, user)); item.visibility = visibility(body.visibility) }
    else if (action === 'attachments') {
      requireAccess(canEdit(item, user))
      if (method === 'post' && !parts[3]) item.attachments.push(...await files())
      else if (method === 'delete' && parts[3]) { const at = item.attachments.findIndex(f => String(f.id) === parts[3]); if (at < 0) fail(404, '附件不存在'); item.attachments.splice(at, 1) }
      else fail(405, '不支持的请求')
    } else if (action === 'ai-chats') {
      if (method === 'post' && !parts[3]) {
        if (!Array.isArray(body.messages) || !body.messages.length || body.messages.some(m => !['user', 'assistant'].includes(m.role) || typeof m.content !== 'string')) fail(422, '对话格式无效')
        item.ai_chats.push({ id: nextId(item.ai_chats), title: required(body.title, '分析标题'), messages: body.messages.map(m => ({ role: m.role, content: m.content })), model: String(body.model || ''), saved_by: user.id, saved_by_name: user.real_name || user.name, saved_at: new Date().toISOString() })
      } else if (method === 'delete') {
        const chat = item.ai_chats.find(c => String(c.id) === parts[3]); if (!chat) fail(404, '分析不存在'); requireAccess(canDeleteChat(chat, user)); item.ai_chats.splice(item.ai_chats.indexOf(chat), 1)
      } else fail(405, '不支持的请求')
    } else if (action === 'threads') {
      if (method !== 'delete') requireAccess(canDiscuss(item, user))
      // Multipart discussion posts carry JSON in a payload field and files alongside it.
      if (config.data instanceof FormData) { try { body = JSON.parse(config.data.get('payload') || '{}') } catch { fail(422, '帖子格式无效') } }
      if (method === 'post' && !parts[3]) {
        const post = await makePost(); if (config.data instanceof FormData && config.data.getAll('files').length) post.attachments = await files()
        item.threads.push({ id: nextId(item.threads), title: required(body.title, '话题标题'), ...stamp(user), posts: [post] })
      } else {
        const thread = item.threads.find(t => String(t.id) === parts[3]); if (!thread) fail(404, '话题不存在')
        if (parts[4] !== 'posts') fail(404, '接口不存在')
        if (method === 'post' && !parts[5]) { const post = await makePost(); post.id = nextId(thread.posts); if (config.data instanceof FormData && config.data.getAll('files').length) post.attachments = await files(); thread.posts.push(post) }
        else if (method === 'delete') { const post = thread.posts.find(p => String(p.id) === parts[5]); if (!post) fail(404, '帖子不存在'); requireAccess(canDeletePost(post, user)); thread.posts.splice(thread.posts.indexOf(post), 1) }
        else fail(405, '不支持的请求')
      }
    } else fail(404, '接口不存在')
  } else if (action === 'logs') {
    if (method === 'post' && !parts[3]) {
      if (config.data instanceof FormData) { try { body = JSON.parse(config.data.get('payload') || '{}') } catch { fail(422, '日志格式无效') } }
      const log = { id: nextId(item.logs), ...stamp(user), date: required(body.date, '维护日期'), content: required(body.content, '维护内容'), attachments: [] }
      if (config.data instanceof FormData && config.data.getAll('files').length) log.attachments = await files()
      item.logs.push(log); item.logs.sort((a, b) => b.date.localeCompare(a.date) || String(b.created_at || '').localeCompare(String(a.created_at || '')))
    } else if (method === 'delete') { const log = item.logs.find(l => String(l.id) === parts[3]); if (!log) fail(404, '日志不存在'); requireAccess(canDeletePost(log, user)); item.logs.splice(item.logs.indexOf(log), 1) }
    else fail(405, '不支持的请求')
  } else if (action === 'files' && method === 'post') item.files.push(...await files())
  else fail(404, '接口不存在')
  persist(); return done(item)
}
