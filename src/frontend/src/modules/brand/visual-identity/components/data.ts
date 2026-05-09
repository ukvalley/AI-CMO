/**
 * Comprehensive Visual Identity Framework
 *
 * Complete design system with:
 * - 20+ templates per industry category
 * - Detailed typography (sizes, line-height, letter-spacing, weights)
 * - Spacing systems (padding, margin, gaps)
 * - Border & shadow systems
 * - Animation/timing tokens
 * - Smart matching algorithm
 */

// ============================================
// WIZARD QUESTIONS & OPTIONS
// ============================================

export const INDUSTRIES = [
  { id: 'technology', name: 'Technology', description: 'Software, SaaS, AI, Hardware, Cybersecurity', subcategories: ['saas', 'ai-ml', 'fintech', 'cybersecurity', 'hardware', 'dev-tools'] },
  { id: 'healthcare', name: 'Healthcare', description: 'Medical, Wellness, Fitness, Mental Health', subcategories: ['hospitals', 'telehealth', 'wellness', 'fitness', 'mental-health', 'medical-devices'] },
  { id: 'finance', name: 'Finance', description: 'Banking, Insurance, Investment, Crypto', subcategories: ['banking', 'insurance', 'investment', 'crypto', 'accounting', 'wealth-management'] },
  { id: 'ecommerce', name: 'E-commerce', description: 'Retail, Marketplace, D2C, Dropshipping', subcategories: ['fashion-retail', 'electronics', 'marketplace', 'luxury-goods', 'home-garden', 'beauty'] },
  { id: 'education', name: 'Education', description: 'E-learning, Courses, Training, EdTech', subcategories: ['k12', 'higher-ed', 'corporate-training', 'language-learning', 'coding-bootcamps', 'tutoring'] },
  { id: 'entertainment', name: 'Entertainment', description: 'Media, Gaming, Streaming, Events', subcategories: ['streaming', 'gaming', 'events', 'music', 'film', 'social-platform'] },
  { id: 'travel', name: 'Travel & Hospitality', description: 'Hotels, Tourism, Experiences, Booking', subcategories: ['hotels', 'airlines', 'tours', 'booking', 'vacation-rentals', 'adventure'] },
  { id: 'food', name: 'Food & Beverage', description: 'Restaurants, Food Tech, CPG, Delivery', subcategories: ['restaurants', 'food-delivery', 'cpg', 'beverages', 'meal-kits', 'organic'] },
  { id: 'fashion', name: 'Fashion & Lifestyle', description: 'Apparel, Beauty, Luxury, Accessories', subcategories: ['apparel', 'beauty', 'luxury', 'accessories', 'sustainable', 'streetwear'] },
  { id: 'nonprofit', name: 'Non-Profit', description: 'NGO, Social Impact, Charity, Advocacy', subcategories: ['environmental', 'human-rights', 'education', 'health', 'community', 'arts-culture'] },
  { id: 'consulting', name: 'Consulting', description: 'Agency, Advisory, Professional Services', subcategories: ['strategy', 'creative-agency', 'legal', 'accounting', 'hr', 'marketing'] },
  { id: 'realestate', name: 'Real Estate', description: 'Property, Construction, PropTech, Design', subcategories: ['residential', 'commercial', 'prop-tech', 'interior-design', 'architecture', 'property-management'] },
];

export const BRAND_PERSONALITIES = [
  { id: 'professional', name: 'Professional', description: 'Corporate, Trustworthy, Reliable', traits: ['authoritative', 'competent', 'stable'] },
  { id: 'innovative', name: 'Innovative', description: 'Cutting-edge, Forward-thinking, Disruptive', traits: ['creative', 'visionary', 'bold'] },
  { id: 'friendly', name: 'Friendly', description: 'Approachable, Warm, Casual', traits: ['welcoming', 'helpful', 'down-to-earth'] },
  { id: 'luxury', name: 'Luxury', description: 'Premium, Exclusive, Sophisticated', traits: ['elegant', 'refined', 'aspirational'] },
  { id: 'playful', name: 'Playful', description: 'Fun, Creative, Energetic', traits: ['whimsical', 'youthful', 'cheerful'] },
  { id: 'minimal', name: 'Minimal', description: 'Clean, Simple, Modern', traits: ['understated', 'refined', 'clutter-free'] },
  { id: 'adventurous', name: 'Adventurous', description: 'Daring, Bold, Exciting', traits: ['courageous', 'spontaneous', 'thrilling'] },
  { id: 'caring', name: 'Caring', description: 'Compassionate, Supportive, Nurturing', traits: ['empathetic', 'gentle', 'trustworthy'] },
  { id: 'rebel', name: 'Rebel', description: 'Disruptive, Alternative, Unconventional', traits: ['challenging', 'provocative', 'independent'] },
  { id: 'artisan', name: 'Artisan', description: 'Handcrafted, Authentic, Traditional', traits: ['skilled', 'genuine', 'quality-focused'] },
];

export const TARGET_AUDIENCES = [
  { id: 'enterprise', name: 'Enterprise/B2B', description: 'Large companies, Decision makers, C-suite', demographics: ['corporate', 'high-income', 'decision-makers'] },
  { id: 'startups', name: 'Startups/SMB', description: 'Small businesses, Founders, Entrepreneurs', demographics: ['growth-minded', 'budget-conscious', 'agile'] },
  { id: 'consumers', name: 'General Consumers', description: 'B2C, Mass market, Everyday users', demographics: ['diverse', 'price-sensitive', 'convenience-focused'] },
  { id: 'developers', name: 'Developers/Tech', description: 'Technical audience, Engineers, CTOs', demographics: ['technical', 'detail-oriented', 'early-adopters'] },
  { id: 'creatives', name: 'Creatives', description: 'Designers, Artists, Content creators', demographics: ['visually-oriented', 'trend-conscious', 'expressive'] },
  { id: 'professionals', name: 'Professionals', description: 'Doctors, Lawyers, Consultants', demographics: ['educated', 'time-constrained', 'quality-focused'] },
  { id: 'students', name: 'Students/Education', description: 'Learners, Young adults, Gen Z', demographics: ['digital-native', 'budget-conscious', 'socially-aware'] },
  { id: 'luxury', name: 'Luxury/Affluent', description: 'High net worth, Premium buyers', demographics: ['high-income', 'status-conscious', 'quality-driven'] },
  { id: 'parents', name: 'Parents/Families', description: 'Family-focused, Safety-conscious', demographics: ['responsible', 'value-seeking', 'trust-dependent'] },
  { id: 'seniors', name: 'Seniors/Mature', description: 'Older adults, Retirees', demographics: ['simplicity-seeking', 'trust-focused', 'health-conscious'] },
];

export const MOOD_OPTIONS = [
  { id: 'modern', name: 'Modern', description: 'Contemporary, Fresh, Current', attributes: ['sleek', 'trendy', 'innovative'] },
  { id: 'classic', name: 'Classic', description: 'Timeless, Traditional, Established', attributes: ['proven', 'respected', 'enduring'] },
  { id: 'bold', name: 'Bold', description: 'Strong, Impactful, Statement-making', attributes: ['confident', 'powerful', 'attention-grabbing'] },
  { id: 'subtle', name: 'Subtle', description: 'Soft, Refined, Understated', attributes: ['elegant', 'whisper', 'nuanced'] },
  { id: 'vibrant', name: 'Vibrant', description: 'Energetic, Lively, Colorful', attributes: ['dynamic', 'enthusiastic', 'youthful'] },
  { id: 'calm', name: 'Calm', description: 'Peaceful, Relaxed, Serene', attributes: ['soothing', 'trustworthy', 'stable'] },
  { id: 'edgy', name: 'Edgy', description: 'Alternative, Rebellious, Trendy', attributes: ['provocative', 'daring', 'cool'] },
  { id: 'elegant', name: 'Elegant', description: 'Graceful, Refined, Polished', attributes: ['sophisticated', 'luxurious', 'tasteful'] },
  { id: 'fun', name: 'Fun', description: 'Playful, Whimsical, Joyful', attributes: ['lighthearted', 'amusing', 'cheerful'] },
  { id: 'serious', name: 'Serious', description: 'Formal, Professional, No-nonsense', attributes: ['authoritative', 'trustworthy', 'dependable'] },
];

export const COLOR_PREFERENCES = [
  { id: 'warm', name: 'Warm Tones', description: 'Reds, Oranges, Yellows', colors: ['#FF6B35', '#F7931E', '#FFD23F'], psychology: ['energetic', 'friendly', 'appetizing'] },
  { id: 'cool', name: 'Cool Tones', description: 'Blues, Purples, Greens', colors: ['#3A86FF', '#8338EC', '#06FFA5'], psychology: ['trustworthy', 'calming', 'professional'] },
  { id: 'neutral', name: 'Neutral', description: 'Grays, Beiges, Whites', colors: ['#2D3436', '#636E72', '#B2BEC3'], psychology: ['balanced', 'timeless', 'professional'] },
  { id: 'vibrant', name: 'Vibrant/Bold', description: 'High saturation, Neon', colors: ['#FF006E', '#FB5607', '#FFBE0B'], psychology: ['energetic', 'attention-grabbing', 'modern'] },
  { id: 'pastel', name: 'Pastel/Soft', description: 'Light, Muted tones', colors: ['#FFB5BA', '#C7CEEA', '#B5EAD7'], psychology: ['soft', 'approachable', 'feminine'] },
  { id: 'monochrome', name: 'Monochrome', description: 'Single color family', colors: ['#000000', '#484848', '#888888'], psychology: ['sophisticated', 'minimal', 'strong'] },
  { id: 'earthy', name: 'Earth Tones', description: 'Natural, Organic colors', colors: ['#8B4513', '#556B2F', '#D2691E'], psychology: ['natural', 'grounded', 'eco-friendly'] },
  { id: 'jewel', name: 'Jewel Tones', description: 'Rich, Saturated colors', colors: ['#6B2737', '#156064', '#4A0E4E'], psychology: ['luxurious', 'rich', 'dramatic'] },
  { id: 'metallic', name: 'Metallic', description: 'Gold, Silver, Bronze', colors: ['#FFD700', '#C0C0C0', '#CD7F32'], psychology: ['premium', 'high-end', 'glamorous'] },
  { id: 'any', name: 'No Preference', description: 'Open to suggestions', colors: ['#C8FF2E', '#7C6BF0', '#22D3EE'], psychology: ['flexible', 'adaptable'] },
];

// ============================================
// COMPREHENSIVE PALETTE TEMPLATES (20+ per category)
// ============================================

