// universal-semantic-processor.js
class UniversalSemanticProcessor {
    constructor() {
        this.semanticDB = this.loadFallbackDatabase(); // Start with fallback
        this.searchHistory = [];
        this.userProfile = {};
        this.initializeDatabase(); // Try to load external DB
    }

    async initializeDatabase() {
        try {
            console.log('🔄 Loading semantic database...');
            const response = await fetch('semantic-vector-db.json');
            if (!response.ok) throw new Error('JSON file not found');
            
            const jsonData = await response.json();
            this.semanticDB = jsonData.gx_universal_semantic_database || jsonData;
            console.log('✅ Database loaded successfully!');
            console.log('📊 Terms:', Object.keys(this.semanticDB.universal_semantic_vectors).length);
            return true;
        } catch (error) {
            console.warn('❌ Using fallback database:', error.message);
            this.semanticDB = this.loadFallbackDatabase();
            return false;
        }
    }

    loadFallbackDatabase() {
        console.log('🔄 Loading fallback database...');
        return {
            universal_semantic_vectors: {
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
                    actions: ["Start small container garden", "Learn composting basics", "Test soil quality", "Join community garden", "Plant native species"],
                    modifiers: {
                        "home_garden": "home gardening beginners containers",
                        "commercial": "commercial scale business plan",
                        "health": "health benefits nutrition organic",
                        "environment": "environmental impact sustainability"
                    }
                },
                "learn programming": {
                    domain: "TECHNOLOGY",
                    vector: [0.92, 0.85, 0.78, 0.88, 0.82, 0.79, 0.85, 0.81],
                    questions: {
                        context: {
                            title: "💻 What type of programming interests you?",
                            options: {
                                "web_dev": "🌐 Web Development",
                                "mobile": "📱 Mobile Apps",
                                "data_science": "📊 Data Science", 
                                "games": "🎮 Game Development",
                                "automation": "⚡ Automation",
                                "career": "💼 Career Change"
                            }
                        },
                        approach: {
                            title: "🎯 How do you want to learn programming?",
                            options: {
                                "self_study": "📚 Self-paced online",
                                "bootcamp": "⚡ Intensive bootcamp", 
                                "university": "🎓 University degree",
                                "project_based": "🛠️ Project-based learning",
                                "mentorship": "👥 Find mentor",
                                "community": "🤝 Join coding community"
                            }
                        },
                        outcome: {
                            title: "🚀 What's your programming goal?",
                            options: {
                                "job": "💼 Get a developer job",
                                "freelance": "👨‍💼 Freelance work",
                                "startup": "🚀 Build startup", 
                                "skills": "🛠️ Learn valuable skills",
                                "hobby": "🎨 Personal projects",
                                "automation": "⚡ Automate tasks"
                            }
                        }
                    },
                    actions: ["Choose programming language", "Setup development environment", "Build first project", "Join programming community"],
                    modifiers: {
                        "web_dev": "web development frontend backend",
                        "mobile": "mobile apps iOS Android",
                        "data_science": "data science python machine learning"
                    }
                },
                "mental health": {
                    domain: "WELLNESS",
                    vector: [0.65, 0.58, 0.92, 0.71, 0.82, 0.68, 0.75, 0.79],
                    questions: {
                        context: {
                            title: "😊 What aspect of mental health?",
                            options: {
                                "stress": "😫 Stress management",
                                "anxiety": "😰 Anxiety relief", 
                                "depression": "😔 Overcoming depression",
                                "mindfulness": "🧠 Mindfulness & peace",
                                "relationships": "💞 Healthy relationships",
                                "purpose": "🎯 Finding meaning & purpose"
                            }
                        },
                        approach: {
                            title: "🌿 How do you prefer to approach wellness?",
                            options: {
                                "self_care": "💆‍♀️ Self-care practices",
                                "professional": "👨‍⚕️ Professional help", 
                                "community": "👥 Community support",
                                "nature": "🌳 Nature-based healing",
                                "holistic": "🌈 Holistic approaches",
                                "spiritual": "🕊️ Spiritual practices"
                            }
                        },
                        outcome: {
                            title: "💫 What wellness outcome do you seek?",
                            options: {
                                "peace": "☮️ Inner peace & calm",
                                "energy": "⚡ More energy & motivation",
                                "clarity": "💡 Mental clarity & focus", 
                                "connections": "🤝 Better relationships",
                                "purpose": "🎯 Sense of purpose",
                                "resilience": "🛡️ Emotional resilience"
                            }
                        }
                    },
                    actions: ["Practice daily mindfulness", "Connect with nature", "Join support community", "Establish sleep routine"],
                    modifiers: {
                        "stress": "stress relief management techniques",
                        "anxiety": "anxiety reduction coping strategies", 
                        "depression": "depression recovery support"
                    }
                }
            },
            metadata: {
                version: "4.0",
                total_terms: 3,
                description: "Fallback semantic database"
            }
        };
    }

    processUserSearch(keyword, userContext = {}) {
        console.log('🔍 Processing search:', keyword);
        
        const analysis = this.analyzeKeyword(keyword);
        const match = this.findSemanticMatch(keyword, analysis);
        const questions = this.generateQuestions(match);
        const enhancedQuery = this.buildEnhancedQuery(keyword, match, userContext);
        const actions = this.generateActions(match);

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
            processingTime: 50, // mock
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
        if (keyword.includes('learn') || keyword.includes('study')) return 'learning';
        if (keyword.includes('mental') || keyword.includes('health')) return 'wellness';
        if (keyword.includes('organic') || keyword.includes('farm')) return 'ecological';
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
                    matchType: score > 0.5 ? 'semantic' : 'fallback'
                };
            }
        }

        // Fallback if no good match
        if (!bestMatch || highestScore < 0.3) {
            bestMatch = {
                keyword: keyword,
                data: this.semanticDB.universal_semantic_vectors["organic farming"], // default fallback
                score: 0.2,
                matchType: 'fallback'
            };
        }

        console.log('🎯 Best match:', bestMatch.keyword, 'Score:', bestMatch.score);
        return bestMatch;
    }

    calculateMatchScore(query, term, termData, analysis) {
        let score = 0;
        const queryWords = query.toLowerCase().split(' ');
        const termWords = term.toLowerCase().split(' ');

        // Exact matches
        queryWords.forEach(qWord => {
            termWords.forEach(tWord => {
                if (qWord === tWord) score += 0.4;
                else if (qWord.includes(tWord) || tWord.includes(qWord)) score += 0.2;
            });
        });

        // Domain matching
        if (termData.domain && analysis.intent) {
            if (termData.domain === 'AGRICULTURE' && analysis.intent === 'ecological') score += 0.3;
            if (termData.domain === 'WELLNESS' && analysis.intent === 'wellness') score += 0.3;
            if (termData.domain === 'TECHNOLOGY' && analysis.intent === 'learning') score += 0.3;
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
        
        // Add context from user answers if available
        if (userContext.answers && userContext.answers.context) {
            const context = userContext.answers.context;
            if (match.data.modifiers && match.data.modifiers[context]) {
                query += ' ' + match.data.modifiers[context];
            }
        }

        // Add ecological context
        if (match.data.domain === 'AGRICULTURE' || match.data.domain === 'ECOLOGY') {
            query += ' sustainable ecological solutions';
        } else {
            query += ' practical solutions guide';
        }
        
        return query;
    }

    generateActions(match) {
        return match.data.actions || ['Research options', 'Join relevant community', 'Start with small steps'];
    }
}

// Create global instance
console.log('🚀 Creating UniversalSemanticProcessor instance...');
const semanticProcessor = new UniversalSemanticProcessor();
