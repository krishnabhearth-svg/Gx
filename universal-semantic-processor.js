// 🌍 GLOBAL SEMANTIC DATABASE (Combined from both JSON files)
const GX_SEMANTIC_DB = {
  // ... [INSERT YOUR ENTIRE COMBINED JSON CONTENT HERE]
  // This should include all semantic_vectors from both files
};

// 🧠 ENHANCED SEMANTIC PROCESSOR CLASS
class EnhancedSemanticProcessor {
  constructor(semanticDB) {
    this.db = semanticDB;
    this.searchHistory = [];
    this.userProfile = this.initializeUserProfile();
  }

  initializeUserProfile() {
    return {
      preferences: {
        learning_style: null, // visual, auditory, reading, kinesthetic
        experience_level: 'beginner', // beginner, intermediate, advanced
        time_availability: 'moderate', // limited, moderate, extensive
        ecological_focus: 'balanced' // minimal, balanced, intensive
      },
      search_patterns: {},
      successful_matches: []
    };
  }

  // 🎯 MAIN SEARCH PROCESSING FUNCTION
  processUserSearch(keyword, userContext = {}) {
    const startTime = performance.now();
    
    // Tokenize and analyze input
    const analysis = this.analyzeInput(keyword, userContext);
    
    // Find best semantic match
    const semanticMatch = this.findBestSemanticMatch(keyword, analysis);
    
    // Generate intelligent questions
    const questions = this.generateContextualQuestions(semanticMatch, analysis);
    
    // Build enhanced query
    const enhancedQuery = this.buildEnhancedQuery(keyword, semanticMatch, analysis);
    
    // Generate recommended actions
    const actions = this.generatePersonalizedActions(semanticMatch, analysis);
    
    // Calculate match confidence
    const confidenceScore = this.calculateConfidence(semanticMatch, analysis);
    
    const processingTime = performance.now() - startTime;
    
    // Store in search history
    this.updateSearchHistory({
      keyword,
      semanticMatch,
      confidenceScore,
      processingTime,
      timestamp: new Date().toISOString()
    });

    return {
      originalQuery: keyword,
      semanticMatch: semanticMatch,
      confidenceScore: confidenceScore,
      enhancedQuery: enhancedQuery,
      contextualQuestions: questions,
      recommendedActions: actions,
      processingTime: processingTime,
      analysis: analysis,
      resources: this.getRelevantResources(semanticMatch, analysis)
    };
  }

  // 🔍 ADVANCED INPUT ANALYSIS
  analyzeInput(input, userContext) {
    const tokens = this.tokenizeInput(input);
    const wordAnalysis = this.analyzeWords(tokens);
    
    return {
      tokens: tokens,
      wordAnalysis: wordAnalysis,
      intent: this.determineSearchIntent(input, wordAnalysis),
      complexity: this.assessQueryComplexity(input),
      domainHints: this.extractDomainHints(input),
      userContext: userContext,
      emotionalTone: this.detectEmotionalTone(input),
      urgencyLevel: this.detectUrgency(input)
    };
  }

