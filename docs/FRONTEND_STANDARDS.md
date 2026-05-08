# Frontend Development Standards

**Based on:** Common Defect Prevention Guide  
**Applies to:** Mengo Frontend (Next.js + React + TypeScript)

---

## Quick Reference

### Field Labels (MUST USE)

```tsx
// ✅ CORRECT
<Input label="Email ID" />
<Input label="Contact Number" />
<Input label="Postal Code" />

// ❌ INCORRECT
<Input label="Email" />
<Input label="Email Address" />
<Input label="Phone Number" />
<Input label="Mobile" />
<Input label="PIN" />
```

### Authentication Labels

```tsx
// ✅ CORRECT - Two words
<Button>Log In</Button>
<Button>Log Out</Button>

// ❌ INCORRECT
<Button>Login</Button>
<Button>Logout</Button>
<Button>Signin</Button>
```

### Required Fields

```tsx
// ✅ CORRECT - Red asterisk, no space
<Input label="Full Name" required />
// Renders: Full Name*

// ❌ INCORRECT
<Input label="Full Name *" />  // Space before asterisk
```

### Error Messages

```tsx
// ✅ CORRECT - Field-specific, ends with full stop
error = "Full Name is required."
error = "Please enter a valid Email ID."

// ❌ INCORRECT
error = "This field is required"      // Generic, no full stop
error = "Name is required"            // Inconsistent with label
error = "Invalid input"               // No full stop
```

### Punctuation

```tsx
// ✅ CORRECT - No space before colon
"Name: Komal"
"Status: Active"

// ❌ INCORRECT
"Name : Komal"   // Space before colon
"Status : Active"
```

---

## Using the Standards in Code

### 1. Import Standards Utilities

```tsx
import { UILabels, formatMessage, formatCurrency } from '@/utils/spelling';
```

### 2. Use UILabels Constants

```tsx
// ✅ Use constants from UILabels
<Input label={UILabels.emailId} required />
<Input label={UILabels.contactNumber} required />
<Input label={UILabels.postalCode} />

<Button>{UILabels.logIn}</Button>
<Button>{UILabels.logOut}</Button>
```

### 3. Format Messages with Full Stops

```tsx
import { formatMessage } from '@/utils/spelling';

// ✅ Always end messages with full stop
const successMessage = formatMessage('Record saved successfully');
// Returns: "Record saved successfully."

const errorMessage = formatMessage(`${fieldName} is required`);
// Returns: "Full Name is required."
```

### 4. Format Currency Correctly

```tsx
import { formatCurrency } from '@/utils/spelling';

// ✅ No space between symbol and value
formatCurrency(2999);        // Returns: "£2,999" (or "$2,999")
formatCurrency(2999.50);     // Returns: "£2,999.50"

// ❌ Never manually concatenate
"₹ " + price        // Wrong - has space
"$" + price          // Wrong - no comma separator
```

### 5. UK English Spelling

```tsx
import { toUkSpelling } from '@/utils/spelling';

// ✅ Convert US to UK spelling
const ukText = toUkSpelling('Customize your organization settings');
// Returns: "Customise your organisation settings"
```

---

## Component Standards

### Buttons

```tsx
// ✅ All buttons must have:
// - Visible borders (secondary/default variant)
// - Hover highlight effect
// - Hand/pointer cursor
// - Tooltip for icon buttons

import { Button } from '@/components/ui/Button';
import { IconButton, Tooltip } from '@/components/ui/Tooltip';

// Standard button
<Button variant="primary">Save</Button>

// Icon button with tooltip (REQUIRED)
<IconButton
  icon={<Edit className="w-4 h-4" />}
  tooltip="Edit campaign"
  onClick={handleEdit}
/>
```

### Tables

```tsx
// ✅ Required in every data table:
// - Search field
// - SR. No. column (not ID, #, etc.)
// - Pagination options: 10, 20, 50, 100
// - Actions column (plural if multiple actions)
// - Tooltips on action icons

const columns = [
  { key: 'srNo', header: 'SR. No.' },       // ✅ Standard
  { key: 'name', header: 'Campaign Name' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Actions' },   // ✅ Plural for multiple
];
```

### Forms

```tsx
// ✅ Required in every form:
// - Cancel button
// - Pre-populated values when editing
// - Client + server-side validation
// - Descriptive error messages
// - Success message after submission

function CampaignForm({ campaign }) {
  return (
    <form>
      <Input
        label="Campaign Name"
        required
        placeholder="Enter campaign name"
        defaultValue={campaign?.name}      // ✅ Pre-populated
      />

      <Input
        label="Email ID"
        required
        placeholder="Enter Email ID"      // ✅ Consistent with label
      />

      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>  // ✅ Required
      </div>
    </form>
  );
}
```

