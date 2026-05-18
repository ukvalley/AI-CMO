export type NewsletterTemplateId =
  | 'promotional'
  | 'educational'
  | 'engagement'
  | 'company-update'
  | 'ai';

export interface TemplateSection {
  type: 'heading' | 'subheading' | 'paragraph' | 'list' | 'quote' | 'cta' | 'image';
  label: string;
  description: string;
  required: boolean;
  order: number;
}

export interface NewsletterTemplate {
  id: NewsletterTemplateId;
  name: string;
  description: string;
  contentTypes: string[];
  subjectPatterns: string[];
  sections: TemplateSection[];
  ctaStyle: string;
  urgencyBonus?: string;
}

export const NEWSLETTER_TEMPLATES: Record<NewsletterTemplateId, NewsletterTemplate> = {
  promotional: {
    id: 'promotional',
    name: 'Promotional Newsletter',
    description: 'Sales-focused newsletter with offers, featured products, urgency CTAs, and limited-time deals.',
    contentTypes: ['promotional'],
    subjectPatterns: [
      '🎉 Limited Time Offer — Save Big Today!',
      '🚀 Exclusive Deal Just for You',
      'Don\'t Miss Our Biggest Sale of the Month',
      'Special Discount Inside 🎁',
    ],
    sections: [
      { type: 'heading', label: 'Header — Newsletter Title & Tagline', description: 'Newsletter title with a bold promotional tagline highlighting the main offer.', required: true, order: 1 },
      { type: 'paragraph', label: 'Welcome / Offer Intro', description: 'Short paragraph welcoming the reader and introducing the exclusive promotion or offer.', required: true, order: 2 },
      { type: 'subheading', label: 'Highlight Block — Featured Offer', description: 'Bold subheading showcasing the key offer (e.g. "Up to XX% OFF", "Free Shipping", "Buy 1 Get 1 Free").', required: true, order: 3 },
      { type: 'list', label: 'Featured Products / Services', description: 'List 2-4 featured products or services with brief descriptions and key benefits.', required: true, order: 4 },
      { type: 'cta', label: 'Primary CTA — Shop Now / Claim Offer', description: 'A bold, urgency-driven call to action button text (e.g. "Shop Now & Save Big", "Claim Your Offer").', required: true, order: 5 },
      { type: 'paragraph', label: 'Urgency Section', description: 'A short paragraph creating urgency — mention expiration date, limited stock, or exclusive member rewards.', required: false, order: 6 },
      { type: 'paragraph', label: 'Closing & Thank You', description: 'Thank the reader for choosing the brand and reiterate the offer deadline.', required: true, order: 7 },
    ],
    ctaStyle: 'Bold, action-oriented, urgency-driven (e.g. "Claim Offer", "Shop Now — Ends Friday", "Get Discount")',
    urgencyBonus: 'Include a sense of urgency: mention offer expiration date, limited availability, or exclusive member-only access.',
  },

  educational: {
    id: 'educational',
    name: 'Educational Newsletter',
    description: 'Knowledge-focused newsletter with tips, guides, learning resources, and how-to content.',
    contentTypes: ['educational', 'case-study'],
    subjectPatterns: [
      '📚 Learn Something New This Week',
      '5 Tips to Improve Your Skills',
      'Beginner\'s Guide to [Topic]',
      'Weekly Learning Digest 💡',
    ],
    sections: [
      { type: 'heading', label: 'Header — Newsletter Title & Issue', description: 'Newsletter title with issue number and month/year.', required: true, order: 1 },
      { type: 'paragraph', label: 'Welcome / Topic Introduction', description: 'Short paragraph introducing this week\'s educational topic and why it matters.', required: true, order: 2 },
      { type: 'subheading', label: 'Main Topic Heading', description: 'Clear heading naming the main topic being covered (e.g. "Today\'s Topic: [Topic Name]").', required: true, order: 3 },
      { type: 'paragraph', label: 'Main Topic Explanation', description: 'A well-structured explanation of the topic with key insights and takeaways.', required: true, order: 4 },
      { type: 'list', label: 'Tips & Insights', description: 'Numbered or bulleted list of 3-5 practical tips, insights, or actionable takeaways.', required: true, order: 5 },
      { type: 'quote', label: 'Highlight / Quick Learning Tip', description: 'A memorable quote or quick learning tip readers can apply immediately.', required: false, order: 6 },
      { type: 'list', label: 'Recommended Resources', description: 'List of 3-4 recommended resources: blog articles, videos, free tools, or courses.', required: false, order: 7 },
      { type: 'cta', label: 'CTA — Start Learning', description: 'Encourage deeper engagement (e.g. "Read More", "Watch Now", "Join Course").', required: true, order: 8 },
      { type: 'paragraph', label: 'Closing & Encouragement', description: 'Encourage the reader to keep learning and growing. Sign off with brand/team name.', required: true, order: 9 },
    ],
    ctaStyle: 'Value-driven, learning-focused (e.g. "Read Full Guide", "Watch Now", "Start Learning Today")',
  },

  engagement: {
    id: 'engagement',
    name: 'Engagement Newsletter',
    description: 'Community-focused newsletter with discussions, polls, surveys, member spotlights, and feedback requests.',
    contentTypes: ['community', 'curated'],
    subjectPatterns: [
      'We Want to Hear From You ❤️',
      'Tell Us Your Thoughts',
      'Your Feedback Matters',
      'Join the Conversation Today',
    ],
    sections: [
      { type: 'heading', label: 'Header — Community Newsletter Title', description: 'Community newsletter title with issue number and month/year.', required: true, order: 1 },
      { type: 'paragraph', label: 'Welcome / Connection Intro', description: 'Warm opening paragraph inviting readers to connect and explaining how their feedback helps the community grow.', required: true, order: 2 },
      { type: 'subheading', label: 'Community Discussion Question', description: 'Pose an engaging question related to your topic or business to spark conversation.', required: true, order: 3 },
      { type: 'paragraph', label: 'Discussion Context', description: 'Short paragraph providing context or background for the discussion question.', required: true, order: 4 },
      { type: 'list', label: 'Poll / Survey Options', description: 'Present 3-4 poll/survey options for readers to vote on (e.g. content preferences, feature requests).', required: false, order: 5 },
      { type: 'quote', label: 'Community Spotlight', description: 'Feature a customer story, user feedback highlight, or community achievement.', required: false, order: 6 },
      { type: 'cta', label: 'CTA — Share Your Feedback', description: 'Encourage participation (e.g. "Reply Now", "Take Survey", "Join Discussion").', required: true, order: 7 },
      { type: 'paragraph', label: 'Bonus / Rewards Section', description: 'Mention any rewards, giveaways, or recognition for community participation.', required: false, order: 8 },
      { type: 'paragraph', label: 'Closing & Thank You', description: 'Thank readers for being part of the community. Sign off warmly.', required: true, order: 9 },
    ],
    ctaStyle: 'Conversational, community-driven (e.g. "Reply Now", "Take Survey", "Join the Discussion")',
  },

  'company-update': {
    id: 'company-update',
    name: 'Company Update Newsletter',
    description: 'Professional newsletter sharing company news, team achievements, milestones, partnerships, and upcoming events.',
    contentTypes: ['product-update', 'founder-letter', 'industry-news'],
    subjectPatterns: [
      '🚀 Company Updates You Should Know',
      'This Month\'s Business Highlights',
      'Exciting News from Our Team',
      'New Features & Announcements',
    ],
    sections: [
      { type: 'heading', label: 'Header — Company Update Title', description: 'Company newsletter title with issue number and month/year.', required: true, order: 1 },
      { type: 'paragraph', label: 'Welcome / Month Overview', description: 'Short paragraph summarizing what\'s new this month and setting the tone for the update.', required: true, order: 2 },
      { type: 'subheading', label: 'Business Updates Heading', description: 'Section heading for key business updates.', required: true, order: 3 },
      { type: 'list', label: 'Business Updates', description: 'List 3-5 key business updates: product launches, team achievements, growth milestones, new partnerships.', required: true, order: 4 },
      { type: 'paragraph', label: 'Major Announcement Detail', description: 'An expanded paragraph about the most important company achievement or update.', required: false, order: 5 },
      { type: 'subheading', label: 'Team Spotlight', description: 'Highlight a team member, success story, or behind-the-scenes look.', required: false, order: 6 },
      { type: 'paragraph', label: 'Team Spotlight Content', description: 'Brief story or introduction about the featured team member or team achievement.', required: false, order: 7 },
      { type: 'cta', label: 'CTA — Explore Updates', description: 'Encourage exploration (e.g. "Visit Website", "Learn More", "Contact Us").', required: true, order: 8 },
      { type: 'list', label: 'Upcoming Events', description: 'List upcoming events, webinars, or workshops with dates and format (online/offline).', required: false, order: 9 },
      { type: 'paragraph', label: 'Closing & Thank You', description: 'Thank readers for their support. Sign off with company name.', required: true, order: 10 },
    ],
    ctaStyle: 'Professional, informative (e.g. "Visit Website", "Learn More", "Contact Us")',
  },

  ai: {
    id: 'ai',
    name: 'AI Newsletter',
    description: 'AI-focused newsletter covering the latest AI trends, tools, productivity tips, and industry innovations.',
    contentTypes: ['ai'],
    subjectPatterns: [
      '🚀 Latest AI Trends & Tools This Week',
      'AI Innovations You Need to Know',
      'Future of AI — Weekly Insights',
      'Boost Productivity with AI Tools',
    ],
    sections: [
      { type: 'heading', label: 'Header — AI Newsletter Title', description: 'AI newsletter title with issue number and month/year.', required: true, order: 1 },
      { type: 'paragraph', label: 'Welcome / AI Landscape Intro', description: 'Opening paragraph about staying updated with AI news, tools, and productivity tips.', required: true, order: 2 },
      { type: 'subheading', label: 'Featured AI Story Heading', description: 'Bold heading for the main AI trend or innovation story.', required: true, order: 3 },
      { type: 'paragraph', label: 'Featured AI Story', description: 'A concise paragraph about a major AI trend, innovation, or breaking news.', required: true, order: 4 },
      { type: 'list', label: 'AI Tips & Insights', description: 'List of 3-5 AI tips: best tools this week, productivity hacks, automation ideas.', required: true, order: 5 },
      { type: 'quote', label: 'Tool of the Week Spotlight', description: 'Feature one useful AI tool with a brief description and why it matters.', required: false, order: 6 },
      { type: 'cta', label: 'CTA — Try AI Tools', description: 'Encourage action (e.g. "Explore Tools", "Read More", "Join Community").', required: true, order: 7 },
      { type: 'list', label: 'Industry Updates', description: 'Brief list of AI startup news, new apps, market trends, or notable developments.', required: false, order: 8 },
      { type: 'paragraph', label: 'Closing & Thank You', description: 'Thank readers and sign off. Encourage continued exploration of AI.', required: true, order: 9 },
    ],
    ctaStyle: 'Tech-forward, discovery-driven (e.g. "Explore AI Tools", "Try It Now", "Join the AI Community")',
  },
};

