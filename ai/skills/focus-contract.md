# TitanOS Focus Contract

Focus indicator:
- Use attribute: data-focused
- Truthy values include: "true" and "focused" (also "1", "yes", "" if applicable)

Rules:
- Prefer asserting focus via shared helpers:
  - assertFocused(locator)
  - waitForFocused(locator)
- Never add sleeps to stabilize focus.
- For OK actions:
  - Do focus precondition checks before pressing OK (guardrail)
  - Validate outcome (route/modal/player) in flow/page layer