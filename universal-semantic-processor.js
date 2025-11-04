// universal-semantic-processor.js
class UniversalSemanticProcessor {
    constructor() {
        this.semanticDB = null;
        this.searchHistory = [];
        this.userProfile = {};
        this.isInitialized = false;
        this.loadDatabase();
    }

    async loadDatabase() {
        try {
            console.log('🔄 Loading semantic database...');
            const response = await fetch('semantic-vector-db.json');
            if (!response.ok) throw new Error('Database file not found');
            
            const jsonData = await response.json();
            this.semanticDB = jsonData.gx_universal_semantic_database || jsonData;
            this.isInitialized = true;
            console.log('✅ Database loaded successfully!');
            console.log('📊 Terms:', Object.keys(this.semanticDB.universal_semantic_vectors).length);
            return true;
        } catch (error) {
            console.warn('❌ Loading external database failed:', error.message);
            this.semanticDB = this.createEnhancedFallbackDatabase();
            this.isInitialized = true;
            console.log('✅ Fallback database loaded');
            return false;
        }
    }

    createEnhancedFallbackDatabase() {
        return {
            universal_semantic_vectors: {
                // Keep your existing fallback terms
                "organic farming": {
                    domain: "AGRICULTURE",
                    vector: [0.88, 0.95, 0.74, 0.88, 0.85, 0.78, 0.82, 0.79],
                    questions: {
                        context: {
                            title: "🌱 What aspect of organic farming interests you?",
                            options: {
                                "home_garden": "🏠 Starting home garden",
                                "commercial": "🏢 Commercial farming", 
                                "health": "💚 Health benefits",
                                "environment": "🌍 Environmental impact",
                                "community": "👥 Community food security",
                                "education": "🎓 Learning & teaching"
                            }
                        },
                        approach: {
                            title: "🛠️ How do you want to get involved?",
                            options: {
                                "learn": "📚 Learn the basics",
                                "practice": "🌿 Start practicing", 
                                "community": "🤝 Join community garden",
                                "business": "💼 Start small business",
                                "advocate": "📢 Promote organic farming",
                                "research": "🔬 Study advanced techniques"
                            }
                        },
                        outcome: {
                            title: "🎯 What are you hoping to achieve?",
                            options: {
                                "healthy_food": "🍎 Grow healthy food",
                                "save_money": "💰 Save money on groceries",
                                "environment": "🌱 Help environment",
                                "community": "🏘️ Build community", 
                                "skills": "🛠️ Learn valuable skills",
                                "income": "💵 Generate additional income"
                            }
                        }
                    },
                    actions: {
                        immediate: ["Start small container garden", "Research local growing seasons", "Test soil pH basic kit"],
                        short_term: ["Learn composting basics", "Join community garden tour", "Plant beginner-friendly herbs"],
                        medium_term: ["Setup rainwater collection", "Create crop rotation plan", "Attend organic farming workshop"],
                        long_term: ["Certify organic practices", "Start farmers market stall", "Teach organic gardening classes"]
                    },
                    modifiers: {
                        "home_garden": "home gardening beginners containers small space urban",
                        "commercial": "commercial scale business plan market farming profit",
                        "health": "health benefits nutrition organic chemical-free wellness",
                        "environment": "environmental impact sustainability biodiversity conservation",
                        "community": "community shared agriculture cooperative local collective",
                        "education": "educational resources training courses certification skills"
                    }
                },
                "learn programming": {
                    domain: "TECHNOLOGY",
                    vector: [0.92, 0.85, 0.78, 0.88, 0.82, 0.79, 0.85, 0.81],
                    questions: {
                        // ... your existing questions
                    },
                    actions: {
                        immediate: ["Choose first programming language", "Setup development environment", "Complete 'Hello World' tutorial"],
                        short_term: ["Build simple calculator app", "Learn version control with Git", "Join programming community"],
                        medium_term: ["Contribute to open source", "Build portfolio website", "Complete full-stack project"],
                        long_term: ["Master advanced concepts", "Get first developer job", "Build complex applications"]
                    },
                    modifiers: {
                        "web_dev": "web development frontend backend fullstack javascript",
                        "mobile": "mobile apps iOS Android react native flutter",
                        "data_science": "data science python machine learning AI",
                        "games": "game development unity unreal engine graphics",
                        "automation": "automation scripts python bash tools",
                        "career": "career change jobs professional developer"
                    }
                },
                "mental wellness": {
                    domain: "WELLNESS",
                    vector: [0.65, 0.58, 0.92, 0.71, 0.82, 0.68, 0.75, 0.79],
                    questions: {
                        // ... your existing questions
                    },
                    actions: {
                        immediate: ["Practice 5-minute breathing", "Take nature break", "Write gratitude list"],
                        short_term: ["Establish sleep routine", "Digital detox hours", "Join support community"],
                        medium_term: ["Regular exercise routine", "Therapy sessions", "Mindfulness practice"],
                        long_term: ["Lifestyle transformation", "Deep healing work", "Become wellness advocate"]
                    },
                    modifiers: {
                        "stress": "stress relief management techniques coping",
                        "anxiety": "anxiety reduction coping strategies calm", 
                        "depression": "depression recovery support healing",
                        "mindfulness": "mindfulness practice meditation awareness",
                        "relationships": "healthy communication boundaries connection",
                        "purpose": "meaning purpose life direction fulfillment"
                    }
                }
            },
            metadata: {
                version: "4.0",
                total_terms: 3,
                description: "Enhanced fallback semantic database"
            }
        };
    }

