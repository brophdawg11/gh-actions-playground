# Agentic Workflows Overview

New issues are triaged automatically. Repository administrators can request
re-triage, a focused fix, or a community PR review with the exact commands
`/triage`, `/fix`, and `/review`. Triage and review are read-only; fix is the
only code-writing workflow, and all model-proposed GitHub changes start in
staged mode.

## Maintainer quick reference

| Workflow                    | Trigger                                                                             | Agent capabilities                                                                       | Visible output                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `triage`                    | Every newly opened issue, or an exact `/triage` issue comment from an administrator | Read-only GitHub access; no checkout, shell, or file editing                             | At most one issue comment, two labels, one label removal, and one issue closure   |
| `fix`                       | An exact `/fix` issue comment from an administrator                                 | Trusted default-branch checkout, shell, file editing, tests, and read-only GitHub access | One constrained draft PR or one issue comment                                     |
| `review`                    | An exact `/review` PR comment from an administrator                                 | Read-only GitHub access; no checkout, shell, or file editing                             | One PR comment containing P1/P2/P3 findings                                       |
| `Triage Needs-Info Timeout` | Daily schedule or manual dispatch                                                   | Deterministic GitHub API script; no model invocation                                     | Preview summary, label removal after an author reply, or an expired issue closure |

All model-proposed GitHub writes are staged initially and pass through
fail-closed threat detection. The agent jobs themselves receive read-only
GitHub tokens. `triage` and `review` never execute issue, PR, or repository
content. `fix` is the only workflow with shell and edit access, and its draft
PR output is limited to eight files under `packages/**` or `demos/**`.
Manifests, lockfiles, root documentation, TypeScript/workspace configuration,
and `.github/**` are excluded.

Each comment-triggered workflow is limited to three runs per user per hour.
Daily AI-credit caps and per-run timeouts provide additional cost bounds.

## Needs-info timeout

Triage requests missing information by adding `needs-info` and asking the issue
author to reply in a new comment within seven days. Editing the issue body does
not reset the window.

The timeout workflow runs daily at 8:00 AM Eastern time and inspects at most
100 open issues carrying `needs-info`. It uses the latest label event as the
start of the window:

- A new comment from the issue author removes `needs-info`.
- Before seven full days, the issue is left unchanged.
- After seven days without an author reply, the workflow re-fetches the issue,
  label event, and comments. It closes only if the issue is still open, the
  same label application is still present, and no late reply appeared. It then
  posts a short explanation and closes with `not_planned`.

Scheduled enforcement starts disabled through `ENFORCE_SCHEDULED: "false"`, so
scheduled runs only write a preview to the workflow summary. A manual dispatch
also defaults to `dry_run: true`; a live manual run performs an administrator
permission check before processing. After reviewing preview output on real
issues, enable scheduled closure by changing `ENFORCE_SCHEDULED` to `"true"`.

## Development and rollout

Compile and validate agentic workflow sources with the installed `gh aw` CLI:

```sh
gh aw compile triage fix review --strict --validate --approve
gh aw validate triage fix review --strict
```

`--approve` accepts intentional action-manifest changes; review the generated
locks after every compile. Validation includes GitHub Actions schema checks and
the actionlint, zizmor, and poutine scanners.

Roll out in stages:

1. Merge with staged safe outputs and scheduled timeout enforcement disabled.
2. Exercise `/triage`, `/review`, and `/fix` on controlled issues and PRs;
   inspect threat-detection results and staged outputs before approval.
3. Enable each workflow's direct safe outputs only after its observed behavior
   is acceptable.
4. Review timeout previews for at least one full seven-day window, then enable
   scheduled enforcement separately.
