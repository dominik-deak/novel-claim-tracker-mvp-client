# Frontend Manual Testing Checklist

Complete testing guide for the Claim Tracker MVP frontend application.

**Prerequisites:**
- Backend mock server running at `http://localhost:3001`
- Frontend dev server running at `http://localhost:5173`
- Browser DevTools console open to monitor errors

---

## ⚠️ MVP Scope Note

This is a **Minimum Viable Product (MVP)** with focused functionality. The following features are **intentionally not implemented** in this version:

**Not Available:**
- ❌ Editing projects or claims after creation (except claim status)
- ❌ Deleting projects or claims
- ❌ Cancel buttons on forms
- ❌ Individual detail pages for projects/claims
- ❌ Confirmation dialogs
- ❌ Search or advanced filtering
- ❌ Pagination

**What IS Available:**
- ✅ Create projects and claims
- ✅ View lists of projects and claims
- ✅ Filter claims by status
- ✅ Update claim status (Draft → Submitted → Approved)
- ✅ Link/unlink projects to/from existing claims
- ✅ Role-based access control (Submitter vs. Reviewer)
- ✅ Form validation
- ✅ User switching (Alice/Bob)

---

## Initial Setup

### Environment Check
- [ ] Verify backend server is running (`http://localhost:3001`)
- [ ] Verify frontend server is running (`http://localhost:5173`)
- [ ] Open browser DevTools Console (F12)
- [ ] Open Network tab in DevTools
- [ ] Check no console errors on page load

---

## Part 1: Projects Management

### A. Create Projects

#### Test Case 1.1: Create First Project
1. [ ] Navigate to "Projects" page via header navigation
2. [ ] Click "Create New Project" button
3. [ ] Verify you're redirected to `/projects/new`
4. [ ] Fill in the form:
   - Name: `AI Algorithm Development`
   - Description: `Machine learning algorithms for predictive analytics`
5. [ ] Click "Create Project" button
6. [ ] **Expected**:
   - Success toast notification appears
   - Automatically redirected back to `/projects`
   - New project appears in the list
   - No console errors

#### Test Case 1.2: Create Second Project
1. [ ] Click "Create New Project" button
2. [ ] Fill in the form:
   - Name: `Quantum Computing Research`
   - Description: `Research into quantum algorithms and implementations`
3. [ ] Click "Create Project" button
4. [ ] **Expected**: Success toast, redirected to list, project appears

#### Test Case 1.3: Empty Name Validation
1. [ ] Click "Create New Project" button
2. [ ] Leave name empty, fill description: `Test description`
3. [ ] Try to click "Create Project" button
4. [ ] **Expected**:
   - Validation error message appears below name field
   - Form does not submit
   - Project not created
   - Button may show loading state briefly

#### Test Case 1.4: Empty Description Validation
1. [ ] Click "Create New Project" button
2. [ ] Fill name: `Test Project`
3. [ ] Leave description empty
4. [ ] Try to click "Create Project" button
5. [ ] **Expected**: Validation error message below description field, form does not submit

#### Test Case 1.5: Both Fields Empty
1. [ ] Click "Create New Project" button
2. [ ] Leave both fields empty
3. [ ] Try to submit
4. [ ] **Expected**: Validation errors shown for both fields

### B. View Projects

#### Test Case 2.1: List All Projects
1. [ ] Navigate to "Projects" page
2. [ ] **Expected**: Both projects are visible in the list
3. [ ] Verify each project card shows:
   - Project name (as heading)
   - Description (as paragraph text)
   - Created date (formatted as "Created: MM/DD/YYYY...")
4. [ ] Verify cards have proper styling (border, shadow, padding)

**Note:** Project cards are read-only. There are no Edit/Delete buttons or click handlers to view details. This is by design for the MVP.

---

## Part 2: Claims Management

### A. Create Claims

#### Test Case 3.1: Create Claim With Projects
1. [ ] Navigate to "Claims" page (or click "Claims" in header, should go to `/`)
2. [ ] Click "Create New Claim" button
3. [ ] Verify you're redirected to `/claims/new`
4. [ ] Fill in the form:
   - Company Name: `Acme Corporation Ltd`
   - Start Date: `2024-01-01`
   - End Date: `2024-12-31`
   - Amount: `50000` (this is in pence, will display as £500.00)
5. [ ] In the "Select Projects" section:
   - Check the box for `AI Algorithm Development`
   - Check the box for `Quantum Computing Research`
   - Verify selection count shows "2 projects selected"
6. [ ] Click "Create Claim" button
7. [ ] **Expected**:
   - Success toast notification
   - Automatically redirected back to `/` (claims list)
   - New claim appears in the list
   - Claim shows as "Draft" status (gray badge)
   - Both projects are visible under the claim
   - Amount displays as "£500.00"
   - Claim period shows formatted dates

