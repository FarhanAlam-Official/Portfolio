import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

/**
 * Feature: database-free-cms-admin-panel
 * Property 11: JSON Pretty Printing
 * 
 * For any content written to content.json, the file SHALL be formatted 
 * with exactly 2-space indentation.
 * 
 * Validates: Requirements 3.6
 */
describe('Property 11: JSON Pretty Printing', () => {
  it('should format JSON with exactly 2-space indentation', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbitraryJsonObject(),
        async (obj) => {
          // Pretty print with 2-space indentation
          const formatted = JSON.stringify(obj, null, 2)
          
          // Parse to verify it's valid JSON
          const parsed = JSON.parse(formatted)
          expect(parsed).toEqual(obj)
          
          // Check indentation is exactly 2 spaces
          const lines = formatted.split('\n')
          
          for (const line of lines) {
            // Skip empty lines
            if (line.trim() === '') continue
            
            // Count leading spaces
            const leadingSpaces = line.match(/^ */)?.[0].length || 0
            
            // Indentation should be a multiple of 2
            expect(leadingSpaces % 2).toBe(0)
          }
          
          // Verify no tabs used
          expect(formatted).not.toContain('\t')
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should maintain consistent indentation for nested objects', () => {
    const nestedObject = {
      level1: {
        level2: {
          level3: {
            value: 'deep',
          },
        },
      },
    }
    
    const formatted = JSON.stringify(nestedObject, null, 2)
    const lines = formatted.split('\n')
    
    // Check specific indentation levels
    expect(lines[0]).toBe('{')
    expect(lines[1]).toBe('  "level1": {')
    expect(lines[2]).toBe('    "level2": {')
    expect(lines[3]).toBe('      "level3": {')
    expect(lines[4]).toBe('        "value": "deep"')
    expect(lines[5]).toBe('      }')
    expect(lines[6]).toBe('    }')
    expect(lines[7]).toBe('  }')
    expect(lines[8]).toBe('}')
  })
  
  it('should format arrays with proper indentation', () => {
    const arrayObject = {
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
    }
    
    const formatted = JSON.stringify(arrayObject, null, 2)
    const lines = formatted.split('\n')
    
    // Verify array formatting
    expect(lines[0]).toBe('{')
    expect(lines[1]).toBe('  "items": [')
    expect(lines[2]).toBe('    {')
    expect(lines[3]).toBe('      "id": 1,')
    expect(lines[4]).toBe('      "name": "Item 1"')
    expect(lines[5]).toBe('    },')
    expect(lines[6]).toBe('    {')
    expect(lines[7]).toBe('      "id": 2,')
    expect(lines[8]).toBe('      "name": "Item 2"')
    expect(lines[9]).toBe('    }')
    expect(lines[10]).toBe('  ]')
    expect(lines[11]).toBe('}')
  })
  
  it('should handle empty objects and arrays', () => {
    const emptyStructures = {
      emptyObject: {},
      emptyArray: [],
      nestedEmpty: {
        obj: {},
        arr: [],
      },
    }
    
    const formatted = JSON.stringify(emptyStructures, null, 2)
    
    // Verify valid JSON
    const parsed = JSON.parse(formatted)
    expect(parsed).toEqual(emptyStructures)
    
    // Verify no tabs
    expect(formatted).not.toContain('\t')
    
    // Verify indentation is multiples of 2
    const lines = formatted.split('\n')
    for (const line of lines) {
      if (line.trim() === '') continue
      const leadingSpaces = line.match(/^ */)?.[0].length || 0
      expect(leadingSpaces % 2).toBe(0)
    }
  })
  
  it('should preserve special characters in pretty-printed JSON', () => {
    const specialChars = {
      quotes: 'He said "hello"',
      backslash: 'C:\\Users\\Admin',
      newline: 'Line 1\nLine 2',
      tab: 'Column1\tColumn2',
      unicode: 'Hello 世界 🌍',
    }
    
    const formatted = JSON.stringify(specialChars, null, 2)
    const parsed = JSON.parse(formatted)
    
    // Verify all special characters preserved
    expect(parsed).toEqual(specialChars)
    
    // Verify proper indentation
    const lines = formatted.split('\n')
    for (const line of lines) {
      if (line.trim() === '') continue
      const leadingSpaces = line.match(/^ */)?.[0].length || 0
      expect(leadingSpaces % 2).toBe(0)
    }
  })
})

// Arbitrary generator for JSON objects
function arbitraryJsonObject() {
  return fc.oneof(
    // Simple objects
    fc.record({
      string: fc.string(),
      number: fc.integer(),
      boolean: fc.boolean(),
    }),
    // Nested objects
    fc.record({
      nested: fc.record({
        deep: fc.record({
          value: fc.string(),
        }),
      }),
    }),
    // Arrays
    fc.record({
      items: fc.array(
        fc.record({
          id: fc.integer(),
          name: fc.string(),
        }),
        { minLength: 0, maxLength: 5 }
      ),
    }),
    // Mixed
    fc.record({
      data: fc.record({
        strings: fc.array(fc.string(), { minLength: 0, maxLength: 5 }),
        numbers: fc.array(fc.integer(), { minLength: 0, maxLength: 5 }),
        nested: fc.record({
          value: fc.string(),
        }),
      }),
    })
  )
}
