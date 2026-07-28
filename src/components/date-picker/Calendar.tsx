'use client'

import clsx from 'clsx'
import { useState } from 'react'

import { ArrowIosBackIcon, ArrowIosForwardIcon } from '../../icons/index.js'
import styles from './calendar.module.css'

type MonthGrid = (number | null)[][]

interface CalendarState {
  year: number
  month: number
}

/**
 * Внутренность `DatePicker`, наружу не экспортируется: своей разметкой поля,
 * подписи и ошибки у календаря нет, а раскладка сетки завязана на попап пикера.
 * Понадобится отдельный календарь — вынесем осознанно, с собственным API.
 */
interface CalendarProps {
  initialMonth?: Date
  onSelect?: (date: Date) => void
  selected?: Date | null
  rangeSelected?: { from: Date; to: Date } | null
  mode?: 'single' | 'range'
  onRangeSelect?: (range: { from: Date; to: Date }) => void
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const buildMonthGrid = (year: number, month: number): MonthGrid => {
  const firstDay = new Date(year, month, 1).getDay()
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const weeks: MonthGrid = []
  let currentWeek: (number | null)[] = []

  for (let i = 0; i < adjustedFirstDay; i++) {
    currentWeek.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null)
    }
    weeks.push(currentWeek)
  }

  return weeks
}

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

/**
 * Полночь того же дня. Дни сетки построены из `new Date(год, месяц, число)`,
 * то есть уже полуночные, а границы диапазона приходят от потребителя как есть —
 * с временем. Без срезания `new Date()` в `from` не совпал бы ни с одной ячейкой
 * и диапазон не подсветился бы вовсе.
 */
const startOfDay = (date: Date): number => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

const isToday = (year: number, month: number, day: number): boolean => {
  const today = new Date()
  return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
}

const isWeekend = (year: number, month: number, day: number): boolean => {
  const d = new Date(year, month, day)
  return d.getDay() === 0 || d.getDay() === 6
}

export const Calendar = ({
  initialMonth,
  selected,
  rangeSelected,
  mode = 'single',
  onSelect,
  onRangeSelect,
}: CalendarProps) => {
  // Ленивая инициализация: initialMonth читается один раз, при монтировании.
  // Дальше месяц ведёт сам календарь — смена пропа его не перематывает.
  const [state, setState] = useState<CalendarState>(() => {
    const start = initialMonth ?? new Date()

    return { year: start.getFullYear(), month: start.getMonth() }
  })
  const [rangeStart, setRangeStart] = useState<Date | null>(rangeSelected?.from || null)

  // Без useMemo/useCallback: сетка — 42 числа, мемоизированных детей у календаря нет,
  // и кэш обошёлся бы дороже пересчёта.
  const grid = buildMonthGrid(state.year, state.month)

  const goPrev = () => {
    setState((s) => (s.month === 0 ? { year: s.year - 1, month: 11 } : { ...s, month: s.month - 1 }))
  }

  const goNext = () => {
    setState((s) => (s.month === 11 ? { year: s.year + 1, month: 0 } : { ...s, month: s.month + 1 }))
  }

  const isSelected = (day: number): boolean => {
    if (!selected) return false
    return isSameDay(selected, new Date(state.year, state.month, day))
  }

  const getRangeEdge = (day: number): 'start' | 'end' | 'middle' | null => {
    if (!rangeSelected?.from || !rangeSelected?.to) return null

    const d = new Date(state.year, state.month, day).getTime()
    const fromTime = startOfDay(rangeSelected.from)
    const toTime = startOfDay(rangeSelected.to)

    // Диапазон из одного дня отдельной ветки не требует: from === to, и ячейка
    // получает 'start' по первому же сравнению.
    if (d === fromTime) return 'start'
    if (d === toTime) return 'end'
    if (d > fromTime && d < toTime) return 'middle'

    return null
  }

  const handleDayClick = (day: number) => {
    const date = new Date(state.year, state.month, day)

    if (mode === 'single') {
      onSelect?.(date)
      return
    }

    if (!rangeStart) {
      setRangeStart(date)
      onRangeSelect?.({ from: date, to: date })
    } else {
      const from = rangeStart < date ? rangeStart : date
      const to = rangeStart < date ? date : rangeStart
      setRangeStart(null)
      onRangeSelect?.({ from, to })
    }
  }

  const monthName = new Date(state.year, state.month).toLocaleString('en-US', { month: 'long' })

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <span className={styles.monthLabel}>
          {monthName} {state.year}
        </span>
        <div className={styles.navButtons}>
          <button type="button" className={styles.navBtn} onClick={goPrev} aria-label="Previous month">
            <ArrowIosBackIcon size={20} />
          </button>
          <button type="button" className={styles.navBtn} onClick={goNext} aria-label="Next month">
            <ArrowIosForwardIcon size={20} />
          </button>
        </div>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map((d) => (
          <span key={d} className={styles.weekday}>
            {d}
          </span>
        ))}
      </div>

      <div className={styles.month}>
        {grid.map((week, wi) => (
          <div key={wi} className={styles.week}>
            {week.map((day, di) => {
              if (day === null) {
                return <span key={di} className={styles.day} />
              }

              const rangeEdge = getRangeEdge(day)
              const weekend = isWeekend(state.year, state.month, day)

              const dayClasses = clsx(
                styles.day,
                isToday(state.year, state.month, day) && styles.dayToday,
                isSelected(day) && styles.daySelected,
                rangeEdge === 'start' && styles.dayRangeStart,
                rangeEdge === 'end' && styles.dayRangeEnd,
                rangeEdge === 'middle' && styles.dayRangeMiddle,
                weekend && !isSelected(day) && rangeEdge === null && styles.dayWeekend
              )

              // tabIndex не задаём: в исходнике 0 стоял только у первого числа,
              // а стрелок для перехода между днями не было — с клавиатуры вся
              // остальная сетка была недостижима. Пока каждый день — свой таб-стоп.
              return (
                <button key={di} type="button" className={dayClasses} onClick={() => handleDayClick(day)}>
                  {day}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
