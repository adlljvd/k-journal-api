=== PRD: Authentication & User Management ===
Version: 1.0
Scale: L
Project: kjournal-001-k-journal-platform
Flow Document ref: v0.1
MVP: IN
Status: Validated

═══════════════════════════════════════════════════════════════
1. PROBLEM STATEMENT
═══════════════════════════════════════════════════════════════

Users need a secure way to create accounts and authenticate to access their personal journal and profile. Currently, there is no system for user identity management. This module establishes the foundation for all personalized features: journal entries, favorites, profile, and content requests.

**Current state:** No user system exists.
**Impact:** Users cannot save or track any personal data.
**What changes:** Users can register, log in, and manage their account.

═══════════════════════════════════════════════════════════════
2. ROLES & PERMISSIONS
═══════════════════════════════════════════════════════════════

| Role | Description | Permissions |
|------|-------------|-------------|
| GUEST | Unauthenticated visitor | Browse catalog, view content details, search content, view public profiles |
| USER | Authenticated standard user | All GUEST permissions + Create journal entries, rate/review, manage favorites, submit content requests, manage own profile |
| ADMIN | Super-admin (single) | All USER permissions + Approve/reject content requests, manage content catalog, manage users |

═══════════════════════════════════════════════════════════════
3. USER STORIES
═══════════════════════════════════════════════════════════════

### Story AUTH-01: User Registration
As a guest,
I want to create an account with my email and a unique username,
so that I can access personalized features like my journal and profile.

**Acceptance Criteria:**
- AC-AUTH-01-001: Registration form accepts email, username, and password fields
- AC-AUTH-01-002: Email must be valid format and unique in the system
- AC-AUTH-01-003: Username must be 3-30 characters, alphanumeric and underscores only, unique in the system
- AC-AUTH-01-004: Password must be minimum 8 characters
- AC-AUTH-01-005: Duplicate email shows error: "An account with this email already exists."
- AC-AUTH-01-006: Duplicate username shows error: "This username is already taken."
- AC-AUTH-01-007: Successful registration auto-logs the user in and redirects to journal page
- AC-AUTH-01-008: User profile is auto-created with default values (empty bio, no avatar, no favorites)

---

### Story AUTH-02: User Login
As a registered user,
I want to log in with my email and password,
so that I can access my account and personal data.

**Acceptance Criteria:**
- AC-AUTH-02-001: Login form accepts email and password fields
- AC-AUTH-02-002: Invalid credentials show error: "Invalid email or password. Please try again."
- AC-AUTH-02-003: Successful login redirects to the page user was trying to access, or journal page by default
- AC-AUTH-02-004: "Remember me" option extends session duration (optional for MVP)

---

### Story AUTH-03: User Logout
As a logged-in user,
I want to log out of my account,
so that my session is terminated and my data is protected.

**Acceptance Criteria:**
- AC-AUTH-03-001: Logout button is visible in navigation when authenticated
- AC-AUTH-03-002: Logout clears session and redirects to homepage
- AC-AUTH-03-003: After logout, user can still browse catalog and view public profiles as guest

---

### Story AUTH-04: Password Reset
As a user who forgot my password,
I want to reset my password via email,
so that I can regain access to my account.

**Acceptance Criteria:**
- AC-AUTH-04-001: Login page has "Forgot password?" link
- AC-AUTH-04-002: Password reset form accepts email address
- AC-AUTH-04-003: If email exists, send password reset link (valid for 24 hours)
- AC-AUTH-04-004: If email doesn't exist, show generic message: "If an account exists with this email, you'll receive a reset link."
- AC-AUTH-04-005: Reset link leads to new password form
- AC-AUTH-04-006: New password must meet minimum requirements (8 characters)

**Note:** Email functionality may be deferred to Phase 2 if infrastructure not ready. Alternative: Admin can manually reset passwords.

---

### Story AUTH-05: Account Settings
As a logged-in user,
I want to change my password and email,
so that I can keep my account secure and up-to-date.

**Acceptance Criteria:**
- AC-AUTH-05-001: Settings page accessible from navigation
- AC-AUTH-05-002: User can change password (requires current password verification)
- AC-AUTH-05-003: User can change email (requires password verification, sends confirmation to new email)
- AC-AUTH-05-004: User can delete account (requires password confirmation, shows warning about data loss)