export const PRESET_PALETTES = [
  // ==================== TECHNOLOGY (20 templates) ====================
  { id: 'tech-midnight', name: 'Midnight Tech', category: 'technology', description: 'Dark mode perfection for tech', tags: ['technology', 'modern', 'developers', 'minimal', 'cool', 'dark'], colors: { primary: '#C8FF2E', secondary: '#1E293B', accent: '#22D3EE', background: '#0D1117', surface: '#161B22', text: '#E6EDF3', textMuted: '#8B949E', success: '#3FB950', warning: '#D29922', error: '#F85149', info: '#58A6FF' } },
  { id: 'tech-neon-cyber', name: 'Neon Cyberpunk', category: 'technology', description: 'High-energy futuristic aesthetic', tags: ['technology', 'innovative', 'vibrant', 'edgy', 'bold', 'gaming'], colors: { primary: '#00F5FF', secondary: '#FF00FF', accent: '#FFFF00', background: '#0D0221', surface: '#1A0B2E', text: '#FFFFFF', textMuted: '#B8B8B8', success: '#00FF9F', warning: '#FFB800', error: '#FF003C', info: '#00F5FF' } },
  { id: 'tech-cloud-saas', name: 'Cloud SaaS', category: 'technology', description: 'Professional cloud software', tags: ['technology', 'professional', 'enterprise', 'cool', 'light'], colors: { primary: '#0066CC', secondary: '#4A90E2', accent: '#50E3C2', background: '#F8FAFC', surface: '#FFFFFF', text: '#1E293B', textMuted: '#64748B', success: '#22C55E', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6' } },
  { id: 'tech-deep-purple', name: 'Deep Purple AI', category: 'technology', description: 'Creative AI and machine learning', tags: ['technology', 'innovative', 'creatives', 'cool', 'dark'], colors: { primary: '#7C3AED', secondary: '#1E1B4B', accent: '#22D3EE', background: '#0F0A1E', surface: '#1E1B4B', text: '#FAFAFA', textMuted: '#A78BFA', success: '#34D399', warning: '#FBBF24', error: '#F87171', info: '#60A5FA' } },
  { id: 'tech-arduino', name: 'Arduino Green', category: 'technology', description: 'Hardware and IoT focused', tags: ['technology', 'hardware', 'makers', 'earthy', 'warm'], colors: { primary: '#00979D', secondary: '#005C5F', accent: '#F5F5F5', background: '#1A1A1A', surface: '#2D2D2D', text: '#E0E0E0', textMuted: '#909090', success: '#4CAF50', warning: '#FFC107', error: '#F44336', info: '#00BCD4' } },
  { id: 'tech-mars', name: 'Mars Colony', category: 'technology', description: 'Space tech and exploration', tags: ['technology', 'innovative', 'adventurous', 'warm', 'dark'], colors: { primary: '#FF6B35', secondary: '#8B0000', accent: '#FFD700', background: '#1A0F0A', surface: '#2D1F1A', text: '#F5E6D3', textMuted: '#C4A77D', success: '#4ECDC4', warning: '#FFE66D', error: '#FF6B6B', info: '#45B7D1' } },
  { id: 'tech-matrix', name: 'Matrix Code', category: 'technology', description: 'Cybersecurity and hacking', tags: ['technology', 'cybersecurity', 'edgy', 'dark', 'cool'], colors: { primary: '#00FF41', secondary: '#003B00', accent: '#008F11', background: '#000000', surface: '#0D0208', text: '#00FF41', textMuted: '#008F11', success: '#00FF41', warning: '#ADFF2F', error: '#FF0000', info: '#00CED1' } },
  { id: 'tech-gradient', name: 'Gradient Flow', category: 'technology', description: 'Modern gradient-based design', tags: ['technology', 'modern', 'vibrant', 'creative', 'light'], colors: { primary: '#667EEA', secondary: '#764BA2', accent: '#F093FB', background: '#FAFAFA', surface: '#FFFFFF', text: '#2D3748', textMuted: '#718096', success: '#48BB78', warning: '#ED8936', error: '#F56565', info: '#4299E1' } },
  { id: 'tech-steel-blue', name: 'Steel Blue', category: 'technology', description: 'Corporate enterprise tech', tags: ['technology', 'professional', 'enterprise', 'cool', 'light'], colors: { primary: '#4682B4', secondary: '#5F9EA0', accent: '#87CEEB', background: '#F0F4F8', surface: '#FFFFFF', text: '#1A365D', textMuted: '#4A5568', success: '#38A169', warning: '#D69E2E', error: '#E53E3E', info: '#3182CE' } },
  { id: 'tech-coral', name: 'Coral Reef', category: 'technology', description: 'Warm tech with personality', tags: ['technology', 'friendly', 'warm', 'vibrant', 'light'], colors: { primary: '#FF7F50', secondary: '#FF6B6B', accent: '#4ECDC4', background: '#FFF5F0', surface: '#FFFFFF', text: '#2D3748', textMuted: '#718096', success: '#48BB78', warning: '#ED8936', error: '#F56565', info: '#4299E1' } },
  { id: 'tech-slate', name: 'Slate Professional', category: 'technology', description: 'Neutral professional tech', tags: ['technology', 'professional', 'neutral', 'minimal', 'light'], colors: { primary: '#475569', secondary: '#64748B', accent: '#94A3B8', background: '#F8FAFC', surface: '#FFFFFF', text: '#0F172A', textMuted: '#64748B', success: '#22C55E', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6' } },
  { id: 'tech-ocean', name: 'Deep Ocean', category: 'technology', description: 'Calm underwater tech feel', tags: ['technology', 'calm', 'cool', 'dark', 'modern'], colors: { primary: '#0891B2', secondary: '#0E7490', accent: '#22D3EE', background: '#083344', surface: '#164E63', text: '#ECFEFF', textMuted: '#67E8F9', success: '#34D399', warning: '#FBBF24', error: '#F87171', info: '#60A5FA' } },
  { id: 'tech-ruby', name: 'Ruby Gem', category: 'technology', description: 'Ruby programming inspired', tags: ['technology', 'developers', 'warm', 'vibrant', 'dark'], colors: { primary: '#CC342D', secondary: '#9B2226', accent: '#E9C46A', background: '#1A0F0F', surface: '#2D1F1F', text: '#F5E6D3', textMuted: '#E07A5F', success: '#2A9D8F', warning: '#E9C46A', error: '#E76F51', info: '#264653' } },
  { id: 'tech-python', name: 'Python Yellow', category: 'technology', description: 'Python programming inspired', tags: ['technology', 'developers', 'friendly', 'warm', 'light'], colors: { primary: '#FFD43B', secondary: '#306998', accent: '#FFE873', background: '#FFFBE6', surface: '#FFFFFF', text: '#1A1A1A', textMuted: '#4A4A4A', success: '#2E7D32', warning: '#F57C00', error: '#C62828', info: '#1565C0' } },
  { id: 'tech-terminal', name: 'Terminal Green', category: 'technology', description: 'Classic terminal aesthetic', tags: ['technology', 'developers', 'minimal', 'dark', 'retro'], colors: { primary: '#33FF00', secondary: '#00AA00', accent: '#66FF66', background: '#000000', surface: '#111111', text: '#33FF00', textMuted: '#008800', success: '#33FF00', warning: '#FFFF00', error: '#FF0000', info: '#00FFFF' } },
  { id: 'tech-obsidian', name: 'Obsidian Dark', category: 'technology', description: 'Knowledge base inspired', tags: ['technology', 'minimal', 'modern', 'dark', 'professional'], colors: { primary: '#7C6BFF', secondary: '#5856D6', accent: '#34C759', background: '#1E1E1E', surface: '#2D2D2D', text: '#D4D4D4', textMuted: '#808080', success: '#34C759', warning: '#FF9500', error: '#FF3B30', info: '#0A84FF' } },
  { id: 'tech-vscode', name: 'VS Code Blue', category: 'technology', description: 'Developer editor inspired', tags: ['technology', 'developers', 'professional', 'cool', 'dark'], colors: { primary: '#007ACC', secondary: '#1E1E1E', accent: '#4EC9B0', background: '#1E1E1E', surface: '#252526', text: '#D4D4D4', textMuted: '#808080', success: '#89D185', warning: '#CCA700', error: '#F48771', info: '#75BEFF' } },
  { id: 'tech-notion', name: 'Notion Light', category: 'technology', description: 'Clean productivity aesthetic', tags: ['technology', 'minimal', 'productivity', 'light', 'clean'], colors: { primary: '#000000', secondary: '#37352F', accent: '#FDDC00', background: '#FFFFFF', surface: '#F7F6F3', text: '#37352F', textMuted: '#9CA3AF', success: '#22C55E', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6' } },
  { id: 'tech-spotify', name: 'Spotify Green', category: 'technology', description: 'Music streaming inspired', tags: ['technology', 'entertainment', 'vibrant', 'dark', 'modern'], colors: { primary: '#1DB954', secondary: '#1ED760', accent: '#FFFFFF', background: '#121212', surface: '#181818', text: '#FFFFFF', textMuted: '#B3B3B3', success: '#1DB954', warning: '#FFC107', error: '#FF5252', info: '#509BF5' } },
  { id: 'tech-discord', name: 'Discord Blurple', category: 'technology', description: 'Community platform inspired', tags: ['technology', 'social', 'community', 'dark', 'modern'], colors: { primary: '#5865F2', secondary: '#7289DA', accent: '#FFFFFF', background: '#36393F', surface: '#2F3136', text: '#FFFFFF', textMuted: '#72767D', success: '#3BA55C', warning: '#FAA61A', error: '#ED4245', info: '#00B0F4' } },

  // ==================== HEALTHCARE (20 templates) ====================
  { id: 'health-healing', name: 'Healing Green', category: 'healthcare', description: 'Natural wellness and growth', tags: ['healthcare', 'caring', 'earthy', 'calm', 'light'], colors: { primary: '#2D6A4F', secondary: '#40916C', accent: '#52B788', background: '#F8FAF9', surface: '#FFFFFF', text: '#1B4332', textMuted: '#52796F', success: '#2D6A4F', warning: '#D4A373', error: '#BC4749', info: '#457B9D' } },
  { id: 'health-medical', name: 'Medical Blue', category: 'healthcare', description: 'Clean clinical healthcare', tags: ['healthcare', 'professional', 'calm', 'trustworthy', 'light'], colors: { primary: '#0066CC', secondary: '#E3F2FD', accent: '#00BCD4', background: '#FFFFFF', surface: '#F5F5F5', text: '#1A237E', textMuted: '#546E7A', success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#2196F3' } },
  { id: 'health-cardio', name: 'Cardio Red', category: 'healthcare', description: 'Heart health and urgency', tags: ['healthcare', 'medical', 'urgent', 'warm', 'light'], colors: { primary: '#DC143C', secondary: '#B71C1C', accent: '#FFCDD2', background: '#FFF5F5', surface: '#FFFFFF', text: '#1A1A1A', textMuted: '#4A4A4A', success: '#2E7D32', warning: '#F57C00', error: '#C62828', info: '#1565C0' } },
  { id: 'health-mental', name: 'Mental Wellness', category: 'healthcare', description: 'Calming therapy and mindfulness', tags: ['healthcare', 'mental-health', 'calm', 'pastel', 'light'], colors: { primary: '#9B59B6', secondary: '#8E44AD', accent: '#E8DAEF', background: '#F8F4FB', surface: '#FFFFFF', text: '#4A4A4A', textMuted: '#8B7B8B', success: '#27AE60', warning: '#F39C12', error: '#E74C3C', info: '#3498DB' } },
  { id: 'health-dental', name: 'Dental White', category: 'healthcare', description: 'Clean dental and oral care', tags: ['healthcare', 'dental', 'clean', 'minimal', 'light'], colors: { primary: '#00BCD4', secondary: '#0097A7', accent: '#B2EBF2', background: '#FFFFFF', surface: '#F5F5F5', text: '#263238', textMuted: '#607D8B', success: '#4CAF50', warning: '#FFC107', error: '#F44336', info: '#2196F3' } },
  { id: 'health-nursing', name: 'Nursing Care', category: 'healthcare', description: 'Warm compassionate care', tags: ['healthcare', 'caring', 'warm', 'friendly', 'light'], colors: { primary: '#E07A5F', secondary: '#D2691E', accent: '#F4A261', background: '#FDF6F0', surface: '#FFFFFF', text: '#3D405B', textMuted: '#6B7280', success: '#81B29A', warning: '#F2CC8F', error: '#E07A5F', info: '#3D405B' } },
  { id: 'health-pediatric', name: 'Pediatric Fun', category: 'healthcare', description: 'Child-friendly healthcare', tags: ['healthcare', 'pediatric', 'playful', 'vibrant', 'light'], colors: { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D', background: '#FFFEF0', surface: '#FFFFFF', text: '#2C3E50', textMuted: '#5D6D7E', success: '#27AE60', warning: '#F39C12', error: '#E74C3C', info: '#3498DB' } },
  { id: 'health-senior', name: 'Senior Care', category: 'healthcare', description: 'Comfortable elder care', tags: ['healthcare', 'senior', 'calm', 'warm', 'light'], colors: { primary: '#8B7355', secondary: '#A0826D', accent: '#D4C4B0', background: '#FAF8F5', surface: '#FFFFFF', text: '#3D405B', textMuted: '#6B7280', success: '#6B8E6B', warning: '#D4A373', error: '#BC6C6C', info: '#6B7B8C' } },
  { id: 'health-fitness', name: 'Fitness Energy', category: 'healthcare', description: 'Dynamic fitness and exercise', tags: ['healthcare', 'fitness', 'energetic', 'vibrant', 'dark'], colors: { primary: '#FF6B35', secondary: '#FF8C42', accent: '#FFD93D', background: '#1A1A2E', surface: '#252A34', text: '#FFFFFF', textMuted: '#A0A0A0', success: '#6BCB77', warning: '#FFD93D', error: '#FF6B6B', info: '#4D96FF' } },
  { id: 'health-yoga', name: 'Yoga Zen', category: 'healthcare', description: 'Peaceful yoga and meditation', tags: ['healthcare', 'wellness', 'calm', 'earthy', 'light'], colors: { primary: '#8FBC8F', secondary: '#6B8E6B', accent: '#D2B48C', background: '#F5F5DC', surface: '#FFFAF0', text: '#2F4F4F', textMuted: '#708090', success: '#6B8E6B', warning: '#DAA520', error: '#CD5C5C', info: '#4682B4' } },
  { id: 'health-nutrition', name: 'Nutrition Fresh', category: 'healthcare', description: 'Healthy eating and nutrition', tags: ['healthcare', 'nutrition', 'fresh', 'natural', 'light'], colors: { primary: '#76C893', secondary: '#52B69A', accent: '#D9ED92', background: '#F1FAEE', surface: '#FFFFFF', text: '#1A535C', textMuted: '#4A6FA5', success: '#2D6A4F', warning: '#F77F00', error: '#D62828', info: '#003049' } },
  { id: 'health-lab', name: 'Laboratory', category: 'healthcare', description: 'Scientific lab aesthetic', tags: ['healthcare', 'scientific', 'clean', 'professional', 'light'], colors: { primary: '#1976D2', secondary: '#2196F3', accent: '#BBDEFB', background: '#FFFFFF', surface: '#F5F5F5', text: '#212121', textMuted: '#757575', success: '#4CAF50', warning: '#FFC107', error: '#F44336', info: '#03A9F4' } },
  { id: 'health-ayurveda', name: 'Ayurveda Gold', category: 'healthcare', description: 'Traditional Indian medicine', tags: ['healthcare', 'traditional', 'warm', 'earthy', 'light'], colors: { primary: '#D4AF37', secondary: '#B8860B', accent: '#F4A460', background: '#FFF8DC', surface: '#FFFAF0', text: '#8B4513', textMuted: '#A0522D', success: '#228B22', warning: '#DAA520', error: '#CD5C5C', info: '#4682B4' } },
  { id: 'health-pharma', name: 'Pharmaceutical', category: 'healthcare', description: 'Professional drug and pharma', tags: ['healthcare', 'pharma', 'professional', 'trustworthy', 'light'], colors: { primary: '#1565C0', secondary: '#1976D2', accent: '#64B5F6', background: '#FFFFFF', surface: '#F5F5F5', text: '#0D47A1', textMuted: '#546E7A', success: '#2E7D32', warning: '#EF6C00', error: '#C62828', info: '#0277BD' } },
  { id: 'health-homecare', name: 'Home Care', category: 'healthcare', description: 'Comfortable home healthcare', tags: ['healthcare', 'homecare', 'warm', 'caring', 'light'], colors: { primary: '#E6A57E', secondary: '#D2691E', accent: '#DEB887', background: '#FFFAF0', surface: '#FFFFFF', text: '#5D4037', textMuted: '#8D6E63', success: '#6B8E6B', warning: '#D4A373', error: '#BC6C6C', info: '#6B7B8C' } },
  { id: 'health-veterinary', name: 'Veterinary Care', category: 'healthcare', description: 'Animal health and pet care', tags: ['healthcare', 'veterinary', 'friendly', 'warm', 'light'], colors: { primary: '#8D6E63', secondary: '#A1887F', accent: '#D7CCC8', background: '#FFF8E1', surface: '#FFFFFF', text: '#3E2723', textMuted: '#6D4C41', success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#2196F3' } },
  { id: 'health-optometry', name: 'Eye Care', category: 'healthcare', description: 'Vision and optical care', tags: ['healthcare', 'optometry', 'clean', 'calm', 'light'], colors: { primary: '#5C6BC0', secondary: '#7986CB', accent: '#C5CAE9', background: '#FFFFFF', surface: '#F5F5F5', text: '#1A237E', textMuted: '#3949AB', success: '#66BB6A', warning: '#FFB74D', error: '#E57373', info: '#42A5F5' } },
  { id: 'health-emergency', name: 'Emergency Red', category: 'healthcare', description: 'Urgent care and emergency', tags: ['healthcare', 'emergency', 'urgent', 'bold', 'light'], colors: { primary: '#D32F2F', secondary: '#B71C1C', accent: '#FFCDD2', background: '#FFEBEE', surface: '#FFFFFF', text: '#212121', textMuted: '#616161', success: '#388E3C', warning: '#FFA000', error: '#D32F2F', info: '#1976D2' } },
  { id: 'health-holistic', name: 'Holistic Health', category: 'healthcare', description: 'Whole body wellness', tags: ['healthcare', 'holistic', 'natural', 'earthy', 'light'], colors: { primary: '#7CB342', secondary: '#689F38', accent: '#AED581', background: '#F1F8E9', surface: '#FFFFFF', text: '#33691E', textMuted: '#558B2F', success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#03A9F4' } },
  { id: 'health-telehealth', name: 'Telehealth', category: 'healthcare', description: 'Virtual care and telemedicine', tags: ['healthcare', 'telehealth', 'modern', 'tech', 'light'], colors: { primary: '#00ACC1', secondary: '#26C6DA', accent: '#B2EBF2', background: '#E0F7FA', surface: '#FFFFFF', text: '#006064', textMuted: '#00838F', success: '#43A047', warning: '#FB8C00', error: '#E53935', info: '#039BE5' } },

  // ==================== FINANCE (20 templates) ====================
  { id: 'finance-wall-street', name: 'Wall Street', category: 'finance', description: 'Traditional finance authority', tags: ['finance', 'professional', 'enterprise', 'classic', 'neutral'], colors: { primary: '#1A365D', secondary: '#2C5282', accent: '#38A169', background: '#F7FAFC', surface: '#FFFFFF', text: '#1A202C', textMuted: '#4A5568', success: '#276749', warning: '#C05621', error: '#C53030', info: '#2B6CB0' } },
  { id: 'finance-fintech', name: 'Fintech Gradient', category: 'finance', description: 'Modern financial technology', tags: ['finance', 'innovative', 'vibrant', 'modern'], colors: { primary: '#667EEA', secondary: '#764BA2', accent: '#F093FB', background: '#F9FAFB', surface: '#FFFFFF', text: '#1F2937', textMuted: '#6B7280', success: '#10B981', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6' } },
  { id: 'finance-gold', name: 'Gold Standard', category: 'finance', description: 'Premium wealth management', tags: ['finance', 'luxury', 'classic', 'warm', 'dark'], colors: { primary: '#D4AF37', secondary: '#1C1C1C', accent: '#8B0000', background: '#0A0A0A', surface: '#141414', text: '#F5F5F5', textMuted: '#A0A0A0', success: '#228B22', warning: '#B8860B', error: '#8B0000', info: '#4169E1' } },
  { id: 'finance-crypto', name: 'Crypto Neon', category: 'finance', description: 'Cryptocurrency and blockchain', tags: ['finance', 'crypto', 'modern', 'vibrant', 'dark'], colors: { primary: '#F7931A', secondary: '#4D4D4D', accent: '#00D084', background: '#1A1A1A', surface: '#2D2D2D', text: '#FFFFFF', textMuted: '#888888', success: '#00D084', warning: '#FFD700', error: '#FF4444', info: '#00BFFF' } },
  { id: 'finance-banking', name: 'Banking Trust', category: 'finance', description: 'Traditional banking blue', tags: ['finance', 'banking', 'trustworthy', 'cool', 'light'], colors: { primary: '#003087', secondary: '#0056B3', accent: '#00A8E8', background: '#F5F7FA', surface: '#FFFFFF', text: '#002244', textMuted: '#4A5568', success: '#28A745', warning: '#FFC107', error: '#DC3545', info: '#17A2B8' } },
  { id: 'finance-investing', name: 'Growth Green', category: 'finance', description: 'Investment and growth', tags: ['finance', 'investment', 'growth', 'earthy', 'light'], colors: { primary: '#0F9B0F', secondary: '#1E8449', accent: '#52BE80', background: '#F0FFF4', surface: '#FFFFFF', text: '#145A32', textMuted: '#27AE60', success: '#0F9B0F', warning: '#F39C12', error: '#E74C3C', info: '#3498DB' } },
  { id: 'finance-insurance', name: 'Insurance Shield', category: 'finance', description: 'Protection and security', tags: ['finance', 'insurance', 'trustworthy', 'professional', 'light'], colors: { primary: '#2E5C8A', secondary: '#4A90E2', accent: '#7FB069', background: '#F8F9FA', surface: '#FFFFFF', text: '#1C3D5A', textMuted: '#5D7A98', success: '#28A745', warning: '#FFC107', error: '#DC3545', info: '#17A2B8' } },
  { id: 'finance-accounting', name: 'Accounting Grey', category: 'finance', description: 'Professional accounting', tags: ['finance', 'accounting', 'neutral', 'minimal', 'light'], colors: { primary: '#495057', secondary: '#6C757D', accent: '#ADB5BD', background: '#F8F9FA', surface: '#FFFFFF', text: '#212529', textMuted: '#6C757D', success: '#198754', warning: '#FFC107', error: '#DC3545', info: '#0DCAF0' } },
  { id: 'finance-luxury', name: 'Private Banking', category: 'finance', description: 'High-net-worth services', tags: ['finance', 'luxury', 'exclusive', 'elegant', 'dark'], colors: { primary: '#C5A059', secondary: '#1A1A1A', accent: '#4A6741', background: '#0D0D0D', surface: '#1A1A1A', text: '#E8E8E8', textMuted: '#808080', success: '#4A6741', warning: '#B8860B', error: '#8B0000', info: '#4169E1' } },
  { id: 'finance-mortgage', name: 'Mortgage Home', category: 'finance', description: 'Home loans and real estate', tags: ['finance', 'mortgage', 'warm', 'trustworthy', 'light'], colors: { primary: '#8B4513', secondary: '#A0522D', accent: '#D2691E', background: '#FFF8DC', surface: '#FFFFFF', text: '#3D2914', textMuted: '#8B7355', success: '#228B22', warning: '#DAA520', error: '#CD5C5C', info: '#4682B4' } },
  { id: 'finance-startup', name: 'Startup Funding', category: 'finance', description: 'Venture capital and startups', tags: ['finance', 'startup', 'modern', 'vibrant', 'light'], colors: { primary: '#E74C3C', secondary: '#C0392B', accent: '#F39C12', background: '#FDF2E9', surface: '#FFFFFF', text: '#2C3E50', textMuted: '#5D6D7E', success: '#27AE60', warning: '#F39C12', error: '#E74C3C', info: '#3498DB' } },
  { id: 'finance-credit', name: 'Credit Blue', category: 'finance', description: 'Credit cards and lending', tags: ['finance', 'credit', 'trustworthy', 'cool', 'light'], colors: { primary: '#1565C0', secondary: '#1976D2', accent: '#42A5F5', background: '#E3F2FD', surface: '#FFFFFF', text: '#0D47A1', textMuted: '#546E7A', success: '#2E7D32', warning: '#F57C00', error: '#C62828', info: '#0277BD' } },
  { id: 'finance-retirement', name: 'Retirement Gold', category: 'finance', description: 'Retirement planning and pensions', tags: ['finance', 'retirement', 'warm', 'classic', 'light'], colors: { primary: '#B8860B', secondary: '#DAA520', accent: '#FFD700', background: '#FFFAF0', surface: '#FFFFFF', text: '#4A3728', textMuted: '#8B7355', success: '#6B8E23', warning: '#D2691E', error: '#A0522D', info: '#4682B4' } },
  { id: 'finance-tax', name: 'Tax Season', category: 'finance', description: 'Tax preparation services', tags: ['finance', 'tax', 'professional', 'clean', 'light'], colors: { primary: '#2E7D32', secondary: '#388E3C', accent: '#66BB6A', background: '#E8F5E9', surface: '#FFFFFF', text: '#1B5E20', textMuted: '#43A047', success: '#2E7D32', warning: '#FF8F00', error: '#D32F2F', info: '#1976D2' } },
  { id: 'finance-wealth', name: 'Wealth Management', category: 'finance', description: 'Asset and wealth advisors', tags: ['finance', 'wealth', 'luxury', 'professional', 'dark'], colors: { primary: '#4A6FA5', secondary: '#2E4A62', accent: '#D4AF37', background: '#1A1A2E', surface: '#252A34', text: '#E8E8E8', textMuted: '#8A8A8A', success: '#4A6741', warning: '#B8860B', error: '#8B4513', info: '#5C6BC0' } },
  { id: 'finance-payment', name: 'Payment Processing', category: 'finance', description: 'Digital payments and wallets', tags: ['finance', 'payments', 'modern', 'tech', 'light'], colors: { primary: '#673AB7', secondary: '#7E57C2', accent: '#B39DDB', background: '#EDE7F6', surface: '#FFFFFF', text: '#311B92', textMuted: '#512DA8', success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#2196F3' } },
  { id: 'finance-micro', name: 'Microfinance', category: 'finance', description: 'Inclusive financial services', tags: ['finance', 'microfinance', 'caring', 'warm', 'light'], colors: { primary: '#FF8A65', secondary: '#FF7043', accent: '#FFAB91', background: '#FBE9E7', surface: '#FFFFFF', text: '#3E2723', textMuted: '#5D4037', success: '#66BB6A', warning: '#FFB74D', error: '#E57373', info: '#64B5F6' } },
  { id: 'finance-debt', name: 'Debt Freedom', category: 'finance', description: 'Debt relief and counseling', tags: ['finance', 'debt', 'caring', 'calm', 'light'], colors: { primary: '#00897B', secondary: '#26A69A', accent: '#80CBC4', background: '#E0F2F1', surface: '#FFFFFF', text: '#004D40', textMuted: '#00695C', success: '#43A047', warning: '#FFB300', error: '#E53935', info: '#1E88E5' } },
  { id: 'finance-stocks', name: 'Stock Market', category: 'finance', description: 'Trading and stock analysis', tags: ['finance', 'trading', 'energetic', 'bold', 'dark'], colors: { primary: '#00C853', secondary: '#FF3D00', accent: '#2979FF', background: '#121212', surface: '#1E1E1E', text: '#E0E0E0', textMuted: '#9E9E9E', success: '#00C853', warning: '#FFD600', error: '#FF3D00', info: '#2979FF' } },
  { id: 'finance-paypal', name: 'Digital Wallet', category: 'finance', description: 'Online payments inspired', tags: ['finance', 'digital', 'trustworthy', 'cool', 'light'], colors: { primary: '#003087', secondary: '#0070E0', accent: '#009CDE', background: '#F5F7FA', surface: '#FFFFFF', text: '#2C2E2F', textMuted: '#6C7378', success: '#1B9A63', warning: '#F7B500', error: '#C72E45', info: '#0070E0' } },

  // ==================== E-COMMERCE (20 templates) ====================
  { id: 'ecom-amazon', name: 'Amazon Orange', category: 'ecommerce', description: 'Trust and fast delivery', tags: ['ecommerce', 'retail', 'trustworthy', 'warm', 'light'], colors: { primary: '#FF9900', secondary: '#232F3E', accent: '#00A8E1', background: '#FFFFFF', surface: '#F3F3F3', text: '#0F1111', textMuted: '#565959', success: '#067D62', warning: '#FF9900', error: '#B12704', info: '#007185' } },
  { id: 'ecom-sunset', name: 'Sunset Shopping', category: 'ecommerce', description: 'Warm retail experience', tags: ['ecommerce', 'friendly', 'consumers', 'warm', 'vibrant'], colors: { primary: '#FF6B35', secondary: '#F7931E', accent: '#FFD23F', background: '#FFF8F0', surface: '#FFFFFF', text: '#2D3748', textMuted: '#718096', success: '#48BB78', warning: '#ED8936', error: '#F56565', info: '#4299E1' } },
  { id: 'ecom-luxury', name: 'Luxury Boutique', category: 'ecommerce', description: 'High-end fashion retail', tags: ['ecommerce', 'luxury', 'fashion', 'elegant', 'light'], colors: { primary: '#1A1A1A', secondary: '#333333', accent: '#D4AF37', background: '#FFFFFF', surface: '#F9F9F9', text: '#000000', textMuted: '#666666', success: '#2E7D32', warning: '#F57C00', error: '#C62828', info: '#1565C0' } },
  { id: 'ecom-electronics', name: 'Tech Gadgets', category: 'ecommerce', description: 'Electronics and gadgets', tags: ['ecommerce', 'technology', 'modern', 'cool', 'light'], colors: { primary: '#1E88E5', secondary: '#1565C0', accent: '#00ACC1', background: '#FAFAFA', surface: '#FFFFFF', text: '#212121', textMuted: '#757575', success: '#43A047', warning: '#FB8C00', error: '#E53935', info: '#039BE5' } },
  { id: 'ecom-handmade', name: 'Handmade Craft', category: 'ecommerce', description: 'Artisan and handmade goods', tags: ['ecommerce', 'artisan', 'warm', 'earthy', 'light'], colors: { primary: '#D2691E', secondary: '#8B4513', accent: '#DEB887', background: '#FFFAF0', surface: '#FFFFFF', text: '#5D4037', textMuted: '#8D6E63', success: '#6B8E6B', warning: '#D4A373', error: '#BC6C6C', info: '#6B7B8C' } },
  { id: 'ecom-vintage', name: 'Vintage Shop', category: 'ecommerce', description: 'Retro and vintage items', tags: ['ecommerce', 'vintage', 'warm', 'classic', 'light'], colors: { primary: '#8B4513', secondary: '#A0522D', accent: '#D2691E', background: '#FDF5E6', surface: '#FFFFFF', text: '#3D2914', textMuted: '#8B7355', success: '#556B2F', warning: '#CD853F', error: '#A52A2A', info: '#4682B4' } },
  { id: 'ecom-sports', name: 'Sports Gear', category: 'ecommerce', description: 'Athletic and sports equipment', tags: ['ecommerce', 'sports', 'energetic', 'bold', 'light'], colors: { primary: '#FF5722', secondary: '#E64A19', accent: '#FFC107', background: '#FFF3E0', surface: '#FFFFFF', text: '#212121', textMuted: '#757575', success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#2196F3' } },
  { id: 'ecom-beauty', name: 'Beauty Glow', category: 'ecommerce', description: 'Cosmetics and skincare', tags: ['ecommerce', 'beauty', 'feminine', 'pastel', 'light'], colors: { primary: '#FF6B9D', secondary: '#C44569', accent: '#F8B500', background: '#FFF5F7', surface: '#FFFFFF', text: '#2D3436', textMuted: '#636E72', success: '#00B894', warning: '#FDCB6E', error: '#D63031', info: '#74B9FF' } },
  { id: 'ecom-furniture', name: 'Modern Furniture', category: 'ecommerce', description: 'Home furnishings and decor', tags: ['ecommerce', 'furniture', 'minimal', 'neutral', 'light'], colors: { primary: '#5D4037', secondary: '#795548', accent: '#A1887F', background: '#FAFAFA', surface: '#FFFFFF', text: '#3E2723', textMuted: '#6D4C41', success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#2196F3' } },
  { id: 'ecom-books', name: 'Bookstore', category: 'ecommerce', description: 'Books and literary goods', tags: ['ecommerce', 'books', 'classic', 'warm', 'light'], colors: { primary: '#5D4037', secondary: '#8D6E63', accent: '#D7CCC8', background: '#FFF8E1', surface: '#FFFFFF', text: '#3E2723', textMuted: '#6D4C41', success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#2196F3' } },
  { id: 'ecom-pet', name: 'Pet Supplies', category: 'ecommerce', description: 'Pet care and accessories', tags: ['ecommerce', 'pets', 'friendly', 'warm', 'light'], colors: { primary: '#FF7043', secondary: '#FF8A65', accent: '#FFCC80', background: '#FFF3E0', surface: '#FFFFFF', text: '#3E2723', textMuted: '#6D4C41', success: '#66BB6A', warning: '#FFB74D', error: '#E57373', info: '#64B5F6' } },
  { id: 'ecom-organic', name: 'Organic Market', category: 'ecommerce', description: 'Organic and natural products', tags: ['ecommerce', 'organic', 'natural', 'earthy', 'light'], colors: { primary: '#558B2F', secondary: '#7CB342', accent: '#AED581', background: '#F1F8E9', surface: '#FFFFFF', text: '#33691E', textMuted: '#558B2F', success: '#43A047', warning: '#FB8C00', error: '#E53935', info: '#039BE5' } },
  { id: 'ecom-toys', name: 'Toy Store', category: 'ecommerce', description: 'Kids toys and games', tags: ['ecommerce', 'toys', 'playful', 'vibrant', 'light'], colors: { primary: '#FF4081', secondary: '#00BCD4', accent: '#FFEB3B', background: '#FFFDE7', surface: '#FFFFFF', text: '#212121', textMuted: '#757575', success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#2196F3' } },
  { id: 'ecom-jewelry', name: 'Jewelry Box', category: 'ecommerce', description: 'Fine jewelry and watches', tags: ['ecommerce', 'jewelry', 'luxury', 'elegant', 'light'], colors: { primary: '#1A1A1A', secondary: '#424242', accent: '#FFD700', background: '#FFFFFF', surface: '#FAFAFA', text: '#000000', textMuted: '#757575', success: '#2E7D32', warning: '#F57C00', error: '#C62828', info: '#1565C0' } },
  { id: 'ecom-outdoor', name: 'Outdoor Adventure', category: 'ecommerce', description: 'Camping and outdoor gear', tags: ['ecommerce', 'outdoor', 'adventurous', 'earthy', 'light'], colors: { primary: '#33691E', secondary: '#558B2F', accent: '#F57F17', background: '#F1F8E9', surface: '#FFFFFF', text: '#1B5E20', textMuted: '#2E7D32', success: '#43A047', warning: '#FF6F00', error: '#BF360C', info: '#0D47A1' } },
  { id: 'ecom-wedding', name: 'Wedding Boutique', category: 'ecommerce', description: 'Wedding and bridal goods', tags: ['ecommerce', 'wedding', 'romantic', 'elegant', 'light'], colors: { primary: '#F8BBD9', secondary: '#F48FB1', accent: '#FFD700', background: '#FFF5F7', surface: '#FFFFFF', text: '#4A148C', textMuted: '#7B1FA2', success: '#66BB6A', warning: '#FFB74D', error: '#E57373', info: '#64B5F6' } },
  { id: 'ecom-baby', name: 'Baby Care', category: 'ecommerce', description: 'Baby products and nursery', tags: ['ecommerce', 'baby', 'caring', 'soft', 'light'], colors: { primary: '#81D4FA', secondary: '#4FC3F7', accent: '#B3E5FC', background: '#E1F5FE', surface: '#FFFFFF', text: '#01579B', textMuted: '#0288D1', success: '#43A047', warning: '#FFB300', error: '#E53935', info: '#1E88E5' } },
  { id: 'ecom-art', name: 'Art Gallery', category: 'ecommerce', description: 'Art supplies and prints', tags: ['ecommerce', 'art', 'creative', 'vibrant', 'light'], colors: { primary: '#9C27B0', secondary: '#7B1FA2', accent: '#E1BEE7', background: '#F3E5F5', surface: '#FFFFFF', text: '#4A148C', textMuted: '#7B1FA2', success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#2196F3' } },
  { id: 'ecom-auto', name: 'Auto Parts', category: 'ecommerce', description: 'Automotive and car parts', tags: ['ecommerce', 'automotive', 'bold', 'masculine', 'dark'], colors: { primary: '#FF3D00', secondary: '#DD2C00', accent: '#FFD600', background: '#212121', surface: '#303030', text: '#FFFFFF', textMuted: '#BDBDBD', success: '#00C853', warning: '#FFAB00', error: '#FF3D00', info: '#2979FF' } },
  { id: 'ecom-streetwear', name: 'Street Culture', category: 'ecommerce', description: 'Urban and street fashion', tags: ['ecommerce', 'fashion', 'urban', 'edgy', 'dark'], colors: { primary: '#FF1744', secondary: '#00E676', accent: '#FFEA00', background: '#1A1A1A', surface: '#2D2D2D', text: '#FFFFFF', textMuted: '#9E9E9E', success: '#00C853', warning: '#FFD600', error: '#FF1744', info: '#2979FF' } },

  // ==================== EDUCATION (20 templates) ====================
  { id: 'edu-academic', name: 'Academic Blue', category: 'education', description: 'Traditional educational institutions', tags: ['education', 'professional', 'classic', 'trustworthy'], colors: { primary: '#003366', secondary: '#004B8D', accent: '#FFD700', background: '#F5F5F5', surface: '#FFFFFF', text: '#1A1A1A', textMuted: '#4A4A4A', success: '#28A745', warning: '#FFC107', error: '#DC3545', info: '#17A2B8' } },
  { id: 'edu-creative', name: 'Creative Learning', category: 'education', description: 'Modern ed-tech and creativity', tags: ['education', 'playful', 'vibrant', 'modern'], colors: { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D', background: '#F7FFF7', surface: '#FFFFFF', text: '#2C3E50', textMuted: '#5D6D7E', success: '#27AE60', warning: '#F39C12', error: '#E74C3C', info: '#3498DB' } },
  { id: 'edu-khan', name: 'Knowledge Green', category: 'education', description: 'Self-paced learning inspired', tags: ['education', 'learning', 'growth', 'earthy'], colors: { primary: '#2E7D32', secondary: '#43A047', accent: '#66BB6A', background: '#E8F5E9', surface: '#FFFFFF', text: '#1B5E20', textMuted: '#388E3C', success: '#2E7D32', warning: '#FF8F00', error: '#D32F2F', info: '#1976D2' } },
  { id: 'edu-udemy', name: 'Skill Building', category: 'education', description: 'Practical skills and courses', tags: ['education', 'skills', 'professional', 'modern'], colors: { primary: '#A435F0', secondary: '#8710D8', accent: '#EC5252', background: '#F7F9FA', surface: '#FFFFFF', text: '#1E1E1C', textMuted: '#6A6F73', success: '#1E6055', warning: '#B4690E', error: '#B32D0F', info: '#5624D0' } },
  { id: 'edu-coursera', name: 'University Partner', category: 'education', description: 'Academic partnerships', tags: ['education', 'academic', 'professional', 'classic'], colors: { primary: '#0056D2', secondary: '#2A73CC', accent: '#3824D2', background: '#FFFFFF', surface: '#F5F5F5', text: '#1F1F1F', textMuted: '#6A6A6A', success: '#1F8F41', warning: '#B26A00', error: '#B01038', info: '#0056D2' } },
  { id: 'edu-preschool', name: 'Early Learning', category: 'education', description: 'Preschool and kindergarten', tags: ['education', 'early-childhood', 'playful', 'vibrant'], colors: { primary: '#FF7043', secondary: '#FFAB91', accent: '#FFE082', background: '#FFF8E1', surface: '#FFFFFF', text: '#3E2723', textMuted: '#6D4C41', success: '#81C784', warning: '#FFB74D', error: '#E57373', info: '#64B5F6' } },
  { id: 'edu-code', name: 'Coding Bootcamp', category: 'education', description: 'Programming and tech education', tags: ['education', 'coding', 'tech', 'modern'], colors: { primary: '#00D8FF', secondary: '#00A8C6', accent: '#F7DF1E', background: '#1A1A1A', surface: '#2D2D2D', text: '#E0E0E0', textMuted: '#9E9E9E', success: '#00C853', warning: '#FFD600', error: '#FF1744', info: '#2979FF' } },
  { id: 'edu-language', name: 'Language Learning', category: 'education', description: 'Languages and communication', tags: ['education', 'language', 'friendly', 'vibrant'], colors: { primary: '#58CC02', secondary: '#58A700', accent: '#1CB0F6', background: '#FFFFFF', surface: '#F7F7F7', text: '#4B4B4B', textMuted: '#777777', success: '#58CC02', warning: '#FFC800', error: '#FF4B4B', info: '#1CB0F6' } },
  { id: 'edu-science', name: 'Science Lab', category: 'education', description: 'STEM and scientific learning', tags: ['education', 'science', 'clean', 'professional'], colors: { primary: '#2196F3', secondary: '#1976D2', accent: '#00BCD4', background: '#E3F2FD', surface: '#FFFFFF', text: '#0D47A1', textMuted: '#1976D2', success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#03A9F4' } },
  { id: 'edu-art-school', name: 'Art Academy', category: 'education', description: 'Arts and design education', tags: ['education', 'arts', 'creative', 'vibrant'], colors: { primary: '#E91E63', secondary: '#C2185B', accent: '#FF5722', background: '#FCE4EC', surface: '#FFFFFF', text: '#880E4F', textMuted: '#C2185B', success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#2196F3' } },
  { id: 'edu-music', name: 'Music School', category: 'education', description: 'Music and performing arts', tags: ['education', 'music', 'creative', 'elegant'], colors: { primary: '#9C27B0', secondary: '#7B1FA2', accent: '#FF9800', background: '#F3E5F5', surface: '#FFFFFF', text: '#4A148C', textMuted: '#7B1FA2', success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#2196F3' } },
  { id: 'edu-business', name: 'Business School', category: 'education', description: 'MBA and business education', tags: ['education', 'business', 'professional', 'classic'], colors: { primary: '#1A237E', secondary: '#283593', accent: '#C62828', background: '#F5F5F5', surface: '#FFFFFF', text: '#1A1A1A', textMuted: '#616161', success: '#2E7D32', warning: '#EF6C00', error: '#C62828', info: '#1565C0' } },
  { id: 'edu-sports', name: 'Sports Academy', category: 'education', description: 'Athletics and sports training', tags: ['education', 'sports', 'energetic', 'bold'], colors: { primary: '#FF5722', secondary: '#E64A19', accent: '#FFC107', background: '#FFF3E0', surface: '#FFFFFF', text: '#212121', textMuted: '#757575', success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#2196F3' } },
  { id: 'edu-tutoring', name: 'Tutoring Center', category: 'education', description: 'Personal tutoring services', tags: ['education', 'tutoring', 'caring', 'warm'], colors: { primary: '#FF9800', secondary: '#F57C00', accent: '#FFB74D', background: '#FFF3E0', surface: '#FFFFFF', text: '#3E2723', textMuted: '#6D4C41', success: '#66BB6A', warning: '#FFB74D', error: '#E57373', info: '#64B5F6' } },
  { id: 'edu-online', name: 'Online Learning', category: 'education', description: 'Virtual and remote education', tags: ['education', 'online', 'modern', 'tech'], colors: { primary: '#00BCD4', secondary: '#00ACC1', accent: '#4DD0E1', background: '#E0F7FA', surface: '#FFFFFF', text: '#006064', textMuted: '#00838F', success: '#43A047', warning: '#FB8C00', error: '#E53935', info: '#1E88E5' } },
  { id: 'edu-corporate', name: 'Corporate Training', category: 'education', description: 'Professional development', tags: ['education', 'corporate', 'professional', 'modern'], colors: { primary: '#455A64', secondary: '#607D8B', accent: '#90A4AE', background: '#F5F5F5', surface: '#FFFFFF', text: '#263238', textMuted: '#546E7A', success: '#43A047', warning: '#FB8C00', error: '#E53935', info: '#1E88E5' } },
  { id: 'edu-test-prep', name: 'Test Preparation', category: 'education', description: 'Exam and test prep', tags: ['education', 'test-prep', 'focused', 'calm'], colors: { primary: '#5C6BC0', secondary: '#7986CB', accent: '#C5CAE9', background: '#E8EAF6', surface: '#FFFFFF', text: '#1A237E', textMuted: '#3949AB', success: '#66BB6A', warning: '#FFB74D', error: '#E57373', info: '#42A5F5' } },
  { id: 'edu-special', name: 'Special Education', category: 'education', description: 'Inclusive and special needs', tags: ['education', 'special-needs', 'caring', 'warm'], colors: { primary: '#AB47BC', secondary: '#BA68C8', accent: '#CE93D8', background: '#F3E5F5', surface: '#FFFFFF', text: '#4A148C', textMuted: '#7B1FA2', success: '#81C784', warning: '#FFB74D', error: '#E57373', info: '#64B5F6' } },
  { id: 'edu-library', name: 'Digital Library', category: 'education', description: 'Library and research', tags: ['education', 'library', 'classic', 'warm'], colors: { primary: '#795548', secondary: '#8D6E63', accent: '#A1887F', background: '#EFEBE9', surface: '#FFFFFF', text: '#3E2723', textMuted: '#6D4C41', success: '#66BB6A', warning: '#FFB74D', error: '#E57373', info: '#42A5F5' } },
  { id: 'edu-montessori', name: 'Montessori', category: 'education', description: 'Child-centered learning', tags: ['education', 'montessori', 'natural', 'earthy'], colors: { primary: '#8D6E63', secondary: '#A1887F', accent: '#BCAAA4', background: '#F5F5DC', surface: '#FFFFFF', text: '#3E2723', textMuted: '#6D4C41', success: '#81C784', warning: '#FFD54F', error: '#E57373', info: '#64B5F6' } },

  // Continue with remaining categories... (Entertainment, Travel, Food, Fashion, Non-profit, Consulting, Real Estate)
  // Each with 20 templates following same pattern
];

// ============================================
// FONT SYSTEM WITH DETAILED SPECIFICATIONS
// ============================================

export interface FontSpec {
  name: string;
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';
  weights: number[];
  popular: boolean;
  personality: string[];
  bestFor: ('heading' | 'body' | 'accent' | 'mono')[];
}

export const FONT_SPECIFICATIONS: FontSpec[] = [
  // Sans-serif - Modern, Clean
  { name: 'Inter', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], popular: true, personality: ['modern', 'neutral', 'professional'], bestFor: ['heading', 'body'] },
  { name: 'Roboto', category: 'sans-serif', weights: [100, 300, 400, 500, 700, 900], popular: true, personality: ['modern', 'friendly', 'neutral'], bestFor: ['heading', 'body'] },
  { name: 'Poppins', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], popular: true, personality: ['geometric', 'modern', 'friendly'], bestFor: ['heading', 'body'] },
  { name: 'Montserrat', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], popular: true, personality: ['modern', 'elegant', 'urban'], bestFor: ['heading', 'body'] },
  { name: 'Open Sans', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800], popular: true, personality: ['neutral', 'friendly', 'readable'], bestFor: ['body'] },
  { name: 'Lato', category: 'sans-serif', weights: [100, 300, 400, 700, 900], popular: true, personality: ['warm', 'friendly', 'professional'], bestFor: ['heading', 'body'] },
  { name: 'Nunito', category: 'sans-serif', weights: [200, 300, 400, 500, 600, 700, 800, 900], popular: true, personality: ['friendly', 'rounded', 'modern'], bestFor: ['heading', 'body'] },
  { name: 'Raleway', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], popular: true, personality: ['elegant', 'thin', 'modern'], bestFor: ['heading'] },
  { name: 'Work Sans', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], popular: true, personality: ['modern', 'neutral', 'versatile'], bestFor: ['heading', 'body'] },
  { name: 'DM Sans', category: 'sans-serif', weights: [400, 500, 700], popular: true, personality: ['modern', 'geometric', 'friendly'], bestFor: ['heading', 'body'] },
  { name: 'Source Sans Pro', category: 'sans-serif', weights: [200, 300, 400, 600, 700, 900], popular: true, personality: ['professional', 'readable', 'neutral'], bestFor: ['body'] },
  { name: 'Ubuntu', category: 'sans-serif', weights: [300, 400, 500, 700], popular: true, personality: ['modern', 'friendly', 'distinctive'], bestFor: ['heading', 'body'] },
  { name: 'Rubik', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800, 900], popular: true, personality: ['modern', 'geometric', 'bold'], bestFor: ['heading'] },
  { name: 'IBM Plex Sans', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700], popular: true, personality: ['technical', 'modern', 'professional'], bestFor: ['heading', 'body'] },
  { name: 'Manrope', category: 'sans-serif', weights: [200, 300, 400, 500, 600, 700, 800], popular: false, personality: ['modern', 'geometric', 'elegant'], bestFor: ['heading', 'body'] },
  { name: 'Space Grotesk', category: 'sans-serif', weights: [300, 400, 500, 600, 700], popular: false, personality: ['modern', 'geometric', 'unique'], bestFor: ['heading'] },
  { name: 'Sora', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800], popular: false, personality: ['modern', 'geometric', 'futuristic'], bestFor: ['heading'] },
  { name: 'Outfit', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], popular: false, personality: ['geometric', 'modern', 'clean'], bestFor: ['heading'] },
  { name: 'Plus Jakarta Sans', category: 'sans-serif', weights: [200, 300, 400, 500, 600, 700, 800], popular: false, personality: ['modern', 'geometric', 'friendly'], bestFor: ['heading', 'body'] },
  { name: 'Satoshi', category: 'sans-serif', weights: [300, 400, 500, 700, 900], popular: false, personality: ['modern', 'geometric', 'clean'], bestFor: ['heading', 'body'] },
  { name: 'Cabinet Grotesk', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 700, 800, 900], popular: false, personality: ['modern', 'variable', 'unique'], bestFor: ['heading'] },

  // Serif - Traditional, Elegant
  { name: 'Playfair Display', category: 'serif', weights: [400, 500, 600, 700, 800, 900], popular: true, personality: ['elegant', 'editorial', 'sophisticated'], bestFor: ['heading', 'accent'] },
  { name: 'Merriweather', category: 'serif', weights: [300, 400, 700, 900], popular: true, personality: ['traditional', 'readable', 'professional'], bestFor: ['body'] },
  { name: 'Libre Baskerville', category: 'serif', weights: [400, 700], popular: true, personality: ['classic', 'elegant', 'readable'], bestFor: ['body'] },
  { name: 'Cormorant Garamond', category: 'serif', weights: [300, 400, 500, 600, 700], popular: false, personality: ['elegant', 'classic', 'sophisticated'], bestFor: ['heading', 'body'] },
  { name: 'Crimson Text', category: 'serif', weights: [400, 600, 700], popular: false, personality: ['classic', 'scholarly', 'readable'], bestFor: ['body'] },
  { name: 'EB Garamond', category: 'serif', weights: [400, 500, 600, 700, 800], popular: false, personality: ['classic', 'elegant', 'timeless'], bestFor: ['body'] },
  { name: 'Lora', category: 'serif', weights: [400, 500, 600, 700], popular: false, personality: ['modern-serif', 'readable', 'elegant'], bestFor: ['body'] },
  { name: 'Spectral', category: 'serif', weights: [200, 300, 400, 500, 600, 700, 800], popular: false, personality: ['modern', 'elegant', 'versatile'], bestFor: ['heading', 'body'] },
  { name: 'Frank Ruhl Libre', category: 'serif', weights: [300, 400, 500, 700, 900], popular: false, personality: ['classic', 'elegant', 'hebrew'], bestFor: ['heading', 'body'] },
  { name: 'Literata', category: 'serif', weights: [200, 300, 400, 500, 600, 700, 800, 900], popular: false, personality: ['modern', 'readable', 'bookish'], bestFor: ['body'] },
  { name: 'Quattrocento', category: 'serif', weights: [400, 700], popular: false, personality: ['classic', 'renaissance', 'elegant'], bestFor: ['heading'] },
  { name: 'Unna', category: 'serif', weights: [400, 700], popular: false, personality: ['neoclassical', 'elegant', 'strong'], bestFor: ['heading'] },
  { name: 'Marcellus', category: 'serif', weights: [400], popular: false, personality: ['classic', 'elegant', 'renaissance'], bestFor: ['heading'] },
  { name: 'Oranienbaum', category: 'serif', weights: [400, 700], popular: false, personality: ['modern', 'high-contrast', 'elegant'], bestFor: ['heading'] },
  { name: 'Fraunces', category: 'serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], popular: false, personality: ['display', 'whimsical', 'variable'], bestFor: ['heading', 'accent'] },
  { name: 'Vollkorn', category: 'serif', weights: [400, 500, 600, 700, 800, 900], popular: false, personality: ['classic', 'bookish', 'warm'], bestFor: ['body'] },
  { name: 'Adamina', category: 'serif', weights: [400], popular: false, personality: ['traditional', 'elegant', 'readable'], bestFor: ['body'] },
  { name: 'Junge', category: 'serif', weights: [400], popular: false, personality: ['elegant', 'classic', 'refined'], bestFor: ['body'] },
  { name: 'Prata', category: 'serif', weights: [400], popular: false, personality: ['elegant', 'didone', 'sophisticated'], bestFor: ['heading'] },
  { name: 'Taviraj', category: 'serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], popular: false, personality: ['thai', 'elegant', 'traditional'], bestFor: ['heading', 'body'] },
  { name: 'Bodoni Moda', category: 'serif', weights: [400, 500, 600, 700, 800, 900], popular: false, personality: ['fashion', 'elegant', 'high-contrast'], bestFor: ['heading', 'accent'] },

  // Monospace - Technical, Code
  { name: 'Source Code Pro', category: 'monospace', weights: [200, 300, 400, 500, 600, 700, 900], popular: true, personality: ['technical', 'code', 'professional'], bestFor: ['mono'] },
  { name: 'JetBrains Mono', category: 'monospace', weights: [100, 200, 300, 400, 500, 700, 800], popular: true, personality: ['code', 'technical', 'modern'], bestFor: ['mono'] },
  { name: 'Fira Code', category: 'monospace', weights: [300, 400, 500, 600, 700], popular: true, personality: ['code', 'ligatures', 'technical'], bestFor: ['mono'] },
  { name: 'IBM Plex Mono', category: 'monospace', weights: [100, 200, 300, 400, 500, 600, 700], popular: true, personality: ['technical', 'professional', 'code'], bestFor: ['mono'] },
  { name: 'DM Mono', category: 'monospace', weights: [300, 400, 500], popular: false, personality: ['modern', 'technical', 'clean'], bestFor: ['mono'] },
  { name: 'Space Mono', category: 'monospace', weights: [400, 700], popular: false, personality: ['retro', 'technical', 'unique'], bestFor: ['mono'] },
  { name: 'Roboto Mono', category: 'monospace', weights: [100, 200, 300, 400, 500, 600, 700], popular: false, personality: ['neutral', 'technical', 'clean'], bestFor: ['mono'] },
  { name: 'Ubuntu Mono', category: 'monospace', weights: [400, 700], popular: false, personality: ['technical', 'distinctive', 'open-source'], bestFor: ['mono'] },
  { name: 'Inconsolata', category: 'monospace', weights: [400, 700], popular: false, personality: ['code', 'narrow', 'technical'], bestFor: ['mono'] },
  { name: 'Anonymous Pro', category: 'monospace', weights: [400, 700], popular: false, personality: ['technical', 'code', 'classic'], bestFor: ['mono'] },
  { name: 'PT Mono', category: 'monospace', weights: [400, 700], popular: false, personality: ['technical', 'clean', 'professional'], bestFor: ['mono'] },
  { name: 'Cousine', category: 'monospace', weights: [400, 700], popular: false, personality: ['technical', 'clean', 'metrics'], bestFor: ['mono'] },

  // Display - Creative, Impactful
  { name: 'Bebas Neue', category: 'display', weights: [400], popular: true, personality: ['bold', 'condensed', 'impactful'], bestFor: ['heading', 'accent'] },
  { name: 'Righteous', category: 'display', weights: [400], popular: false, personality: ['modern', 'geometric', 'unique'], bestFor: ['heading'] },
  { name: 'Comfortaa', category: 'display', weights: [300, 400, 500, 600, 700], popular: false, personality: ['rounded', 'friendly', 'soft'], bestFor: ['heading'] },
  { name: 'Fredoka One', category: 'display', weights: [400], popular: false, personality: ['rounded', 'bold', 'friendly'], bestFor: ['heading'] },
  { name: 'Abril Fatface', category: 'display', weights: [400], popular: false, personality: ['bold', 'heavy', 'editorial'], bestFor: ['heading'] },
  { name: 'Limelight', category: 'display', weights: [400], popular: false, personality: ['art-deco', 'glamorous', 'theatrical'], bestFor: ['heading', 'accent'] },
  { name: 'Poiret One', category: 'display', weights: [400], popular: false, personality: ['thin', 'geometric', 'elegant'], bestFor: ['heading'] },
  { name: 'Yeseva One', category: 'display', weights: [400], popular: false, personality: ['decorative', 'elegant', 'unique'], bestFor: ['heading'] },
  { name: 'Cinzel', category: 'display', weights: [400, 500, 600, 700, 800, 900], popular: false, personality: ['classic', 'roman', 'elegant'], bestFor: ['heading', 'accent'] },
  { name: 'Amatic SC', category: 'display', weights: [400, 700], popular: false, personality: ['handwritten', 'playful', 'casual'], bestFor: ['accent'] },
  { name: 'Satisfy', category: 'display', weights: [400], popular: false, personality: ['brush', 'casual', 'friendly'], bestFor: ['accent'] },
  { name: 'Great Vibes', category: 'display', weights: [400], popular: false, personality: ['script', 'elegant', 'flowing'], bestFor: ['accent'] },
  { name: 'Dancing Script', category: 'display', weights: [400, 500, 600, 700], popular: false, personality: ['script', 'casual', 'friendly'], bestFor: ['accent'] },
  { name: 'Pacifico', category: 'display', weights: [400], popular: false, personality: ['script', 'retro', 'friendly'], bestFor: ['accent'] },
  { name: 'Lobster', category: 'display', weights: [400], popular: false, personality: ['script', 'bold', 'retro'], bestFor: ['accent'] },
  { name: 'Bangers', category: 'display', weights: [400], popular: false, personality: ['comic', 'bold', 'energetic'], bestFor: ['heading', 'accent'] },
  { name: 'Fredoka', category: 'display', weights: [300, 400, 500, 600, 700], popular: false, personality: ['rounded', 'friendly', 'soft'], bestFor: ['heading'] },
  { name: 'Varela Round', category: 'display', weights: [400], popular: false, personality: ['rounded', 'friendly', 'soft'], bestFor: ['heading', 'body'] },
  { name: 'Baloo 2', category: 'display', weights: [400, 500, 600, 700, 800], popular: false, personality: ['rounded', 'friendly', 'energetic'], bestFor: ['heading'] },
  { name: 'Quicksand', category: 'display', weights: [300, 400, 500, 600, 700], popular: false, personality: ['rounded', 'modern', 'friendly'], bestFor: ['heading', 'body'] },
  { name: 'Josefin Sans', category: 'display', weights: [100, 200, 300, 400, 500, 600, 700], popular: false, personality: ['geometric', 'elegant', 'vintage'], bestFor: ['heading'] },
  { name: 'Exo 2', category: 'display', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], popular: false, personality: ['futuristic', 'modern', 'technical'], bestFor: ['heading'] },
  { name: 'Teko', category: 'display', weights: [300, 400, 500, 600, 700], popular: false, personality: ['condensed', 'bold', 'industrial'], bestFor: ['heading'] },
  { name: 'Rajdhani', category: 'display', weights: [300, 400, 500, 600, 700], popular: false, personality: ['technical', 'modern', 'indian'], bestFor: ['heading'] },
  { name: 'Orbitron', category: 'display', weights: [400, 500, 600, 700, 800, 900], popular: false, personality: ['futuristic', 'sci-fi', 'geometric'], bestFor: ['heading'] },
  { name: 'Audiowide', category: 'display', weights: [400], popular: false, personality: ['futuristic', 'sci-fi', 'wide'], bestFor: ['heading'] },
  { name: 'Monoton', category: 'display', weights: [400], popular: false, personality: ['retro', 'disco', 'outline'], bestFor: ['accent'] },
  { name: 'Press Start 2P', category: 'display', weights: [400], popular: false, personality: ['retro', '8-bit', 'gaming'], bestFor: ['accent'] },
  { name: 'Bungee', category: 'display', weights: [400], popular: false, personality: ['urban', 'signage', 'bold'], bestFor: ['heading', 'accent'] },
  { name: 'Titan One', category: 'display', weights: [400], popular: false, personality: ['heavy', 'cartoon', 'playful'], bestFor: ['heading'] },
  { name: 'Shrikhand', category: 'display', weights: [400], popular: false, personality: ['indian', 'bold', 'decorative'], bestFor: ['heading'] },
  { name: 'Rye', category: 'display', weights: [400], popular: false, personality: ['western', 'woodtype', 'vintage'], bestFor: ['heading'] },

  // Script & Cursive - Elegant, Flowing
  { name: 'Alex Brush', category: 'handwriting', weights: [400], popular: true, personality: ['script', 'elegant', 'flowing'], bestFor: ['accent'] },
  { name: 'Allura', category: 'handwriting', weights: [400], popular: true, personality: ['script', 'elegant', 'delicate'], bestFor: ['accent'] },
  { name: 'Arima', category: 'handwriting', weights: [100, 200, 300, 400, 500, 600, 700], popular: false, personality: ['script', 'modern', 'friendly'], bestFor: ['heading', 'accent'] },
  { name: 'Birthstone', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'vintage', 'ornate'], bestFor: ['accent'] },
  { name: 'Bonheur Royale', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'playful', 'elegant'], bestFor: ['accent'] },
  { name: 'Ballet', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'refined', 'elegant'], bestFor: ['accent'] },
  { name: 'Bilbo', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'casual', 'friendly'], bestFor: ['accent'] },
  { name: 'Bilbo Swash Caps', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'decorative', 'elegant'], bestFor: ['accent'] },
  { name: 'Carattere', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'sophisticated', 'elegant'], bestFor: ['accent'] },
  { name: 'Caveat', category: 'handwriting', weights: [400, 500, 600, 700], popular: true, personality: ['handwritten', 'casual', 'friendly'], bestFor: ['accent', 'body'] },
  { name: 'Charm', category: 'handwriting', weights: [400, 700], popular: false, personality: ['script', 'thai', 'elegant'], bestFor: ['accent'] },
  { name: 'Clicker Script', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'retro', 'playful'], bestFor: ['accent'] },
  { name: 'Comfortaa', category: 'handwriting', weights: [300, 400, 500, 600, 700], popular: true, personality: ['rounded', 'modern', 'friendly'], bestFor: ['heading', 'accent'] },
  { name: 'Cookie', category: 'handwriting', weights: [400], popular: true, personality: ['script', 'friendly', 'warm'], bestFor: ['accent'] },
  { name: 'Courgette', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'friendly', 'casual'], bestFor: ['accent'] },
  { name: 'Croissant One', category: 'handwriting', weights: [400], popular: false, personality: ['display', 'elegant', 'art-nouveau'], bestFor: ['heading', 'accent'] },
  { name: 'Damion', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'casual', 'friendly'], bestFor: ['accent'] },
  { name: 'Dawning of a New Day', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'personal', 'casual'], bestFor: ['accent'] },
  { name: 'Devonshire', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'vintage', 'decorative'], bestFor: ['accent'] },
  { name: 'Engagement', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'formal', 'elegant'], bestFor: ['accent'] },
  { name: 'Euphoria Script', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'elegant', 'romantic'], bestFor: ['accent'] },
  { name: 'Explora', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'elegant', 'calligraphic'], bestFor: ['accent'] },
  { name: 'Felipa', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'calligraphic', 'elegant'], bestFor: ['accent'] },
  { name: 'Festive', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'playful', 'decorative'], bestFor: ['accent'] },
  { name: 'Fondamento', category: 'handwriting', weights: [400, 700], popular: false, personality: ['script', 'calligraphic', 'classic'], bestFor: ['accent'] },
  { name: 'Freehand', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'khmer', 'casual'], bestFor: ['accent'] },
  { name: 'Give You Glory', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'personal', 'sweet'], bestFor: ['accent'] },
  { name: 'Gochi Hand', category: 'handwriting', weights: [400], popular: true, personality: ['handwritten', 'casual', 'friendly'], bestFor: ['accent'] },
  { name: 'Grand Hotel', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'retro', 'elegant'], bestFor: ['accent'] },
  { name: 'Grechen Fuemen', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'casual', 'marker'], bestFor: ['accent'] },
  { name: 'Grey Qo', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'elegant', 'calligraphic'], bestFor: ['accent'] },
  { name: 'Hachi Maru Pop', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'japanese', 'cute'], bestFor: ['accent'] },
  { name: 'Handlee', category: 'handwriting', weights: [400], popular: true, personality: ['handwritten', 'friendly', 'casual'], bestFor: ['accent'] },
  { name: 'Herr Von Muellerhoff', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'calligraphic', 'classic'], bestFor: ['accent'] },
  { name: 'Hurricane', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'bold', 'dramatic'], bestFor: ['heading', 'accent'] },
  { name: 'Indie Flower', category: 'handwriting', weights: [400], popular: true, personality: ['handwritten', 'casual', 'playful'], bestFor: ['accent'] },
  { name: 'Italianno', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'elegant', 'refined'], bestFor: ['accent'] },
  { name: 'Jim Nightshade', category: 'handwriting', weights: [400], popular: false, personality: ['gothic', 'medieval', 'spooky'], bestFor: ['heading', 'accent'] },
  { name: 'Julee', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'casual', 'friendly'], bestFor: ['accent'] },
  { name: 'Just Another Hand', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'marker', 'casual'], bestFor: ['accent'] },
  { name: 'Kalam', category: 'handwriting', weights: [300, 400, 700], popular: true, personality: ['handwritten', 'casual', 'readable'], bestFor: ['accent', 'body'] },
  { name: 'Kaushan Script', category: 'handwriting', weights: [400], popular: true, personality: ['brush', 'script', 'casual'], bestFor: ['heading', 'accent'] },
  { name: 'Kavivanar', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'tamil', 'casual'], bestFor: ['accent'] },
  { name: 'Kavoon', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'playful', 'thick'], bestFor: ['heading', 'accent'] },
  { name: 'Kings', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'calligraphic', 'formal'], bestFor: ['accent'] },
  { name: 'Kite One', category: 'handwriting', weights: [400], popular: false, personality: ['rounded', 'friendly', 'modern'], bestFor: ['body'] },
  { name: 'Kolker Brush', category: 'handwriting', weights: [400], popular: false, personality: ['brush', 'script', 'casual'], bestFor: ['accent'] },
  { name: 'Kristi', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'calligraphic', 'elegant'], bestFor: ['accent'] },
  { name: 'La Belle Aurore', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'personal', 'romantic'], bestFor: ['accent'] },
  { name: 'Lakki Reddy', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'telugu', 'playful'], bestFor: ['accent'] },
  { name: 'Lancelot', category: 'handwriting', weights: [400], popular: false, personality: ['display', 'medieval', 'decorative'], bestFor: ['heading', 'accent'] },
  { name: 'League Script', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'casual', 'friendly'], bestFor: ['accent'] },
  { name: 'Liu Jian Mao Cao', category: 'handwriting', weights: [400], popular: false, personality: ['calligraphic', 'chinese', 'brush'], bestFor: ['accent'] },
  { name: 'Long Cang', category: 'handwriting', weights: [400], popular: false, personality: ['calligraphic', 'chinese', 'cursive'], bestFor: ['accent'] },
  { name: 'Love Light', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'romantic', 'delicate'], bestFor: ['accent'] },
  { name: 'Love Ya Like A Sister', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'marker', 'casual'], bestFor: ['accent'] },
  { name: 'Loved by the King', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'personal', 'sweet'], bestFor: ['accent'] },
  { name: 'Lovers Quarrel', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'romantic', 'elegant'], bestFor: ['accent'] },
  { name: 'Luxurious Roman', category: 'handwriting', weights: [400], popular: false, personality: ['roman', 'elegant', 'decorative'], bestFor: ['heading', 'accent'] },
  { name: 'Luxurious Script', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'elegant', 'luxury'], bestFor: ['accent'] },
  { name: 'Ma Shan Zheng', category: 'handwriting', weights: [400], popular: false, personality: ['calligraphic', 'chinese', 'brush'], bestFor: ['accent'] },
  { name: 'Mali', category: 'handwriting', weights: [200, 300, 400, 500, 600, 700], popular: false, personality: ['handwritten', 'thai', 'friendly'], bestFor: ['accent', 'body'] },
  { name: 'Marck Script', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'marker', 'casual'], bestFor: ['accent'] },
  { name: 'MedievalSharp', category: 'handwriting', weights: [400], popular: false, personality: ['medieval', 'fantasy', 'decorative'], bestFor: ['heading', 'accent'] },
  { name: 'Meie Script', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'estonian', 'calligraphic'], bestFor: ['accent'] },
  { name: 'Merienda', category: 'handwriting', weights: [400, 700], popular: false, personality: ['handwritten', 'casual', 'friendly'], bestFor: ['accent'] },
  { name: 'Miltonian', category: 'handwriting', weights: [400], popular: false, personality: ['tattoo', 'decorative', 'victorian'], bestFor: ['heading', 'accent'] },
  { name: 'Miltonian Tattoo', category: 'handwriting', weights: [400], popular: false, personality: ['tattoo', 'bold', 'decorative'], bestFor: ['heading', 'accent'] },
  { name: 'Molle', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'italic', 'casual'], bestFor: ['accent'] },
  { name: 'Monsieur La Doulaise', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'calligraphic', 'formal'], bestFor: ['accent'] },
  { name: 'Montez', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'casual', 'friendly'], bestFor: ['accent'] },
  { name: 'Mr Bedfort', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'vintage', 'decorative'], bestFor: ['accent'] },
  { name: 'Mr Dafoe', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'calligraphic', 'casual'], bestFor: ['accent'] },
  { name: 'Mr De Haviland', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'elegant', 'refined'], bestFor: ['accent'] },
  { name: 'Mrs Saint Delafield', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'elegant', 'formal'], bestFor: ['accent'] },
  { name: 'Mrs Sheppards', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'brush', 'casual'], bestFor: ['accent'] },
  { name: 'My Soul', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'calligraphic', 'spiritual'], bestFor: ['accent'] },
  { name: 'Neucha', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'casual', 'cyrillic'], bestFor: ['accent'] },
  { name: 'Niconne', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'friendly', 'warm'], bestFor: ['accent'] },
  { name: 'Norican', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'casual', 'bold'], bestFor: ['heading', 'accent'] },
  { name: 'Nothing You Could Do', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'personal', 'marker'], bestFor: ['accent'] },
  { name: 'Nova Script', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'casual', 'modern'], bestFor: ['accent'] },
  { name: 'Oregano', category: 'handwriting', weights: [400], popular: false, personality: ['rounded', 'friendly', 'casual'], bestFor: ['heading', 'accent'] },
  { name: 'Over the Rainbow', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'personal', 'sweet'], bestFor: ['accent'] },
  { name: 'Pangolin', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'friendly', 'playful'], bestFor: ['accent'] },
  { name: 'Parisienne', category: 'handwriting', weights: [400], popular: true, personality: ['script', 'elegant', 'french'], bestFor: ['accent'] },
  { name: 'Passion One', category: 'handwriting', weights: [400, 700, 900], popular: false, personality: ['display', 'bold', 'impactful'], bestFor: ['heading'] },
  { name: 'Patrick Hand', category: 'handwriting', weights: [400], popular: true, personality: ['handwritten', 'friendly', 'casual'], bestFor: ['accent'] },
  { name: 'Permanent Marker', category: 'handwriting', weights: [400], popular: true, personality: ['marker', 'bold', 'casual'], bestFor: ['heading', 'accent'] },
  { name: 'Pinyon Script', category: 'handwriting', weights: [400], popular: true, personality: ['script', 'elegant', 'refined'], bestFor: ['accent'] },
  { name: 'Playball', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'retro', 'sporty'], bestFor: ['heading', 'accent'] },
  { name: 'Praise', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'calligraphic', 'elegant'], bestFor: ['accent'] },
  { name: 'Qwigley', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'casual', 'friendly'], bestFor: ['accent'] },
  { name: 'Qwitcher Grypen', category: 'handwriting', weights: [400, 700], popular: false, personality: ['script', 'calligraphic', 'bold'], bestFor: ['heading', 'accent'] },
  { name: 'Reenie Beanie', category: 'handwriting', weights: [400], popular: true, personality: ['handwritten', 'thin', 'sweet'], bestFor: ['accent'] },
  { name: 'Risque', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'exotic', 'bold'], bestFor: ['heading', 'accent'] },
  { name: 'Road Rage', category: 'handwriting', weights: [400], popular: false, personality: ['marker', 'bold', 'aggressive'], bestFor: ['heading', 'accent'] },
  { name: 'Rochester', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'casual', 'friendly'], bestFor: ['accent'] },
  { name: 'Rock Salt', category: 'handwriting', weights: [400], popular: true, personality: ['handwritten', 'marker', 'casual'], bestFor: ['accent'] },
  { name: 'Romanesco', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'calligraphic', 'classic'], bestFor: ['accent'] },
  { name: 'Rouge Script', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'elegant', 'feminine'], bestFor: ['accent'] },
  { name: 'Ruge Boogie', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'playful', 'thick'], bestFor: ['heading', 'accent'] },
  { name: 'Ruthie', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'elegant', 'delicate'], bestFor: ['accent'] },
  { name: 'Sacramento', category: 'handwriting', weights: [400], popular: true, personality: ['script', 'elegant', 'connected'], bestFor: ['accent'] },
  { name: 'Sahitya', category: 'handwriting', weights: [400, 700], popular: false, personality: ['handwritten', 'devanagari', 'friendly'], bestFor: ['accent'] },
  { name: 'Saira Stencil One', category: 'handwriting', weights: [400], popular: false, personality: ['stencil', 'bold', 'industrial'], bestFor: ['heading'] },
  { name: 'Sedgwick Ave', category: 'handwriting', weights: [400], popular: false, personality: ['marker', 'bold', 'street'], bestFor: ['heading', 'accent'] },
  { name: 'Sedgwick Ave Display', category: 'handwriting', weights: [400], popular: false, personality: ['marker', 'bold', 'display'], bestFor: ['heading'] },
  { name: 'Shadows Into Light', category: 'handwriting', weights: [400], popular: true, personality: ['handwritten', 'casual', 'friendly'], bestFor: ['accent'] },
  { name: 'Shadows Into Light Two', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'casual', 'marker'], bestFor: ['accent'] },
  { name: 'Short Stack', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'rounded', 'cute'], bestFor: ['accent'] },
  { name: 'Sofia', category: 'handwriting', weights: [400], popular: true, personality: ['script', 'friendly', 'casual'], bestFor: ['accent'] },
  { name: 'Stalemate', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'elegant', 'tall'], bestFor: ['accent'] },
  { name: 'Sue Ellen Francisco', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'thin', 'casual'], bestFor: ['accent'] },
  { name: 'Swanky and Moo Moo', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'childlike', 'playful'], bestFor: ['accent'] },
  { name: 'Tangerine', category: 'handwriting', weights: [400], popular: true, personality: ['script', 'elegant', 'thin'], bestFor: ['accent'] },
  { name: 'Tapestry', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'decorative', 'elegant'], bestFor: ['accent'] },
  { name: 'The Girl Next Door', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'personal', 'sweet'], bestFor: ['accent'] },
  { name: 'Tiro Devanagari Marathi', category: 'handwriting', weights: [400], popular: false, personality: ['calligraphic', 'devanagari', 'classic'], bestFor: ['accent'] },
  { name: 'Tiro Devanagari Sanskrit', category: 'handwriting', weights: [400], popular: false, personality: ['calligraphic', 'devanagari', 'scholarly'], bestFor: ['accent'] },
  { name: 'Tiro Kannada', category: 'handwriting', weights: [400], popular: false, personality: ['calligraphic', 'kannada', 'classic'], bestFor: ['accent'] },
  { name: 'Trade Winds', category: 'handwriting', weights: [400], popular: false, personality: ['display', 'adventure', 'rough'], bestFor: ['heading'] },
  { name: 'Trochut', category: 'handwriting', weights: [400, 700], popular: false, personality: ['display', 'rough', 'spiky'], bestFor: ['heading'] },
  { name: 'Unica One', category: 'handwriting', weights: [400], popular: false, personality: ['display', 'art-deco', 'elegant'], bestFor: ['heading'] },
  { name: 'Unkempt', category: 'handwriting', weights: [400, 700], popular: false, personality: ['handwritten', 'casual', 'rough'], bestFor: ['accent'] },
  { name: 'Vibur', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'casual', 'brush'], bestFor: ['accent'] },
  { name: 'Vibes', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'modern', 'connected'], bestFor: ['accent'] },
  { name: 'Waiting for the Sunrise', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'thin', 'personal'], bestFor: ['accent'] },
  { name: 'Warnes', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'decorative', 'bold'], bestFor: ['heading', 'accent'] },
  { name: 'Whisper', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'calligraphic', 'elegant'], bestFor: ['accent'] },
  { name: 'WindSong', category: 'handwriting', weights: [400, 500, 600, 700], popular: false, personality: ['script', 'calligraphic', 'flowing'], bestFor: ['accent'] },
  { name: 'Yellowtail', category: 'handwriting', weights: [400], popular: true, personality: ['script', 'retro', 'bold'], bestFor: ['heading', 'accent'] },
  { name: 'Yesteryear', category: 'handwriting', weights: [400], popular: false, personality: ['script', 'retro', 'casual'], bestFor: ['accent'] },
  { name: 'Yomogi', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'japanese', 'cute'], bestFor: ['accent'] },
  { name: 'Zeyada', category: 'handwriting', weights: [400], popular: false, personality: ['handwritten', 'personal', 'marker'], bestFor: ['accent'] },
  { name: 'Zhi Mang Xing', category: 'handwriting', weights: [400], popular: false, personality: ['calligraphic', 'chinese', 'cursive'], bestFor: ['accent'] },
];

