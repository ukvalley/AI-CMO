/**
 * Visual Identity Data Sets
 */

export const INDUSTRIES = [
  { id: 'technology', name: 'Technology', description: 'Software, SaaS, AI, Hardware' },
  { id: 'healthcare', name: 'Healthcare', description: 'Medical, Wellness, Fitness' },
  { id: 'finance', name: 'Finance', description: 'Banking, Insurance, Fintech' },
  { id: 'ecommerce', name: 'E-commerce', description: 'Retail, Marketplace, D2C' },
  { id: 'education', name: 'Education', description: 'E-learning, Courses, Training' },
  { id: 'entertainment', name: 'Entertainment', description: 'Media, Gaming, Streaming' },
  { id: 'travel', name: 'Travel & Hospitality', description: 'Hotels, Tourism, Experiences' },
  { id: 'food', name: 'Food & Beverage', description: 'Restaurants, Food Tech, CPG' },
  { id: 'fashion', name: 'Fashion & Lifestyle', description: 'Apparel, Beauty, Luxury' },
  { id: 'nonprofit', name: 'Non-Profit', description: 'NGO, Social Impact, Charity' },
  { id: 'consulting', name: 'Consulting', description: 'Agency, Advisory, Services' },
  { id: 'realestate', name: 'Real Estate', description: 'Property, Construction, PropTech' },
];

export const BRAND_PERSONALITIES = [
  { id: 'professional', name: 'Professional', description: 'Corporate, Trustworthy, Reliable', keywords: ['trust', 'reliability'] },
  { id: 'innovative', name: 'Innovative', description: 'Cutting-edge, Forward-thinking', keywords: ['innovation', 'technology'] },
  { id: 'friendly', name: 'Friendly', description: 'Approachable, Warm, Casual', keywords: ['warmth', 'community'] },
  { id: 'luxury', name: 'Luxury', description: 'Premium, Exclusive, Sophisticated', keywords: ['elegance', 'exclusivity'] },
  { id: 'playful', name: 'Playful', description: 'Fun, Creative, Energetic', keywords: ['creativity', 'energy'] },
  { id: 'minimal', name: 'Minimal', description: 'Clean, Simple, Modern', keywords: ['simplicity', 'clarity'] },
  { id: 'adventurous', name: 'Adventurous', description: 'Daring, Bold, Exciting', keywords: ['adventure', 'courage'] },
  { id: 'caring', name: 'Caring', description: 'Compassionate, Supportive', keywords: ['care', 'support'] },
];

export const TARGET_AUDIENCES = [
  { id: 'enterprise', name: 'Enterprise/B2B', description: 'Large companies, Decision makers' },
  { id: 'startups', name: 'Startups/SMB', description: 'Small businesses, Founders' },
  { id: 'consumers', name: 'General Consumers', description: 'B2C, Mass market' },
  { id: 'developers', name: 'Developers/Tech', description: 'Technical audience, Engineers' },
  { id: 'creatives', name: 'Creatives', description: 'Designers, Artists, Content creators' },
  { id: 'professionals', name: 'Professionals', description: 'Doctors, Lawyers, Consultants' },
  { id: 'students', name: 'Students/Education', description: 'Learners, Young adults' },
  { id: 'luxury', name: 'Luxury/Affluent', description: 'High net worth individuals' },
];

export const MOOD_OPTIONS = [
  { id: 'modern', name: 'Modern', description: 'Contemporary, Fresh, Current' },
  { id: 'classic', name: 'Classic', description: 'Timeless, Traditional, Established' },
  { id: 'bold', name: 'Bold', description: 'Strong, Impactful, Statement-making' },
  { id: 'subtle', name: 'Subtle', description: 'Soft, Refined, Understated' },
  { id: 'vibrant', name: 'Vibrant', description: 'Energetic, Lively, Colorful' },
  { id: 'calm', name: 'Calm', description: 'Peaceful, Relaxed, Serene' },
  { id: 'edgy', name: 'Edgy', description: 'Alternative, Rebellious, Trendy' },
  { id: 'elegant', name: 'Elegant', description: 'Graceful, Refined, Polished' },
];

