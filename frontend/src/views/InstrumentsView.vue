<script setup>
import { onMounted, ref } from 'vue'
import { instrumentsApi } from '../api/client'
import LoadingState from '../components/LoadingState.vue'
import InstrumentEditor from '../components/InstrumentEditor.vue'
import './notebook.css'
const rows = ref([]), loading = ref(true), error = ref(''), editor = ref(false)
async function load() { loading.value = true; error.value = ''; try { rows.value = await instrumentsApi.list() } catch (e) { error.value = e.message } finally { loading.value = false } }
onMounted(load)
</script>
<template><main class="personal-page notebook-page"><header class="page-heading"><div><h1>仪器</h1><p>操作说明、维护经验与相关实验记录</p></div><div class="notebook-actions"><router-link class="button secondary" to="/experiments">实验数据</router-link><button class="button primary" @click="editor = true">新建仪器</button></div></header><LoadingState v-if="loading" label="正在读取仪器" /><p v-else-if="error" class="error-banner" role="alert">{{ error }} <button class="button secondary" @click="load">重试</button></p><template v-else><p v-if="!rows.length" class="panel">暂无仪器，可新建第一台仪器</p><div class="notebook-grid"><article v-for="item in rows" :key="item.id" class="panel"><span class="badge">{{ item.status }}</span><h2><router-link class="notebook-card-title" :to="`/instruments/${item.id}`">{{ item.name }}</router-link></h2><p>{{ item.model }} · {{ item.manufacturer }}</p><p class="muted">位置：{{ item.location || '未填写' }} · 负责人：{{ item.manager || '未填写' }}</p></article></div></template><InstrumentEditor :open="editor" @close="editor = false" @saved="load" /></main></template>
