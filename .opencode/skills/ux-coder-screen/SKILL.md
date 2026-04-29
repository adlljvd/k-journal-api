---
name: ux-coder-screen
description: 'Screen structure. Navbar, container, 5 states, 4 annotations.'
license: MIT
compatibility: opencode
metadata:
  audience: ux-coder
  category: screen-structure
  priority: 2
  layer: 2
---

## What I Do

Complete screen structure with states and annotations. Load me for each screen you create.

### 1. Full Screen Template

```html
<div class="screen-container" id="S-01">
  <div class="screen-header">
    <div>
      <div class="flex items-center gap-3">
        <span class="text-sm font-mono font-bold text-blue-600">S-01</span>
        <h2 class="text-lg font-bold text-gray-900">Screen Name</h2>
        <span class="badge badge-info">Role</span>
      </div>
      <div class="text-xs text-gray-500 mt-1">🖥️ Desktop / 📱 Mobile</div>
    </div>
    <div class="state-controls">
      <button class="state-btn active" onclick="showState('S-01', 'empty', this)">Empty</button>
      <button class="state-btn" onclick="showState('S-01', 'populated', this)">Populated</button>
      <button class="state-btn" onclick="showState('S-01', 'loading', this)">Loading</button>
      <button class="state-btn" onclick="showState('S-01', 'error', this)">Error</button>
      <button class="state-btn" onclick="showState('S-01', 'success', this)">Success</button>
    </div>
  </div>

  <div class="screen-layout">
    <div class="screen-canvas">
      <div class="wireframe-box">
        <div class="wireframe-content">
          <!-- 5 STATES HERE -->
        </div>
      </div>
    </div>
    <div class="screen-context">
      <!-- 4 ANNOTATIONS HERE -->
    </div>
  </div>
</div>
```

### 2. The 5 Required States

**EVERY screen MUST include these 5 states:**

#### Empty (default visible)

```html
<div data-state="empty" class="visible">
  <div class="empty-state">
    <div class="empty-state-icon">📭</div>
    <div class="empty-state-title">Exact message from PRD</div>
    <div class="empty-state-description">What to do next</div>
    <a href="#S-XX" class="empty-state-cta">Action</a>
  </div>
</div>
```

#### Populated

```html
<div data-state="populated">
  <!-- Screen content with realistic data -->
  <div class="space-y-6">
    <div class="field-primary">
      <label>Field 1<span class="required-mark">*</span></label>
      <input type="text" class="w-full border border-blue-500 rounded px-3 py-2 bg-blue-50" />
    </div>
  </div>
</div>
```

#### Loading

```html
<div data-state="loading">
  <!-- Skeletons matching populated structure -->
  <div class="space-y-6">
    <div class="h-4 w-64 skeleton"></div>
    <div class="h-10 w-full skeleton"></div>
  </div>
</div>
```

#### Error

```html
<div data-state="error">
  <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm mb-4">
    Exact error message from PRD
  </div>
  <!-- Form with error styling -->
  <input class="w-full border border-red-300 rounded bg-red-50" />
  <p class="text-[10px] text-red-600 mt-1">Error details</p>
</div>
```

#### Success

```html
<div data-state="success">
  <div class="bg-white border rounded-lg shadow-sm overflow-hidden relative min-h-[200px]">
    <div class="toast-container absolute top-4 right-4">
      <div class="toast">
        <div class="toast-icon">✅</div>
        <div class="toast-content">
          <div class="toast-title">Success</div>
          <div class="toast-message">Exact success message from PRD</div>
        </div>
      </div>
    </div>
    <div class="p-6 opacity-50">Next screen preview</div>
  </div>
</div>
```

### 3. The 4 Required Annotations

**EVERY screen context MUST include:**

#### Journey Strip

```html
<div class="journey-strip">
  <div class="flex items-center gap-4 text-xs font-bold">
    <span class="text-gray-400">Step 1</span>
    <span class="text-gray-400">→</span>
    <span class="bg-blue-600 text-white px-2 py-1 rounded">Step 2 (Current)</span>
    <span class="text-gray-400">→</span>
    <span class="text-gray-400">Step 3</span>
  </div>
</div>
```

#### Flow Connection

```html
<div class="flow-connection">
  <strong>FLOW_CONNECTION</strong>
  <strong>← From:</strong> S-XX (Name) <strong>|</strong> <strong>→ To:</strong> S-XX (Name)<br /><br />
  <strong>On success:</strong> What happens<br />
  <strong>On error:</strong> What happens<br />
  <strong>Special cases:</strong> Edge cases
</div>
```

#### UX Note

```html
<div class="ux-note">
  <strong>UX_NOTE</strong>
  "WHY this design choice was made. Reference UX principles, user goals, and pain points."
</div>
```

#### Dev Note

```html
<div class="dev-note">
  <strong>DEV_NOTE</strong>
  "API endpoints, validation rules, error codes, data flow, business logic."
</div>
```

### 4. Critical Rules

1. **NEVER** skip any of the 5 states
2. **NEVER** skip any of the 4 annotations
3. **ALWAYS** copy exact messages from PRD (empty, error, success)
4. **ALWAYS** use `field-primary` for required fields
5. **ALWAYS** include `data-state` and `class="visible"` on states
6. **ALWAYS** verify onclick handlers reference correct screen ID

### 5. Common Mistakes

❌ **Skip states:** Only show populated
✅ **All 5 states:** Empty, Populated, Loading, Error, Success

❌ **Vague annotations:** "This is a form"
✅ **Specific annotations:** "Registration form. PRIMARY: Name, Phone, DOB, Gender. Optional: Address, Contact"

❌ **Paraphrase messages:** "No data found"
✅ **Exact from PRD:** "No patients registered in this clinic"

## When to Use Me

Load me when creating each screen. I provide complete structure.

## Dependencies

**Required:**

- `ux-coder-foundation` loaded first

**References:**

- Template files for copy-paste:
  - `docs/wireframe-template/module-template.html` - Complete module with all screens
  - `docs/wireframe-template/index.html` - Overview hub template
- Quality checklist: `docs/wireframe-template/guide-best-practices.md`
