<script setup>
import { onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi, experimentsApi, instrumentsApi } from '../api/client'
import { canEdit, canDelete, canDiscuss, canDeletePost, canDeleteChat } from '../utils/experimentAccess'
import { renderMarkdown } from '../utils/markdown'
import { formatRecommendDate } from '../utils/date'
import { confirmAction, notify } from '../composables/feedback'
import LoadingState from '../components/LoadingState.vue'
import BaseDialog from '../components/BaseDialog.vue'
import ExperimentEditor from '../components/ExperimentEditor.vue'
import NotebookMarkdown from '../components/NotebookMarkdown.vue'
import NotebookFilePicker from '../components/NotebookFilePicker.vue'
import NotebookAttachments from '../components/NotebookAttachments.vue'
import ExperimentAiPanel from '../components/ExperimentAiPanel.vue'
import './notebook.css'
const route = useRoute(), router = useRouter(), record = ref(null), user = ref(null), instruments = ref([]), loading = ref(true), error = ref(''), busy = ref(false), editor = ref(false), discussionOpen = ref(false), threadId = ref(null), files = ref([]), draft = reactive({ title: '', content: '' })
let request = 0
async function load() {
  const ticket = ++request; loading.value = true; error.value = ''
  try { const [r, u, i] = await Promise.all([experimentsApi.get(route.params.id), authApi.getMe(), instrumentsApi.list()]); if (ticket === request) { record.value = r; user.value = u; instruments.value = i } }
  catch (e) { if (ticket === request) { record.value = null; error.value = e.message } }
  finally { if (ticket === request) loading.value = false }
}
async function act(fn) {
  if (busy.value) return
  busy.value = true
  try { record.value = await fn() } catch (e) { notify(e.message, 'error') } finally { busy.value = false }
}
async function remove() {
  const id = record.value.id
  if (!await confirmAction('删除后无法恢复，确认删除这条实验记录及其讨论、附件和已保存分析？', { title: '删除实验记录', danger: true, confirmLabel: '确认删除' })) return
  busy.value = true
  try { await experimentsApi.remove(id); await router.push('/experiments') } catch (e) { notify(e.message, 'error') } finally { busy.value = false }
}
function openDiscussion(id = null) { threadId.value = id; draft.title = ''; draft.content = ''; files.value = []; discussionOpen.value = true }
async function sendDiscussion() {
  if (busy.value) return
  busy.value = true
  try { record.value = threadId.value === null ? await experimentsApi.thread(record.value.id, { ...draft }, files.value) : await experimentsApi.post(record.value.id, threadId.value, { content: draft.content }, files.value); discussionOpen.value = false }
  catch (e) { notify(e.message, 'error') } finally { busy.value = false }
}
async function deletePost(thread, post) {
  if (await confirmAction('确认删除自己的帖子？', { danger: true })) act(() => experimentsApi.removePost(record.value.id, thread.id, post.id))
}
async function deleteChat(chat) {
  if (await confirmAction('确认删除自己保存的分析？', { danger: true })) act(() => experimentsApi.removeChat(record.value.id, chat.id))
}
async function refreshRecord() { try { record.value = await experimentsApi.get(route.params.id) } catch (e) { notify(e.message, 'error') } }
watch(() => route.params.id, () => { record.value = null; editor.value = false; discussionOpen.value = false; load() }, { immediate: true })
onBeforeUnmount(() => { request++ })
</script>
<template>
  <main class="personal-page notebook-page"><router-link to="/experiments">← 实验数据</router-link><LoadingState v-if="loading" label="正在读取实验记录" /><p v-else-if="error" class="error-banner" role="alert">{{ error }} <button class="button secondary" @click="load">重试</button></p>
    <template v-else-if="record"><header class="panel"><div class="notebook-meta"><span>{{ record.date }} · {{ record.author_name }}</span><span class="badge">{{ record.visibility === 'group' ? '组内公开' : '私有' }}</span></div><h1>{{ record.title }}</h1><p>样品：{{ record.sample || '未填写' }}</p><div class="notebook-badges"><router-link v-for="id in record.instrument_ids" :key="id" class="badge" :to="`/instruments/${id}`">{{ instruments.find(i => i.id === id)?.name || '已归档仪器' }}</router-link><span v-for="tag in record.tags" :key="tag" class="badge">{{ tag }}</span></div><div v-if="canEdit(record,user)" class="notebook-actions"><button class="button secondary" :disabled="busy" @click="editor = true">编辑</button><button class="button secondary" :disabled="busy" @click="act(() => experimentsApi.visibility(record.id,record.visibility === 'private' ? 'group' : 'private'))">{{ record.visibility === 'private' ? '公开给组内' : '设为私有' }}</button><button v-if="canDelete(record,user)" class="button secondary" :disabled="busy" @click="remove">删除记录</button></div></header>
      <section class="panel"><h2>实验正文</h2><div class="notebook-prose" v-html="renderMarkdown(record.content || '暂无正文')"></div></section>
      <section class="panel"><h2>附件</h2><NotebookAttachments :files="record.attachments" :removable="canEdit(record,user)" :busy="busy" @remove="file => act(() => experimentsApi.removeAttachment(record.id,file.id))" /><button v-if="canEdit(record,user)" class="button secondary" :disabled="busy" @click="editor = true">添加附件</button></section>
      <section class="panel"><h2>讨论</h2><p v-if="!canDiscuss(record,user)" class="muted">公开后组内成员才能讨论</p><template v-else><button class="button primary" :disabled="busy" @click="openDiscussion()">发起话题</button><p v-if="!record.threads.length" class="muted">暂无讨论话题</p><article v-for="thread in record.threads" :key="thread.id" class="notebook-inset"><h3>{{ thread.title }}</h3><p class="muted">{{ thread.author_name }} · {{ formatRecommendDate(thread.created_at) }}</p><p v-if="!thread.posts.length" class="muted">本话题暂无帖子</p><article v-for="post in thread.posts" :key="post.id" class="notebook-inset"><p class="notebook-meta">{{ post.author_name }} · {{ formatRecommendDate(post.created_at) }}</p><div class="notebook-prose" v-html="renderMarkdown(post.content)"></div><NotebookAttachments :files="post.attachments" /><button v-if="canDeletePost(post,user)" class="button secondary" :disabled="busy" @click="deletePost(thread,post)">删除我的帖子</button></article><button class="button secondary" :disabled="busy" @click="openDiscussion(thread.id)">回复话题</button></article></template></section>
      <ExperimentAiPanel :key="record.id" :record="record" :instruments="instruments" :user="user" @saved="refreshRecord" />
      <section class="panel"><h2>已保存的 AI 分析</h2><p v-if="!record.ai_chats.length" class="muted">暂无已保存的 AI 分析</p><details v-for="chat in record.ai_chats" :key="chat.id"><summary>{{ chat.title }} · {{ chat.saved_by_name }} · {{ formatRecommendDate(chat.saved_at) }} · {{ chat.model }}</summary><article v-for="(message,index) in chat.messages" :key="index" class="notebook-inset"><strong>{{ message.role === 'user' ? '提问' : 'AI 助手' }}</strong><div class="notebook-prose" v-html="renderMarkdown(message.content)"></div></article><button v-if="canDeleteChat(chat,user)" class="button secondary" :disabled="busy" @click="deleteChat(chat)">删除我的分析</button></details></section>
      <ExperimentEditor :open="editor" :record="record" :instruments="instruments" @close="editor = false" @saved="refreshRecord" />
      <BaseDialog :open="discussionOpen" :title="threadId === null ? '发起讨论话题' : '回复话题'" :busy="busy" wide @close="discussionOpen = false"><form class="notebook-form" @submit.prevent="sendDiscussion"><fieldset :disabled="busy"><label v-if="threadId === null">话题标题<input v-model="draft.title" required /></label><NotebookMarkdown v-model="draft.content" label="帖子内容" required /><NotebookFilePicker v-model="files" :disabled="busy" /></fieldset><button class="button primary" :disabled="busy">发表</button></form></BaseDialog>
    </template>
  </main>
</template>
