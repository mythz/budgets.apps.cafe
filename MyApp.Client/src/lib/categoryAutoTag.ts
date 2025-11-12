import type { TransactionType } from '../types/budget'

/**
 * Keyword mappings for auto-tagging categories based on transaction descriptions
 */
interface CategoryKeywords {
  category: string
  keywords: string[]
}

const EXPENSE_KEYWORDS: CategoryKeywords[] = [
  {
    category: 'Food',
    keywords: [
      'starbucks', 'coffee', 'cafe', 'restaurant', 'food', 'lunch', 'dinner',
      'breakfast', 'pizza', 'burger', 'sushi', 'mcdonald', 'kfc', 'subway',
      'doordash', 'ubereats', 'grubhub', 'grocery', 'supermarket', 'whole foods',
      'trader joe', 'safeway', 'kroger', 'walmart', 'target', 'latte', 'drink',
      'meal', 'snack', 'bakery', 'deli', 'bar', 'pub'
    ]
  },
  {
    category: 'Transportation',
    keywords: [
      'uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking', 'metro', 'bus',
      'train', 'subway', 'transit', 'car', 'vehicle', 'auto', 'mechanic',
      'repair', 'oil change', 'tire', 'registration', 'insurance', 'toll',
      'flight', 'airline', 'bike', 'scooter', 'rideshare'
    ]
  },
  {
    category: 'Housing',
    keywords: [
      'rent', 'mortgage', 'landlord', 'apartment', 'house', 'home',
      'property', 'hoa', 'maintenance', 'repair', 'furniture', 'ikea',
      'home depot', 'lowes', 'decor', 'renovation', 'lease', 'property tax'
    ]
  },
  {
    category: 'Utilities',
    keywords: [
      'electric', 'electricity', 'gas', 'water', 'internet', 'wifi',
      'phone', 'mobile', 'cable', 'streaming', 'netflix', 'spotify',
      'hulu', 'disney', 'amazon prime', 'utility', 'bill', 'comcast',
      'verizon', 'at&t', 't-mobile', 'heating', 'cooling', 'trash',
      'sewage', 'youtube premium', 'apple music'
    ]
  },
  {
    category: 'Healthcare',
    keywords: [
      'doctor', 'hospital', 'pharmacy', 'medicine', 'prescription',
      'clinic', 'dentist', 'dental', 'vision', 'eye', 'health',
      'medical', 'insurance', 'copay', 'therapy', 'therapist',
      'cvs', 'walgreens', 'rite aid', 'urgent care', 'checkup'
    ]
  },
  {
    category: 'Entertainment',
    keywords: [
      'movie', 'cinema', 'theater', 'concert', 'show', 'event',
      'game', 'gaming', 'xbox', 'playstation', 'nintendo', 'steam',
      'museum', 'park', 'zoo', 'amusement', 'hobby',
      'sports', 'gym', 'fitness', 'magazine'
    ]
  },
  {
    category: 'Shopping',
    keywords: [
      'amazon', 'ebay', 'shop', 'store', 'mall', 'clothing', 'clothes',
      'fashion', 'shoes', 'accessories', 'jewelry', 'electronics',
      'best buy', 'apple store', 'nike', 'adidas', 'zara', 'h&m',
      'target', 'walmart', 'costco', 'online', 'purchase', 'buy',
      'macys', 'nordstrom', 'sephora', 'ulta'
    ]
  },
  {
    category: 'Education',
    keywords: [
      'school', 'tuition', 'college', 'university', 'course', 'class',
      'textbook', 'student', 'education', 'learning', 'udemy',
      'coursera', 'skillshare', 'training', 'workshop', 'seminar',
      'certification', 'degree', 'supplies', 'stationery'
    ]
  },
  {
    category: 'Travel',
    keywords: [
      'hotel', 'airbnb', 'flight', 'airline', 'vacation', 'trip',
      'travel', 'expedia', 'kayak', 'resort', 'cruise',
      'luggage', 'passport', 'visa', 'tour', 'tourist', 'sightseeing',
      'hostel', 'motel', 'accommodation', 'marriott', 'hilton', 'hyatt',
      'booking'
    ]
  }
]

const INCOME_KEYWORDS: CategoryKeywords[] = [
  {
    category: 'Investment',
    keywords: [
      'dividend', 'stock', 'investment', 'interest', 'capital gain',
      'profit', 'return', 'portfolio', 'trading', 'crypto', 'bitcoin',
      'ethereum', 'robinhood', 'etrade', 'schwab', 'fidelity', 'vanguard',
      'bond', 'mutual fund', 'etf', 'real estate', 'payout'
    ]
  },
  {
    category: 'Freelance',
    keywords: [
      'freelance', 'contract', 'consulting', 'gig', 'upwork', 'fiverr',
      'client', 'project', 'freelancer', 'independent', 'contractor',
      'commission', 'invoice'
    ]
  },
  {
    category: 'Salary',
    keywords: [
      'salary', 'paycheck', 'wage', 'payroll', 'direct deposit',
      'employer', 'company', 'job', 'work', 'income', 'payment',
      'compensation', 'pay', 'monthly pay', 'biweekly'
    ]
  },
  {
    category: 'Business',
    keywords: [
      'business', 'revenue', 'sales', 'customer', 'client payment',
      'stripe', 'paypal', 'square', 'shopify', 'store', 'shop',
      'ecommerce', 'merchant', 'transaction', 'order'
    ]
  },
  {
    category: 'Gift',
    keywords: [
      'gift', 'present', 'bonus', 'reward', 'prize', 'birthday',
      'holiday', 'christmas', 'wedding', 'graduation', 'cash gift',
      'money gift', 'donation received', 'rebate', 'refund'
    ]
  }
]

/**
 * Suggests a category based on the transaction description
 * @param description - The transaction description
 * @param type - The transaction type (income or expense)
 * @returns The suggested category or null if no match found
 */
export function suggestCategory(description: string, type: TransactionType): string | null {
  if (!description || description.trim().length === 0) {
    return null
  }

  const normalizedDescription = description.toLowerCase().trim()
  const keywordList = type === 'income' ? INCOME_KEYWORDS : EXPENSE_KEYWORDS

  // Find the first matching category
  for (const { category, keywords } of keywordList) {
    for (const keyword of keywords) {
      // Check if the description contains the keyword as a whole word or part of a word
      if (normalizedDescription.includes(keyword.toLowerCase())) {
        return category
      }
    }
  }

  return null
}

/**
 * Gets all suggested categories with confidence scores
 * Useful for showing multiple suggestions to the user
 */
export function getSuggestedCategoriesWithScores(
  description: string,
  type: TransactionType
): Array<{ category: string; score: number }> {
  if (!description || description.trim().length === 0) {
    return []
  }

  const normalizedDescription = description.toLowerCase().trim()
  const keywordList = type === 'income' ? INCOME_KEYWORDS : EXPENSE_KEYWORDS
  const categoryScores = new Map<string, number>()

  // Calculate scores based on keyword matches
  for (const { category, keywords } of keywordList) {
    let score = 0
    for (const keyword of keywords) {
      if (normalizedDescription.includes(keyword.toLowerCase())) {
        // Give higher score for exact word matches vs partial matches
        const isExactWord = new RegExp(`\\b${keyword}\\b`, 'i').test(description)
        score += isExactWord ? 2 : 1
      }
    }
    if (score > 0) {
      categoryScores.set(category, score)
    }
  }

  // Sort by score descending
  return Array.from(categoryScores.entries())
    .map(([category, score]) => ({ category, score }))
    .sort((a, b) => b.score - a.score)
}
