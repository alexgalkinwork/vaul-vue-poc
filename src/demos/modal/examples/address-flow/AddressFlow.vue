<template>
  <ModalNavStack
    :root="AddressInputPage"
    root-title="Lieferadresse" />
</template>

<script setup lang="ts">
  import { provide, ref } from 'vue';
  import ModalNavStack from '../../ModalNavStack.vue';
  import AddressInputPage from './AddressInputPage.vue';
  import { ADDRESS_KEY, type Address } from './addressState';

  const selectedAddress = ref<Address>({
    street: 'Musterstraße 42',
    city: '10115 Berlin'
  });

  provide(ADDRESS_KEY, selectedAddress);
</script>
