<script setup>
import { onBeforeUnmount, ref } from 'vue'
import BaseDialog from './BaseDialog.vue'
import { firstLines, getDemoImageBlob } from '../utils/experimentFiles'
defineProps({ files: { type: Array, default: () => [] }, removable: Boolean, busy: Boolean })
defineEmits(['remove'])
const preview = ref(null), urls = new Map()
const contentUrl = file => {
  if (!urls.has(file.content)) urls.set(file.content, URL.createObjectURL(new Blob([file.content], { type: file.type })))
  return urls.get(file.content)
}
const imageUrl = file => {
  const blob = getDemoImageBlob(file.id)
  if (!blob) return ''
  if (!urls.has(file.id)) urls.set(file.id, URL.createObjectURL(blob))
  return urls.get(file.id)
}
onBeforeUnmount(() => urls.forEach(url => URL.revokeObjectURL(url)))
</script>
<template>
  <div class="notebook-attachments">
    <p v-if="!files.length" class="muted">暂无附件</p>
    <article v-for="file in files" :key="file.id" class="notebook-inset">
      <strong>{{ file.name }}</strong><p class="muted">{{ (file.size / 1024).toFixed(1) }} KB · {{ file.type }} · 上传人：{{ file.author_name }}</p>
      <template v-if="file.type?.startsWith('image/') || /\.(png|jpe?g|webp|gif|tif)$/i.test(file.name)"><img v-if="imageUrl(file)" class="notebook-image" :src="imageUrl(file)" :alt="file.name" /><div v-else class="notebook-image-placeholder" role="img" :aria-label="`${file.name}：演示图片占位，未保存原图`">图片缩略图占位 · {{ file.name }}</div></template>
      <div class="notebook-actions"><template v-if="typeof file.content === 'string'"><button class="button secondary" @click="preview = file">预览前 200 行</button><a class="button secondary" :href="contentUrl(file)" :download="file.name">下载文本</a></template><span v-else class="muted">演示版不保存文件内容</span><button v-if="removable" class="button secondary" :disabled="busy" @click="$emit('remove', file)">删除附件</button></div>
    </article>
    <BaseDialog :open="!!preview" title="文本附件预览（前 200 行）" wide @close="preview = null"><pre class="notebook-text-preview">{{ firstLines(preview?.content) }}</pre></BaseDialog>
  </div>
</template>
