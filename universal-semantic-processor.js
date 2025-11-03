// universal-semantic-processor.js
class UniversalSemanticProcessor {
  constructor() {
    this.semanticDB = null;
    this.searchHistory = [];
    this.userProfile = {};
    this.initializeDatabase();
  }

  async initializeDatabase() {
    try {
      // Load the JSON database
      const response = await fetch('/semantic-vector-db.json');
      this.semanticDB = await response.json();
      console.log('✅ Database loaded:', Object.keys(this.semanticDB.universal_semantic_vectors).length + ' terms');
      return true;
    } catch (error) {
      console.error('❌ Database loading failed:', error);
      // Fallback to embedded minimal database
      this.loadFallbackDatabase();
      return false;
    }
  }

  loadFallbackDatabase() {
    this.semanticDB = {
      universal_semantic_vectors: {
        "organic farming": {
          domain: "AGRICULTURE",
          vector: [0.88, 0.95, 0.74, 0.88, 0.85, 0.78, 0.82, 0.79],
          questions: {
            context: {
              title: "🌱 What aspect interests you?",
              options: {
                "home_garden": "Starting home garden",
                "commercial": "Commercial farming"
              }
            },
            approach: {
              title: "🛠️ How to get involved?",
              options: {
                "learn": "Learn basics",
                "practice": "Start practicing"
              }
            },
            outcome: {
              title: "🎯 What's your goal?",
              options: {
                "healthy_food": "Grow healthy food",
                "save_money": "Save money"
              }
            }
          },
          actions: ["Start small garden", "Learn composting"],
          modifiers: {
            "home_garden": "home gardening beginners",
            "commercial": "commercial scale business"
          }
        }
        // ... more fallback terms
      }
    };
  }

  processUserSearch(keyword, userContext = {}) {
    if (!this.semanticDB) {
      console.warn('Database not loaded, using fallback');
      this.loadFallbackDatabase();
    }

    const analysis = this.analyzeKeyword(keyword);
    const match = this.findSemanticMatch(keyword, analysis);
    const questions = this.generateQuestions(match);
    const enhancedQuery = this.buildEnhancedQuery(keyword, match, analysis);
    const actions = this.generateActions(match, analysis);

    return {
      originalQuery: keyword,
      semanticMatch: match,
      enhancedQuery: enhancedQuery,
      contextualQuestions: questions,
      recommendedActions: actions,
      analysis: analysis
    };
  }

  analyzeKeyword(keyword) {
    return {
      tokens: keyword.toLowerCase().split(' '),
      intent: this.determineIntent(keyword),
      complexity: this.assessComplexity(keyword)
    };
  }

  findSemanticMatch(keyword, analysis) {
    let bestMatch = null;
    let highestScore = 0;

    for (const [term, data] of Object.entries(this.semanticDB.universal_semantic_vectors)) {
      const score = this.calculateMatchScore(keyword, term, data, analysis);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = { keyword: term, data: data, score: score };
      }
    }

    return bestMatch || this.getFallbackMatch(keyword, analysis);
  }

  calculateMatchScore(query, term, termData, analysis) {
    // Advanced matching logic here
    let score = 0;
    const queryWords = query.toLowerCase().split(' ');
    const termWords = term.toLowerCase().split(' ');

    // Exact word matches
    queryWords.forEach(qWord => {
      termWords.forEach(tWord => {
        if (qWord === tWord) score += 0.3;
        else if (qWord.includes(tWord) || tWord.includes(qWord)) score += 0.15;
      });
    });

    return Math.min(score, 1.0);
  }

  generateQuestions(match) {
    return match.data.questions || this.getFallbackQuestions();
  }

  buildEnhancedQuery(original, match, analysis) {
    let query = original;
    
    // Add context from user answers if available
    if (analysis.userAnswers) {
      const context = analysis.userAnswers.context;
      if (match.data.modifiers && match.data.modifiers[context]) {
        query += ' ' + match.data.modifiers[context];
      }
    }

    // Add ecological context
    query += ' sustainable ecological solutions';
    
    return query;
  }

  generateActions(match, analysis) {
    return match.data.actions || ['Research options', 'Join community', 'Start small'];
  }

  // ... rest of the advanced methods from previous JS engine
}

// Initialize global instance
const semanticProcessor = new UniversalSemanticProcessor();
