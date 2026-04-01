<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <div class="flex shrink-0 items-center px-4 pt-3 pb-2">
      <button
        v-if="nav.canGoBack.value"
        class="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200"
        @click="nav.pop()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <h2 class="flex-1 text-lg font-semibold">
        {{ nav.currentTitle.value }}
      </h2>
      <ModalClose />
    </div>

    <div class="relative flex-1 overflow-hidden">
      <Transition
        :name="
          nav.direction.value === 'forward' ? 'nav-forward' : 'nav-back'
        "
        mode="out-in">
        <component
          :is="nav.activeEntry.value.component"
          v-bind="nav.activeEntry.value.props ?? {}"
          :key="nav.stack.value.length" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { type Component, provide } from 'vue';
  import ModalClose from './ModalClose.vue';
  import { NAV_STACK_KEY, createNavStack } from './useNavStack';

  const { root, rootTitle } = defineProps<{
    root: Component;
    rootTitle: string;
  }>();

  const nav = createNavStack(root, rootTitle);
  provide(NAV_STACK_KEY, nav);
</script>

<style>
  .nav-forward-enter-active,
  .nav-forward-leave-active,
  .nav-back-enter-active,
  .nav-back-leave-active {
    transition:
      transform 0.25s ease,
      opacity 0.25s ease;
  }

  .nav-forward-enter-from {
    transform: translateX(30%);
    opacity: 0;
  }
  .nav-forward-leave-to {
    transform: translateX(-30%);
    opacity: 0;
  }

  .nav-back-enter-from {
    transform: translateX(-30%);
    opacity: 0;
  }
  .nav-back-leave-to {
    transform: translateX(30%);
    opacity: 0;
  }
</style>
