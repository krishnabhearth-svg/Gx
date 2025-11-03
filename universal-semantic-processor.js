// universal-semantic-processor.js
class SemanticProcessor {
    constructor(semanticDB) {
        this.db = semanticDB;
        this.wordTypes = this.initializeWordTypes();
    }

    // Initialize word classification patterns
    initializeWordTypes() {
        return {
            verbs: ['learn', 'study', 'build', 'create', 'make', 'do', 'find', 'get', 'use', 'work', 'help', 'need', 'want'],
            adverbs: ['quickly', 'easily', 'slowly', 'well', 'fast', 'now', 'today', 'soon'],
            adjectives: ['best', 'good', 'bad', 'easy', 'hard', 'simple', 'complex', 'free', 'paid', 'new', 'old'],
            nouns: ['course', 'tutorial', 'guide', 'book', 'video', 'tool', 'software', 'app', 'website', 'resource'],
            emotional: ['mad', 'angry', 'sad', 'happy', 'bored', 'tired', 'stressed', 'anxious', 'excited'],
            ecological: ['sustainable', 'eco', 'green', 'organic', 'natural', 'renewable', 'environment']
        };
    }

    // Main processing function
    processUserInput(userInput) {
        const words = this.tokenizeInput(userInput);
        const analysis = this.analyzeWords(words);
        const bestMatch = this.findSemanticMatch(analysis);
        const enhancedQuery = this.buildEnhancedQuery(userInput, bestMatch, analysis);
        
        return {
            original: userInput,
            analysis: analysis,
            bestMatch: bestMatch,
            enhancedQuery: enhancedQuery,
            actions: this.generateActions(bestMatch, analysis)
        };
    }

