# Stable Test Gate (Definition of Done)

Before merging a PR, every test must meet these stability criteria.

## 1. No Explicit Waits
- **Forbidden**: `await page.waitForTimeout(5000)`
- **Allowed**: `await expect(locator).toBeVisible({ timeout: 10000 })`
- **Exception**: Polling for backend state (use `expect.poll` or `await expect(async () => ...).toPass()`).

## 2. Review "Network Idle" Usage
- **Avoid**: `await page.waitForLoadState('networkidle')`. It is flaky for streaming/SPA apps.
- **Preferred**: Wait for specific UI element (`data-testid`) that signifies page ready.

## 3. Strict Selectors
- **Primary**: `[data-testid="my-element"]`
- **Secondary**: Role-based `page.getByRole('button', { name: 'Submit' })`
- **Avoid**: CSS structure selectors `.container > div > span`

## 4. Focus Management (TV/Console)
- If navigating via RemoteControl, you **MUST** assert focus state between steps if the UI changes.
- **Pattern**:
  ```javascript
  await remote.right();
  await expect(locator).toHaveAttribute('data-focused', 'focused');
  await remote.select();
  ```

## 5. Cleaning
- Tests must clean up their own state (favorites, created items) even if they fail.
- Use `test.afterEach` or custom fixtures with auto-cleanup.
