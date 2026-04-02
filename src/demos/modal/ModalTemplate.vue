<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <div
      class="relative z-10 flex shrink-0 items-start px-4 pt-3 pb-2 transition-shadow duration-150"
      :class="isScrolled ? 'shadow-md' : ''">
      <div class="min-w-0 flex-1">
        <slot name="header" />
      </div>
      <ModalClose />
    </div>

    <div
      ref="scrollEl"
      class="flex-1 overflow-y-auto"
      @scroll="onScroll">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="shrink-0 transition-shadow duration-150"
      :class="!isAtBottom ? 'shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]' : ''">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, useTemplateRef } from 'vue';
  import ModalClose from './ModalClose.vue';

  const scrollEl = useTemplateRef<HTMLElement>('scrollEl');
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
