/**
 * UK English Spelling Utilities
 *
 * Helper functions to ensure British English spelling is used consistently.
 * Based on the Defect Prevention Guide standards.
 */

// ============================================
// UK ENGLISH WORD MAPPINGS
// ============================================

const usToUkSpelling: Record<string, string> = {
  // Organization/Colour group
  organization: 'organisation',
  organizations: 'organisations',
  organizational: 'organisational',
  organize: 'organise',
  organizes: 'organises',
  organized: 'organised',
  organizing: 'organising',
  organizer: 'organiser',
  organizers: 'organisers',
  color: 'colour',
  colors: 'colours',
  favorite: 'favourite',
  favorites: 'favourites',
  favorited: 'favourited',
  behavior: 'behaviour',
  behaviors: 'behaviours',
  behavioral: 'behavioural',
  humor: 'humour',
  humorous: 'humourous',

  // Center/Metre group
  center: 'centre',
  centers: 'centres',
  centered: 'centred',
  centering: 'centring',

  // Ize/Ise group
  authorize: 'authorise',
  authorizes: 'authorises',
  authorized: 'authorised',
  authorization: 'authorisation',
  authorize: 'authorise',
  customize: 'customise',
  customizes: 'customises',
  customized: 'customised',
  customization: 'customisation',
  optimize: 'optimise',
  optimizes: 'optimises',
  optimized: 'optimised',
  optimization: 'optimisation',
  analyze: 'analyse',
  analyzes: 'analyses',
  analyzed: 'analysed',
  analysis: 'analysis', // Same in both
  initialize: 'initialise',
  initializes: 'initialises',
  initialized: 'initialised',
  initialization: 'initialisation',

  // L/LL group
  canceled: 'cancelled',
  canceling: 'cancelling',
  cancellation: 'cancellation',
  traveler: 'traveller',
  travelers: 'travellers',
  traveling: 'travelling',

  // Other common words
  license: 'licence', // noun only, verb is 'license' in both
  practice: 'practise', // verb, noun is 'practice' in both
  program: 'programme', // except computing
  programs: 'programmes',
  catalog: 'catalogue',
  catalogs: 'catalogues',
  dialog: 'dialogue',
  dialogs: 'dialogues',
  check: 'cheque', // for payments, 'check' is still used for verification
  checks: 'cheques',
  gray: 'grey',
  plow: 'plough',
  mustache: 'moustache',
  specialty: 'speciality',
  specialties: 'specialities',
  skeptic: 'sceptic',
  skepticism: 'scepticism',
  analog: 'analogue',
  analogs: 'analogues',
  curb: 'kerb', // for edges of roads
  story: 'storey', // for building floors
  stories: 'storeys',
  tire: 'tyre', // for rubber on wheels
  tires: 'tyres',
  whiskey: 'whisky',
};

// Words that are the same in both (for reference)
const sameInBoth = [
  'program', // when referring to computer programs
  'software',
  'app',
  'application',
  'code',
  'coding',
  'data',
  'online',
  'email',
  'internet',
  'website',
  'web',
  'digital',
  'tech',
  'technology',
];

// ============================================
// SPELLING CHECKER FUNCTIONS
// ============================================

/**
 * Convert US English spelling to UK English
 * @param text - Text to convert
 * @returns UK English spelling
 */
export function toUkSpelling(text: string): string {
  let ukText = text;

  // Replace whole words only (case-insensitive)
  for (const [usWord, ukWord] of Object.entries(usToUkSpelling)) {
    const regex = new RegExp(`\\b${usWord}\\b`, 'gi');
    ukText = ukText.replace(regex, (match) => {
      // Preserve original case
      if (match === match.toUpperCase()) {
        return ukWord.toUpperCase();
      } else if (match === match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()) {
        return ukWord.charAt(0).toUpperCase() + ukWord.slice(1).toLowerCase();
      }
      return ukWord;
    });
  }

  return ukText;
}

/**
 * Check if a word is US English spelling
 * @param word - Word to check
 * @returns True if US spelling detected
 */
export function isUsSpelling(word: string): boolean {
  const lowerWord = word.toLowerCase();
  return lowerWord in usToUkSpelling;
}

/**
 * Get UK English version of a word
 * @param word - Word to convert
 * @returns UK English version
 */
export function getUkSpelling(word: string): string {
  const lowerWord = word.toLowerCase();
  return usToUkSpelling[lowerWord] || word;
}

/**
 * Common UI labels in UK English
 * Use these constants to ensure consistency
 */
export const UILabels = {
  // Form labels
  emailId: 'Email ID',
  contactNumber: 'Contact Number',
  postalCode: 'Postal Code',
  fullName: 'Full Name',
  firstName: 'First Name',
  lastName: 'Last Name',

  // Table columns
  srNo: 'SR. No.',
  actions: 'Actions',
  action: 'Action',
  status: 'Status',

  // Buttons
  logIn: 'Log In',
  logOut: 'Log Out',
  save: 'Save',
  update: 'Update',
  cancel: 'Cancel',
  delete: 'Delete',
  confirm: 'Confirm',
  submit: 'Submit',

  // Messages
  formSubmitted: 'Form submitted successfully.',
  enquirySubmitted: 'Enquiry submitted successfully.',
  recordSaved: 'Record saved successfully.',
  recordUpdated: 'Record updated successfully.',
  recordDeleted: 'Record deleted successfully.',

  // Errors
  fieldRequired: (fieldName: string) => `${fieldName} is required.`,
  invalidEmail: 'Please enter a valid Email ID.',
  invalidContactNumber: 'Please enter a valid Contact Number.',
} as const;

/**
 * Validation message formatter (ensures full stop at end)
 * @param message - Message to format
 * @returns Message with full stop
 */
export function formatMessage(message: string): string {
  if (!message) return message;
  const trimmed = message.trim();
  if (trimmed.endsWith('.') || trimmed.endsWith('!') || trimmed.endsWith('?')) {
    return trimmed;
  }
  return `${trimmed}.`;
}

/**
 * Format currency with proper formatting
 * - No space between symbol and value
 * - Comma separators for thousands
 * @param value - Numeric value
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format date in UK format (DD/MM/YYYY)
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format time in 12-hour format with uppercase AM/PM
 * @param date - Date to format
 * @returns Formatted time string
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(/am|pm/i, (match) => match.toUpperCase());
}
