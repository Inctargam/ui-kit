// Calendar отсюда не реэкспортируется: он внутренность DatePicker, а не второй
// компонент кита. Публичный API — обещание поддерживать, и календарь попадёт
// в него только вместе с собственным продуманным API.
export type { DatePickerProps, DatePickerValue, DateRange } from './DatePicker.js'
export { DatePicker } from './DatePicker.js'