  tokenizeInput(input) {
    return input.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2)
      .map(word => this.normalizeWord(word))
      .map(word => ({
        word: word,
        stem: this.stemWord(word),
        type: this.classifyWordType(word),
        weight: this.calculateWordWeight(word)
      }));
  }

  normalizeWord(word) {
    const normalizations = {
      'learning': 'learn', 'studying': 'study', 'gardening': 'garden',
      'farming': 'farm', 'meditating': 'meditate', 'practicing': 'practice',
      'building': 'build', 'creating': 'create', 'developing': 'develop'
    };
    return normalizations[word] || word;
  }

  stemWord(word) {
    const stems = {
      'learning': 'learn', 'studying': 'study', 'gardening': 'garden',
      'farming': 'farm', 'running': 'run', 'swimming': 'swim',
      'eating': 'eat', 'sleeping': 'sleep', 'working': 'work'
    };
    return stems[word] || word.replace(/ing$|ed$|s$/, '');
  }

  classifyWordType(word) {
    const wordTypes = {
      verbs: ['learn', 'study', 'build', 'create', 'make', 'do', 'find', 'get', 'use', 'work', 'help'],
      emotional: ['mad', 'angry', 'sad', 'happy', 'bored', 'tired', 'stressed', 'anxious'],
      ecological: ['sustainable', 'eco', 'green', 'organic', 'natural', 'renewable'],
      objects: ['car', 'vehicle', 'phone', 'house', 'home', 'garden', 'food'],
      activities: ['shopping', 'dating', 'traveling', 'working', 'cooking']
    };

    for (const [type, words] of Object.entries(wordTypes)) {
      if (words.includes(word)) return type;
    }
    return 'other';
  }

  calculateWordWeight(word) {
    const weightMap = {
      'learn': 0.9, 'study': 0.8, 'build': 0.7, 'create': 0.7,
      'sustainable': 0.95, 'eco': 0.9, 'organic': 0.85,
      'mental': 0.8, 'health': 0.8, 'wellness': 0.8
    };
    return weightMap[word] || 0.5;
  }

  determineSearchIntent(input, wordAnalysis) {
    const intentPatterns = {
      learning: ['learn', 'study', 'tutorial', 'course', 'how to'],
      research: ['research', 'study', 'paper', 'academic', 'scholar'],
      action: ['build', 'create', 'make', 'do', 'implement'],
      wellness: ['mental', 'health', 'wellness', 'therapy', 'meditation'],
      ecological: ['sustainable', 'eco', 'green', 'organic', 'natural']
    };

    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      if (patterns.some(pattern => input.includes(pattern))) {
        return intent;
      }
    }

    // Fallback intent detection
    if (wordAnalysis.tokens.some(t => t.type === 'emotional')) return 'wellness';
    if (wordAnalysis.tokens.some(t => t.type === 'ecological')) return 'ecological_action';
    if (wordAnalysis.tokens.some(t => t.type === 'verbs')) return 'action';

    return 'general_inquiry';
  }

  assessQueryComplexity(input) {
    const wordCount = input.split(/\s+/).length;
    const hasComplexTerms = /(methodology|analysis|research|development)/i.test(input);
    
    if (wordCount > 4 && hasComplexTerms) return 'high';
    if (wordCount > 2) return 'medium';
    return 'low';
  }

  extractDomainHints(input) {
    const domainKeywords = {
      AGRICULTURE: ['farm', 'garden', 'crop', 'soil', 'organic', 'permaculture'],
      LEARNING: ['learn', 'study', 'course', 'tutorial', 'education'],
      WELLNESS: ['mental', 'health', 'therapy', 'meditation', 'wellness'],
      TECHNOLOGY: ['code', 'program', 'software', 'app', 'website'],
      ECOLOGY: ['sustainable', 'eco', 'green', 'environment', 'conservation']
    };

    const hints = [];
    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      if (keywords.some(keyword => input.includes(keyword))) {
        hints.push(domain);
      }
    }
    return hints;
  }

  detectEmotionalTone(input) {
    const positiveWords = ['happy', 'excited', 'great', 'wonderful', 'amazing'];
    const negativeWords = ['sad', 'angry', 'frustrated', 'stressed', 'anxious'];
    
    const positiveCount = positiveWords.filter(word => input.includes(word)).length;
    const negativeCount = negativeWords.filter(word => input.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  detectUrgency(input) {
    const urgentIndicators = ['now', 'immediately', 'urgent', 'asap', 'emergency'];
    return urgentIndicators.some(indicator => input.includes(indicator)) ? 'high' : 'low';
  }

  // 🎯 ENHANCED SEMANTIC MATCHING
  findBestSemanticMatch(keyword, analysis) {
    let bestMatch = null;
    let highestScore = 0;

    // Search through all semantic vectors
    for (const [term, data] of Object.entries(this.db.semantic_vectors)) {
      const score = this.calculateMatchScore(keyword, term, data, analysis);
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = {
          keyword: term,
          data: data,
          score: score,
          matchType: this.determineMatchType(keyword, term)
        };
      }
    }

    // Fallback to domain-based matching if no good match found
    if (!bestMatch || highestScore < 0.3) {
      bestMatch = this.fallbackDomainMatch(keyword, analysis);
    }

    return bestMatch;
  }

  calculateMatchScore(query, term, termData, analysis) {
    let score = 0;

    // 1. Direct keyword matching
    const queryWords = query.toLowerCase().split(' ');
    const termWords = term.toLowerCase().split(' ');
    
    const exactMatches = queryWords.filter(qw => 
      termWords.some(tw => qw === tw)
    );
    score += exactMatches.length * 0.3;

    // 2. Partial word matching
    const partialMatches = queryWords.filter(qw =>
      termWords.some(tw => qw.includes(tw) || tw.includes(qw))
    );
    score += partialMatches.length * 0.2;

    // 3. Intent matching
    if (termData.domain && analysis.intent) {
      const domainIntentMap = {
        'LEARNING': 'learning',
        'SCHOLAR': 'research', 
        'WELLNESS': 'wellness',
        'AGRICULTURE': 'ecological_action',
        'TRANSPORT_ECOLOGY': 'ecological_action'
      };
      
      if (domainIntentMap[termData.domain] === analysis.intent) {
        score += 0.25;
      }
    }

    // 4. Domain hint matching
    if (analysis.domainHints.includes(termData.domain)) {
      score += 0.15;
    }

    // 5. Vector similarity (if vectors exist)
    if (termData.vector && analysis.wordAnalysis.tokens.length > 0) {
      const queryVector = this.createQueryVector(analysis);
      const similarity = this.calculateCosineSimilarity(queryVector, termData.vector);
      score += similarity * 0.1;
    }

    return Math.min(score, 1.0);
  }

  createQueryVector(analysis) {
    // Simplified vector creation based on word analysis
    const vector = [0, 0, 0, 0];
    
    analysis.wordAnalysis.tokens.forEach(token => {
      vector[0] += token.weight * (token.type === 'verbs' ? 1 : 0);
      vector[1] += token.weight * (token.type === 'ecological' ? 1 : 0);
      vector[2] += token.weight * (token.type === 'emotional' ? 1 : 0);
      vector[3] += token.weight * (token.type === 'objects' ? 1 : 0);
    });
    
    // Normalize vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map(val => val / magnitude) : vector;
  }

  calculateCosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    
    return mag1 > 0 && mag2 > 0 ? dotProduct / (mag1 * mag2) : 0;
  }

  determineMatchType(query, term) {
    if (query === term) return 'exact';
    if (query.includes(term) || term.includes(query)) return 'partial';
    return 'semantic';
  }

  fallbackDomainMatch(keyword, analysis) {
    // Find best matching domain based on analysis
    const domainScores = {};
    
    analysis.domainHints.forEach(domain => {
      domainScores[domain] = (domainScores[domain] || 0) + 0.3;
    });

    // Add scores based on intent
    const intentDomainMap = {
      'learning': 'LEARNING',
      'research': 'SCHOLAR', 
      'wellness': 'WELLNESS',
      'ecological_action': 'AGRICULTURE'
    };
    
    if (intentDomainMap[analysis.intent]) {
      domainScores[intentDomainMap[analysis.intent]] = 0.5;
    }

    // Find domain with highest score
    const bestDomain = Object.keys(domainScores).reduce((a, b) => 
      domainScores[a] > domainScores[b] ? a : b, 'LEARNING'
    );

    // Return a generic match for the domain
    return {
      keyword: keyword,
      data: this.getDomainTemplate(bestDomain),
      score: 0.2,
      matchType: 'domain_fallback'
    };
  }

  getDomainTemplate(domain) {
    const templates = {
      'LEARNING': {
        domain: 'LEARNING',
        questions: this.db.fallback_templates.unknown_keyword.questions,
        actions: ['Research learning resources', 'Find online courses', 'Join learning community'],
        modifiers: { general: 'learning education knowledge' }
      },
      'WELLNESS': {
        domain: 'WELLNESS', 
        questions: this.db.fallback_templates.unknown_keyword.questions,
        actions: ['Explore wellness practices', 'Find support resources', 'Learn self-care techniques'],
        modifiers: { general: 'wellness health self-care' }
      }
      // Add more domain templates as needed
    };
    
    return templates[domain] || templates['LEARNING'];
  }

  // ❓ INTELLIGENT QUESTION GENERATION
  generateContextualQuestions(semanticMatch, analysis) {
    const questions = {};
    
    // Use domain-specific question templates if available
    if (semanticMatch.data.questions) {
      Object.keys(semanticMatch.data.questions).forEach(step => {
        questions[step] = {
          title: semanticMatch.data.questions[step].title,
          options: this.adaptQuestionOptions(
            semanticMatch.data.questions[step].options, 
            analysis
          )
        };
      });
    } else {
      // Use fallback questions
      questions.context = this.db.fallback_templates.unknown_keyword.questions.context;
      questions.approach = this.db.fallback_templates.unknown_keyword.questions.approach;
      questions.outcome = this.db.fallback_templates.unknown_keyword.questions.outcome;
    }

    return questions;
  }

  adaptQuestionOptions(options, analysis) {
    // Personalize options based on user context and analysis
    const adaptedOptions = { ...options };
    
    // Example adaptation based on urgency
    if (analysis.urgencyLevel === 'high') {
      // Prioritize immediate action options
      const immediateOptions = {};
      Object.entries(options).forEach(([key, value]) => {
        if (value.toLowerCase().includes('immediate') || value.toLowerCase().includes('quick')) {
          immediateOptions[key] = value;
        }
      });
      if (Object.keys(immediateOptions).length > 0) {
        return { ...immediateOptions, ...options };
      }
    }

    return adaptedOptions;
  }

  // 🔍 ENHANCED QUERY BUILDING
  buildEnhancedQuery(originalQuery, semanticMatch, analysis) {
    let enhancedQuery = originalQuery;

    // Add domain-specific context
    if (semanticMatch.data.domain) {
      enhancedQuery += this.getDomainContext(semanticMatch.data.domain);
    }

    // Add intent-based modifiers
    enhancedQuery += this.getIntentModifiers(analysis.intent);

    // Add ecological context if missing
    if (!analysis.wordAnalysis.tokens.some(t => t.type === 'ecological')) {
      enhancedQuery += ' sustainable ecological';
    }

    // Add complexity adjustment
    if (analysis.complexity === 'low') {
      enhancedQuery += ' basics fundamentals';
    } else if (analysis.complexity === 'high') {
      enhancedQuery += ' advanced expert';
    }

    // Add emotional context if detected
    if (analysis.emotionalTone === 'negative') {
      enhancedQuery += ' support help solutions';
    }

    return enhancedQuery.trim();
  }

  getDomainContext(domain) {
    const domainContexts = {
      'LEARNING': ' learning education knowledge',
      'WELLNESS': ' health wellbeing self-care', 
      'AGRICULTURE': ' farming gardening sustainable',
      'TECHNOLOGY': ' tech digital programming',
      'ECOLOGY': ' environmental conservation sustainable'
    };
    return domainContexts[domain] || '';
  }

  getIntentModifiers(intent) {
    const intentModifiers = {
      'learning': ' tutorial guide how-to',
      'research': ' study paper academic',
      'action': ' DIY practical implementation',
      'wellness': ' practice techniques methods'
    };
    return intentModifiers[intent] || '';
  }

  // 🎯 PERSONALIZED ACTION GENERATION
  generatePersonalizedActions(semanticMatch, analysis) {
    let actions = [];

    // Start with base actions from semantic match
    if (semanticMatch.data.actions) {
      actions.push(...semanticMatch.data.actions);
    }

    // Add intent-specific actions
    actions.push(...this.getIntentActions(analysis.intent));

    // Add complexity-appropriate actions
    actions.push(...this.getComplexityActions(analysis.complexity));

    // Add urgency-appropriate actions
    if (analysis.urgencyLevel === 'high') {
      actions = actions.filter(action => 
        !action.toLowerCase().includes('long-term') && 
        !action.toLowerCase().includes('comprehensive')
      );
    }

    return actions.slice(0, 5); // Return top 5 actions
  }

  getIntentActions(intent) {
    const intentActions = {
      'learning': ['Research learning resources', 'Find educational materials'],
      'research': ['Review academic papers', 'Check scholarly databases'],
      'action': ['Start with small steps', 'Gather necessary materials'],
      'wellness': ['Practice self-care', 'Seek support if needed']
    };
    return intentActions[intent] || [];
  }

  getComplexityActions(complexity) {
    const complexityActions = {
      'low': ['Start with basics', 'Learn fundamental concepts'],
      'medium': ['Explore intermediate topics', 'Practice applied skills'],
      'high': ['Study advanced concepts', 'Engage with expert communities']
    };
    return complexityActions[complexity] || [];
  }

  // 📊 CONFIDENCE CALCULATION
  calculateConfidence(semanticMatch, analysis) {
    let confidence = semanticMatch.score;

    // Boost confidence for exact matches
    if (semanticMatch.matchType === 'exact') {
      confidence += 0.2;
    }

    // Adjust based on query complexity
    if (analysis.complexity === 'high' && semanticMatch.score > 0.6) {
      confidence += 0.1;
    }

    // Reduce confidence for fallback matches
    if (semanticMatch.matchType === 'domain_fallback') {
      confidence *= 0.8;
    }

    return Math.min(confidence, 1.0);
  }

  // 📚 RESOURCE RECOMMENDATION
  getRelevantResources(semanticMatch, analysis) {
    const resources = {
      immediate: [],
      learning: [],
      community: [],
      tools: []
    };

    // Add domain-specific resources if available
    if (semanticMatch.data.resources) {
      Object.assign(resources, semanticMatch.data.resources);
    }

    // Add intent-based resources
    resources.learning.push(...this.getIntentResources(analysis.intent));

    return resources;
  }

  getIntentResources(intent) {
    const intentResources = {
      'learning': ['Online courses', 'Tutorial websites', 'Educational videos'],
      'research': ['Academic databases', 'Research papers', 'Scholarly articles'],
      'wellness': ['Wellness apps', 'Support groups', 'Therapy resources']
    };
    return intentResources[intent] || ['General information resources'];
  }

  // 📈 SEARCH HISTORY MANAGEMENT
  updateSearchHistory(searchData) {
    this.searchHistory.unshift(searchData);
    
    // Keep only last 50 searches
    if (this.searchHistory.length > 50) {
      this.searchHistory.pop();
    }

    // Update user profile based on successful matches
    if (searchData.confidenceScore > 0.7) {
      this.userProfile.successful_matches.push({
        keyword: searchData.keyword,
        domain: searchData.semanticMatch.data.domain,
        timestamp: searchData.timestamp
      });
    }
  }

  getUserSearchPatterns() {
    const domainCounts = {};
    this.userProfile.successful_matches.forEach(match => {
      domainCounts[match.domain] = (domainCounts[match.domain] || 0) + 1;
    });

    return {
      preferredDomains: Object.keys(domainCounts)
        .sort((a, b) => domainCounts[b] - domainCounts[a])
        .slice(0, 3),
      totalSearches: this.searchHistory.length,
      averageConfidence: this.searchHistory.reduce((sum, search) => 
        sum + search.confidenceScore, 0) / this.searchHistory.length
    };
  }
}

// 🚀 INITIALIZE AND EXPORT SEMANTIC PROCESSOR
const semanticProcessor = new EnhancedSemanticProcessor(GX_SEMANTIC_DB);

// 💡 USAGE EXAMPLE:
/*
const searchResult = semanticProcessor.processUserSearch("learn organic gardening", {
  experience_level: "beginner",
  time_availability: "moderate"
});

console.log("Enhanced Query:", searchResult.enhancedQuery);
console.log("Confidence Score:", searchResult.confidenceScore);
console.log("Recommended Actions:", searchResult.recommendedActions);
console.log("Contextual Questions:", searchResult.contextualQuestions);
*/