═══════════════════════════════════════════════════════════════
4. BUSINESS RULES
═══════════════════════════════════════════════════════════════

| Rule ID | Rule |
|---------|------|
| BR-AUTH-01 | Usernames are case-insensitive for uniqueness (User123 and user123 are the same) |
| BR-AUTH-02 | Emails are case-insensitive for uniqueness |
| BR-AUTH-03 | Passwords must be hashed using industry-standard algorithm (bcrypt, argon2) |
| BR-AUTH-04 | Session tokens must be securely generated and stored |
| BR-AUTH-05 | Account deletion removes user data but preserves anonymized journal entry counts for stats |
| BR-AUTH-06 | Admin account is pre-seeded; no public registration for admin role |
| BR-AUTH-07 | Password reset via email is Phase 2; MVP uses admin-assisted manual reset |
| BR-AUTH-08 | "Remember me" extends session to 30 days; default session is 24 hours |

═══════════════════════════════════════════════════════════════
5. DATA MODEL
═══════════════════════════════════════════════════════════════

## User Entity

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL, indexed | User email |
| username | VARCHAR(30) | UNIQUE, NOT NULL, indexed | Display name |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| role | ENUM | NOT NULL, DEFAULT 'USER' | USER or ADMIN |
| created_at | TIMESTAMP | NOT NULL, auto | Account creation time |
| updated_at | TIMESTAMP | NOT NULL, auto-update | Last modification time |

## User Profile Entity (Related)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| user_id | UUID | FK -> User.id, PK | One-to-one with User |
| avatar_url | VARCHAR(500) | NULLABLE | Avatar image URL |
| bio | VARCHAR(160) | NULLABLE | Short bio text |
| created_at | TIMESTAMP | NOT NULL, auto | Profile creation time |
| updated_at | TIMESTAMP | NOT NULL, auto-update | Last modification time |

═══════════════════════════════════════════════════════════════
6. WORKFLOW MAP
═══════════════════════════════════════════════════════════════

```
Registration Workflow:
[Guest] -> [Click Register] -> [Fill Form] -> [Validate]
    -> [Valid] -> [Create Account] -> [Auto Login] -> [Redirect to Journal]
    -> [Invalid] -> [Show Errors] -> [Return to Form]

Login Workflow:
[Guest] -> [Click Login] -> [Enter Credentials] -> [Authenticate]
    -> [Success] -> [Create Session] -> [Redirect to Target Page]
    -> [Fail] -> [Show Error] -> [Return to Form]

Password Reset Workflow:
[User] -> [Click Forgot Password] -> [Enter Email] -> [Send Reset Link]
    -> [User clicks link] -> [Enter New Password] -> [Password Updated]
```

═══════════════════════════════════════════════════════════════
7. SCREEN SKELETON
═══════════════════════════════════════════════════════════════

**Screen Inventory:**

| ID | Name | Accessible to | Reached from | MVP |
|----|------|---------------|--------------|-----|
| S-AUTH-01 | Registration Page | Guest | Homepage, Login page | YES |
| S-AUTH-02 | Login Page | Guest | Homepage, Protected route redirect | YES |
| S-AUTH-03 | Forgot Password Page | Guest | Login page | YES |
| S-AUTH-04 | Reset Password Page | Guest | Email link | YES |
| S-AUTH-05 | Account Settings Page | User, Admin | Navigation menu | YES |

---

**[S-AUTH-01] Registration Page**

Purpose: Allow guests to create new accounts
Accessible to: Guest only
Reached from: Homepage "Sign Up" button, Login page "Create account" link

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Email input | User input | Email field | YES |
| Username input | User input | Text field (3-30 chars) | YES |
| Password input | User input | Password field (min 8 chars) | YES |
| Confirm Password | User input | Password field | YES |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Submit | "Create Account" | Form valid | Create account, auto-login, redirect to journal |
| Cancel | "Already have an account? Log in" | Always | Redirect to login page |

States:
- Loading: Button shows spinner during submission
- Error: "Unable to create account. Please try again."
- Validation errors shown inline per field

