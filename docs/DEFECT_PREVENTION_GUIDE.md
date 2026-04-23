# Common Defect Prevention Guide

**For:** Development Team  
**Version:** 1.0  
**Applies to:** Panel (Admin), Website (Public), Both

---

## Quick Reference Standards

### Field Labels (Both)

| Use This | Never Use |
|----------|-------------|
| Email ID | Email, Email Address |
| Contact Number | Phone, Phone Number, Mobile, Mobile Number |
| Postal Code | PIN Number, PIN |
| SR. No. | ID, #, Sr. No. |
| Month, Year | Mo, Yr, m, y |

### Authentication (Both)

| Use This | Never Use |
|----------|-------------|
| Log In, Log Out | Login, Logout, Signin, Signout |

### Punctuation (Both)

- **No space before colon:** `Name: Komal` ✓ | `Name : Komal` ✗
- **End messages with full stop:** "Form submitted successfully."

---

## UI Standards Checklist

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

### Website Only

- [ ] Header navigation is fixed/sticky
- [ ] Active page/tab is highlighted
- [ ] FAQ accordion: only one open at a time
- [ ] Social media icons present, clickable, open in new tab
- [ ] Footer contains Contact Number and Email ID
- [ ] Contact Us page has map, location links, contact numbers
- [ ] Favicon is set
- [ ] All images are high resolution
- [ ] Scroll-to-top button present
- [ ] 'All Rights Reserved' in footer
- [ ] 'Remember Me' checkbox consistent across all panels

---

## UK English Spelling Standard

| American | British ✓ | American | British ✓ |
|----------|-----------|----------|-----------|
| Organization | Organisation | Authorized | Authorised |
| Color | Colour | Behavior | Behaviour |
| Canceled | Cancelled | Favorite | Favourite |
| Center | Centre | Analyze | Analyse |
| Initialize | Initialise | Customize | Customise |
| Optimize | Optimise | License (noun) | Licence |
| Humor | Humour | Program (general) | Programme |

**Note:** "Program" is correct when referring to computer programs/software. "Programme" is used in all other contexts.

---

## Common Defect Patterns

### #1 — Missing Mandatory Field Marker (*)
**Impact:** Users submit incomplete forms → data entry errors
**Prevention:** Auto-apply asterisk via design system. Verify before QA handoff.

### #2 — Wrong or Missing Icon
**Impact:** Users cannot identify clickable elements
**Prevention:** Use standardized icon library. Check cursor:pointer on all clickable elements.

### #3 — UI Alignment / Overlap Issue
**Impact:** Broken interface — trust loss
**Prevention:** Test at multiple screen sizes (1366px, 1440px, 1920px, mobile).

### #4 — Missing Field Validation
**Impact:** Data corruption, server errors
**Prevention:** Implement client-side AND server-side validation. Never rely on HTML validation alone.

### #5 — Spelling / Grammar / Typo
**Impact:** Unprofessional — erodes trust
**Prevention:** Use spell-check. Review all UI text before handoff.

### #6 — UK / US English Inconsistency
**Impact:** Fails content quality audits
**Prevention:** Reference UK English word list. Automated checks preferred.

### #7 — Missing Success Message
**Impact:** Users unsure if action worked → duplicate submissions
**Prevention:** Show success message after EVERY Create/Update/Delete. Only after server confirms.

### #8 — Pagination / Count Mismatch
**Impact:** Users lose trust in data accuracy
**Prevention:** Fetch count and records in SAME API call. Refresh after every change.

### #9 — Accepts Invalid Input
**Impact:** Corrupt data in database
**Prevention:** Test boundary conditions. Server-side validation mandatory.

### #10 — Inconsistent Label / Heading
**Impact:** Confuses users navigating modules
**Prevention:** Centralized content reference document. Same field = same label everywhere.

### #11 — Incorrect Error Message
**Impact:** Users don't understand what went wrong
**Prevention:** Error messages connected to validation logic. Field-specific messages.

### #12 — Inconsistent Placeholder Text
**Impact:** Users make input format errors
**Prevention:** Standard placeholder reference. "Enter [Field Label]" format.

### #13 — Colour / Contrast Issue (Dark Mode)
**Impact:** Accessibility failure
**Prevention:** Test colour contrast. Test dark mode before handoff.

### #14 — Missing Full Stop / Punctuation
**Impact:** Unprofessional polish
**Prevention:** All messages end with full stop. Content review step.

### #15 — CRUD Operation Failure — Data Not Saved
**Impact:** Data integrity failure
**Prevention:** Show success only after server confirms. Refresh list from server.

### #16 — Navigation / Redirect Issue
**Impact:** Users stranded
**Prevention:** Configure deep-link routing. Test direct URL access and refresh.

### #17 — Filter / Search Not Working
**Impact:** Core functionality broken
**Prevention:** Server-side filtering. Test with real data volumes.

---

## Document Control

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-04-23 | Initial release |

**Prepared by:** QA Team  
**For:** Development Team  
**Applies to:** All Projects
