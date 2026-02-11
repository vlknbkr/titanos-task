# PR Checklist for New Tests

## Stability Checks
- [ ] **No `waitForTimeout`**: Are there any hard sleeps?
- [ ] **No `networkidle`**: Does it rely on network silence?
- [ ] **Smart Locators**: Are `data-testid` attributes used?
- [ ] **Focus Assertions**: (TV Apps) Does every navigation step verify focus?

## Framework Compliance (Frozen Zones)
- [ ] **No changes to `packages/shared/`**?
- [ ] **No changes to `apps/ui/fixtures/`**?
  - *Note*: If you need a new fixture, create a local fixture in the test file or discuss with the architect.

## Isolation
- [ ] **Self-cleaning**: Does the test clean up data after itself?
- [ ] **Unique Data**: Does it use unique names/IDs to avoid collisions with other parallel tests?
