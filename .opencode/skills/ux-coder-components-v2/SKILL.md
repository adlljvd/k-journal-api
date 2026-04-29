---
name: ux-coder-components-v2
description: 'Component patterns. Buttons, forms, tables, badges.'
license: MIT
compatibility: opencode
metadata:
  audience: ux-coder
  category: components
  priority: 3
  layer: 3
---

## What I Do

Component patterns for wireframes. Load me when adding UI elements.

## Quick Reference

**For full examples and copy-paste code, see:**

- `docs/wireframe-template/components.html`
- `docs/wireframe-template/module-template.html#S-02` (modals/toasts)

## Button Patterns

```html
<!-- Primary -->
<button class="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700">
  Submit
</button>

<!-- Secondary -->
<button class="px-4 py-2 border border-wire-border rounded text-sm font-bold hover:bg-gray-50">
  Cancel
</button>

<!-- Danger -->
<button class="px-4 py-2 bg-red-600 text-white rounded text-sm font-bold hover:bg-red-700">
  Delete
</button>

<!-- Icon -->
<button class="p-2 hover:bg-gray-100 rounded">✕</button>
```

## Form Patterns

```html
<!-- Primary Field (Required) -->
<div class="field-primary">
  <label class="block text-sm font-bold text-gray-500 mb-1"
    >Field<span class="required-mark">*</span></label
  >
  <input type="text" class="w-full border border-blue-500 rounded px-3 py-2 text-sm bg-blue-50" />
</div>

<!-- Secondary Field (Optional) -->
<div>
  <label class="block text-xs font-bold text-gray-500 mb-1">Field</label>
  <input type="text" class="w-full border rounded px-3 py-2 text-sm" />
</div>

<!-- Error Field -->
<div>
  <label class="block text-xs font-bold text-gray-500 mb-1">Field</label>
  <input type="text" class="w-full border border-red-300 rounded px-3 py-2 text-sm bg-red-50" />
  <p class="text-[10px] text-red-600 mt-1">Error</p>
</div>

<!-- Select -->
<select class="w-full border border-blue-500 rounded px-3 py-2 text-sm bg-blue-50">
  <option value="">Select...</option>
</select>

<!-- Textarea -->
<textarea class="w-full border rounded px-3 py-2 text-sm h-24"></textarea>
```

## Table Pattern

```html
<div class="bg-white rounded-xl border border-wire-border shadow-sm overflow-hidden">
  <table class="wire-table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th class="text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr class="cursor-pointer hover:bg-gray-50">
        <td>Data 1</td>
        <td>Data 2</td>
        <td class="text-right">
          <a href="#" class="text-blue-600 hover:underline text-xs font-bold">Action</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## Badge Pattern

```html
<span class="badge badge-neutral">Neutral</span>
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Inactive</span>
<span class="badge badge-info">PCO</span>
<span class="badge badge-purple">Nurse</span>
<span class="badge badge-teal">Admin</span>
```

## Card Patterns

```html
<!-- Default -->
<div class="bg-white p-6 rounded-xl border border-wire-border shadow-sm">
  <h3 class="text-lg font-bold mb-2">Title</h3>
  <p class="text-sm text-gray-600">Content</p>
</div>

<!-- Info (Blue) -->
<div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
  <h3 class="text-lg font-bold text-blue-900">Info</h3>
  <p class="text-sm text-blue-700">Content</p>
</div>

<!-- Success (Green) -->
<div class="bg-green-50 border border-green-200 rounded-xl p-6">
  <h3 class="text-lg font-bold text-green-900">Success</h3>
  <p class="text-sm text-green-700">Content</p>
</div>

<!-- Error (Red) -->
<div class="bg-red-50 border border-red-200 rounded-xl p-6">
  <h3 class="text-lg font-bold text-red-900">Error</h3>
  <p class="text-sm text-red-700">Content</p>
</div>
```

## Layout Patterns

```html
<!-- 2-Column Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>Col 1</div>
  <div>Col 2</div>
</div>

<!-- 3-Column Grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>

<!-- Flex Row -->
<div class="flex items-center gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Flex Space Between -->
<div class="flex justify-between items-center">
  <div>Left</div>
  <div>Right</div>
</div>
```

## Empty State Pattern

```html
<div class="empty-state">
  <div class="empty-state-icon">📭</div>
  <div class="empty-state-title">No data available</div>
  <div class="empty-state-description">Description from PRD</div>
  <a href="#S-XX" class="empty-state-cta">Action</a>
</div>
```

## Error State Pattern

```html
<div class="error-state">
  <div class="error-state-icon">❌</div>
  <div class="error-state-title">Error</div>
  <div class="error-state-description">Error message from PRD</div>
  <button class="error-state-cta">Retry</button>
</div>
```

## Modal Pattern

**See examples in:** `module-template.html#S-02`

```html
<div class="bg-gray-900/10 rounded">
  <div class="bg-white rounded-xl shadow-2xl max-w-md mx-auto overflow-hidden">
    <div class="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h3 class="font-bold text-gray-900">Title</h3>
      <button class="text-gray-400 hover:text-gray-600">✕</button>
    </div>
    <div class="p-6">Content</div>
    <div class="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
      <button class="px-6 py-2 border border-gray-300 rounded">Cancel</button>
      <button class="px-6 py-2 bg-blue-600 text-white rounded">Confirm</button>
    </div>
  </div>
</div>
```

## Toast Pattern

**See examples in:** `module-template.html#S-02`

```html
<div class="toast">
  <div class="toast-icon">✅</div>
  <div class="toast-content">
    <div class="toast-title">Success</div>
    <div class="toast-message">Action completed</div>
  </div>
</div>
```

## Critical Rules

1. **NEVER** use arbitrary colors - use design tokens from foundation skill
2. **ALWAYS** use `field-primary` for required fields
3. **ALWAYS** include unique `id` for form inputs
4. **ALWAYS** use semantic HTML elements
5. **NEVER** copy-paste long examples from here - reference components.html for full examples
6. **ALWAYS** ensure components are accessible (focus states, labels)

## When to Use Me

Load me when adding UI components to screens. For full examples, see template files.

## Dependencies

**Required:**

- `ux-coder-foundation` loaded first

**References:**

- Template files for copy-paste:
  - `docs/wireframe-template/components.html` - Component library with full examples
  - `docs/wireframe-template/module-template.html#S-02` - Modal & toast examples (within wireframe context)
- Quality checklist: `docs/wireframe-template/guide-best-practices.md`
