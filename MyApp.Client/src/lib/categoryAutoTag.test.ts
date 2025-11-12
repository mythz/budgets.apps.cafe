import { describe, it, expect } from 'vitest'
import { suggestCategory, getSuggestedCategoriesWithScores } from './categoryAutoTag'

describe('categoryAutoTag', () => {
  describe('suggestCategory', () => {
    it('should suggest Food category for Starbucks latte', () => {
      const result = suggestCategory('Starbucks latte', 'expense')
      expect(result).toBe('Food')
    })

    it('should suggest Transportation category for Uber to work', () => {
      const result = suggestCategory('Uber to work', 'expense')
      expect(result).toBe('Transportation')
    })

    it('should suggest Food category for McDonald\'s lunch', () => {
      const result = suggestCategory('McDonald\'s lunch', 'expense')
      expect(result).toBe('Food')
    })

    it('should suggest Shopping category for Amazon purchase', () => {
      const result = suggestCategory('Amazon purchase', 'expense')
      expect(result).toBe('Shopping')
    })

    it('should suggest Transportation category for gas station', () => {
      const result = suggestCategory('Shell gas station', 'expense')
      expect(result).toBe('Transportation')
    })

    it('should suggest Housing category for monthly rent', () => {
      const result = suggestCategory('Monthly rent payment', 'expense')
      expect(result).toBe('Housing')
    })

    it('should suggest Utilities category for Netflix subscription', () => {
      const result = suggestCategory('Netflix subscription', 'expense')
      expect(result).toBe('Utilities')
    })

    it('should suggest Healthcare category for pharmacy visit', () => {
      const result = suggestCategory('CVS pharmacy prescription', 'expense')
      expect(result).toBe('Healthcare')
    })

    it('should suggest Travel category for hotel booking', () => {
      const result = suggestCategory('Marriott hotel booking', 'expense')
      expect(result).toBe('Travel')
    })

    it('should suggest Salary category for paycheck', () => {
      const result = suggestCategory('Monthly paycheck deposit', 'income')
      expect(result).toBe('Salary')
    })

    it('should suggest Freelance category for client payment', () => {
      const result = suggestCategory('Client project payment', 'income')
      expect(result).toBe('Freelance')
    })

    it('should suggest Investment category for dividend', () => {
      const result = suggestCategory('Stock dividend payout', 'income')
      expect(result).toBe('Investment')
    })

    it('should return null for empty description', () => {
      const result = suggestCategory('', 'expense')
      expect(result).toBeNull()
    })

    it('should return null for unrecognized description', () => {
      const result = suggestCategory('Random xyz abc', 'expense')
      expect(result).toBeNull()
    })

    it('should be case insensitive', () => {
      const result = suggestCategory('STARBUCKS LATTE', 'expense')
      expect(result).toBe('Food')
    })
  })

  describe('getSuggestedCategoriesWithScores', () => {
    it('should return multiple suggestions with scores', () => {
      const results = getSuggestedCategoriesWithScores('Coffee and breakfast at Starbucks', 'expense')
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].category).toBe('Food')
      expect(results[0].score).toBeGreaterThan(0)
    })

    it('should sort suggestions by score descending', () => {
      const results = getSuggestedCategoriesWithScores('Uber ride to restaurant for dinner', 'expense')
      expect(results.length).toBeGreaterThan(0)
      // Should have decreasing scores
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score)
      }
    })

    it('should return empty array for empty description', () => {
      const results = getSuggestedCategoriesWithScores('', 'expense')
      expect(results).toEqual([])
    })

    it('should prioritize exact word matches', () => {
      const results = getSuggestedCategoriesWithScores('Uber', 'expense')
      expect(results[0].category).toBe('Transportation')
    })
  })
})
