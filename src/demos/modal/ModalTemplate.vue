<template>
  <div class="flex flex-col overflow-hidden flex-1">
    <div
      v-if="$slots.header"
      class="shrink-0 border-b border-transparent transition-colors duration-150"
      :class="{ 'border-gray-200': isScrolled }"
    >
      <slot name="header" />
    </div>

    <div ref="scrollEl" class="flex-1 overflow-y-auto" @scroll="onScroll">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="shrink-0 border-t border-transparent transition-colors duration-150"
      :class="{ 'border-gray-200': !isAtBottom }"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const scrollEl = ref<HTMLElement>();
const isScrolled = ref(false);
const isAtBottom = ref(true);

function onScroll() {
  if (!scrollEl.value) return;
  const { scrollTop, scrollHeight, clientHeight } = scrollEl.value;
  isScrolled.value = scrollTop > 0;
  isAtBottom.value = scrollTop + clientHeight >= scrollHeight - 1;
}

onMounted(() => onScroll());
</script>
