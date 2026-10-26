#!/usr/bin/env python3
"""Exit 1 if any commit in a revision range has AI agent git attribution.

Mirrors the check from developer-az/tennis-court-reserve-umd commit a72906d,
and also rejects Copilot co-author trailers, other coding-agent co-author
trailers, and lines that say the change was generated with an agent.
"""
from __future__ import annotations

import re
import subprocess
import sys

# Reference patterns from a72906d.
_AGENT_PATTERNS = (
    re.compile(r"cursoragent@cursor\.com", re.IGNORECASE),
    re.compile(r"^\s*co-authored-by:\s*cursor\b", re.IGNORECASE | re.MULTILINE),
    re.compile(r"^\s*made-with:\s*cursor\b", re.IGNORECASE | re.MULTILINE),
    re.compile(r"^\s*claude-session:", re.IGNORECASE | re.MULTILINE),
    re.compile(r"co-authored-by:.*@anthropic\.com", re.IGNORECASE),
    # Copilot, Claude by name, and other coding-agent co-author trailers.
    re.compile(
        r"^\s*co-authored-by:.*\b("
        r"cursor|claude|copilot|chatgpt|openai|devin|codeium|windsurf|"
        r"aider|codewhisperer|gemini|grok|cline|anthropic|tabnine|"
        r"amazon q"
        r")\b",
        re.IGNORECASE | re.MULTILINE,
    ),
    re.compile(r"generated with\b", re.IGNORECASE),
)


def message_has_agent_attribution(message: str) -> bool:
    return any(pattern.search(message) for pattern in _AGENT_PATTERNS)


def commits_in_range(rev_range: str) -> list[str]:
    result = subprocess.run(
        ["git", "rev-list", rev_range],
        capture_output=True,
        text=True,
        check=True,
    )
    return [line.strip() for line in result.stdout.splitlines() if line.strip()]


def commit_message(sha: str) -> str:
    result = subprocess.run(
        ["git", "log", "-1", "--format=%B", sha],
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout


def main() -> None:
    if len(sys.argv) != 2:
        print("usage: check-agent-commit-trailers.py <rev-range>", file=sys.stderr)
        sys.exit(2)

    rev_range = sys.argv[1]
    if rev_range.strip() == "":
        return

    violations: list[str] = []
    for sha in commits_in_range(rev_range):
        message = commit_message(sha)
        if message_has_agent_attribution(message):
            short = subprocess.run(
                ["git", "rev-parse", "--short", sha],
                capture_output=True,
                text=True,
                check=True,
            ).stdout.strip()
            violations.append(short)

    if violations:
        print(
            "Commits must not include AI agent attribution "
            "(Co-authored-by trailers for Cursor, Claude, Copilot, or other "
            "coding agents, Made-with: Cursor, or Generated with lines).",
            file=sys.stderr,
        )
        for short in violations:
            print(f"  - {short}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
