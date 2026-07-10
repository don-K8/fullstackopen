import { create } from 'zustand'

const useCounterStore = create(set => ({
  counters: {
    good: 0,
    neutral: 0,
    bad: 0,
  },
  actions: {
    good: () => set(state => ({ counters: {...state.counters, good: state.counters.good + 1} })),
    neutral: () => set(state => ({ counters: {...state.counters, neutral: state.counters.neutral + 1} })),
    bad: () => set(state => ({ counters: {...state.counters, bad: state.counters.bad + 1} }))
  }
  
}))

export const useCounter = () => useCounterStore(state => state.counters)
export const useCounterControls = () => useCounterStore(state => state.actions)