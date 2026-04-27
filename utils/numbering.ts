import { shallowRef } from 'vue'

export const figureMapShared = shallowRef<Map<number, number>>(new Map())
export const tableMapShared = shallowRef<Map<number, number>>(new Map())
export const figurePrefixShared = shallowRef('Figure')
export const tablePrefixShared = shallowRef('Table')
