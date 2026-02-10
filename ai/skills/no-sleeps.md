# No Sleeps Policy

- No waitForTimeout as a primary sync method.
- Wait on UI state:
  - focus becomes truthy
  - route changes
  - element visible/enabled
- If a test is flaky, fix root cause instead of adding sleeps.