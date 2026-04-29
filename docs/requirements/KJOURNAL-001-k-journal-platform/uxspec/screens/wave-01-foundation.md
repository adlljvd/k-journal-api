=== WAVE 1 SCREENS: Foundation & Authentication ===
Project: KJOURNAL-001-k-journal-platform
Module: AUTH
Wireframe: wireframes/01-auth.html

═══════════════════════════════════════════════════════════════
WAVE OVERVIEW
═══════════════════════════════════════════════════════════════

This wave establishes the foundation for K-Journal:
- Global navigation and header
- User authentication flows
- Account management

**Screens in this wave:**
| ID | Screen Name | Purpose |
|----|-------------|---------|
| S-AUTH-01 | Registration Page | New user signup |
| S-AUTH-02 | Login Page | Returning user authentication |
| S-AUTH-03 | Forgot Password Page | Password recovery |
| S-AUTH-05 | Account Settings Page | Account management |

---

## S-AUTH-01 Registration Page

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Email | PRIMARY | Required for account creation and future communication; must be unique |
| Username | PRIMARY | User's public identity across the platform; must be unique |
| Password | PRIMARY | Security credential; must meet minimum requirements |
| Confirm Password | SECONDARY | Validation only; prevents typos during signup |

### Screen Definition

**UX structure decision:**
- Primary action: Complete registration form
- Information hierarchy: Form fields (centered) → Helper text → Alternative actions
- Principle applied: **Progressive Disclosure** - Only essential fields visible; no optional fields to distract
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Homepage or Login / → to Personal Journal (on success)

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| Cancel/Back | Homepage | 02-content.html |
| "Already have an account?" | Login | This file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Email input | PRIMARY | User input | Email field | Required, unique |
| Username input | PRIMARY | User input | Text field (3-30 chars) | Required, unique, alphanumeric + underscore |
| Password input | PRIMARY | User input | Password field (min 8 chars) | Required |
| Confirm Password | SECONDARY | User input | Password field | Must match password |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Submit | Primary button | Below form | Create account, auto-login, redirect to journal |
| Cancel | Text link | Below submit | Redirect to login page |

**States:**
_Loading_: Button shows spinner with text "Creating account..."
_Empty_: Form fields visible with placeholder text
_Populated_: User has entered data
_Error_: 
- Email invalid: "Please enter a valid email address."
- Email exists: "An account with this email already exists."
- Username invalid: "Username must be 3-30 characters, letters, numbers, and underscores only."
- Username exists: "This username is already taken."
- Password short: "Password must be at least 8 characters."
- Passwords mismatch: "Passwords do not match."

**Navigation:**
Success → /journal (Personal Journal)
Cancel → /login

---

## S-AUTH-02 Login Page

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Email | PRIMARY | Unique identifier for authentication |
| Password | PRIMARY | Security credential for verification |
| Remember Me | TERTIARY | Convenience option; affects session duration |

### Screen Definition

**UX structure decision:**
- Primary action: Authenticate with email/password
- Information hierarchy: Form fields → Actions → Help links
- Principle applied: **Recognition over Recall** - Show "Forgot password?" link; don't make users remember recovery options
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Homepage, Protected routes, Registration / → to intended page or Personal Journal

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| "Create an account" | Registration | This file |
| "Forgot password?" | Forgot Password | This file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Email input | PRIMARY | User input | Email field | Required |
| Password input | PRIMARY | User input | Password field | Required |
| Remember me | TERTIARY | User input | Checkbox | Extends session to 30 days |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Submit | Primary button | Below form | Authenticate, redirect |
| Forgot password | Text link | Below submit | Navigate to forgot password page |
| Create account | Text link | Below form | Navigate to registration page |

**States:**
_Loading_: Button shows spinner with text "Logging in..."
_Empty_: Form fields visible with placeholder text
_Populated_: User has entered data
_Error_: "Invalid email or password. Please try again."

**Navigation:**
Success → /journal or intended protected page
Forgot password → /forgot-password
Create account → /register

---

## S-AUTH-03 Forgot Password Page

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Email | PRIMARY | Required to send reset instructions; must match existing account |

### Screen Definition

**UX structure decision:**
- Primary action: Submit email for password reset
- Information hierarchy: Instructions → Form field → Submit → Back to login
- Principle applied: **Error Prevention** - Generic success message prevents account enumeration
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Login page / → to Login page (on submit) or email link → Reset Password

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| "Back to login" | Login | This file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Email input | PRIMARY | User input | Email field | Required |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Submit | Primary button | Below form | Send reset email (if account exists) |
| Back to login | Text link | Below submit | Navigate to login page |

