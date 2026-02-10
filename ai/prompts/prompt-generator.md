# Prompt Generator (TitanOS)

## Coverage gaps
Act as: ai/agents/30-coverage-hunter.md
Apply skills: focus-contract, selector-policy, test-quality-bar, no-sleeps
Task: Based on current repo structure (pages/components/flows/tests), list:
- current covered journeys
- top 5 missing P0/P1 tests
For each missing test provide: remote steps + focus checkpoints + expected outcome + flake risks.

## PR review
Act as: ai/agents/40-pr-hygiene-reviewer.md
Apply skills: pr-checklist, focus-contract, selector-policy, no-sleeps
Task: Review this diff and output blocking + non-blocking + improved PR description.

## Flaky diagnosis
Act as: ai/agents/20-focus-doctor.md
Apply skills: focus-contract, no-sleeps
Task: Given failing test + trace/logs, identify root cause and propose code-ready fix.

## Journey mapping
Act as: ai/agents/10-remote-navigation-scout.md
Apply skills: focus-contract, selector-policy
Task: Map P0/P1 journeys for Channels/Favorites/Search/Player and propose stable checkpoints.