### Date/Time

```tsx
import { formatDate, formatTime } from '@/utils/spelling';

// ✅ UK date format (DD/MM/YYYY)
formatDate(new Date());     // Returns: "23/04/2024"

// ✅ Uppercase AM/PM
formatTime(new Date());     // Returns: "2:30 PM"

// ❌ Never use other formats
"04/23/2024"     // US format - wrong
"23-04-2024"     // ISO format - wrong
"2:30 pm"        // Lowercase - wrong
```

---

## Message Standards

### Success Messages

| Action | Message |
|--------|---------|
| Contact Form | "Form submitted successfully." |
| Enquiry Form | "Enquiry submitted successfully." |
| Create | "Record saved successfully." |
| Update | "Record updated successfully." |
| Delete | "Record deleted successfully." |

### Confirmation Dialogs

```tsx
// ✅ Descriptive - names what is being actioned
"Are you sure you want to delete Employee John?"
"Are you sure you want to cancel this order #12345?"

// ❌ Generic - not allowed
"Are you sure?"
"Confirm action?"
```

### Error Message Format

```tsx
// Pattern: "[Field Label] [error description]."

// ✅ Field-specific
"Full Name is required."
"Email ID is required."
"Please enter a valid Contact Number."

// ❌ Generic
"This field is required."
"Invalid input."
"Error occurred."
```

---

## Dark Mode Requirements

All components must support dark mode:

```tsx
// ✅ Check contrast in both modes
<div className="text-neutral-900 dark:text-neutral-100">
  Content visible in both modes
</div>

// ✅ Icons must be visible
<Icon className="text-neutral-600 dark:text-neutral-400" />

// ✅ Disabled states distinct
<Button disabled className="opacity-40" >Disabled</Button>
```

---

## Checklist Before QA Handoff

### Labels & Content
- [ ] All field labels use standard names (Email ID, Contact Number, Postal Code, SR. No.)
- [ ] All buttons use standard labels (Log In/Log Out, Save/Update/Cancel/Delete/Confirm)
- [ ] No space before colons anywhere in the UI
- [ ] UK English spellings used throughout (Organisation, Colour, Cancelled, etc.)
- [ ] AM/PM is uppercase wherever displayed
- [ ] Pricing formatted with commas, no space between currency symbol and value

### Forms & Validation
- [ ] Every mandatory field shows a red asterisk (*) with no space before the label
- [ ] All fields have placeholder text consistent with the field label
- [ ] Country/State/City fields use dropdowns
- [ ] Cancel button present on all forms
- [ ] Edit forms pre-populate all existing values
- [ ] Client-side AND server-side validation implemented for all fields
- [ ] No field accepts invalid input (test: empty, spaces only, special chars, wrong type)
- [ ] Password eye icon shows correct state (show ↔ hide)
- [ ] Forgot Password link present (where applicable)

### Messages & Dialogs
- [ ] Success message shown after every Create, Update, Delete (fires only after server confirms)
- [ ] Every error message ends with a full stop
- [ ] Error messages are field-specific, not generic
- [ ] Delete operations show a descriptive confirmation dialog (system modal, not browser popup)
- [ ] Confirmation messages name what is being actioned — not just 'Are you sure?'

### Data Tables
- [ ] Search field present in every data table
- [ ] Pagination options: 10, 20, 50, 100
- [ ] Record count and pagination fetched in one API call
- [ ] Count refreshes after every add/delete/filter operation
- [ ] Dashboard stat cards are clickable and navigate to correct pages

### UI & Visual
- [ ] All icons display tooltips on hover
- [ ] All buttons have visible borders and hover highlight effect
- [ ] Hand/pointer cursor on all clickable elements
- [ ] No misaligned or overlapping elements (tested at 1366px, 1440px, 1920px)
- [ ] Dropdown toggle icon changes direction when open
- [ ] Search field has a clear (✕) icon inside
- [ ] Calendar icon present in all date fields

### Dark Mode
- [ ] All icons visible in dark mode
- [ ] Progress bars visible in dark mode
- [ ] Date/time picker icons visible in dark mode
- [ ] Toast close icons visible in dark mode

### Navigation
- [ ] All routes work on direct URL access and page refresh
- [ ] Logo links to the correct homepage
- [ ] After form submission, redirect goes to the correct destination
- [ ] No 404 errors on any page

---

## Resources

- [Defect Prevention Guide](./DEFECT_PREVENTION_GUIDE.md)
- [Design System](./design-system.md)
- [Component Library](../src/components/)

---

**Version:** 1.0  
**Last Updated:** 2024-04-23
