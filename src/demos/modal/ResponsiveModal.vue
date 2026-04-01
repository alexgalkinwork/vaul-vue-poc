<template>
  <template
    v-for="(instance, index) in modalStack"
    :key="instance.id">
    <ModalDialog
      v-if="instance.isDesktop"
      :instance="instance"
      :z-index="100 + index * 10"
      :first-in-stack="index === 0" />
    <ModalSheet
      v-else
      :instance="instance"
      :z-index="100 + index * 10"
      :first-in-stack="index === 0" />
  </template>
</template>

<script setup lang="ts">
  import { useModal } from './useModal';
  import ModalDialog from './ModalDialog.vue';
  import ModalSheet from './ModalSheet.vue';

  const { modalStack } = useModal();
</script>
