import { type InjectionKey, type Ref } from 'vue';

export interface Address {
  street: string;
  city: string;
  note?: string;
}

export const ADDRESS_KEY: InjectionKey<Ref<Address>> =
  Symbol('address');

export const savedAddresses: Address[] = [
  { street: 'Musterstraße 42', city: '10115 Berlin' },
  { street: 'Friedrichstraße 123', city: '10117 Berlin' },
  { street: 'Hauptstraße 45', city: '80331 München' },
  { street: 'Königsallee 7', city: '40212 Düsseldorf' }
];
