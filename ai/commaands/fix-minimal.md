Act as ai/agents/60-minimal-failure-fixer.md.
Apply skills: framework-freeze, minimal-diff-policy, focus-contract, selector-policy, no-sleeps.

Task:
- Given failing test + error/trace, propose the smallest safe fix.
- Provide patch-ready code suggestions with exact file paths.
- Do not modify frozen areas.