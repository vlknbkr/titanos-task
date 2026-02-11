# Stability Contract (TitanOS)

Primary goal: New test cases must be stable by default.

Rules:
- No arbitrary sleeps as primary sync.
- All remote-driven flows must have focus checkpoints.
- Focus truthy values include "true" and "focused".
- Use state-based waits:
  - focused element truthy
  - overlay visible/hidden
  - route/assertion (URL or app-level marker)
- Prefer flow-layer journeys over test-level raw steps.
- Each new test must include: flake risks + mitigations.