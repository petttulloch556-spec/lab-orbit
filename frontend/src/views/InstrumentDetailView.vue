<script setup>
import { formatRecommendDate } from '../utils/date'
import { onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi, instrumentsApi } from '../api/client'
import { canDeleteInstrument, canEditInstrument, canDeletePost } from '../utils/experimentAccess'
import { renderMarkdown } from '../utils/markdown'
import { confirmAction, notify } from '../composables/feedback'
import BaseDialog from '../components/BaseDialog.vue'
import LoadingState from '../components/LoadingState.vue'
import InstrumentEditor from '../components/InstrumentEditor.vue'
import NotebookMarkdown from '../components/NotebookMarkdown.vue'
import NotebookFilePicker from '../components/NotebookFilePicker.vue'
import NotebookAttachments from '../components/NotebookAttachments.vue'
import './notebook.css'
const route = useRoute(), router = useRouter(), item = ref(null), user = ref(null), loading = ref(true), error = ref(''), busy = ref(false), metadata = ref(false), editKey = ref(''), editContent = ref(''), logOpen = ref(false), log = reactive({ date: '', content: '' }), files = ref([]), manuals = ref([])
const sections = [{ id: 'operation', title: '操作说明' }, { id: 'precautions', title: '注意事项' }, { id: 'faq', title: '常见问题与踩坑' }]
let request = 0
async function load() {
  const ticket = ++request; loading.value = true; error.value = ''
  try { const [data, me] = await Promise.all([instrumentsApi.get(route.params.id), authApi.getMe()]); if (ticket === request) { item.value = data; user.value = me } }
  catch (e) { if (ticket === request) { item.value = null; error.value = e.message } } finally { if (ticket === request) loading.value = false }
}
async function refresh() { const data = await instrumentsApi.get(route.params.id); item.value = data }
async function act(fn, after) {
  if (busy.value) return
  busy.value = true
  try { await fn(); await refresh(); after?.(); notify('已保存') } catch (e) { notify(e.message, 'error') } finally { busy.value = false }
}
async function remove() {
  if (!await confirmAction('确认删除这台仪器？实验记录仍会保留。', { title: '删除仪器', danger: true })) return
  busy.value = true
  try { await instrumentsApi.remove(item.value.id); await router.push('/instruments') } catch (e) { notify(e.message, 'error') } finally { busy.value = false }
}
async function deleteLog(entry) { if (await confirmAction('确认删除自己的维护日志？', { danger: true })) act(() => instrumentsApi.removeLog(item.value.id, entry.id)) }
function openLog() { log.date = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Shanghai' }); log.content = ''; files.value = []; logOpen.value = true }
watch(() => route.params.id, () => { item.value = null; metadata.value = false; editKey.value = ''; logOpen.value = false; manuals.value = []; load() }, { immediate: true })
onBeforeUnmount(() => { request++ })
</script>
<template><main class="personal-page notebook-page"><router-link to="/instruments">← 仪器</router-link><LoadingState v-if="loading" label="正在读取仪器资料" /><p v-else-if="error" class="error-banner" role="alert">{{ error }} <button class="button secondary" @click="load">重试</button></p><template v-else-if="item">
  <header class="panel"><span class="badge">{{ item.status }}</span><h1>{{ item.name }}</h1><p>{{ item.model }} · {{ item.manufacturer }}</p><p>位置：{{ item.location || '未填写' }} · 负责人：{{ item.manager || '未填写' }}</p><div class="notebook-actions"><button v-if="canEditInstrument(item,user)" class="button secondary" :disabled="busy" @click="metadata = true">编辑仪器信息</button><button v-if="canDeleteInstrument(item,user)" class="button secondary" :disabled="busy" @click="remove">删除仪器</button></div></header>
  <section v-for="section in sections" :key="section.id" class="panel"><div class="notebook-actions"><h2>{{ section.title }}</h2><button v-if="canEditInstrument(item,user)" class="button secondary" :disabled="busy" @click="editKey = section.id; editContent = item.sections[section.id]?.content || ''">编辑分区</button></div><p v-if="item.sections[section.id]" class="muted">最后编辑：{{ item.sections[section.id].edited_by }} · {{ formatRecommendDate(item.sections[section.id].edited_at) }}</p><div class="notebook-prose" v-html="renderMarkdown(item.sections[section.id]?.content || '暂无内容')"></div></section>
  <section class="panel"><div class="notebook-actions"><h2>维护与维修日志</h2><button class="button primary" :disabled="busy" @click="openLog">追加维护日志</button></div><p v-if="!item.logs.length" class="muted">暂无维护日志</p><article v-for="entry in item.logs" :key="entry.id" class="notebook-inset"><p class="notebook-meta">{{ entry.date }} · {{ entry.author_name }}</p><div class="notebook-prose" v-html="renderMarkdown(entry.content)"></div><NotebookAttachments :files="entry.attachments" /><button v-if="canDeletePost(entry,user)" class="button secondary" :disabled="busy" @click="deleteLog(entry)">删除我的日志</button></article></section>
  <section class="panel"><h2>手册与文件</h2><NotebookAttachments :files="item.files" /><form class="notebook-form" @submit.prevent="act(() => instrumentsApi.files(item.id,manuals), () => manuals = [])"><NotebookFilePicker v-model="manuals" :disabled="busy" /><button class="button primary" :disabled="busy || !manuals.length">上传手册与文件</button></form></section>
  <section class="panel"><h2>相关实验记录</h2><p v-if="!item.related_experiments.length" class="muted">暂无你可以查看的相关实验记录</p><article v-for="record in item.related_experiments" :key="record.id" class="notebook-inset"><router-link :to="`/experiments/${record.id}`">{{ record.title }}</router-link><p class="notebook-meta">{{ record.date }} · {{ record.author_name }} · {{ record.visibility === 'group' ? '组内公开' : '私有' }}</p></article></section>
  <InstrumentEditor :open="metadata" :instrument="item" @close="metadata = false" @saved="act(() => Promise.resolve())" />
  <BaseDialog :open="!!editKey" :title="`编辑${sections.find(s => s.id === editKey)?.title || '分区'}`" :busy="busy" wide @close="editKey = ''"><form class="notebook-form" @submit.prevent="act(() => instrumentsApi.update(item.id,{sections:{[editKey]:editContent}}), () => editKey = '')"><fieldset :disabled="busy"><NotebookMarkdown v-model="editContent" /></fieldset><button class="button primary" :disabled="busy">保存分区</button></form></BaseDialog>
  <BaseDialog :open="logOpen" title="追加维护日志" :busy="busy" wide @close="logOpen = false"><form class="notebook-form" @submit.prevent="act(() => instrumentsApi.log(item.id,{...log},files), () => logOpen = false)"><fieldset :disabled="busy"><label>维护日期<input v-model="log.date" type="date" required /></label><NotebookMarkdown v-model="log.content" label="维护内容" required /><NotebookFilePicker v-model="files" :disabled="busy" /></fieldset><button class="button primary" :disabled="busy">保存日志</button></form></BaseDialog>
</template></main></template>