Validation:
| Field | Rule | Error Message |
|-------|------|---------------|
| Email | Valid format, unique | "Please enter a valid email address." / "An account with this email already exists." |
| Username | 3-30 chars, alphanumeric + underscore, unique | "Username must be 3-30 characters." / "This username is already taken." |
| Password | Min 8 characters | "Password must be at least 8 characters." |
| Confirm Password | Matches password | "Passwords do not match." |

Navigation:
- Success → /journal
- Cancel → /login

---

**[S-AUTH-02] Login Page**

Purpose: Allow registered users to authenticate
Accessible to: Guest only
Reached from: Homepage "Log In" button, Protected route redirect, Registration page

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Email input | User input | Email field | YES |
| Password input | User input | Password field | YES |
| Remember me | User input | Checkbox | YES |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Submit | "Log In" | Form filled | Authenticate, redirect |
| Forgot password | "Forgot password?" | Always | Redirect to forgot password page |
| Register | "Create an account" | Always | Redirect to registration page |

States:
- Loading: Button shows spinner during authentication
- Error: "Invalid email or password. Please try again."

Validation:
| Field | Rule | Error Message |
|-------|------|---------------|
| Email | Required, valid format | "Please enter a valid email address." |
| Password | Required | "Please enter your password." |

Navigation:
- Success → /journal (or intended protected page)
- Forgot password → /forgot-password
- Register → /register

---

**[S-AUTH-05] Account Settings Page**

Purpose: Allow users to manage account settings
Accessible to: User, Admin
Reached from: Navigation menu "Settings"

Data displayed:
| Field | Source | Format | Editable |
|-------|--------|--------|----------|
| Current email | User record | Display only | NO |
| Change email | User input | Email field | YES |
| Current password | User input | Password field | YES (for verification) |
| New password | User input | Password field | YES |
| Confirm new password | User input | Password field | YES |
| Delete account | Button | Danger button | YES |

Actions:
| Action | Label | Visible when | Result |
|--------|-------|--------------|--------|
| Change email | "Update Email" | Email field changed + password entered | Send confirmation, update email |
| Change password | "Update Password" | Both password fields filled + current password | Update password |
| Delete account | "Delete My Account" | Confirmation typed | Delete account, redirect to homepage |

States:
- Loading: Buttons show spinner during submission
- Success: "Email updated successfully." / "Password updated successfully."
- Error: "Failed to update. Please try again."

Validation:
| Field | Rule | Error Message |
|-------|------|---------------|
| New email | Valid format, unique | "Please enter a valid email address." / "An account with this email already exists." |
| Current password | Must match stored hash | "Current password is incorrect." |
| New password | Min 8 characters | "Password must be at least 8 characters." |
| Confirm password | Matches new password | "Passwords do not match." |

Navigation:
- Success → /settings (refresh)
- Delete account → / (homepage as guest)

═══════════════════════════════════════════════════════════════
8. ENTRY POINTS PER ROLE
═══════════════════════════════════════════════════════════════

| Role | Entry Points |
|------|--------------|
| Guest | Homepage (public), Login, Register, Forgot Password, Content catalog (read-only), Public profiles |
| User | All Guest entry points + Journal, Profile, Settings, Content Requests |
| Admin | All User entry points + Admin Dashboard, Admin Content Management |

═══════════════════════════════════════════════════════════════
9. NOTIFICATIONS
═══════════════════════════════════════════════════════════════

| Trigger | Type | Recipient | Message |
|---------|------|-----------|---------|
| Password reset requested | Email | User | "Reset your K-Journal password" with reset link |
| Email changed | Email | User (new email) | "Confirm your new email address" |
| Account deleted | Email | User | "Your K-Journal account has been deleted" |

**Note:** Email infrastructure may be Phase 2. MVP can use in-app notifications only.

═══════════════════════════════════════════════════════════════
10. SCOPE
═══════════════════════════════════════════════════════════════

**In MVP:**
- User registration with email/username/password
- User login/logout
- Password reset (via email, if infrastructure ready; otherwise admin-assisted)
- Account settings (change email, change password, delete account)
- Session management

**Not in MVP (Phase 2+):**
- OAuth social login (Google, etc.)
- Two-factor authentication
- Email verification on registration
- Password strength meter
- Login history / device management
- Account suspension by admin

═══════════════════════════════════════════════════════════════
11. OPEN ITEMS
═══════════════════════════════════════════════════════════════

No open items. All decisions confirmed.