**States:**
_Loading_: Button shows spinner with text "Sending..."
_Empty_: Form field visible with placeholder
_Populated_: User has entered email
_Success_: "If an account exists with this email, you'll receive a reset link."
_Error_: Generic message (same as success to prevent enumeration)

**Navigation:**
Submit → /login (with success message)
Back → /login

**Note:** For MVP, if email infrastructure not ready, admin can manually reset passwords. In this case, show: "Contact support to reset your password."

---

## S-AUTH-05 Account Settings Page

### Data Field Importance Matrix

| Field | Importance | Domain Reasoning |
|-------|------------|------------------|
| Current email | SECONDARY | Reference only; shows current account email |
| Change email | SECONDARY | Optional; for updating contact information |
| Current password | PRIMARY | Required for security verification before changes |
| New password | PRIMARY | Required if changing password |
| Delete account | TERTIARY | Destructive action; requires confirmation |

### Screen Definition

**UX structure decision:**
- Primary action: Change password or email
- Secondary action: Delete account (dangerous)
- Information hierarchy: Current info → Change sections → Danger zone
- Principle applied: **Error Prevention First** - Require current password for security changes; confirm before delete
- PRD challenge: None - skeleton is appropriate
- Flow connection: ← from Navigation menu / → to same page (refresh) or Homepage (on delete)

**Cross-file navigation:**
| Action | Target | Wireframe File |
|--------|--------|----------------|
| None - all navigation within this file |

**Data displayed:**
| Field | Hierarchy | Source | Format | Notes |
|-------|-----------|--------|--------|-------|
| Current email | SECONDARY | User record | Display text | Not editable directly |
| New email input | SECONDARY | User input | Email field | For email change |
| Current password | PRIMARY | User input | Password field | Required for any change |
| New password | PRIMARY | User input | Password field | For password change |
| Confirm new password | PRIMARY | User input | Password field | Must match new password |

**Actions:**
| Action | Type | Placement | Result |
|--------|------|-----------|--------|
| Update email | Secondary button | Email section | Verify password, send confirmation email |
| Update password | Secondary button | Password section | Verify current password, update |
| Delete account | Danger button | Danger zone | Show confirmation dialog |

**States:**
_Loading_: Button shows spinner during submission
_Success_: "Email updated successfully." / "Password updated successfully."
_Error_: 
- Current password wrong: "Current password is incorrect."
- New email exists: "An account with this email already exists."
- New password short: "Password must be at least 8 characters."
- Passwords mismatch: "Passwords do not match."

**Delete Confirmation Dialog:**
- Title: "Delete Account"
- Message: "Are you sure you want to delete your account? This will remove all your journal entries, reviews, and profile data. This action cannot be undone."
- Actions: "Cancel" / "Delete My Account" (danger)

**Navigation:**
Update → /settings (refresh)
Delete → / (homepage as guest)

---

═══════════════════════════════════════════════════════════════
WAVE NOTES
═══════════════════════════════════════════════════════════════

## Global Elements

These elements appear across all authenticated screens and should be built as shared components.

### Header/Navigation (Logged Out)

| Element | Placement | Behavior |
|---------|-----------|----------|
| Logo | Left | Click → Homepage |
| Search bar | Center | Type → Search results dropdown |
| "Log In" button | Right | Click → Login page |
| "Sign Up" button | Right | Click → Registration page |

### Header/Navigation (Logged In - User)

| Element | Placement | Behavior |
|---------|-----------|----------|
| Logo | Left | Click → Homepage |
| Search bar | Center | Type → Search results dropdown |
| "My Journal" link | Right | Click → Personal Journal |
| User avatar/menu | Right | Dropdown: Profile, Settings, Logout |
| Admin link | Right (admin only) | Click → Admin Dashboard |

### Authentication Flow Notes

1. **Auto-login after registration** - Users should not need to log in again after creating account
2. **Session persistence** - "Remember me" extends session to 30 days; default is 24 hours
3. **Protected route redirect** - If guest tries to access protected page, redirect to login with return URL
4. **Post-login redirect** - After login, redirect to intended page OR Personal Journal (default)

## Cross-File Links Summary

| From Screen | Action | To Screen | Wireframe File |
|-------------|--------|-----------|----------------|
| S-AUTH-01 | Cancel | S-AUTH-02 | This file |
| S-AUTH-02 | Create account | S-AUTH-01 | This file |
| S-AUTH-02 | Forgot password | S-AUTH-03 | This file |
| S-AUTH-03 | Back to login | S-AUTH-02 | This file |
| S-AUTH-01 | Success | S-JRN-01 | 03-journal.html |
| S-AUTH-02 | Success | S-JRN-01 | 03-journal.html |
