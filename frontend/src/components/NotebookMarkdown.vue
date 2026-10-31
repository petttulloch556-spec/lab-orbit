<script setup>
import { ref } from 'vue'
import { renderMarkdown } from '../utils/markdown'
defineProps({ modelValue: String, label: { type: String, default: '正文' }, required: Boolean })
const emit = defineEmits(['update:modelValue'])
const preview = ref(false)
</script>
<template>
  <div class="notebook-markdown">
    <div class="notebook-actions"><span>{{ label }}（Markdown / 公式 / 图片链接）</span><button class="button secondary" type="button" :aria-pressed="preview" @click="preview = !preview">{{ preview ? '继续编辑' : '预览' }}</button></div>
    <div v-if="preview" class="notebook-prose" v-html="renderMarkdown(modelValue || '暂无内容')"></div>
    <textarea v-else :value="modelValue" :aria-label="label" :required="required" rows="10" placeholder="自由记录实验过程、结果与问题；公式用 $…$，图片用 ![说明](https://…)" @input="emit('update:modelValue', $event.target.value)"></textarea>
  </div>
</template>
