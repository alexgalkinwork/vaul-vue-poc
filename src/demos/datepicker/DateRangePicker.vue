<template>
  <DateRangePickerRoot
    v-model="model"
    :locale="locale"
    :week-starts-on="weekStartsOn"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-disabled="isDateDisabled"
    :is-date-unavailable="isDateUnavailable"
    :disabled="disabled"
    :number-of-months="numberOfMonths"
    :close-on-select="true">
    <DateRangePickerField
      v-slot="{ segments }"
      class="flex items-center rounded-lg border border-gray-300 px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
      :class="{ 'opacity-50': disabled }">
      <div class="flex items-center">
        <template
          v-for="item in segments.start"
          :key="'start-' + item.part">
          <DateRangePickerInput
            v-if="item.part === 'literal'"
            type="start"
            :part="item.part"
            class="text-sm text-gray-400">
            {{ item.value }}
          </DateRangePickerInput>
          <DateRangePickerInput
            v-else
            type="start"
            :part="item.part"
            class="rounded-sm text-center text-sm tabular-nums focus:bg-blue-100 focus:outline-none data-placeholder:text-gray-400">
            {{ item.value }}
          </DateRangePickerInput>
        </template>
        <span class="mx-1 text-gray-400">–</span>
        <template
          v-for="item in segments.end"
          :key="'end-' + item.part">
          <DateRangePickerInput
            v-if="item.part === 'literal'"
            type="end"
            :part="item.part"
            class="text-sm text-gray-400">
            {{ item.value }}
          </DateRangePickerInput>
          <DateRangePickerInput
            v-else
            type="end"
            :part="item.part"
            class="rounded-sm text-center text-sm tabular-nums focus:bg-blue-100 focus:outline-none data-placeholder:text-gray-400">
            {{ item.value }}
          </DateRangePickerInput>
        </template>
      </div>
      <DateRangePickerTrigger
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
      </DateRangePickerTrigger>
    </DateRangePickerField>

    <DateRangePickerContent
      :side-offset="4"
      :avoid-collisions="true"
      :collision-padding="8"
      align="center"
      class="z-50 max-w-[calc(100vw-1rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <DateRangePickerCalendar
        v-slot="{ weekDays, grid }"
        class="select-none">
        <DateRangePickerHeader class="mb-2 flex items-center justify-between">
          <DateRangePickerPrev
            class="inline-flex h-7 w-7 cursor-default items-center justify-center rounded-md hover:bg-gray-100">
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
          </DateRangePickerPrev>
          <DateRangePickerHeading class="text-sm font-medium" />
          <DateRangePickerNext
            class="inline-flex h-7 w-7 cursor-default items-center justify-center rounded-md hover:bg-gray-100">
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
          </DateRangePickerNext>
        </DateRangePickerHeader>

        <div class="flex flex-col gap-4 sm:flex-row">
          <DateRangePickerGrid
            v-for="month in grid"
            :key="month.value.toString()"
            class="w-full border-collapse space-y-1">
            <DateRangePickerGridHead>
              <DateRangePickerGridRow class="mb-1 flex w-full justify-between">
                <DateRangePickerHeadCell
                  v-for="day in weekDays"
                  :key="day"
                  class="w-8 text-center text-xs font-medium text-gray-500">
                  {{ day }}
                </DateRangePickerHeadCell>
              </DateRangePickerGridRow>
            </DateRangePickerGridHead>
            <DateRangePickerGridBody>
              <DateRangePickerGridRow
                v-for="(week, weekIndex) in month.rows"
                :key="`week-${weekIndex}`"
                class="flex w-full">
                <DateRangePickerCell
                  v-for="dayCell in week"
                  :key="dayCell.toString()"
                  :date="dayCell">
                  <DateRangePickerCellTrigger
                    :day="dayCell"
                    :month="month.value"
                    class="flex h-8 w-8 cursor-default items-center justify-center rounded-full text-sm data-outside-view:text-gray-300 data-selected:bg-blue-600 data-selected:text-white data-highlighted:bg-blue-100 data-today:font-bold data-disabled:text-gray-300 data-disabled:cursor-not-allowed hover:bg-gray-100 data-selected:hover:bg-blue-700" />
                </DateRangePickerCell>
              </DateRangePickerGridRow>
            </DateRangePickerGridBody>
          </DateRangePickerGrid>
        </div>
      </DateRangePickerCalendar>
    </DateRangePickerContent>
  </DateRangePickerRoot>
</template>

<script setup lang="ts">
  import type { DateValue } from '@internationalized/date';
  import type { DateRange } from 'reka-ui';
  import {
    DateRangePickerCalendar,
    DateRangePickerCell,
    DateRangePickerCellTrigger,
    DateRangePickerContent,
    DateRangePickerField,
    DateRangePickerGrid,
    DateRangePickerGridBody,
    DateRangePickerGridHead,
    DateRangePickerGridRow,
    DateRangePickerHeadCell,
    DateRangePickerHeader,
    DateRangePickerHeading,
    DateRangePickerInput,
    DateRangePickerNext,
    DateRangePickerPrev,
    DateRangePickerRoot,
    DateRangePickerTrigger
  } from 'reka-ui';

  const model = defineModel<DateRange>();

  const {
    locale = 'de-DE',
    weekStartsOn = 1,
    numberOfMonths = 2,
    disabled = false
  } = defineProps<{
    locale?: string;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    numberOfMonths?: number;
    minValue?: DateValue;
    maxValue?: DateValue;
    isDateDisabled?: (date: DateValue) => boolean;
    isDateUnavailable?: (date: DateValue) => boolean;
    disabled?: boolean;
  }>();
</script>