export function getTemplateForContentType(contentType: string): NewsletterTemplate {
  for (const template of Object.values(NEWSLETTER_TEMPLATES)) {
    if (template.contentTypes.includes(contentType)) {
      return template;
    }
  }
  return NEWSLETTER_TEMPLATES.educational;
}

export function buildTemplatePromptGuidance(template: NewsletterTemplate): string {
  const sectionLines = template.sections
    .filter(s => s.required)
    .map((s, i) => `${i + 1}. [${s.type}] ${s.label} — ${s.description}`)
    .join('\n');

  const optionalLines = template.sections
    .filter(s => !s.required)
    .map((s, i) => `${i + 1}. [${s.type}] ${s.label} — ${s.description}`)
    .join('\n');

  const subjectExamples = template.subjectPatterns.slice(0, 2).join('" or "');

  let guidance = `TEMPLATE STRUCTURE for "${template.name}":
Subject line style examples: "${subjectExamples}"

You MUST follow this section structure. Required sections:
${sectionLines}`;

  if (optionalLines) {
    guidance += `\n\nOptional sections (include when relevant):\n${optionalLines}`;
  }

  guidance += `\n\nCTA Style: ${template.ctaStyle}`;

  if (template.urgencyBonus) {
    guidance += `\n\n${template.urgencyBonus}`;
  }

  return guidance;
}