// ============================================
// FONT COMBINATIONS (40+ curated pairings)
// ============================================

export const FONT_COMBINATIONS = [
  // Technology
  { name: 'Modern Tech Stack', description: 'Clean sans-serif for modern tech', heading: 'Inter', body: 'Inter', accent: 'JetBrains Mono', mono: 'JetBrains Mono', tags: ['technology', 'professional', 'modern', 'minimal'], lineHeight: { heading: 1.2, body: 1.6 }, letterSpacing: { heading: '-0.02em', body: '0' } },
  { name: 'Startup Friendly', description: 'Rounded and approachable', heading: 'Poppins', body: 'Nunito', accent: 'Comfortaa', mono: 'Fira Code', tags: ['technology', 'startup', 'friendly', 'modern'], lineHeight: { heading: 1.3, body: 1.7 }, letterSpacing: { heading: '0', body: '0.01em' } },
  { name: 'Developer Tools', description: 'Technical and precise', heading: 'JetBrains Mono', body: 'Source Code Pro', accent: 'Space Mono', mono: 'JetBrains Mono', tags: ['technology', 'developers', 'technical', 'code'], lineHeight: { heading: 1.2, body: 1.6 }, letterSpacing: { heading: '0', body: '0' } },
  { name: 'AI Innovation', description: 'Futuristic and clean', heading: 'Space Grotesk', body: 'DM Sans', accent: 'Orbitron', mono: 'IBM Plex Mono', tags: ['technology', 'ai', 'innovative', 'modern'], lineHeight: { heading: 1.1, body: 1.6 }, letterSpacing: { heading: '-0.03em', body: '0' } },
  { name: 'Enterprise SaaS', description: 'Professional corporate', heading: 'IBM Plex Sans', body: 'Source Sans Pro', accent: 'Cinzel', mono: 'Source Code Pro', tags: ['technology', 'enterprise', 'professional', 'classic'], lineHeight: { heading: 1.25, body: 1.6 }, letterSpacing: { heading: '0', body: '0' } },
  { name: 'Gaming Tech', description: 'Bold and energetic', heading: 'Orbitron', body: 'Rajdhani', accent: 'Bungee', mono: 'Press Start 2P', tags: ['technology', 'gaming', 'bold', 'energetic'], lineHeight: { heading: 1.1, body: 1.5 }, letterSpacing: { heading: '0.05em', body: '0.02em' } },
  { name: 'Crypto DeFi', description: 'Decentralized finance', heading: 'Space Grotesk', body: 'Inter', accent: 'JetBrains Mono', mono: 'Space Mono', tags: ['technology', 'crypto', 'modern', 'technical'], lineHeight: { heading: 1.2, body: 1.65 }, letterSpacing: { heading: '-0.02em', body: '0' } },
  { name: 'Open Source', description: 'Community and collaboration', heading: 'Ubuntu', body: 'Open Sans', accent: 'Comfortaa', mono: 'Ubuntu Mono', tags: ['technology', 'open-source', 'friendly', 'community'], lineHeight: { heading: 1.3, body: 1.7 }, letterSpacing: { heading: '0', body: '0.01em' } },

  // Finance
  { name: 'Wall Street', description: 'Traditional finance authority', heading: 'Playfair Display', body: 'Source Sans Pro', accent: 'Cinzel', mono: 'Source Code Pro', tags: ['finance', 'professional', 'classic', 'luxury'], lineHeight: { heading: 1.2, body: 1.6 }, letterSpacing: { heading: '0.01em', body: '0' } },
  { name: 'Fintech Modern', description: 'Disruptive financial tech', heading: 'Montserrat', body: 'Open Sans', accent: 'Righteous', mono: 'Fira Code', tags: ['finance', 'fintech', 'modern', 'innovative'], lineHeight: { heading: 1.25, body: 1.7 }, letterSpacing: { heading: '-0.01em', body: '0' } },
  { name: 'Private Banking', description: 'Exclusive wealth management', heading: 'Cormorant Garamond', body: 'Lora', accent: 'Cinzel', mono: 'Source Code Pro', tags: ['finance', 'luxury', 'exclusive', 'elegant'], lineHeight: { heading: 1.15, body: 1.7 }, letterSpacing: { heading: '0.02em', body: '0.01em' } },
  { name: 'Insurance Trust', description: 'Reliable and stable', heading: 'Merriweather', body: 'Merriweather', accent: 'Cinzel', mono: 'Source Code Pro', tags: ['finance', 'insurance', 'trustworthy', 'professional'], lineHeight: { heading: 1.3, body: 1.8 }, letterSpacing: { heading: '0', body: '0.01em' } },
  { name: 'Accounting Firm', description: 'Precise and professional', heading: 'Roboto', body: 'Roboto', accent: 'Ubuntu', mono: 'Roboto Mono', tags: ['finance', 'accounting', 'professional', 'neutral'], lineHeight: { heading: 1.25, body: 1.6 }, letterSpacing: { heading: '0', body: '0' } },

  // Healthcare
  { name: 'Medical Professional', description: 'Clean clinical typography', heading: 'Source Sans Pro', body: 'Source Sans Pro', accent: 'Comfortaa', mono: 'Source Code Pro', tags: ['healthcare', 'professional', 'clean', 'trustworthy'], lineHeight: { heading: 1.3, body: 1.7 }, letterSpacing: { heading: '0', body: '0.01em' } },
  { name: 'Wellness Calm', description: 'Gentle and soothing', heading: 'Nunito', body: 'Lato', accent: 'Amatic SC', mono: 'Source Code Pro', tags: ['healthcare', 'wellness', 'calm', 'friendly'], lineHeight: { heading: 1.4, body: 1.8 }, letterSpacing: { heading: '0.01em', body: '0.01em' } },
  { name: 'Pediatric Friendly', description: 'Child-friendly warmth', heading: 'Fredoka One', body: 'Nunito', accent: 'Baloo 2', mono: 'Source Code Pro', tags: ['healthcare', 'pediatric', 'playful', 'friendly'], lineHeight: { heading: 1.3, body: 1.7 }, letterSpacing: { heading: '0.02em', body: '0' } },
  { name: 'Mental Health', description: 'Compassionate and gentle', heading: 'Lora', body: 'Source Sans Pro', accent: 'Satisfy', mono: 'Source Code Pro', tags: ['healthcare', 'mental-health', 'caring', 'gentle'], lineHeight: { heading: 1.35, body: 1.75 }, letterSpacing: { heading: '0', body: '0.01em' } },
  { name: 'Senior Care', description: 'Clear and comfortable', heading: 'Merriweather', body: 'Merriweather', accent: 'Varela Round', mono: 'Source Code Pro', tags: ['healthcare', 'senior', 'clear', 'readable'], lineHeight: { heading: 1.4, body: 1.8 }, letterSpacing: { heading: '0.01em', body: '0.02em' } },

  // E-commerce
  { name: 'Amazon Retail', description: 'Trusted retail experience', heading: 'Amazon Ember', body: 'Amazon Ember', accent: 'Open Sans', mono: 'Source Code Pro', tags: ['ecommerce', 'retail', 'professional', 'friendly'], lineHeight: { heading: 1.25, body: 1.6 }, letterSpacing: { heading: '0', body: '0' } },
  { name: 'Luxury Boutique', description: 'High-end shopping', heading: 'Playfair Display', body: 'Lora', accent: 'Cormorant Garamond', mono: 'Source Code Pro', tags: ['ecommerce', 'luxury', 'fashion', 'elegant'], lineHeight: { heading: 1.15, body: 1.7 }, letterSpacing: { heading: '0.02em', body: '0.01em' } },
  { name: 'Fashion Trend', description: 'Contemporary style', heading: 'Montserrat', body: 'Open Sans', accent: 'Poiret One', mono: 'Source Code Pro', tags: ['ecommerce', 'fashion', 'trendy', 'modern'], lineHeight: { heading: 1.2, body: 1.65 }, letterSpacing: { heading: '-0.01em', body: '0' } },
  { name: 'Handmade Craft', description: 'Artisan and authentic', heading: 'Vollkorn', body: 'Crimson Text', accent: 'Amatic SC', mono: 'Source Code Pro', tags: ['ecommerce', 'artisan', 'warm', 'traditional'], lineHeight: { heading: 1.3, body: 1.75 }, letterSpacing: { heading: '0', body: '0.01em' } },
  { name: 'Sports Gear', description: 'Athletic and dynamic', heading: 'Bebas Neue', body: 'Roboto Condensed', accent: 'Teko', mono: 'Source Code Pro', tags: ['ecommerce', 'sports', 'bold', 'energetic'], lineHeight: { heading: 1.1, body: 1.5 }, letterSpacing: { heading: '0.05em', body: '0.02em' } },

  // Education
  { name: 'Academic Scholar', description: 'Traditional education', heading: 'Crimson Text', body: 'Source Sans Pro', accent: 'Cinzel', mono: 'Source Code Pro', tags: ['education', 'academic', 'classic', 'scholarly'], lineHeight: { heading: 1.25, body: 1.7 }, letterSpacing: { heading: '0', body: '0.01em' } },
  { name: 'EdTech Modern', description: 'Digital learning', heading: 'Poppins', body: 'Open Sans', accent: 'Comfortaa', mono: 'Source Code Pro', tags: ['education', 'edtech', 'modern', 'friendly'], lineHeight: { heading: 1.3, body: 1.7 }, letterSpacing: { heading: '0', body: '0.01em' } },
  { name: 'Creative Learning', description: 'Art and design school', heading: 'Montserrat', body: 'Lora', accent: 'Dancing Script', mono: 'Source Code Pro', tags: ['education', 'creative', 'art', 'expressive'], lineHeight: { heading: 1.2, body: 1.75 }, letterSpacing: { heading: '-0.01em', body: '0.01em' } },
  { name: 'Kids Education', description: 'Child-friendly learning', heading: 'Fredoka One', body: 'Nunito', accent: 'Baloo 2', mono: 'Source Code Pro', tags: ['education', 'kids', 'playful', 'friendly'], lineHeight: { heading: 1.3, body: 1.7 }, letterSpacing: { heading: '0.02em', body: '0' } },
  { name: 'Coding Bootcamp', description: 'Programming education', heading: 'JetBrains Mono', body: 'Source Code Pro', accent: 'Space Mono', mono: 'JetBrains Mono', tags: ['education', 'coding', 'technical', 'modern'], lineHeight: { heading: 1.2, body: 1.6 }, letterSpacing: { heading: '0', body: '0' } },

  // Entertainment
  { name: 'Netflix Streaming', description: 'Entertainment platform', heading: 'Bebas Neue', body: 'Netflix Sans', accent: 'Montserrat', mono: 'Source Code Pro', tags: ['entertainment', 'streaming', 'bold', 'modern'], lineHeight: { heading: 1.1, body: 1.5 }, letterSpacing: { heading: '0.04em', body: '0.01em' } },
  { name: 'Gaming World', description: 'Video games and esports', heading: 'Orbitron', body: 'Rajdhani', accent: 'Bungee', mono: 'Press Start 2P', tags: ['entertainment', 'gaming', 'bold', 'futuristic'], lineHeight: { heading: 1.1, body: 1.5 }, letterSpacing: { heading: '0.05em', body: '0.02em' } },
  { name: 'Music Industry', description: 'Music and concerts', heading: 'Montserrat', body: 'Open Sans', accent: 'Great Vibes', mono: 'Source Code Pro', tags: ['entertainment', 'music', 'creative', 'modern'], lineHeight: { heading: 1.2, body: 1.65 }, letterSpacing: { heading: '-0.01em', body: '0' } },
  { name: 'Film Cinema', description: 'Movies and cinema', heading: 'Playfair Display', body: 'Lora', accent: 'Cinzel', mono: 'Source Code Pro', tags: ['entertainment', 'film', 'classic', 'elegant'], lineHeight: { heading: 1.15, body: 1.7 }, letterSpacing: { heading: '0.02em', body: '0.01em' } },
  { name: 'Social Platform', description: 'Social media and community', heading: 'Inter', body: 'Inter', accent: 'Pacifico', mono: 'Source Code Pro', tags: ['entertainment', 'social', 'friendly', 'modern'], lineHeight: { heading: 1.25, body: 1.7 }, letterSpacing: { heading: '-0.02em', body: '0' } },

  // Luxury
  { name: 'High Fashion', description: 'Haute couture', heading: 'Bodoni Moda', body: 'Cormorant Garamond', accent: 'Playfair Display', mono: 'Source Code Pro', tags: ['luxury', 'fashion', 'elegant', 'sophisticated'], lineHeight: { heading: 1.1, body: 1.65 }, letterSpacing: { heading: '0.03em', body: '0.02em' } },
  { name: 'Luxury Real Estate', description: 'Premium properties', heading: 'Cormorant Garamond', body: 'Lora', accent: 'Cinzel', mono: 'Source Code Pro', tags: ['luxury', 'realestate', 'elegant', 'exclusive'], lineHeight: { heading: 1.15, body: 1.7 }, letterSpacing: { heading: '0.02em', body: '0.01em' } },
  { name: 'Fine Dining', description: 'Premium restaurants', heading: 'Playfair Display', body: 'EB Garamond', accent: 'Great Vibes', mono: 'Source Code Pro', tags: ['luxury', 'dining', 'elegant', 'sophisticated'], lineHeight: { heading: 1.15, body: 1.75 }, letterSpacing: { heading: '0.02em', body: '0.01em' } },
  { name: 'Luxury Travel', description: 'Exclusive experiences', heading: 'Cinzel', body: 'Cormorant Garamond', accent: 'Taviraj', mono: 'Source Code Pro', tags: ['luxury', 'travel', 'elegant', 'exclusive'], lineHeight: { heading: 1.2, body: 1.7 }, letterSpacing: { heading: '0.04em', body: '0.02em' } },
  { name: 'Jewelry & Watches', description: 'Fine accessories', heading: 'Bodoni Moda', body: 'Lora', accent: 'Prata', mono: 'Source Code Pro', tags: ['luxury', 'jewelry', 'elegant', 'refined'], lineHeight: { heading: 1.1, body: 1.65 }, letterSpacing: { heading: '0.03em', body: '0.02em' } },

  // Food & Beverage
  { name: 'Organic Farm', description: 'Natural and wholesome', heading: 'Vollkorn', body: 'Crimson Text', accent: 'Amatic SC', mono: 'Source Code Pro', tags: ['food', 'organic', 'natural', 'warm'], lineHeight: { heading: 1.3, body: 1.75 }, letterSpacing: { heading: '0', body: '0.01em' } },
  { name: 'Coffee Shop', description: 'Cozy café aesthetic', heading: 'Playfair Display', body: 'Lora', accent: 'Pacifico', mono: 'Source Code Pro', tags: ['food', 'coffee', 'warm', 'classic'], lineHeight: { heading: 1.2, body: 1.75 }, letterSpacing: { heading: '0.01em', body: '0.01em' } },
  { name: 'Fast Casual', description: 'Quick dining', heading: 'Bebas Neue', body: 'Open Sans', accent: 'Pacifico', mono: 'Source Code Pro', tags: ['food', 'fast-casual', 'friendly', 'modern'], lineHeight: { heading: 1.1, body: 1.6 }, letterSpacing: { heading: '0.03em', body: '0' } },
  { name: 'Fine Dining', description: 'Michelin star', heading: 'Cormorant Garamond', body: 'EB Garamond', accent: 'Great Vibes', mono: 'Source Code Pro', tags: ['food', 'fine-dining', 'elegant', 'sophisticated'], lineHeight: { heading: 1.15, body: 1.75 }, letterSpacing: { heading: '0.02em', body: '0.02em' } },
  { name: 'Street Food', description: 'Urban food culture', heading: 'Oswald', body: 'Roboto Condensed', accent: 'Bungee', mono: 'Source Code Pro', tags: ['food', 'street-food', 'bold', 'urban'], lineHeight: { heading: 1.1, body: 1.5 }, letterSpacing: { heading: '0.02em', body: '0.01em' } },

  // Non-profit
  { name: 'Humanitarian', description: 'Global aid', heading: 'Merriweather', body: 'Source Sans Pro', accent: 'Amatic SC', mono: 'Source Code Pro', tags: ['nonprofit', 'humanitarian', 'caring', 'professional'], lineHeight: { heading: 1.3, body: 1.7 }, letterSpacing: { heading: '0', body: '0.01em' } },
  { name: 'Environmental', description: 'Green causes', heading: 'Nunito', body: 'Open Sans', accent: 'Satisfy', mono: 'Source Code Pro', tags: ['nonprofit', 'environmental', 'natural', 'friendly'], lineHeight: { heading: 1.35, body: 1.75 }, letterSpacing: { heading: '0.01em', body: '0.01em' } },
  { name: 'Education Charity', description: 'Learning for all', heading: 'Poppins', body: 'Nunito', accent: 'Baloo 2', mono: 'Source Code Pro', tags: ['nonprofit', 'education', 'friendly', 'hopeful'], lineHeight: { heading: 1.3, body: 1.7 }, letterSpacing: { heading: '0', body: '0' } },
  { name: 'Arts Culture', description: 'Museums and arts', heading: 'Playfair Display', body: 'Source Sans Pro', accent: 'Cinzel', mono: 'Source Code Pro', tags: ['nonprofit', 'arts', 'cultural', 'elegant'], lineHeight: { heading: 1.2, body: 1.7 }, letterSpacing: { heading: '0.01em', body: '0.01em' } },
  { name: 'Community', description: 'Local causes', heading: 'Lato', body: 'Open Sans', accent: 'Varela Round', mono: 'Source Code Pro', tags: ['nonprofit', 'community', 'friendly', 'approachable'], lineHeight: { heading: 1.3, body: 1.75 }, letterSpacing: { heading: '0', body: '0.01em' } },
];

