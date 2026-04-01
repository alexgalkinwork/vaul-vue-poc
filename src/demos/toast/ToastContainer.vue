<template>
  <ToastProvider
    v-for="pos in positions"
    :key="pos"
    :duration="10000"
    swipe-direction="right">
    <ToastRoot
      v-if="getByPosition(pos)"
      :key="getByPosition(pos)!.id"
      :duration="getByPosition(pos)!.duration"
      :open="true"
      class="pointer-events-auto flex w-80 items-start gap-3 rounded-lg border-l-4 bg-white p-4 shadow-lg"
      :class="borderColors[getByPosition(pos)!.type]"
      @pointerdown.stop
      @pointerup.stop
      @click.stop
      @update:open="(val: boolean) => handleToastOpenChange(val, pos)">
      <div class="min-w-0 flex-1">
        <ToastTitle
          v-if="getByPosition(pos)!.title"
          class="mb-1 text-sm font-semibold text-gray-900">
          {{ getByPosition(pos)!.title }}
        </ToastTitle>
        <ToastDescription
          class="text-sm text-gray-700"
          v-html="getByPosition(pos)!.message" />
        <ToastAction
          v-if="getByPosition(pos)!.action"
          :alt-text="getByPosition(pos)!.action!.label"
          as-child>
          <button
            class="mt-2 text-sm font-medium underline"
            :class="actionColors[getByPosition(pos)!.type]"
            @pointerdown="getByPosition(pos)?.action?.onClick()">
            {{ getByPosition(pos)!.action!.label }}
          </button>
        </ToastAction>
      </div>
      <ToastClose
        class="flex h-6 w-6 shrink-0 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </ToastClose>
    </ToastRoot>

    <ToastPortal>
      <ToastViewport
        class="pointer-events-none fixed z-110 m-0 flex w-80 list-none flex-col gap-2 p-0 outline-none"
        :class="positionClasses[pos]" />
    </ToastPortal>
  </ToastProvider>
</template>

<script setup lang="ts">
  import {
    ToastAction,
    ToastClose,
    ToastDescription,
    ToastPortal,
    ToastProvider,
    ToastRoot,
    ToastTitle,
    ToastViewport
  } from 'reka-ui';
  import { useToast, type ToastPosition, type ToastType } from './useToast';

  const { getByPosition, dismiss } = useToast();

  const positions: ToastPosition[] = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right'
  ];

  function handleToastOpenChange(open: boolean, pos: ToastPosition) {
    if (!open) {
      dismiss(pos);
    }
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  } satisfies Record<ToastPosition, string>;

  const borderColors = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    warning: 'border-l-yellow-500',
    info: 'border-l-blue-500'
  } satisfies Record<ToastType, string>;

  const actionColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  } satisfies Record<ToastType, string>;
</script>