    isReady() {
        return this.isInitialized;
    }

    processUserSearch(keyword, userContext = {}) {
        if (!this.isReady()) {
            throw new Error('Semantic processor not ready yet');
        }

        console.log('🔍 Processing search:', keyword);
        
        const analysis = this.analyzeKeyword(keyword);
        const match = this.findSemanticMatch(keyword, analysis);
        const questions = this.generateQuestions(match);
        const enhancedQuery = this.buildEnhancedQuery(keyword, match, userContext);
        const actions = this.generatePersonalizedActions(match, userContext);

        // Store in history
        this.searchHistory.push({
            keyword,
            match,
            timestamp: new Date().toISOString()
        });

        return {
            originalQuery: keyword,
            semanticMatch: match,
            confidenceScore: match.score || 0.8,
            enhancedQuery: enhancedQuery,
            contextualQuestions: questions,
            recommendedActions: actions,
            processingTime: 50,
            analysis: analysis
        };
    }

    analyzeKeyword(keyword) {
        return {
            tokens: keyword.toLowerCase().split(' '),
            intent: this.determineIntent(keyword),
            complexity: 'medium'
        };
    }

    determineIntent(keyword) {
        const lower = keyword.toLowerCase();
        if (lower.includes('learn') || lower.includes('study') || lower.includes('course')) return 'learning';
        if (lower.includes('mental') || lower.includes('health') || lower.includes('wellness')) return 'wellness';
        if (lower.includes('organic') || lower.includes('farm') || lower.includes('garden')) return 'ecological';
        if (lower.includes('finance') || lower.includes('money') || lower.includes('invest')) return 'finance';
        if (lower.includes('climate') || lower.includes('environment') || lower.includes('sustain')) return 'ecology';
        return 'general';
    }

    findSemanticMatch(keyword, analysis) {
        let bestMatch = null;
        let highestScore = 0;

        for (const [term, data] of Object.entries(this.semanticDB.universal_semantic_vectors)) {
            const score = this.calculateMatchScore(keyword, term, data, analysis);
            if (score > highestScore) {
                highestScore = score;
                bestMatch = { 
                    keyword: term, 
                    data: data, 
                    score: score,
                    matchType: score > 0.3 ? 'semantic' : 'intent-based'
                };
            }
        }

        // If no good match, create dynamic match based on intent
        if (!bestMatch || highestScore < 0.2) {
            const fallbackTerm = this.getFallbackForIntent(analysis.intent);
            bestMatch = {
                keyword: keyword,
                data: fallbackTerm,
                score: 0.2,
                matchType: 'intent-fallback'
            };
        }

        console.log('🎯 Best match:', bestMatch.keyword, 'Score:', bestMatch.score, 'Type:', bestMatch.matchType);
        return bestMatch;
    }

    getFallbackForIntent(intent) {
        const fallbacks = {
            'ecological': this.semanticDB.universal_semantic_vectors["organic farming"],
            'learning': this.semanticDB.universal_semantic_vectors["learn programming"],
            'wellness': this.semanticDB.universal_semantic_vectors["mental wellness"],
            'finance': this.semanticDB.universal_semantic_vectors["mental wellness"], // Use wellness as base
            'ecology': this.semanticDB.universal_semantic_vectors["organic farming"]
        };
        return fallbacks[intent] || this.semanticDB.universal_semantic_vectors["organic farming"];
    }

