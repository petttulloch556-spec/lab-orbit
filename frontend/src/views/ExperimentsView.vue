<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { authApi, experimentsApi, instrumentsApi } from '../api/client'
import { isAdmin } from '../utils/experimentAccess'
import LoadingState from '../components/LoadingState.vue'
import SlidingSegmented from '../components/SlidingSegmented.vue'
import ExperimentEditor from '../components/ExperimentEditor.vue'
import UserAvatar from '../components/UserAvatar.vue'
import './notebook.css'
const user = ref(null), rows = ref([]), instruments = ref([]), authors = ref([]), years = ref([]), loading = ref(true), error = ref(''), editor = ref(false)
const filter = reactive({ scope: 'mine', q: '', instrument_id: '', author_id: '', year: '' })
const scopes = computed(() => [{ id: 'mine', label: '我的记录' }, { id: 'group', label: '组内公开' }, ...(isAdmin(user.value) ? [{ id: 'all', label: '全部' }] : [])])
let request = 0
async function load() {
  const ticket = ++request; loading.value = true; error.value = ''
  try {
    if (!user.value) { const [me, items] = await Promise.all([authApi.getMe(), instrumentsApi.list()]); user.value = me; instruments.value = items }
    const data = await experimentsApi.list({ ...filter })
    if (ticket === request) rows.value = data
  } catch (e) { if (ticket === request) error.value = e.message }
  finally { if (ticket === request) loading.value = false }
}
async function options() {
  // Options are derived only from records this identity may read, including archived authors.
  const data = await experimentsApi.list({ scope: isAdmin(user.value) ? 'all' : 'group' })
  const mine = await experimentsApi.list({ scope: 'mine' })
  const all = [...data, ...mine]
  authors.value = [...new Map(all.map(r => [r.author_id, { id: r.author_id, name: r.author_name }])).values()]
  years.value = [...new Set(all.map(r => r.date.slice(0, 4)))].sort().reverse()
}
async function saved() { await load(); try { await options() } catch (e) { error.value = e.message } }
onMounted(async () => { await load(); if (user.value) try { await options() } catch (e) { error.value = e.message } })
</script>
<template>
  <main class="personal-page notebook-page">
    <header class="page-heading"><div><h1>实验数据</h1><p>记录实验过程、数据与组内讨论</p></div><div class="notebook-actions"><router-link class="button secondary" to="/instruments">仪器</router-link><button class="button primary" :disabled="!user" @click="editor = true">新建记录</button></div></header>
    <SlidingSegmented class="segmented" :active-key="filter.scope" aria-label="记录范围"><button v-for="scope in scopes" :key="scope.id" :class="{active:filter.scope === scope.id}" :aria-pressed="filter.scope === scope.id" @click="filter.scope = scope.id; load()">{{ scope.label }}</button></SlidingSegmented>
    <form class="notebook-filters" @submit.prevent="load"><label>关键词<input v-model="filter.q" type="search" placeholder="标题、样品、标签或正文" /></label><label>仪器<select v-model="filter.instrument_id"><option value="">全部仪器</option><option v-for="item in instruments" :key="item.id" :value="item.id">{{ item.name }}</option></select></label><label>作者<select v-model="filter.author_id"><option value="">全部作者</option><option v-for="author in authors" :key="author.id" :value="author.id">{{ author.name }}</option></select></label><label>年份<select v-model="filter.year"><option value="">全部年份</option><option v-for="year in years" :key="year">{{ year }}</option></select></label><button class="button secondary">筛选</button></form>
    <LoadingState v-if="loading" label="正在读取实验记录" /><p v-else-if="error" class="error-banner" role="alert">{{ error }} <button class="button secondary" @click="load">重试</button></p>
    <template v-else><p v-if="!rows.length" class="panel">暂无符合条件的实验记录</p><div class="notebook-grid"><article v-for="record in rows" :key="record.id" class="panel"><div class="notebook-meta"><span class="notebook-avatar"><UserAvatar :user="{name:record.author_name}" /></span><span>{{ record.author_name }} · {{ record.date }}</span><span class="badge">{{ record.visibility === 'group' ? '组内公开' : '私有' }}</span></div><h2><router-link class="notebook-card-title" :to="`/experiments/${record.id}`">{{ record.title }}</router-link></h2><p>样品：{{ record.sample || '未填写' }}</p><div class="notebook-badges"><span v-for="id in record.instrument_ids" :key="id" class="badge">{{ instruments.find(i => i.id === id)?.name || '已归档仪器' }}</span><span v-for="tag in record.tags" :key="tag" class="badge">{{ tag }}</span></div><p class="muted">附件 {{ record.attachments.length }} · 讨论 {{ record.threads.length }} 个话题 / {{ record.threads.reduce((n,t) => n + t.posts.length,0) }} 帖</p></article></div></template>
    <ExperimentEditor :open="editor" :instruments="instruments" @close="editor = false" @saved="saved" />
  </main>
</template>
