#!/usr/bin/env python3
"""Package a skill directory into .skill zip artifact."""

from __future__ import annotations

import argparse
import os
import pathlib
import subprocess
import zipfile

EXCLUDE_DIRS = {"__pycache__", "runs", ".tokens"}
EXCLUDE_SUFFIXES = {".pyc", ".pyo"}

CODEX_HOME = pathlib.Path(os.getenv("CODEX_HOME", str(pathlib.Path.home() / ".codex")))
VALIDATOR = CODEX_HOME / "skills/.system/skill-creator/scripts/quick_validate.py"


def _validate(skill_dir: pathlib.Path) -> None:
    result = subprocess.run(
        ["python3", str(VALIDATOR), str(skill_dir)],
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(f"Skill validation failed:\n{result.stdout}\n{result.stderr}")


def _iter_files(skill_dir: pathlib.Path):
    for path in skill_dir.rglob("*"):
        if path.is_dir():
            if path.name in EXCLUDE_DIRS:
                continue
            continue
        if any(part in EXCLUDE_DIRS for part in path.parts):
            continue
        if path.suffix in EXCLUDE_SUFFIXES:
            continue
        yield path


def package_skill(skill_dir: pathlib.Path, output: pathlib.Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    root_name = skill_dir.name

    with zipfile.ZipFile(output, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        for file_path in _iter_files(skill_dir):
            rel = file_path.relative_to(skill_dir)
            archive_name = pathlib.Path(root_name) / rel
            zf.write(file_path, archive_name.as_posix())


def main() -> None:
    parser = argparse.ArgumentParser(description="Package skill folder into .skill zip")
    parser.add_argument("--skill-dir", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--validate", action="store_true")
    args = parser.parse_args()

    skill_dir = pathlib.Path(args.skill_dir).resolve()
    output = pathlib.Path(args.output).resolve()

    if not skill_dir.exists() or not skill_dir.is_dir():
        raise SystemExit(f"Skill directory not found: {skill_dir}")

    if args.validate:
        _validate(skill_dir)

    package_skill(skill_dir, output)
    print(f"[OK] Packaged skill: {output}")


if __name__ == "__main__":
    main()
