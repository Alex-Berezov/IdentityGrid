import { describe, it, expect } from 'vitest'
import { useLabelParser } from '../composables/useLabelParser'

describe('useLabelParser', () => {
  const { parseLabels, stringifyLabels } = useLabelParser()

  describe('parseLabels', () => {
    it('should parse "admin;user" into array of objects', () => {
      expect(parseLabels('admin;user')).toEqual([{ text: 'admin' }, { text: 'user' }])
    })

    it('should parse "admin;user;guest" into array of three objects', () => {
      expect(parseLabels('admin;user;guest')).toEqual([
        { text: 'admin' },
        { text: 'user' },
        { text: 'guest' },
      ])
    })

    it('should return empty array for empty string', () => {
      expect(parseLabels('')).toEqual([])
    })

    it('should return empty array for string with only spaces', () => {
      expect(parseLabels('   ')).toEqual([])
    })

    it('should trim spaces around labels', () => {
      expect(parseLabels('  admin ; user  ')).toEqual([{ text: 'admin' }, { text: 'user' }])
    })

    it('should filter out empty labels after split', () => {
      expect(parseLabels('admin;;user')).toEqual([{ text: 'admin' }, { text: 'user' }])
    })

    it('should handle single label', () => {
      expect(parseLabels('admin')).toEqual([{ text: 'admin' }])
    })

    it('should handle trailing semicolon', () => {
      expect(parseLabels('admin;user;')).toEqual([{ text: 'admin' }, { text: 'user' }])
    })

    it('should handle leading semicolon', () => {
      expect(parseLabels(';admin;user')).toEqual([{ text: 'admin' }, { text: 'user' }])
    })
  })

  describe('stringifyLabels', () => {
    it('should convert array of objects to "admin;user" string', () => {
      expect(stringifyLabels([{ text: 'admin' }, { text: 'user' }])).toBe('admin;user')
    })

    it('should return empty string for empty array', () => {
      expect(stringifyLabels([])).toBe('')
    })

    it('should handle single item array', () => {
      expect(stringifyLabels([{ text: 'admin' }])).toBe('admin')
    })

    it('should trim spaces in label texts', () => {
      expect(stringifyLabels([{ text: '  admin  ' }, { text: '  user  ' }])).toBe('admin;user')
    })

    it('should filter out empty texts after trim', () => {
      expect(stringifyLabels([{ text: 'admin' }, { text: '   ' }, { text: 'user' }])).toBe(
        'admin;user'
      )
    })
  })

  describe('round-trip conversion', () => {
    it('should correctly convert string to array and back', () => {
      const original = 'admin;user;guest'
      const parsed = parseLabels(original)
      const stringified = stringifyLabels(parsed)
      expect(stringified).toBe(original)
    })

    it('should preserve labels through round-trip even with spaces', () => {
      const original = '  admin ; user ; guest  '
      const parsed = parseLabels(original)
      const stringified = stringifyLabels(parsed)
      expect(stringified).toBe('admin;user;guest')
    })
  })
})
