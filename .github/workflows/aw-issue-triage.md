---
name: Triage new issues
emoji: "🤖"
description: Automatically triage newly created issues without changing code
on:
  roles: all
  reaction: eyes
  issues:
    types: [opened]
  skip-bots: [dependabot, renovate, github-actions, copilot]
permissions:
  contents: read
  issues: read
  pull-requests: read
checkout: false
model: gpt-5.6-terra
engine:
  id: codex
  env:
    OPENAI_BASE_URL: https://proxy.shopify.ai/v1
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
strict: true
imports:
  - shared/triage-core.md
max-daily-ai-credits: 200
timeout-minutes: 12
---

Follow the imported issue-triage instructions for the triggering issue.
