import { describe, it, expect } from 'vitest'
import { canView, canEdit, canDelete, canDiscuss, canDeletePost, canDeleteChat, canEditInstrument, canDeleteInstrument } from './experimentAccess'

describe('实验记录权限矩阵', () => {
  const users = [
    { name: '作者', user: { id: 2, role: 'member' }, owner: true, admin: false },
    { name: '其他成员', user: { id: 3, role: 'member' }, owner: false, admin: false },
    { name: '管理员', user: { id: 1, role: 'admin' }, owner: false, admin: true },
    { name: '管理员作者', user: { id: 2, role: 'admin' }, owner: true, admin: true },
    { name: '游客', user: null, owner: false, admin: false },
  ]
  for (const visibility of ['private', 'group']) for (const { name, user, owner, admin } of users) {
    it(`${name} / ${visibility}`, () => {
      const record = { author_id: 2, visibility }
      expect(canView(record, user)).toBe(!!user && (owner || admin || visibility === 'group'))
      expect(canEdit(record, user)).toBe(owner)
      expect(canDelete(record, user)).toBe(owner)
      expect(canDiscuss(record, user)).toBe(!!user && visibility === 'group')
    })
  }
  it('只允许帖子作者、分析保存人删除；管理员没有代删权限', () => {
    expect(canDeletePost({ author_id: 2 }, { id: 1, role: 'admin' })).toBe(false)
    expect(canDeletePost({ author_id: '2' }, { id: 2 })).toBe(true)
    expect(canDeleteChat({ saved_by: 2 }, { id: 1, role: 'admin' })).toBe(false)
    expect(canDeleteChat({ saved_by: 2 }, { id: 2 })).toBe(true)
    expect(canDeleteChat({ saved_by: 2 }, null)).toBe(false)
  })
  it('登录成员可编辑仪器，只有创建者或管理员可删除', () => {
    const item = { created_by: 4 }
    expect(canEditInstrument(item, { id: 3 })).toBe(true)
    expect(canEditInstrument(item, null)).toBe(false)
    expect(canDeleteInstrument(item, { id: 3 })).toBe(false)
    expect(canDeleteInstrument(item, { id: 4 })).toBe(true)
    expect(canDeleteInstrument(item, { id: 1, role: 'admin' })).toBe(true)
    expect(canDeleteInstrument(item, null)).toBe(false)
  })
  it('缺失记录和缺失身份均不能读取', () => {
    expect(canView(null, { id: 1, role: 'admin' })).toBe(false)
    expect(canView({ visibility: 'group' }, {})).toBe(false)
    expect(canEdit({}, {})).toBe(false)
  })
})