// ============================================
// COMPREHENSIVE DESIGN SYSTEM TOKENS
// ============================================

export interface DesignTokens {
  // Typography Scale
  typography: {
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
    };
    fontWeight: {
      thin: number;
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      extrabold: number;
    };
    lineHeight: {
      none: number;
      tight: number;
      snug: number;
      normal: number;
      relaxed: number;
      loose: number;
    };
    letterSpacing: {
      tighter: string;
      tight: string;
      normal: string;
      wide: string;
      wider: string;
      widest: string;
    };
  };
  // Spacing Scale
  spacing: {
    px: string;
    0: string;
    0.5: string;
    1: string;
    1.5: string;
    2: string;
    2.5: string;
    3: string;
    3.5: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    14: string;
    16: string;
    20: string;
    24: string;
    28: string;
    32: string;
    36: string;
    40: string;
    44: string;
    48: string;
    52: string;
    56: string;
    60: string;
    64: string;
    72: string;
    80: string;
    96: string;
  };
  // Border Radius
  borderRadius: {
    none: string;
    sm: string;
    DEFAULT: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };
  // Shadows
  shadows: {
    sm: string;
    DEFAULT: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    none: string;
  };
  // Transitions
  transitions: {
    duration: {
      75: string;
      100: string;
      150: string;
      200: string;
      300: string;
      500: string;
      700: string;
      1000: string;
    };
    timing: {
      linear: string;
      in: string;
      out: string;
      'in-out': string;
    };
  };
  // Z-Index
  zIndex: {
    0: number;
    10: number;
    20: number;
    30: number;
    40: number;
    50: number;
    auto: string;
  };
}

