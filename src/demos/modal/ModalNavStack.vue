<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <div class="flex shrink-0 items-center px-4 pt-3 pb-2">
      <Transition name="nav-back-btn">
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
      </Transition>
      <h2 class="flex-1 text-lg font-semibold">
        {{ nav.currentTitle.value }}
      </h2>
      <ModalClose />
    </div>

    <div class="relative flex-1 overflow-hidden">
      <Transition
        :name="transitionName"
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
  import { type Component, computed, provide } from 'vue';
  import ModalClose from './ModalClose.vue';
  import { NAV_STACK_KEY, createNavStack } from './useNavStack';

  const { root, rootTitle } = defineProps<{
    root: Component;
    rootTitle: string;
  }>();

  const nav = createNavStack(root, rootTitle);
  provide(NAV_STACK_KEY, nav);

  const transitionName = computed(() =>
    nav.direction.value === 'forward' ? 'nav-push' : 'nav-pop'
  );
</script>

<style>
  .nav-push-enter-active,
  .nav-push-leave-active,
  .nav-pop-enter-active,
  .nav-pop-leave-active {
    transition:
      transform 0.2s cubic-bezier(0.32, 0.72, 0, 1),
      opacity 0.2s cubic-bezier(0.32, 0.72, 0, 1);
  }

  /* Push: leave slides left, enter slides from right */
  .nav-push-leave-to {
    transform: translateX(-20%);
    opacity: 0;
  }
  .nav-push-enter-from {
    transform: translateX(40%);
    opacity: 0;
  }

  /* Pop: leave slides right, enter slides from left */
  .nav-pop-leave-to {
    transform: translateX(40%);
    opacity: 0;
  }
  .nav-pop-enter-from {
    transform: translateX(-20%);
    opacity: 0;
  }

  /* Back button */
  .nav-back-btn-enter-active,
  .nav-back-btn-leave-active {
    transition:
      opacity 0.15s ease,
      transform 0.15s ease;
  }
  .nav-back-btn-enter-from,
  .nav-back-btn-leave-to {
    opacity: 0;
    transform: translateX(-8px);
  }
</style>
