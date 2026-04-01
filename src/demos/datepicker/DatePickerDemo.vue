<template>
  <div class="space-y-4">
    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        Lieferdatum
      </label>
      <DatePicker v-model="singleDate" />
      <p
        v-if="singleDate"
        class="mt-2 text-xs text-gray-500">
        {{ formatDate(singleDate) }}
      </p>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        Termin (nur Werktage, nächste 30 Tage)
      </label>
      <DatePicker
        v-model="constrainedDate"
        :min-value="todayDate"
        :max-value="maxDate"
        :is-date-disabled="isWeekend" />
      <p
        v-if="constrainedDate"
        class="mt-2 text-xs text-gray-500">
        {{ formatDate(constrainedDate) }}
      </p>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        Urlaubszeitraum
      </label>
      <DateRangePicker v-model="rangeValue" />
      <p
        v-if="rangeValue?.start && rangeValue?.end"
        class="mt-2 text-xs text-gray-500">
        {{ formatDate(rangeValue.start) }} – {{ formatDate(rangeValue.end) }}
      </p>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        Buchungszeitraum (nur Werktage, ab heute)
      </label>
      <DateRangePicker
        v-model="constrainedRange"
        :min-value="todayDate"
        :is-date-disabled="isWeekend" />
      <p
        v-if="constrainedRange?.start && constrainedRange?.end"
        class="mt-2 text-xs text-gray-500">
        {{ formatDate(constrainedRange.start) }} –
        {{ formatDate(constrainedRange.end) }}
      </p>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <label class="mb-2 block text-sm font-medium text-gray-700">
        Deaktiviert
      </label>
      <DatePicker
        v-model="disabledDate"
        disabled />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { DateRange } from 'reka-ui';
  import type { DateValue } from '@internationalized/date';
  import { ref } from 'vue';
  import {
    CalendarDate,
    DateFormatter,
    getDayOfWeek,
    getLocalTimeZone,
    today
  } from '@internationalized/date';
  import DatePicker from './DatePicker.vue';
  import DateRangePicker from './DateRangePicker.vue';

  const singleDate = ref<DateValue>();
  const constrainedDate = ref<DateValue>();
  const rangeValue = ref<DateRange>();
  const constrainedRange = ref<DateRange>();
  const disabledDate = ref<DateValue>(new CalendarDate(2026, 3, 15));

  const todayDate = today(getLocalTimeZone());
  const maxDate = todayDate.add({ days: 30 });

  const df = new DateFormatter('de-DE', { dateStyle: 'long' });

  function formatDate(date: DateValue) {
    return df.format(date.toDate(getLocalTimeZone()));
  }

  function isWeekend(date: DateValue) {
    const dayOfWeek = getDayOfWeek(date, 'de-DE');
    return dayOfWeek === 0 || dayOfWeek === 6;
  }
</script>
