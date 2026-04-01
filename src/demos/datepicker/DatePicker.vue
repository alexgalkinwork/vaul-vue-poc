<template>
  <DatePickerRoot
    v-model="model"
    :locale="locale"
    :week-starts-on="weekStartsOn"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-disabled="isDateDisabled"
    :is-date-unavailable="isDateUnavailable"
    :disabled="disabled"
    :close-on-select="true"
    :placeholder="placeholder"
    @update:placeholder="(d: RekaDateValue) => (placeholder = d)">
    <DatePickerField
      v-slot="{ segments }"
      class="flex items-center rounded-lg border border-gray-300 px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
      :class="{ 'opacity-50': disabled }">
      <div class="flex items-center">
        <template
          v-for="item in segments"
          :key="item.part">
          <DatePickerInput
            v-if="item.part === 'literal'"
            :part="item.part"
            class="text-sm text-gray-400">
            {{ item.value }}
          </DatePickerInput>
          <DatePickerInput
            v-else
            :part="item.part"
            class="rounded-sm text-center text-sm tabular-nums focus:bg-blue-100 focus:outline-none data-placeholder:text-gray-400">
            {{ item.value }}
          </DatePickerInput>
        </template>
      </div>
      <DatePickerTrigger
        class="ml-auto flex h-7 w-7 shrink-0 cursor-default items-center justify-center rounded-md text-gray-500 hover:bg-gray-100">
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
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect
            width="18"
            height="18"
            x="3"
            y="4"
            rx="2" />
          <path d="M3 10h18" />
        </svg>
      </DatePickerTrigger>
    </DatePickerField>

    <DatePickerContent
      :side-offset="4"
      :avoid-collisions="true"
      :collision-padding="8"
      align="center"
      class="z-50 max-w-[calc(100vw-1rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <DatePickerCalendar
        v-slot="{ weekDays, grid }"
        class="select-none">
        <DatePickerHeader class="mb-2 flex items-center justify-between gap-1">
          <DatePickerPrev
            class="inline-flex h-7 w-7 shrink-0 cursor-default items-center justify-center rounded-md hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </DatePickerPrev>

          <div class="flex flex-1 items-center justify-center gap-1">
            <select
              :value="placeholder?.month"
              class="cursor-default rounded-md bg-transparent px-1 py-0.5 text-sm font-medium hover:bg-gray-100 focus:outline-none"
              @change="setMonth(Number(($event.target as HTMLSelectElement).value))">
              <option
                v-for="(name, i) in monthNames"
                :key="i"
                :value="i + 1">
                {{ name }}
              </option>
            </select>
            <select
              :value="placeholder?.year"
              class="cursor-default rounded-md bg-transparent px-1 py-0.5 text-sm font-medium hover:bg-gray-100 focus:outline-none"
              @change="setYear(Number(($event.target as HTMLSelectElement).value))">
              <option
                v-for="y in yearRange"
                :key="y"
                :value="y">
                {{ y }}
              </option>
            </select>
          </div>

          <DatePickerNext
            class="inline-flex h-7 w-7 shrink-0 cursor-default items-center justify-center rounded-md hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </DatePickerNext>
        </DatePickerHeader>

        <DatePickerGrid
          v-for="month in grid"
          :key="month.value.toString()"
          class="w-full border-collapse space-y-1">
          <DatePickerGridHead>
            <DatePickerGridRow class="mb-1 flex w-full justify-between">
              <DatePickerHeadCell
                v-for="day in weekDays"
                :key="day"
                class="w-8 text-center text-xs font-medium text-gray-500">
                {{ day }}
              </DatePickerHeadCell>
            </DatePickerGridRow>
          </DatePickerGridHead>
          <DatePickerGridBody>
            <DatePickerGridRow
              v-for="(week, weekIndex) in month.rows"
              :key="`week-${weekIndex}`"
              class="flex w-full">
              <DatePickerCell
                v-for="dayCell in week"
                :key="dayCell.toString()"
                :date="dayCell">
                <DatePickerCellTrigger
                  :day="dayCell"
                  :month="month.value"
                  class="flex h-8 w-8 cursor-default items-center justify-center rounded-full text-sm data-outside-view:text-gray-300 data-selected:bg-blue-600 data-selected:text-white data-today:font-bold data-disabled:cursor-not-allowed data-disabled:text-gray-300 data-unavailable:cursor-not-allowed data-unavailable:text-gray-300 data-unavailable:line-through hover:bg-gray-100 data-selected:hover:bg-blue-700" />
              </DatePickerCell>
            </DatePickerGridRow>
          </DatePickerGridBody>
        </DatePickerGrid>
      </DatePickerCalendar>
    </DatePickerContent>
  </DatePickerRoot>
</template>

<script setup lang="ts">
  import type { DateValue } from '@internationalized/date';
  import type { DateValue as RekaDateValue } from 'reka-ui';
  import {
    CalendarDate,
    DateFormatter,
    getLocalTimeZone,
    today
  } from '@internationalized/date';
  import { computed, ref } from 'vue';
  import {
    DatePickerCalendar,
    DatePickerCell,
    DatePickerCellTrigger,
    DatePickerContent,
    DatePickerField,
    DatePickerGrid,
    DatePickerGridBody,
    DatePickerGridHead,
    DatePickerGridRow,
    DatePickerHeadCell,
    DatePickerHeader,
    DatePickerInput,
    DatePickerNext,
    DatePickerPrev,
    DatePickerRoot,
    DatePickerTrigger
  } from 'reka-ui';

  const model = defineModel<DateValue>();

  const {
    locale = 'de-DE',
    weekStartsOn = 1,
    yearMin = new Date().getFullYear() - 100,
    yearMax = new Date().getFullYear() + 10,
    disabled = false
  } = defineProps<{
    locale?: string;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    yearMin?: number;
    yearMax?: number;
    minValue?: DateValue;
    maxValue?: DateValue;
    isDateDisabled?: (date: DateValue) => boolean;
    isDateUnavailable?: (date: DateValue) => boolean;
    disabled?: boolean;
  }>();

  const placeholder = ref<RekaDateValue>(
    today(getLocalTimeZone()) as RekaDateValue
  );

  const monthNames = computed(() => {
    const df = new DateFormatter(locale, { month: 'long' });
    return Array.from({ length: 12 }, (_, i) =>
      df.format(new CalendarDate(2024, i + 1, 1).toDate(getLocalTimeZone()))
    );
  });

  const yearRange = computed(() =>
    Array.from({ length: yearMax - yearMin + 1 }, (_, i) => yearMin + i)
  );

  function setMonth(month: number) {
    if (!placeholder.value) return;
    placeholder.value = placeholder.value.set({ month });
  }

  function setYear(year: number) {
    if (!placeholder.value) return;
    placeholder.value = placeholder.value.set({ year });
  }
</script>