export const COLOR_PREFERENCES = [
  { id: 'warm', name: 'Warm Tones', description: 'Reds, Oranges, Yellows' },
  { id: 'cool', name: 'Cool Tones', description: 'Blues, Purples, Greens' },
  { id: 'neutral', name: 'Neutral', description: 'Grays, Beiges, Whites' },
  { id: 'vibrant', name: 'Vibrant/Bold', description: 'High saturation, Neon' },
  { id: 'pastel', name: 'Pastel/Soft', description: 'Light, Muted tones' },
  { id: 'monochrome', name: 'Monochrome', description: 'Single color family' },
  { id: 'earthy', name: 'Earth Tones', description: 'Natural, Organic colors' },
  { id: 'any', name: 'No Preference', description: 'Open to suggestions' },
];

export const PRESET_PALETTES = [
  // Tech
  { id: 'midnight-tech', name: 'Midnight Tech', description: 'Dark mode perfection for tech', tags: ['technology', 'modern', 'developers', 'minimal', 'cool'], colors: { primary: '#C8FF2E', secondary: '#1E293B', accent: '#22D3EE', background: '#0D1117', surface: '#161B22', text: '#E6EDF3', textMuted: '#8B949E', success: '#3FB950', warning: '#D29922', error: '#F85149', info: '#58A6FF' } },
  { id: 'neon-cyber', name: 'Neon Cyberpunk', description: 'High-energy futuristic', tags: ['technology', 'innovative', 'developers', 'vibrant', 'edgy', 'bold'], colors: { primary: '#00F5FF', secondary: '#FF00FF', accent: '#FFFF00', background: '#0D0221', surface: '#1A0B2E', text: '#FFFFFF', textMuted: '#B8B8B8', success: '#00FF9F', warning: '#FFB800', error: '#FF003C', info: '#00F5FF' } },
  { id: 'cloud-blue', name: 'Cloud Blue', description: 'Professional SaaS', tags: ['technology', 'professional', 'enterprise', 'cool', 'modern'], colors: { primary: '#0066CC', secondary: '#4A90E2', accent: '#50E3C2', background: '#F8FAFC', surface: '#FFFFFF', text: '#1E293B', textMuted: '#64748B', success: '#22C55E', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6' } },
  { id: 'deep-purple', name: 'Deep Purple', description: 'Creative AI tech', tags: ['technology', 'innovative', 'creatives', 'cool', 'modern'], colors: { primary: '#7C3AED', secondary: '#1E1B4B', accent: '#22D3EE', background: '#0F0A1E', surface: '#1E1B4B', text: '#FAFAFA', textMuted: '#A78BFA', success: '#34D399', warning: '#FBBF24', error: '#F87171', info: '#60A5FA' } },
  // Healthcare
  { id: 'healing-green', name: 'Healing Green', description: 'Natural wellness', tags: ['healthcare', 'caring', 'consumers', 'earthy', 'calm'], colors: { primary: '#2D6A4F', secondary: '#40916C', accent: '#52B788', background: '#F8FAF9', surface: '#FFFFFF', text: '#1B4332', textMuted: '#52796F', success: '#2D6A4F', warning: '#D4A373', error: '#BC4749', info: '#457B9D' } },
  { id: 'medical-blue', name: 'Medical Blue', description: 'Clean healthcare', tags: ['healthcare', 'professional', 'professionals', 'cool', 'calm'], colors: { primary: '#0066CC', secondary: '#E3F2FD', accent: '#00BCD4', background: '#FFFFFF', surface: '#F5F5F5', text: '#1A237E', textMuted: '#546E7A', success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#2196F3' } },
  // Finance
  { id: 'wall-street', name: 'Wall Street', description: 'Traditional finance', tags: ['finance', 'professional', 'enterprise', 'classic', 'neutral'], colors: { primary: '#1A365D', secondary: '#2C5282', accent: '#38A169', background: '#F7FAFC', surface: '#FFFFFF', text: '#1A202C', textMuted: '#4A5568', success: '#276749', warning: '#C05621', error: '#C53030', info: '#2B6CB0' } },
  { id: 'fintech-gradient', name: 'Fintech Gradient', description: 'Modern financial tech', tags: ['finance', 'innovative', 'startups', 'vibrant', 'modern'], colors: { primary: '#667EEA', secondary: '#764BA2', accent: '#F093FB', background: '#F9FAFB', surface: '#FFFFFF', text: '#1F2937', textMuted: '#6B7280', success: '#10B981', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6' } },
  { id: 'gold-standard', name: 'Gold Standard', description: 'Premium finance', tags: ['finance', 'luxury', 'luxury', 'classic', 'warm'], colors: { primary: '#D4AF37', secondary: '#1C1C1C', accent: '#8B0000', background: '#0A0A0A', surface: '#141414', text: '#F5F5F5', textMuted: '#A0A0A0', success: '#228B22', warning: '#B8860B', error: '#8B0000', info: '#4169E1' } },
  // E-commerce
  { id: 'sunset-shopping', name: 'Sunset Shopping', description: 'Warm retail', tags: ['ecommerce', 'friendly', 'consumers', 'warm', 'vibrant'], colors: { primary: '#FF6B35', secondary: '#F7931E', accent: '#FFD23F', background: '#FFF8F0', surface: '#FFFFFF', text: '#2D3748', textMuted: '#718096', success: '#48BB78', warning: '#ED8936', error: '#F56565', info: '#4299E1' } },
  { id: 'chic-boutique', name: 'Chic Boutique', description: 'Fashion e-commerce', tags: ['fashion', 'luxury', 'consumers', 'elegant', 'pastel'], colors: { primary: '#FF6B9D', secondary: '#C44569', accent: '#F8B500', background: '#FFF5F7', surface: '#FFFFFF', text: '#2D3436', textMuted: '#636E72', success: '#00B894', warning: '#FDCB6E', error: '#D63031', info: '#74B9FF' } },
  // Food
  { id: 'organic-kitchen', name: 'Organic Kitchen', description: 'Fresh food', tags: ['food', 'caring', 'consumers', 'earthy', 'warm'], colors: { primary: '#E07A5F', secondary: '#F2CC8F', accent: '#81B29A', background: '#F4F1DE', surface: '#FFFFFF', text: '#3D405B', textMuted: '#6B7280', success: '#81B29A', warning: '#F2CC8F', error: '#E07A5F', info: '#3D405B' } },
  { id: 'coffee-house', name: 'Coffee House', description: 'Cozy café', tags: ['food', 'friendly', 'consumers', 'warm', 'classic'], colors: { primary: '#6F4E37', secondary: '#D2691E', accent: '#DEB887', background: '#FFF8E7', surface: '#FFFFFF', text: '#3E2723', textMuted: '#795548', success: '#558B2F', warning: '#F9A825', error: '#C62828', info: '#5D4037' } },
  // Education
  { id: 'academic-blue', name: 'Academic Blue', description: 'Educational institutions', tags: ['education', 'professional', 'students', 'cool', 'classic'], colors: { primary: '#003366', secondary: '#004B8D', accent: '#FFD700', background: '#F5F5F5', surface: '#FFFFFF', text: '#1A1A1A', textMuted: '#4A4A4A', success: '#28A745', warning: '#FFC107', error: '#DC3545', info: '#17A2B8' } },
  { id: 'creative-learning', name: 'Creative Learning', description: 'Modern ed-tech', tags: ['education', 'playful', 'students', 'vibrant', 'modern'], colors: { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D', background: '#F7FFF7', surface: '#FFFFFF', text: '#2C3E50', textMuted: '#5D6D7E', success: '#27AE60', warning: '#F39C12', error: '#E74C3C', info: '#3498DB' } },
  // Entertainment
  { id: 'midnight-cinema', name: 'Midnight Cinema', description: 'Entertainment streaming', tags: ['entertainment', 'bold', 'consumers', 'dark', 'vibrant'], colors: { primary: '#E50914', secondary: '#221F1F', accent: '#FFD700', background: '#000000', surface: '#141414', text: '#FFFFFF', textMuted: '#A3A3A3', success: '#46D369', warning: '#E87C03', error: '#E50914', info: '#54B9C0' } },
  { id: 'gaming-rgb', name: 'Gaming RGB', description: 'Gaming aesthetic', tags: ['entertainment', 'playful', 'developers', 'vibrant', 'bold'], colors: { primary: '#FF0055', secondary: '#00FF99', accent: '#00CCFF', background: '#0A0A0F', surface: '#141420', text: '#FFFFFF', textMuted: '#8A8AA0', success: '#00FF99', warning: '#FFAA00', error: '#FF0055', info: '#00CCFF' } },
  // Luxury
  { id: 'royal-black', name: 'Royal Black', description: 'High-end luxury', tags: ['luxury', 'luxury', 'luxury', 'elegant', 'monochrome'], colors: { primary: '#D4AF37', secondary: '#000000', accent: '#8B0000', background: '#0A0A0A', surface: '#141414', text: '#F5F5F5', textMuted: '#A0A0A0', success: '#228B22', warning: '#B8860B', error: '#8B0000', info: '#4169E1' } },
  { id: 'rose-gold', name: 'Rose Gold', description: 'Feminine luxury', tags: ['fashion', 'luxury', 'consumers', 'elegant', 'pastel'], colors: { primary: '#E8B4B8', secondary: '#B76E79', accent: '#F4E1D2', background: '#FFF5F5', surface: '#FFFFFF', text: '#4A4A4A', textMuted: '#8B6B6B', success: '#A8E6CF', warning: '#FFD3B6', error: '#FF8B94', info: '#B4A7D6' } },
  // Non-profit
  { id: 'hope-green', name: 'Hope Green', description: 'Environmental causes', tags: ['nonprofit', 'caring', 'consumers', 'earthy', 'warm'], colors: { primary: '#228B22', secondary: '#2E8B57', accent: '#FFD700', background: '#F0FFF0', surface: '#FFFFFF', text: '#1A472A', textMuted: '#2D5A3D', success: '#2E8B57', warning: '#DAA520', error: '#CD5C5C', info: '#4682B4' } },
  { id: 'unity-diversity', name: 'Unity Diversity', description: 'Social impact', tags: ['nonprofit', 'caring', 'consumers', 'vibrant', 'warm'], colors: { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFD93D', background: '#FAFAFA', surface: '#FFFFFF', text: '#2C3E50', textMuted: '#5D6D7E', success: '#6BCB77', warning: '#FFD93D', error: '#FF6B6B', info: '#4D96FF' } },
  // Additional
  { id: 'nordic-winter', name: 'Nordic Winter', description: 'Scandinavian minimalism', tags: ['technology', 'minimal', 'consumers', 'cool', 'calm'], colors: { primary: '#5D8AA8', secondary: '#B0C4DE', accent: '#FF6B6B', background: '#F0F4F8', surface: '#FFFFFF', text: '#2C3E50', textMuted: '#718096', success: '#48BB78', warning: '#ED8936', error: '#F56565', info: '#4299E1' } },
  { id: 'desert-dusk', name: 'Desert Dusk', description: 'Southwestern aesthetic', tags: ['travel', 'friendly', 'consumers', 'warm', 'earthy'], colors: { primary: '#E07A5F', secondary: '#3D405B', accent: '#81B29A', background: '#F4F1DE', surface: '#FFFFFF', text: '#3D405B', textMuted: '#6B7280', success: '#81B29A', warning: '#F2CC8F', error: '#E07A5F', info: '#3D405B' } },
  { id: 'tokyo-night', name: 'Tokyo Night', description: 'Japanese urban', tags: ['entertainment', 'modern', 'consumers', 'cool', 'edgy'], colors: { primary: '#FF2E63', secondary: '#252A34', accent: '#08D9D6', background: '#1A1A2E', surface: '#252A34', text: '#EAEAEA', textMuted: '#8E8E8E', success: '#08D9D6', warning: '#FFD369', error: '#FF2E63', info: '#533483' } },
];

export const GOOGLE_FONTS = [
  // Popular Sans-serif
  { name: 'Inter', category: 'sans-serif', popular: true },
  { name: 'Roboto', category: 'sans-serif', popular: true },
  { name: 'Poppins', category: 'sans-serif', popular: true },
  { name: 'Montserrat', category: 'sans-serif', popular: true },
  { name: 'Open Sans', category: 'sans-serif', popular: true },
  { name: 'Lato', category: 'sans-serif', popular: true },
  { name: 'Nunito', category: 'sans-serif', popular: true },
  { name: 'Raleway', category: 'sans-serif', popular: true },
  { name: 'Work Sans', category: 'sans-serif', popular: true },
  { name: 'DM Sans', category: 'sans-serif', popular: true },
  { name: 'Source Sans Pro', category: 'sans-serif', popular: true },
  { name: 'Ubuntu', category: 'sans-serif', popular: true },
  { name: 'Rubik', category: 'sans-serif', popular: true },
  { name: 'IBM Plex Sans', category: 'sans-serif', popular: true },
  // More Sans-serif
  { name: 'Oxygen', category: 'sans-serif', popular: false },
  { name: 'Cabin', category: 'sans-serif', popular: false },
  { name: 'PT Sans', category: 'sans-serif', popular: false },
  { name: 'Karla', category: 'sans-serif', popular: false },
  { name: 'Heebo', category: 'sans-serif', popular: false },
  { name: 'Manrope', category: 'sans-serif', popular: false },
  { name: 'Space Grotesk', category: 'sans-serif', popular: false },
  { name: 'Sora', category: 'sans-serif', popular: false },
  { name: 'Outfit', category: 'sans-serif', popular: false },
  { name: 'Plus Jakarta Sans', category: 'sans-serif', popular: false },
  // Serif
  { name: 'Playfair Display', category: 'serif', popular: true },
  { name: 'Merriweather', category: 'serif', popular: true },
  { name: 'Libre Baskerville', category: 'serif', popular: true },
  { name: 'Cormorant Garamond', category: 'serif', popular: false },
  { name: 'Crimson Text', category: 'serif', popular: false },
  { name: 'EB Garamond', category: 'serif', popular: false },
  { name: 'Lora', category: 'serif', popular: false },
  { name: 'Spectral', category: 'serif', popular: false },
  { name: 'Frank Ruhl Libre', category: 'serif', popular: false },
  { name: 'Literata', category: 'serif', popular: false },
  { name: 'Quattrocento', category: 'serif', popular: false },
  { name: 'Unna', category: 'serif', popular: false },
  { name: 'Marcellus', category: 'serif', popular: false },
  { name: 'Oranienbaum', category: 'serif', popular: false },
  { name: 'Fraunces', category: 'serif', popular: false },
  { name: 'Vollkorn', category: 'serif', popular: false },
  { name: 'Adamina', category: 'serif', popular: false },
  { name: 'Junge', category: 'serif', popular: false },
  { name: 'Prata', category: 'serif', popular: false },
  { name: 'Taviraj', category: 'serif', popular: false },
  { name: 'Bodoni Moda', category: 'serif', popular: false },
  // Monospace
  { name: 'Source Code Pro', category: 'monospace', popular: true },
  { name: 'JetBrains Mono', category: 'monospace', popular: true },
  { name: 'Fira Code', category: 'monospace', popular: true },
  { name: 'IBM Plex Mono', category: 'monospace', popular: true },
  { name: 'DM Mono', category: 'monospace', popular: false },
  { name: 'Space Mono', category: 'monospace', popular: false },
  { name: 'Roboto Mono', category: 'monospace', popular: false },
  { name: 'Ubuntu Mono', category: 'monospace', popular: false },
  { name: 'Inconsolata', category: 'monospace', popular: false },
  { name: 'Anonymous Pro', category: 'monospace', popular: false },
  { name: 'PT Mono', category: 'monospace', popular: false },
  { name: 'Cousine', category: 'monospace', popular: false },
  { name: 'Oxygen Mono', category: 'monospace', popular: false },
  { name: 'Victor Mono', category: 'monospace', popular: false },
  // Display
  { name: 'Bebas Neue', category: 'display', popular: true },
  { name: 'Righteous', category: 'display', popular: false },
  { name: 'Comfortaa', category: 'display', popular: false },
  { name: 'Fredoka One', category: 'display', popular: false },
  { name: 'Abril Fatface', category: 'display', popular: false },
  { name: 'Limelight', category: 'display', popular: false },
  { name: 'Poiret One', category: 'display', popular: false },
  { name: 'Yeseva One', category: 'display', popular: false },
  { name: 'Cinzel', category: 'display', popular: false },
  { name: 'Amatic SC', category: 'display', popular: false },
  { name: 'Satisfy', category: 'display', popular: false },
  { name: 'Great Vibes', category: 'display', popular: false },
  { name: 'Dancing Script', category: 'display', popular: false },
  { name: 'Pacifico', category: 'display', popular: false },
  { name: 'Lobster', category: 'display', popular: false },
  { name: 'Bangers', category: 'display', popular: false },
  { name: 'Fredoka', category: 'display', popular: false },
  { name: 'Varela Round', category: 'display', popular: false },
  { name: 'Baloo 2', category: 'display', popular: false },
  { name: 'Quicksand', category: 'display', popular: false },
  { name: 'Josefin Sans', category: 'display', popular: false },
  { name: 'Exo 2', category: 'display', popular: false },
  { name: 'Teko', category: 'display', popular: false },
  { name: 'Rajdhani', category: 'display', popular: false },
  { name: 'Orbitron', category: 'display', popular: false },
  { name: 'Audiowide', category: 'display', popular: false },
  { name: 'Monoton', category: 'display', popular: false },
  { name: 'Press Start 2P', category: 'display', popular: false },
  { name: 'Bungee', category: 'display', popular: false },
  { name: 'Titan One', category: 'display', popular: false },
  { name: 'Shrikhand', category: 'display', popular: false },
  { name: 'Rye', category: 'display', popular: false },
];

export const FONT_COMBINATIONS = [
  { name: 'Modern Tech', description: 'Clean and professional', heading: 'Inter', body: 'Inter', accent: 'JetBrains Mono', tags: ['technology', 'professional', 'modern'] },
  { name: 'Luxury Editorial', description: 'Sophisticated luxury', heading: 'Playfair Display', body: 'Lora', accent: 'Cinzel', tags: ['luxury', 'elegant', 'classic'] },
  { name: 'Friendly Startup', description: 'Approachable and modern', heading: 'Poppins', body: 'Nunito', accent: 'Comfortaa', tags: ['friendly', 'modern', 'playful'] },
  { name: 'Corporate Trust', description: 'Established and reliable', heading: 'Merriweather', body: 'Source Sans Pro', accent: 'Cinzel', tags: ['professional', 'classic', 'trustworthy'] },
  { name: 'Creative Studio', description: 'Artistic and expressive', heading: 'Montserrat', body: 'Open Sans', accent: 'Great Vibes', tags: ['creative', 'modern', 'playful'] },
  { name: 'Minimal Swiss', description: 'Clean minimal aesthetic', heading: 'DM Sans', body: 'Inter', accent: 'Space Grotesk', tags: ['minimal', 'modern', 'professional'] },
  { name: 'Gaming Energy', description: 'Bold and dynamic', heading: 'Orbitron', body: 'Rajdhani', accent: 'Press Start 2P', tags: ['gaming', 'bold', 'energetic'] },
  { name: 'Organic Natural', description: 'Warm and earthy', heading: 'Vollkorn', body: 'Crimson Text', accent: 'Cinzel', tags: ['natural', 'warm', 'classic'] },
];