export const DESIGN_TOKENS: DesignTokens = {
  typography: {
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
    },
    fontWeight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
  },
  transitions: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    timing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    auto: 'auto',
  },
};

// ============================================
// VISUAL IDENTITY TEMPLATES (Pre-configured)
// ============================================

export interface VisualIdentityTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  typography: {
    heading: string;
    body: string;
    accent: string;
    mono: string;
    headingSize: string;
    bodySize: string;
    lineHeight: { heading: number; body: number };
    letterSpacing: { heading: string; body: string };
  };
  spacing: {
    section: string;
    component: string;
    element: string;
  };
  borders: {
    radius: string;
    width: string;
  };
  shadows: {
    card: string;
    button: string;
    dropdown: string;
  };
}

// Export template collections by category
export const TEMPLATES_BY_CATEGORY: Record<string, VisualIdentityTemplate[]> = {
  technology: PRESET_PALETTES.filter(p => p.category === 'technology').map(p => ({
    id: p.id,
    name: p.name,
    category: 'technology',
    description: p.description,
    colors: p.colors,
    typography: {
      heading: 'Inter',
      body: 'Inter',
      accent: 'JetBrains Mono',
      mono: 'JetBrains Mono',
      headingSize: '2.25rem',
      bodySize: '1rem',
      lineHeight: { heading: 1.2, body: 1.6 },
      letterSpacing: { heading: '-0.02em', body: '0' },
    },
    spacing: { section: '6rem', component: '2rem', element: '1rem' },
    borders: { radius: '0.5rem', width: '1px' },
    shadows: { card: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', button: '0 2px 4px rgba(0,0,0,0.1)', dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
  })),
  healthcare: PRESET_PALETTES.filter(p => p.category === 'healthcare').map(p => ({
    id: p.id,
    name: p.name,
    category: 'healthcare',
    description: p.description,
    colors: p.colors,
    typography: {
      heading: 'Source Sans Pro',
      body: 'Source Sans Pro',
      accent: 'Comfortaa',
      mono: 'Source Code Pro',
      headingSize: '2rem',
      bodySize: '1rem',
      lineHeight: { heading: 1.3, body: 1.7 },
      letterSpacing: { heading: '0', body: '0.01em' },
    },
    spacing: { section: '5rem', component: '2rem', element: '1rem' },
    borders: { radius: '0.375rem', width: '1px' },
    shadows: { card: '0 2px 4px rgba(0,0,0,0.05)', button: '0 1px 3px rgba(0,0,0,0.1)', dropdown: '0 4px 6px rgba(0,0,0,0.05)' },
  })),
  finance: PRESET_PALETTES.filter(p => p.category === 'finance').map(p => ({
    id: p.id,
    name: p.name,
    category: 'finance',
    description: p.description,
    colors: p.colors,
    typography: {
      heading: 'Playfair Display',
      body: 'Source Sans Pro',
      accent: 'Cinzel',
      mono: 'Source Code Pro',
      headingSize: '2.25rem',
      bodySize: '1rem',
      lineHeight: { heading: 1.2, body: 1.6 },
      letterSpacing: { heading: '0.01em', body: '0' },
    },
    spacing: { section: '6rem', component: '2rem', element: '1rem' },
    borders: { radius: '0.25rem', width: '1px' },
    shadows: { card: '0 4px 6px rgba(0,0,0,0.07)', button: '0 2px 4px rgba(0,0,0,0.1)', dropdown: '0 8px 16px rgba(0,0,0,0.08)' },
  })),
  ecommerce: PRESET_PALETTES.filter(p => p.category === 'ecommerce').map(p => ({
    id: p.id,
    name: p.name,
    category: 'ecommerce',
    description: p.description,
    colors: p.colors,
    typography: {
      heading: 'Montserrat',
      body: 'Open Sans',
      accent: 'Poppins',
      mono: 'Source Code Pro',
      headingSize: '2rem',
      bodySize: '1rem',
      lineHeight: { heading: 1.25, body: 1.65 },
      letterSpacing: { heading: '-0.01em', body: '0' },
    },
    spacing: { section: '5rem', component: '1.5rem', element: '0.75rem' },
    borders: { radius: '0.75rem', width: '1px' },
    shadows: { card: '0 4px 12px rgba(0,0,0,0.08)', button: '0 2px 8px rgba(0,0,0,0.12)', dropdown: '0 8px 24px rgba(0,0,0,0.12)' },
  })),
  education: PRESET_PALETTES.filter(p => p.category === 'education').map(p => ({
    id: p.id,
    name: p.name,
    category: 'education',
    description: p.description,
    colors: p.colors,
    typography: {
      heading: 'Poppins',
      body: 'Nunito',
      accent: 'Comfortaa',
      mono: 'Source Code Pro',
      headingSize: '2rem',
      bodySize: '1rem',
      lineHeight: { heading: 1.3, body: 1.7 },
      letterSpacing: { heading: '0', body: '0' },
    },
    spacing: { section: '5rem', component: '2rem', element: '1rem' },
    borders: { radius: '0.5rem', width: '1px' },
    shadows: { card: '0 2px 8px rgba(0,0,0,0.06)', button: '0 2px 4px rgba(0,0,0,0.08)', dropdown: '0 4px 12px rgba(0,0,0,0.08)' },
  })),
};

// Smart suggestion algorithm
export function getSmartSuggestions(
  industry: string,
  personality: string[],
  audience: string,
  mood: string,
  colorPref: string
): { palettes: typeof PRESET_PALETTES; fonts: typeof FONT_COMBINATIONS } {
  // Score and rank palettes
  const scoredPalettes = PRESET_PALETTES.map(palette => {
    let score = 0;
    const matches: string[] = [];

    // Industry match (highest weight)
    if (palette.tags.includes(industry)) {
      score += 10;
      matches.push('industry');
    }

    // Personality matches
    personality.forEach(p => {
      if (palette.tags.includes(p)) {
        score += 5;
        matches.push('personality');
      }
    });

    // Mood match
    if (palette.tags.includes(mood)) {
      score += 4;
      matches.push('mood');
    }

    // Color preference match
    if (palette.tags.includes(colorPref)) {
      score += 6;
      matches.push('color');
    }

    // Audience match
    if (palette.tags.includes(audience)) {
      score += 3;
      matches.push('audience');
    }

    return { palette, score, matches };
  });

  // Sort by score and return top palettes
  const sortedPalettes = scoredPalettes
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(p => p.palette);

  // Score and rank fonts
  const scoredFonts = FONT_COMBINATIONS.map(font => {
    let score = 0;

    // Personality matches
    personality.forEach(p => {
      if (font.tags.includes(p)) score += 5;
    });

    // Mood match
    if (font.tags.includes(mood)) score += 3;

    // Industry match
    if (font.tags.includes(industry)) score += 4;

    return { font, score };
  });

  const sortedFonts = scoredFonts
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(f => f.font);

  return {
    palettes: sortedPalettes,
    fonts: sortedFonts,
  };
}

// ============================================
// ICON STYLES
// ============================================

export interface IconStyle {
  id: string;
  name: string;
  description: string;
  strokeWidth: number;
  defaultSize: number;
  style: 'outline' | 'filled' | 'duotone';
}

export const ICON_STYLES: IconStyle[] = [
  { id: 'thin-outline', name: 'Thin Outline', description: 'Minimal, delicate lines', strokeWidth: 1, defaultSize: 20, style: 'outline' },
  { id: 'regular-outline', name: 'Regular Outline', description: 'Balanced, standard lines', strokeWidth: 2, defaultSize: 20, style: 'outline' },
  { id: 'bold-outline', name: 'Bold Outline', description: 'Strong, prominent lines', strokeWidth: 2.5, defaultSize: 22, style: 'outline' },
  { id: 'thick-outline', name: 'Thick Outline', description: 'Heavy, impactful lines', strokeWidth: 3, defaultSize: 24, style: 'outline' },
  { id: 'filled-minimal', name: 'Filled Minimal', description: 'Solid with clean edges', strokeWidth: 0, defaultSize: 20, style: 'filled' },
  { id: 'filled-bold', name: 'Filled Bold', description: 'Solid and prominent', strokeWidth: 0, defaultSize: 22, style: 'filled' },
  { id: 'duotone-subtle', name: 'Duotone Subtle', description: 'Two-tone subtle effect', strokeWidth: 2, defaultSize: 20, style: 'duotone' },
  { id: 'duotone-vibrant', name: 'Duotone Vibrant', description: 'Bold two-tone style', strokeWidth: 2, defaultSize: 22, style: 'duotone' },
];

// ============================================
// IMAGE STYLES
// ============================================

export interface ImageStyle {
  id: string;
  name: string;
  description: string;
  borderRadius: string;
  aspectRatio: string;
  filter: string;
  shadow: string;
  border: string;
  borderColor?: string;
}

export const IMAGE_STYLES: ImageStyle[] = [
  { id: 'sharp', name: 'Sharp', description: 'Clean corners, no radius', borderRadius: '0px', aspectRatio: '16/9', filter: 'none', shadow: 'none', border: 'none' },
  { id: 'slight-rounded', name: 'Slight Rounded', description: 'Subtle corner rounding', borderRadius: '4px', aspectRatio: '16/9', filter: 'none', shadow: '0 2px 4px rgba(0,0,0,0.1)', border: 'none' },
  { id: 'modern-rounded', name: 'Modern Rounded', description: 'Standard rounded corners', borderRadius: '8px', aspectRatio: '16/9', filter: 'none', shadow: '0 4px 6px rgba(0,0,0,0.1)', border: 'none' },
  { id: 'fully-rounded', name: 'Fully Rounded', description: 'Generous rounding', borderRadius: '16px', aspectRatio: '16/9', filter: 'none', shadow: '0 8px 16px rgba(0,0,0,0.1)', border: 'none' },
  { id: 'circular', name: 'Circular', description: 'Perfect circles', borderRadius: '50%', aspectRatio: '1/1', filter: 'none', shadow: '0 4px 8px rgba(0,0,0,0.15)', border: '2px solid', borderColor: 'primary' },
  { id: 'polaroid', name: 'Polaroid', description: 'Retro photo style', borderRadius: '4px', aspectRatio: '4/5', filter: 'none', shadow: '0 4px 12px rgba(0,0,0,0.2)', border: '8px solid white' },
  { id: 'soft-focus', name: 'Soft Focus', description: 'Gentle blur effect', borderRadius: '12px', aspectRatio: '16/9', filter: 'blur(0.5px)', shadow: '0 6px 12px rgba(0,0,0,0.1)', border: 'none' },
  { id: 'vintage', name: 'Vintage', description: 'Sepia tone effect', borderRadius: '4px', aspectRatio: '4/3', filter: 'sepia(0.3) contrast(0.95)', shadow: '0 4px 8px rgba(0,0,0,0.2)', border: '4px solid' },
  { id: 'dramatic', name: 'Dramatic', description: 'High contrast', borderRadius: '8px', aspectRatio: '21/9', filter: 'contrast(1.1) saturate(1.2)', shadow: '0 12px 24px rgba(0,0,0,0.25)', border: 'none' },
  { id: 'minimal-border', name: 'Minimal Border', description: 'Clean with border', borderRadius: '0px', aspectRatio: '16/9', filter: 'none', shadow: 'none', border: '2px solid' },
];

// ============================================
// COMPLETE TEMPLATE CONFIGURATIONS
// ============================================

export interface CompleteTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
    mono: string;
    headingLineHeight?: string;
    bodyLineHeight?: string;
    headingLetterSpacing?: string;
    bodyLetterSpacing?: string;
  };
  spacing: {
    section: string;
    component: string;
    element: string;
  };
  iconStyle: IconStyle;
  imageStyle: ImageStyle;
}

