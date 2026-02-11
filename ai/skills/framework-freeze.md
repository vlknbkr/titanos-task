# Framework Freeze (Hard Rule)

Default assumption: CORE FRAMEWORK IS STABLE AND FROZEN.

Do NOT modify unless explicitly requested:
- packages/shared/**
- apps/**/fixtures/**

Allowed changes:
- apps/**/tests/**
- apps/**/flows/**
- apps/**/pages/**
- apps/**/components/**

If you see improvements in frozen areas:
- list under "Optional improvements (do not apply)"
- do not include code changes for frozen areas