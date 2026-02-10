# Selector Policy

Prefer in order:
1) data-testid / data-test / data-qa
2) TitanOS identity attributes (data-id, aria-label)
3) role + accessible name
Avoid:
- deep CSS chains
- XPath unless last resort

Selectors must be resilient to layout changes.