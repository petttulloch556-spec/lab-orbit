<script setup>
import { FILE_ACCEPT, validateFile } from '../utils/experimentFiles'
import { notify } from '../composables/feedback'
const props = defineProps({ modelValue: { type: Array, default: () => [] }, disabled: Boolean })
const emit = defineEmits(['update:modelValue'])
function choose(event) {
  try {
    const files = [...event.target.files]
    files.forEach(validateFile)
    emit('update:modelValue', [...props.modelValue, ...files])
  } catch (error) { notify(error.message, 'error') }
  event.target.value = ''
}
</script>
<template>
  <div class="notebook-file-picker">
    <label>附件（多选，每个不超过 50 MB）<input type="file" multiple :accept="FILE_ACCEPT" :disabled="disabled" @change="choose" /></label>
    <p class="muted">演示版仅保存不超过 200 KB 的文本附件内容；其他文件只保存信息。</p>
    <ul v-if="modelValue.length"><li v-for="(file, index) in modelValue" :key="index">{{ file.name }} <button type="button" class="button secondary" :disabled="disabled" @click="emit('update:modelValue', modelValue.filter((_, i) => i !== index))">移除待上传文件</button></li></ul>
  </div>
</template>
