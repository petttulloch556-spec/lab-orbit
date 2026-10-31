<script setup>
import { reactive, ref, watch } from 'vue'
import { experimentsApi } from '../api/client'
import { notify } from '../composables/feedback'
import BaseDialog from './BaseDialog.vue'
import NotebookMarkdown from './NotebookMarkdown.vue'
import NotebookFilePicker from './NotebookFilePicker.vue'
const props = defineProps({ open: Boolean, record: Object, instruments: { type: Array, default: () => [] } })
const emit = defineEmits(['close', 'saved'])
const form = reactive({ instrument_ids: [], tags: [] }), files = ref([]), busy = ref(false), error = ref('')
let savedId = null
watch(() => props.open, open => {
  if (!open) return
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Shanghai' })
  Object.assign(form, props.record ? JSON.parse(JSON.stringify(props.record)) : { title: '', date: today, sample: '', instrument_ids: [], content: '', visibility: 'private', tags: [] })
  form.tagText = form.tags.join('、'); files.value = []; error.value = ''; savedId = props.record?.id || null
})
async function save() {
  if (busy.value) return
  busy.value = true; error.value = ''
  try {
    const data = { ...form, tags: form.tagText.split(/[,，、]/).map(s => s.trim()).filter(Boolean) }
    const record = savedId ? await experimentsApi.update(savedId, data) : await experimentsApi.create(data)
    savedId = record.id
    if (files.value.length) await experimentsApi.attach(record.id, files.value)
    notify('实验记录已保存'); emit('saved', record.id); emit('close')
  } catch (e) { error.value = `${e.message}${savedId && files.value.length ? '；正文已保存，可重试附件上传。' : ''}` }
  finally { busy.value = false }
}
</script>
<template>
  <BaseDialog :open="open" :title="record ? '编辑实验记录' : '新建实验记录'" :busy="busy" wide @close="emit('close')">
    <form class="notebook-form" @submit.prevent="save"><fieldset :disabled="busy">
      <label>标题<input v-model="form.title" required maxlength="300" /></label>
      <div class="notebook-grid"><label>实验日期<input v-model="form.date" type="date" required /></label><label>样品<input v-model="form.sample" /></label></div>
      <label>所用仪器（按住 Ctrl 或 ⌘ 多选）<select v-model="form.instrument_ids" multiple size="5"><option v-for="item in instruments" :key="item.id" :value="item.id">{{ item.name }}</option></select></label>
      <label>标签（顿号或逗号分隔）<input v-model="form.tagText" /></label>
      <NotebookMarkdown v-model="form.content" />
      <NotebookFilePicker v-model="files" :disabled="busy" />
      <label>可见性<select v-model="form.visibility"><option value="private">私有</option><option value="group">组内公开</option></select></label>
    </fieldset><p v-if="error" class="error-banner" role="alert">{{ error }}</p><button class="button primary" :disabled="busy">{{ busy ? '保存中…' : '保存记录' }}</button></form>
  </BaseDialog>
</template>
