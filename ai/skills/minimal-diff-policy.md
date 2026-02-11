# Minimal Diff Policy

- Change the smallest surface area possible.
- Fix at the nearest layer:
  - selectors -> component/page
  - navigation intent -> flow
  - checkpoints -> test/flow
- Do not introduce new abstractions unless necessary.
- Never add sleeps as first choice.
- Any fix must include a quick verification plan.