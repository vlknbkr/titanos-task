# AI Hard Rules — TitanOS QA System

## Core Framework Protection
The following folders are considered STABLE CORE and must NOT be modified unless explicitly requested:

- packages/shared/
- apps/ui/fixtures/
- apps/ui/pages/ (existing base structure)
- remote/focus engine

AI must NOT:
- refactor core framework
- change RemoteControl behavior
- change focus engine logic
- modify existing helper architecture
- suggest architectural rewrites

AI CAN:
- propose new tests
- propose new flows
- propose new page objects if missing
- suggest improvements as OPTIONAL only
- add new files without touching core

If improvement ideas exist:
→ list them under "Optional improvements (do not apply automatically)"

Default behavior:
ASSUME framework is production-stable and frozen.
Work around it, not against it.