    // Step 1: Tokenize and classify words
    tokenizeInput(input) {
        return input.toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2) // Remove short words
            .map(word => this.classifyWord(word));
    }

    // Step 2: Classify each word
    classifyWord(word) {
        return {
            word: word,
            type: this.getWordType(word),
            stem: this.stemWord(word),
            vector: this.getWordVector(word)
        };
    }

    getWordType(word) {
        if (this.wordTypes.verbs.includes(word)) return 'verb';
        if (this.wordTypes.adverbs.includes(word)) return 'adverb';
        if (this.wordTypes.adjectives.includes(word)) return 'adjective';
        if (this.wordTypes.nouns.includes(word)) return 'noun';
        if (this.wordTypes.emotional.includes(word)) return 'emotional';
        if (this.wordTypes.ecological.includes(word)) return 'ecological';
        return 'unknown';
    }

    stemWord(word) {
        // Simple stemming - in production use a proper stemmer
        const stems = {
            'learning': 'learn', 'studying': 'study', 'building': 'build',
            'creating': 'create', 'making': 'make', 'doing': 'do',
            'finding': 'find', 'getting': 'get', 'using': 'use'
        };
        return stems[word] || word;
    }

    getWordVector(word) {
        // Get vector from your semantic database or calculate similarity
        for (const [keyword, data] of Object.entries(this.db.semantic_vectors)) {
            if (keyword.includes(word) || word.includes(keyword)) {
                return data.vector;
            }
        }
        return [0.5, 0.5, 0.5, 0.5]; // Default vector
    }

    // Step 3: Analyze word patterns
    analyzeWords(words) {
        const analysis = {
            primaryVerb: words.find(w => w.type === 'verb'),
            primaryNoun: words.find(w => w.type === 'noun'),
            adjectives: words.filter(w => w.type === 'adjective'),
            hasEmotional: words.some(w => w.type === 'emotional'),
            hasEcological: words.some(w => w.type === 'ecological'),
            wordCount: words.length,
            intent: this.determineIntent(words)
        };

        return analysis;
    }

    determineIntent(words) {
        const verb = words.find(w => w.type === 'verb');
        const noun = words.find(w => w.type === 'noun');

        if (verb && noun) {
            if (['learn', 'study', 'understand'].includes(verb.stem)) 
                return 'learning';
            if (['build', 'create', 'make'].includes(verb.stem))
                return 'building';
            if (['find', 'get'].includes(verb.stem))
                return 'discovery';
        }

        if (words.some(w => w.type === 'emotional'))
            return 'wellness';

        return 'general';
    }

    // Step 4: Find best semantic match
    findSemanticMatch(analysis) {
        let bestMatch = null;
        let highestScore = 0;

        for (const [keyword, data] of Object.entries(this.db.semantic_vectors)) {
            const score = this.calculateMatchScore(keyword, data, analysis);
            if (score > highestScore) {
                highestScore = score;
                bestMatch = { keyword, data, score };
            }
        }

        return bestMatch || { 
            keyword: 'general', 
            data: this.db.semantic_vectors.learn, // Fallback
            score: 0.1 
        };
    }

    calculateMatchScore(keyword, data, analysis) {
        let score = 0;

        // Intent matching
        if (data.domain === 'LEARNING' && analysis.intent === 'learning') score += 0.3;
        if (data.domain === 'BUILDING' && analysis.intent === 'building') score += 0.3;
        if (data.domain === 'WELLNESS' && analysis.intent === 'wellness') score += 0.3;

        // Keyword matching
        const keywordWords = keyword.split(' ');
        if (analysis.primaryNoun && keywordWords.includes(analysis.primaryNoun.stem)) score += 0.2;
        if (analysis.primaryVerb && keywordWords.includes(analysis.primaryVerb.stem)) score += 0.2;

        // Vector similarity (simplified)
        if (analysis.primaryNoun) {
            const similarity = this.vectorSimilarity(analysis.primaryNoun.vector, data.vector);
            score += similarity * 0.2;
        }

        return Math.min(score, 1.0);
    }

    vectorSimilarity(vec1, vec2) {
        // Simple cosine similarity
        let dotProduct = 0;
        let mag1 = 0;
        let mag2 = 0;

        for (let i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            mag1 += vec1[i] * vec1[i];
            mag2 += vec2[i] * vec2[i];
        }

        return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
    }

    // Step 5: Build enhanced query
    buildEnhancedQuery(original, bestMatch, analysis) {
        let enhanced = original;

        // Add ecological context if missing
        if (!analysis.hasEcological) {
            enhanced = `sustainable ${enhanced}`;
        }

        // Add filters from best match
        if (bestMatch.data.filters && bestMatch.data.filters.length > 0) {
            enhanced += ' ' + bestMatch.data.filters.slice(0, 2).join(' ');
        }

        // Add domain-specific enhancements
        if (bestMatch.data.domain === 'LEARNING') {
            enhanced += ' step-by-step guide';
        } else if (bestMatch.data.domain === 'WELLNESS') {
            enhanced += ' natural techniques';
        } else if (bestMatch.data.domain === 'BUILDING') {
            enhanced += ' open source tools';
        }

        return enhanced;
    }

    // Step 6: Generate actions
    generateActions(bestMatch, analysis) {
        const actions = [];

        // Base actions from semantic match
        if (bestMatch.data.layer1) {
            actions.push(...bestMatch.data.layer1.slice(0, 2));
        }

        // Intent-specific actions
        if (analysis.intent === 'learning') {
            actions.push('Find beginner resources', 'Join learning community');
        } else if (analysis.intent === 'wellness') {
            actions.push('Practice mindfulness', 'Connect with support');
        } else if (analysis.intent === 'building') {
            actions.push('Start with simple project', 'Learn essential tools');
        }

        // Ecological actions
        actions.push('Explore sustainable alternatives', 'Join eco-community');

        return actions.slice(0, 4);
    }
}

// Integration with HTML
function initializeSemanticSearch(semanticDB) {
    const processor = new SemanticProcessor(semanticDB);

    // Connect to HTML input
    const searchInput = document.getElementById('query');
    const resultsDiv = document.getElementById('semanticResults');

    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        if (query.length > 2) {
            const result = processor.processUserInput(query);
            displaySemanticResults(result);
        }
    });

    function displaySemanticResults(result) {
        const html = `
            <div class="semantic-analysis">
                <div class="intent">Intent: ${result.analysis.intent}</div>
                <div class="match">Best Match: ${result.bestMatch.keyword} (${(result.bestMatch.score * 100).toFixed(0)}%)</div>
                <div class="enhanced-query">Enhanced: "${result.enhancedQuery}"</div>
                <div class="actions">
                    ${result.actions.map(action => 
                        `<div class="action">${action}</div>`
                    ).join('')}
                </div>
                <div class="word-analysis">
                    ${result.analysis.primaryVerb ? `Verb: ${result.analysis.primaryVerb.word}` : ''}
                    ${result.analysis.primaryNoun ? `Noun: ${result.analysis.primaryNoun.word}` : ''}
                </div>
            </div>
        `;
        
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
    }

    return processor;
}

// Usage with your existing HTML
document.addEventListener('DOMContentLoaded', function() {
    // Load your semantic DB (from JSON file)
    fetch('enhanced-semantic-db.json')
        .then(response => response.json())
        .then(semanticDB => {
            window.semanticProcessor = initializeSemanticSearch(semanticDB);
        })
        .catch(error => {
            console.error('Error loading semantic database:', error);
        });
});