#### Test Case 3.2: Create Claim Without Projects
1. [ ] Click "Create New Claim" button
2. [ ] Fill in the form:
   - Company Name: `TechStart Innovations Ltd`
   - Start Date: `2025-01-01`
   - End Date: `2025-12-31`
   - Amount: `75000` (£750.00)
   - Projects: Leave all unchecked
3. [ ] Click "Create Claim" button
4. [ ] **Expected**:
   - Success toast
   - Claim created with "No projects linked" message
   - All other details display correctly

### B. Form Validation Tests

#### Test Case 4.1: Empty Company Name
1. [ ] Click "Create New Claim" button
2. [ ] Leave company name empty
3. [ ] Fill other required fields with valid data
4. [ ] Try to submit
5. [ ] **Expected**: Validation error for company name field

#### Test Case 4.2: Invalid Date - End Before Start
1. [ ] Fill in valid company name and amount
2. [ ] Enter Start Date: `2024-12-31`
3. [ ] Enter End Date: `2024-01-01`
4. [ ] Try to submit
5. [ ] **Expected**: Validation error about date range (dates may also be prevented by date input)

#### Test Case 4.3: Zero Amount
1. [ ] Fill valid company name and dates
2. [ ] Enter amount: `0`
3. [ ] Try to submit
4. [ ] **Expected**: Validation error about positive amount

#### Test Case 4.4: Negative Amount
1. [ ] Try to enter amount: `-1000`
2. [ ] **Expected**: Browser may prevent negative input in number field, or validation error if possible

### C. View and Filter Claims

#### Test Case 5.1: View All Claims
1. [ ] Navigate to Claims page (`/`)
2. [ ] **Expected**: Both claims visible in the list
3. [ ] Verify each claim card shows:
   - Company name (as heading)
   - Claim period (formatted date range)
   - Amount (formatted as currency with £ symbol)
   - Status badge (Draft/Submitted/Approved with appropriate color)
   - List of linked projects (or "No projects linked")
   - Created timestamp at bottom
   - Status action buttons (role-dependent)

#### Test Case 5.2: Filter by Status - All
1. [ ] Locate the status filter dropdown at top of page
2. [ ] Select "All" from dropdown
3. [ ] **Expected**: All claims visible (should be 2 claims)

#### Test Case 5.3: Filter by Status - Draft
1. [ ] Select "Draft" from status filter dropdown
2. [ ] **Expected**: Only Draft claims visible (should be 2 claims initially)

#### Test Case 5.4: Filter by Status - Submitted
1. [ ] Select "Submitted" from status filter
2. [ ] **Expected**:
   - No claims visible yet (empty state)
   - Message like "No claims found" should display

#### Test Case 5.5: Filter by Status - Approved
1. [ ] Select "Approved" from status filter
2. [ ] **Expected**: No claims visible yet (empty state)

### D. Update Claim Status

#### Test Case 6.1: Verify Initial User is Alice (Submitter)
1. [ ] Check the user dropdown in header
2. [ ] **Expected**: "Alice" should be displayed
3. [ ] Navigate to Claims page
4. [ ] **Expected**: Draft claims should show "Submit" button