    calculateMatchScore(query, term, termData, analysis) {
        let score = 0;
        const queryWords = query.toLowerCase().split(' ');
        const termWords = term.toLowerCase().split(' ');

        // Exact word matches
        queryWords.forEach(qWord => {
            termWords.forEach(tWord => {
                if (qWord === tWord) score += 0.5;
                else if (tWord.includes(qWord) || qWord.includes(tWord)) score += 0.3;
            });
        });

        // Domain matching
        if (termData.domain && analysis.intent) {
            const domainMapping = {
                'AGRICULTURE': 'ecological',
                'ECOLOGY': 'ecology',
                'WELLNESS': 'wellness',
                'TECHNOLOGY': 'learning',
                'FINANCE': 'finance'
            };
            if (domainMapping[termData.domain] === analysis.intent) {
                score += 0.4;
            }
        }

        // Subdomain matching
        if (termData.subdomain && analysis.intent) {
            const subDomainMapping = {
                'SUSTAINABLE_FOOD': 'ecological',
                'MENTAL_HEALTH': 'wellness',
                'SOFTWARE_DEVELOPMENT': 'learning',
                'CLIMATE_CHANGE': 'ecology'
            };
            if (subDomainMapping[termData.subdomain] === analysis.intent) {
                score += 0.3;
            }
        }

        return Math.min(score, 1.0);
    }

    generateQuestions(match) {
        return match.data.questions || this.getFallbackQuestions();
    }

    getFallbackQuestions() {
        return {
            context: {
                title: "🌍 What area are you exploring?",
                options: {
                    "environment": "Environmental solutions",
                    "health": "Health & wellness", 
                    "learning": "Learning & skills",
                    "community": "Community development"
                }
            },
            approach: {
                title: "🔄 How do you want to proceed?",
                options: {
                    "learn": "Learn & understand",
                    "action": "Take practical action", 
                    "community": "Join community efforts",
                    "research": "Study & research"
                }
            },
            outcome: {
                title: "💫 What outcome matters most?",
                options: {
                    "personal": "Personal improvement", 
                    "community": "Community benefit",
                    "environment": "Environmental impact",
                    "knowledge": "Knowledge & understanding"
                }
            }
        };
    }

    buildEnhancedQuery(original, match, userContext) {
        let query = original;
        
        // Add modifiers based on user answers
        if (userContext.answers && userContext.answers.context && match.data.modifiers) {
            const context = userContext.answers.context;
            if (match.data.modifiers[context]) {
                query += ' ' + match.data.modifiers[context];
            }
        }

        // Domain-specific enhancements
        if (match.data.domain === 'AGRICULTURE' || match.data.domain === 'ECOLOGY') {
            query += ' sustainable ecological organic natural';
        } else if (match.data.domain === 'WELLNESS') {
            query += ' practical guide beginner friendly';
        } else if (match.data.domain === 'TECHNOLOGY') {
            query += ' tutorial step by step';
        } else {
            query += ' practical solutions guide';
        }
        
        return query;
    }

    generatePersonalizedActions(match, userContext) {
        let actions = [];
        const answers = userContext.answers || {};
        
        // Get actions based on user's approach
        if (answers.approach && match.data.actions) {
            if (answers.approach === 'learn') {
                actions = [...(match.data.actions.immediate || []), ...(match.data.actions.short_term || [])];
            } else if (answers.approach === 'practice' || answers.approach === 'action') {
                actions = [...(match.data.actions.immediate || []), ...(match.data.actions.short_term || [])];
            } else if (answers.approach === 'community') {
                actions = ['Join local community group', 'Attend related meetup', 'Volunteer for cause'];
            } else if (answers.approach === 'business') {
                actions = [...(match.data.actions.short_term || []), ...(match.data.actions.medium_term || [])];
            } else {
                // Default to immediate + short term
                actions = [...(match.data.actions.immediate || []), ...(match.data.actions.short_term || [])];
            }
        } else if (match.data.actions) {
            // Default to immediate actions
            actions = match.data.actions.immediate || Object.values(match.data.actions).flat();
        } else {
            // Ultimate fallback
            actions = ['Research options', 'Join relevant community', 'Start with small steps'];
        }

        // Personalize based on outcome
        if (answers.outcome) {
            const outcomeModifiers = {
                'environment': 'sustainable eco-friendly green',
                'community': 'collaborative shared local',
                'personal': 'personalized tailored individual',
                'health': 'healthy wellness-focused nutritious'
            };
            if (outcomeModifiers[answers.outcome]) {
                actions = actions.map(action => `${outcomeModifiers[answers.outcome]} ${action}`);
            }
        }

        // Ensure we have at least 3 actions
        if (actions.length < 3) {
            actions = [...actions, 'Explore related resources', 'Connect with experts'];
        }

        return actions.slice(0, 5); // Return max 5 actions
    }
}

// Create global instance
const semanticProcessor = new UniversalSemanticProcessor();
