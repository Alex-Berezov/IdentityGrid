import type { LabelItem } from '../types/account'

/**
 * Разделитель меток
 */
const LABEL_SEPARATOR = ';'

/**
 * Composable для парсинга и форматирования меток
 */
export function useLabelParser() {
  /**
   * Преобразует строку меток в массив объектов LabelItem
   * @param labelString - строка с метками, разделенными ;
   * @returns массив объектов { text: string }
   * @example
   * parseLabels("admin;user;guest") → [{ text: "admin" }, { text: "user" }, { text: "guest" }]
   * parseLabels("") → []
   * parseLabels("  admin ; user  ") → [{ text: "admin" }, { text: "user" }]
   */
  function parseLabels(labelString: string): LabelItem[] {
    if (!labelString || !labelString.trim()) {
      return []
    }

    return labelString
      .split(LABEL_SEPARATOR)
      .map((label) => label.trim())
      .filter((label) => label.length > 0)
      .map((text) => ({ text }))
  }

  /**
   * Преобразует массив объектов LabelItem в строку
   * @param labels - массив объектов { text: string }
   * @returns строка с метками, разделенными ;
   * @example
   * stringifyLabels([{ text: "admin" }, { text: "user" }]) → "admin;user"
   * stringifyLabels([]) → ""
   */
  function stringifyLabels(labels: LabelItem[]): string {
    if (!labels || labels.length === 0) {
      return ''
    }

    return labels
      .map((label) => label.text.trim())
      .filter((text) => text.length > 0)
      .join(LABEL_SEPARATOR)
  }

  return {
    parseLabels,
    stringifyLabels,
    LABEL_SEPARATOR,
  }
}