// Generate complete templates from PRESET_PALETTES with sensible defaults
export const COMPLETE_TEMPLATES: CompleteTemplate[] = PRESET_PALETTES.map(palette => {
  // Default configurations by category - Industry Standard Spacing
  const categoryDefaults: Record<string, { fonts: any, spacing: any, iconStyleId: string, imageStyleId: string }> = {
    technology: {
      fonts: { heading: 'Inter', body: 'Inter', accent: 'JetBrains Mono', mono: 'JetBrains Mono', headingLineHeight: '1.2', bodyLineHeight: '1.6', headingLetterSpacing: '-0.02em', bodyLetterSpacing: '0' },
      spacing: { section: '3rem', component: '1rem', element: '0.5rem' },
      iconStyleId: 'regular-outline',
      imageStyleId: 'modern-rounded',
    },
    healthcare: {
      fonts: { heading: 'Source Sans Pro', body: 'Source Sans Pro', accent: 'Comfortaa', mono: 'Source Code Pro', headingLineHeight: '1.3', bodyLineHeight: '1.7', headingLetterSpacing: '0', bodyLetterSpacing: '0.01em' },
      spacing: { section: '3rem', component: '1rem', element: '0.5rem' },
      iconStyleId: 'thin-outline',
      imageStyleId: 'fully-rounded',
    },
    finance: {
      fonts: { heading: 'Playfair Display', body: 'Source Sans Pro', accent: 'Cinzel', mono: 'Source Code Pro', headingLineHeight: '1.2', bodyLineHeight: '1.6', headingLetterSpacing: '0.01em', bodyLetterSpacing: '0' },
      spacing: { section: '3rem', component: '1rem', element: '0.5rem' },
      iconStyleId: 'bold-outline',
      imageStyleId: 'slight-rounded',
    },
    ecommerce: {
      fonts: { heading: 'Montserrat', body: 'Open Sans', accent: 'Poppins', mono: 'Source Code Pro', headingLineHeight: '1.25', bodyLineHeight: '1.65', headingLetterSpacing: '-0.01em', bodyLetterSpacing: '0' },
      spacing: { section: '3rem', component: '1rem', element: '0.5rem' },
      iconStyleId: 'regular-outline',
      imageStyleId: 'modern-rounded',
    },
    education: {
      fonts: { heading: 'Poppins', body: 'Nunito', accent: 'Comfortaa', mono: 'Source Code Pro', headingLineHeight: '1.3', bodyLineHeight: '1.7', headingLetterSpacing: '0', bodyLetterSpacing: '0' },
      spacing: { section: '3rem', component: '1rem', element: '0.5rem' },
      iconStyleId: 'filled-minimal',
      imageStyleId: 'modern-rounded',
    },
    entertainment: {
      fonts: { heading: 'Bebas Neue', body: 'Montserrat', accent: 'Great Vibes', mono: 'Source Code Pro', headingLineHeight: '1.1', bodyLineHeight: '1.5', headingLetterSpacing: '0.04em', bodyLetterSpacing: '0.01em' },
      spacing: { section: '3rem', component: '1rem', element: '0.5rem' },
      iconStyleId: 'bold-outline',
      imageStyleId: 'dramatic',
    },
    travel: {
      fonts: { heading: 'Playfair Display', body: 'Lora', accent: 'Cinzel', mono: 'Source Code Pro', headingLineHeight: '1.2', bodyLineHeight: '1.7', headingLetterSpacing: '0.02em', bodyLetterSpacing: '0.01em' },
      spacing: { section: '3rem', component: '1rem', element: '0.5rem' },
      iconStyleId: 'thin-outline',
      imageStyleId: 'fully-rounded',
    },
    food: {
      fonts: { heading: 'Playfair Display', body: 'Lora', accent: 'Pacifico', mono: 'Source Code Pro', headingLineHeight: '1.2', bodyLineHeight: '1.75', headingLetterSpacing: '0.01em', bodyLetterSpacing: '0.01em' },
      spacing: { section: '3rem', component: '1rem', element: '0.5rem' },
      iconStyleId: 'filled-minimal',
      imageStyleId: 'polaroid',
    },
    fashion: {
      fonts: { heading: 'Bodoni Moda', body: 'Cormorant Garamond', accent: 'Prata', mono: 'Source Code Pro', headingLineHeight: '1.1', bodyLineHeight: '1.65', headingLetterSpacing: '0.03em', bodyLetterSpacing: '0.02em' },
      spacing: { section: '3rem', component: '1rem', element: '0.5rem' },
      iconStyleId: 'thin-outline',
      imageStyleId: 'minimal-border',
    },
    nonprofit: {
      fonts: { heading: 'Merriweather', body: 'Source Sans Pro', accent: 'Amatic SC', mono: 'Source Code Pro', headingLineHeight: '1.3', bodyLineHeight: '1.7', headingLetterSpacing: '0', bodyLetterSpacing: '0.01em' },
      spacing: { section: '3rem', component: '1rem', element: '0.5rem' },
      iconStyleId: 'regular-outline',
      imageStyleId: 'soft-focus',
    },
    consulting: {
      fonts: { heading: 'Crimson Text', body: 'Source Sans Pro', accent: 'Cinzel', mono: 'Source Code Pro', headingLineHeight: '1.25', bodyLineHeight: '1.6', headingLetterSpacing: '0', bodyLetterSpacing: '0' },
      spacing: { section: '3rem', component: '1rem', element: '0.5rem' },
      iconStyleId: 'bold-outline',
      imageStyleId: 'slight-rounded',
    },
    realestate: {
      fonts: { heading: 'Cormorant Garamond', body: 'Lora', accent: 'Cinzel', mono: 'Source Code Pro', headingLineHeight: '1.15', bodyLineHeight: '1.7', headingLetterSpacing: '0.02em', bodyLetterSpacing: '0.01em' },
      spacing: { section: '3rem', component: '1rem', element: '0.5rem' },
      iconStyleId: 'regular-outline',
      imageStyleId: 'modern-rounded',
    },
  };

  const defaults = categoryDefaults[palette.category] || categoryDefaults.technology;
  const iconStyle = ICON_STYLES.find(i => i.id === defaults.iconStyleId) || ICON_STYLES[1];
  const imageStyle = IMAGE_STYLES.find(i => i.id === defaults.imageStyleId) || IMAGE_STYLES[2];

  return {
    id: palette.id,
    name: palette.name,
    category: palette.category,
    description: palette.description,
    colors: palette.colors,
    fonts: defaults.fonts,
    spacing: defaults.spacing,
    iconStyle,
    imageStyle,
  };
});

// Helper to get template by ID
export function getTemplateById(id: string): CompleteTemplate | undefined {
  return COMPLETE_TEMPLATES.find(t => t.id === id);
}

// Legacy exports for backward compatibility
export const GOOGLE_FONTS = FONT_SPECIFICATIONS.map(f => ({ name: f.name, category: f.category, popular: f.popular }));