#### Test Case 6.2: Submit a Draft Claim (as Submitter)
1. [ ] Ensure you're logged in as Alice (Submitter role)
2. [ ] Find "Acme Corporation Ltd" claim (should be Draft)
3. [ ] Locate the "Submit" button on the claim card
4. [ ] Click "Submit" button
5. [ ] **Expected**:
   - Success toast notification
   - Status badge changes from gray "Draft" to blue "Submitted"
   - Submit button disappears
   - No "Approve" button appears (submitters can't approve)
   - Claim updates immediately without page refresh

#### Test Case 6.3: Switch to Reviewer and Verify Buttons
1. [ ] Click user dropdown in header
2. [ ] Select "Bob" (Reviewer role)
3. [ ] **Expected**: Header shows "Bob"
4. [ ] View Claims list
5. [ ] **Expected**:
   - Draft claims have NO action buttons
   - Submitted claim (Acme Corp) has "Approve" button
   - Approved claims have NO action buttons

#### Test Case 6.4: Approve a Submitted Claim (as Reviewer)
1. [ ] Ensure you're logged in as Bob (Reviewer role)
2. [ ] Find "Acme Corporation Ltd" claim (should be Submitted)
3. [ ] Click "Approve" button
4. [ ] **Expected**:
   - Success toast notification
   - Status badge changes from blue "Submitted" to green "Approved"
   - Approve button disappears
   - No further action buttons available
   - Claim updates immediately

#### Test Case 6.5: Verify Status Filters After Updates
1. [ ] Select "Draft" filter
2. [ ] **Expected**: Only 1 claim visible (TechStart)
3. [ ] Select "Submitted" filter
4. [ ] **Expected**: No claims (Acme Corp was approved)
5. [ ] Select "Approved" filter
6. [ ] **Expected**: 1 claim visible (Acme Corporation Ltd)
7. [ ] Select "All" filter
8. [ ] **Expected**: Both claims visible

### E. Link/Unlink Projects to Claims

#### Test Case 7.1: View Manage Projects Interface
1. [ ] Find "TechStart Innovations Ltd" claim (should have no projects)
2. [ ] Locate "Manage Projects" button/section
3. [ ] Click "Manage Projects" button
4. [ ] **Expected**:
   - Section expands to show project management interface
   - Button text changes to "Cancel" or similar
   - Shows "No projects linked" or empty project list
   - Shows "Add Projects" or similar expandable section

#### Test Case 7.2: Link Project to Existing Claim
1. [ ] In the expanded project management section
2. [ ] Find the "Add Projects" or similar section
3. [ ] Select `AI Algorithm Development` from the project selector
4. [ ] Click "Link Selected Projects" button
5. [ ] **Expected**:
   - Success toast: "Projects linked successfully"
   - Project appears in the claim's project list immediately
   - Project shows name and description
   - "Remove" (x) button appears next to the project
   - Section updates without page refresh

#### Test Case 7.3: Link Multiple Projects in Single Operation
1. [ ] Ensure the claim has NO projects linked (or unlink all first)
2. [ ] Click "Manage Projects" to open project management
3. [ ] In the project selector, check BOTH:
   - `AI Algorithm Development`
   - `Quantum Computing Research`
4. [ ] Verify selection count shows "2 projects" selected
5. [ ] Click "Link Selected Projects" button
6. [ ] **Expected**:
   - Success toast: "Projects linked successfully"
   - BOTH projects appear in list immediately
   - Claim now shows 2 linked projects
   - Both projects have remove buttons
   - Both were added in a single API call

#### Test Case 7.4: Unlink a Project
1. [ ] Find the "Remove" (x) button next to `Quantum Computing Research`
2. [ ] Click the remove button
3. [ ] **Expected**:
   - Success toast: "Project unlinked successfully"
   - Project removed from claim's project list immediately
   - Claim now shows 1 linked project
   - Project still exists in Projects list (not deleted)

#### Test Case 7.5: Close Project Management
1. [ ] Click "Cancel" or "Manage Projects" button to collapse the section
2. [ ] **Expected**: Project management section collapses back to summary view

#### Test Case 7.6: Verify Projects Not Deleted
1. [ ] Navigate to Projects page
2. [ ] **Expected**: Both projects still exist in the list
3. [ ] **Note**: Unlinking a project from a claim does NOT delete the project

---

## Part 3: User Role Switching

### Test Case 8.1: Switch to Alice (Submitter)
1. [ ] Click user dropdown in header
2. [ ] Select "Alice"
3. [ ] **Expected**: Header displays "Alice"
4. [ ] Navigate to Claims page
5. [ ] **Expected**:
   - Draft claims show "Submit" button
   - Submitted claims show NO action buttons
   - Approved claims show NO action buttons

### Test Case 8.2: Switch to Bob (Reviewer)
1. [ ] Click user dropdown in header
2. [ ] Select "Bob"
3. [ ] **Expected**: Header displays "Bob"
4. [ ] Navigate to Claims page
5. [ ] **Expected**:
   - Draft claims show NO action buttons
   - Submitted claims show "Approve" button
   - Approved claims show NO action buttons

### Test Case 8.3: User Persistence Across Refresh
1. [ ] Ensure Bob is selected
2. [ ] Refresh the page (F5)
3. [ ] **Expected**:
   - Bob is still the current user (persisted in localStorage)
   - Role-based buttons are still correct

---

## Part 4: UI/UX Testing

### A. Navigation

#### Test Case 9.1: Navigation Between Pages
1. [ ] Click "Claims" in header navigation
2. [ ] **Expected**: Claims list loads, URL is `/`
3. [ ] Click "Projects" in header navigation
4. [ ] **Expected**: Projects list loads, URL is `/projects`
5. [ ] Use browser back button
6. [ ] **Expected**: Returns to Claims page
7. [ ] Use browser forward button
8. [ ] **Expected**: Returns to Projects page

#### Test Case 9.2: Create Buttons Navigate Correctly
1. [ ] From Projects list, click "Create New Project"
2. [ ] **Expected**: URL changes to `/projects/new`
3. [ ] Navigate back, click "Claims" in header
4. [ ] Click "Create New Claim"
5. [ ] **Expected**: URL changes to `/claims/new`

### B. Loading States

#### Test Case 10.1: Loading Indicators on Forms
1. [ ] Fill out a claim or project form
2. [ ] Click submit button
3. [ ] **Expected**:
   - Button text changes to "Creating..." or similar
   - Button may be disabled during submission
   - Loading indicator visible (if implemented)
   - User cannot double-click submit

#### Test Case 10.2: Initial Page Load
1. [ ] Refresh the Claims page
2. [ ] **Expected**:
   - Brief "Loading claims..." message may appear
   - Then content loads
   - No flash of empty state or error

---

## Part 5: Data Persistence Testing

### Test Case 13.1: Page Refresh Persists Data
1. [ ] Note current number of projects and claims
2. [ ] Refresh the page (F5)
3. [ ] **Expected**:
   - All projects still appear
   - All claims still appear
   - Data persisted in mock server memory

### Test Case 13.2: User Selection Persisted
1. [ ] Select Bob as current user
2. [ ] Refresh the page
3. [ ] **Expected**:
   - Bob is still selected (localStorage)
   - Role-based buttons are correct

### Test Case 13.3: Mock Server Restart Clears Data
1. [ ] Stop the backend mock server
2. [ ] Restart the backend mock server
3. [ ] Refresh the frontend
4. [ ] **Expected**:
   - All projects and claims are GONE (in-memory storage cleared)
   - Empty state messages appear
   - No errors in console
   - Can create new data from scratch

---

## Part 6: Final Verification

### Test Case 15.1: Clean State Test
1. [ ] Stop and restart backend server (clears in-memory data)
2. [ ] Refresh frontend
3. [ ] **Expected**:
   - Empty state shows on Claims page
   - Empty state shows on Projects page
   - No errors in console
4. [ ] Create 1 project
5. [ ] Create 1 claim linked to that project
6. [ ] **Expected**: End-to-end flow works from empty state

### Test Case 15.2: Complete User Journey
1. [ ] As Alice (Submitter):
   - Create a project
   - Create a claim with that project linked
   - Submit the claim (Draft → Submitted)
2. [ ] Switch to Bob (Reviewer):
   - Verify can see submitted claim
   - Approve the claim (Submitted → Approved)
3. [ ] Switch back to Alice:
   - Verify claim shows as Approved
   - Verify cannot change status anymore
4. [ ] **Expected**: Complete workflow functions correctly

---

## Summary Checklist

After completing all tests above, verify:

- [ ] **Claims**: Create and view work correctly
- [ ] **Projects**: Create and view work correctly
- [ ] **Linking**: Can link and unlink projects to/from claims
- [ ] **Status Updates**: Draft → Submitted → Approved flow works
- [ ] **Role-Based**: Submitter and Reviewer roles behave correctly
- [ ] **Validation**: All form validation works as expected
- [ ] **Filtering**: Status filter works correctly on Claims page
- [ ] **Error Handling**: Errors show user-friendly messages
- [ ] **User Switching**: Can switch between Alice and Bob
- [ ] **Data Persistence**: Data persists across page refreshes (until server restart)
- [ ] **No Console Errors**: Console is clean during normal operation
- [ ] **Network Requests**: All API calls succeed with correct data

---

## Known Limitations (By Design)

These are **intentional MVP limitations**, not bugs:

1. **No Edit Functionality**: Projects and claims cannot be edited after creation (except claim status can change)
2. **No Delete Functionality**: Projects and claims cannot be deleted
3. **No Cancel Buttons**: Forms only have Submit buttons, navigate away to cancel
4. **No Detail Pages**: Clicking on cards doesn't navigate anywhere
5. **No Confirmation Dialogs**: Actions happen immediately
6. **In-Memory Storage**: Restarting backend server clears all data
7. **Simple Filtering**: Only status filter for claims, no search or advanced filters
8. **No Pagination**: All items shown in a single list

---

## Found Issues Log

Use this section to document any **actual bugs** found during testing (not the known limitations above):

| Test Case | Issue Description | Severity | Steps to Reproduce |
|-----------|------------------|----------|-------------------|
| Example: 3.1 | Amount formatting shows wrong decimal places | Medium | Create claim with amount 500, displays incorrectly |
|  |  |  |  |
|  |  |  |  |

**Severity Levels:**
- **Critical**: Blocking functionality, data loss, or security issue
- **High**: Major feature broken, workaround exists
- **Medium**: Minor feature broken or UX issue
- **Low**: Cosmetic issue, typo, or nice-to-have

---

## Notes

- This checklist reflects the **actual MVP implementation** with focused features
- Mock server retains data in memory only during the session
- Frontend uses localStorage only for current user preference
- All monetary amounts are stored in pence (e.g., 50000 pence = £500.00)
- Dates use ISO 8601 format: `YYYY-MM-DD`
- Focus testing on features that exist, not on missing features

**Estimated Testing Time:** 1-2 hours for complete thorough testing
