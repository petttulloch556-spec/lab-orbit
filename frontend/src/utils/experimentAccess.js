const loggedIn = user => user?.id != null
export const isAuthor = (item, user) => loggedIn(user) && item?.author_id != null && String(item.author_id) === String(user.id)
export const isAdmin = user => loggedIn(user) && user.role === 'admin'
export const canView = (record, user) => loggedIn(user) && !!record && (isAuthor(record, user) || isAdmin(user) || record.visibility === 'group')
export const canEdit = isAuthor
export const canDelete = isAuthor
export const canDiscuss = (record, user) => canView(record, user) && record.visibility === 'group'
export const canDeletePost = isAuthor
export const canDeleteChat = (chat, user) => loggedIn(user) && String(chat?.saved_by) === String(user.id)
export const canEditInstrument = (instrument, user) => !!instrument && loggedIn(user)
export const canDeleteInstrument = (instrument, user) => !!instrument && (isAdmin(user) || (loggedIn(user) && String(instrument.created_by) === String(user.id)))
