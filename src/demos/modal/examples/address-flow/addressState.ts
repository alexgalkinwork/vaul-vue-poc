import { type InjectionKey, type Ref } from 'vue';

export interface Address {
  street: string;
  city: string;
}

export const ADDRESS_KEY: InjectionKey<Ref<Address>> =
  Symbol('address');
