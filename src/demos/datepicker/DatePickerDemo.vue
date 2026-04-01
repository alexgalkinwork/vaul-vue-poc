<template>
  <div class="space-y-8">
    <section>
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Einzelnes Datum
      </h3>
      <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <label class="mb-2 block text-sm font-medium text-gray-700">
          Lieferdatum wählen
        </label>
        <DatePicker v-model="singleDate" />
        <p
          v-if="singleDate"
          class="mt-2 text-sm text-gray-600">
          Gewählt: {{ formatDate(singleDate) }}
        </p>
      </div>
    </section>

    <section>
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Mit Einschränkungen
      </h3>
      <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <label class="mb-2 block text-sm font-medium text-gray-700">
          Termin wählen (nur Werktage, nächste 30 Tage)
        </label>
        <DatePicker
          v-model="constrainedDate"
          :min-value="todayDate"
          :max-value="maxDate"
          :is-date-disabled="isWeekend" />
        <p
          v-if="constrainedDate"
          class="mt-2 text-sm text-gray-600">
          Gewählt: {{ formatDate(constrainedDate) }}
        </p>
      </div>
    </section>

    <section>
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Zeitraum
      </h3>
      <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <label class="mb-2 block text-sm font-medium text-gray-700">
          Urlaubszeitraum wählen
        </label>
        <DateRangePicker v-model="rangeValue" />
        <p
          v-if="rangeValue?.start && rangeValue?.end"
          class="mt-2 text-sm text-gray-600">
          Zeitraum: {{ formatDate(rangeValue.start) }} –
          {{ formatDate(rangeValue.end) }}
        </p>
      </div>
    </section>

    <section>
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Deaktiviert
      </h3>
      <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <label class="mb-2 block text-sm font-medium text-gray-700">
          Nicht editierbar
        </label>
        <DatePicker
          v-model="disabledDate"
          disabled />
      </div>
    </section>
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
