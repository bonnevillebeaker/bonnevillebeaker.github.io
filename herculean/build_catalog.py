#!/usr/bin/env python3
"""Rebuild programs/index.xml and workouts/index.xml for the Herculean expert library.

Run this after adding, editing or removing files in programs/ or workouts/:
    python3 herculean/build_catalog.py
It lists every file, checks that each program's workout references exist,
and reports problems. Static web hosts can't list folders, so the app reads
these index files instead.

Herculean · Copyright (C) 2026 Coleman Nielsen · GNU GPL v3 or later.
"""
import sys
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def load(path):
    try:
        return ET.parse(path).getroot()
    except ET.ParseError as e:
        print(f"  ! {path.relative_to(ROOT)}: not valid XML ({e})")
        return None


def write_index(folder, kind, items):
    root = ET.Element("herculean-catalog", kind=kind, updated=date.today().isoformat())
    for it in sorted(items, key=lambda i: i["name"].lower()):
        ET.SubElement(root, "item", it)
    ET.indent(root)
    ET.ElementTree(root).write(folder / "index.xml", encoding="UTF-8", xml_declaration=True)
    print(f"  wrote {folder.name}/index.xml ({len(items)} {kind})")


def main():
    problems = 0
    workouts, wids = [], {}
    for f in sorted((ROOT / "workouts").glob("*.xml")):
        if f.name == "index.xml":
            continue
        r = load(f)
        w = r.find("workout") if r is not None else None
        if w is None:
            print(f"  ! workouts/{f.name}: no <workout> element"); problems += 1; continue
        wid = w.get("id", "")
        if not w.get("author"):
            print(f"  ! workouts/{f.name}: missing author"); problems += 1
        if wid in wids:
            print(f"  ! workouts/{f.name}: id '{wid}' already used by {wids[wid]}"); problems += 1
        wids[wid] = f.name
        n = len(w.findall("exercise"))
        workouts.append({"file": f"workouts/{f.name}", "id": wid, "name": w.get("name", f.stem),
                         "author": w.get("author", ""), "summary": f"{n} exercise{'s' if n != 1 else ''}"})

    programs = []
    for f in sorted((ROOT / "programs").glob("*.xml")):
        if f.name == "index.xml":
            continue
        r = load(f)
        p = r.find("program") if r is not None else None
        if p is None:
            print(f"  ! programs/{f.name}: no <program> element"); problems += 1; continue
        if not p.get("author"):
            print(f"  ! programs/{f.name}: missing author"); problems += 1
        refs = p.findall("workout")
        for w in refs:
            ref, src = w.get("ref"), w.get("src")
            if ref and (not src or not (ROOT / src).exists()):
                print(f"  ! programs/{f.name}: workout '{ref}' points to missing file {src}"); problems += 1
        loop = p.find("loop")
        days = len(loop.findall("slot")) if loop is not None else 0
        train = sum(1 for s in (loop.findall("slot") if loop is not None else []) if s.get("workout"))
        programs.append({"file": f"programs/{f.name}", "id": p.get("id", f.stem), "name": p.get("name", f.stem),
                         "author": p.get("author", ""),
                         "summary": f"{days}-day loop, {train} training day{'s' if train != 1 else ''}, {len(refs)} workouts"})

    write_index(ROOT / "workouts", "workouts", workouts)
    write_index(ROOT / "programs", "programs", programs)
    print("Done." if not problems else f"Done with {problems} problem(s) above.")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
