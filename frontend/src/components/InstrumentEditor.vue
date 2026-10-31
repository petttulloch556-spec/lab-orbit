<script setup>
import { reactive, ref, watch } from 'vue'
import { instrumentsApi } from '../api/client'
import BaseDialog from './BaseDialog.vue'
import { notify } from '../composables/feedback'
const props = defineProps({ open: Boolean, instrument: Object })
const emit = defineEmits(['close', 'saved'])
const form = reactive({}), busy = ref(false), error = ref('')
watch(() => props.open, open => { if (open) { Object.assign(form, { name: '', model: '', manufacturer: '', location: '', manager: '', status: '正常' }, props.instrument || {}); error.value = '' } })
async function save() {
  if (busy.value) return
  busy.value = true; error.value = ''
  const data = Object.fromEntries(['name', 'model', 'manufacturer', 'location', 'manager', 'status'].map(key => [key, form[key]]))
  try { const item = props.instrument ? await instrumentsApi.update(props.instrument.id, data) : await instrumentsApi.create(data); emit('saved', item); emit('close'); notify('仪器信息已保存') }
  catch (e) { error.value = e.message } finally { busy.value = false }
}
</script>
<template><BaseDialog :open="open" :title="instrument ? '编辑仪器信息' : '新建仪器'" :busy="busy" @close="emit('close')"><form class="notebook-form" @submit.prevent="save"><fieldset :disabled="busy"><label>仪器名称<input v-model="form.name" required /></label><label>型号<input v-model="form.model" /></label><label>厂商<input v-model="form.manufacturer" /></label><label>位置<input v-model="form.location" /></label><label>负责人<input v-model="form.manager" /></label><label>状态<select v-model="form.status"><option>正常</option><option>维护中</option><option>故障</option></select></label></fieldset><p v-if="error" class="error-banner" role="alert">{{ error }}</p><button class="button primary" :disabled="busy">保存</button></form></BaseDialog></template>
