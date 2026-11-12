# Herculean Workout Tracker

A workout log that runs entirely in your browser. No server, no account. Your whole profile (programs, workout library, settings and every logged day) is saved as one XML file you control.

## Start

1. Keep `herculean.html` and the `herculean/` folder side by side and open `herculean.html` in Chrome or Edge on a computer.
2. Enter your name in the welcome window, then click **Create profile file…** and save `Herculean.xml` (the dialog opens in Documents). If you already have one, choose **Open my Herculean.xml** instead.
3. Log workouts. Changes are written to the file about every minute, and when you switch tabs or close the page.

Next visit, open `herculean.html` again and click **Reconnect Herculean.xml** (browsers ask once per visit before a page can write to a file).

### Phones and other browsers

iPhone, Android, Safari and Firefox can't write to a file automatically. The page says so and shows **Download Herculean.xml**. Tap it before you leave to save your log, and use **Load profile…** next time to open it.

## What's inside

| Tab | What it does |
| --- | --- |
| Log | A strip of every day in the current loop (done, missed, rest). Enter weight, reps, time, distance and pace per set. Progression cue per exercise, supersets, biometrics and notes. Add or skip exercises for the day, or use Log as you go with no plan. Rest timer with 0:30 to 2:00 presets or a custom time. |
| Archive | Every logged day, newest first, labeled with the workout and the program it fell under (or "One-off"). |
| Progress | Workouts per loop, volume, any biometric over time (with first, latest and change), loop history, and per-exercise trends (weight and estimated 1RM, or distance and pace). |
| Library | Programs (create, edit, activate or deactivate, copy, import, export; none is active at first), user submissions, reusable workouts (log any as a one-off or add to a program), and biometrics: body weight plus presets (blood pressure, resting heart rate, VO2 max, AHI, body fat, body-part circumferences) or your own. Units and weight jump are in Settings. |

## Authorship

Every program and workout carries an author. The first time someone opens Herculean, a welcome window asks for their name (and lb or kg) to create their profile; the name can't be changed later. Everything they create or copy is stamped "By your name" with the date. The author can't be changed in the app. Items written by someone else open read-only, and **Make my copy** gives you an editable copy credited "based on" the original author. If you change one of their workouts inside your own program, that workout becomes yours with the same credit.

## User submissions (`herculean/programs/` and `herculean/workouts/`)

When Herculean is served from your website, **Library → User submissions** lists everything in these two folders, and one tap copies an item into the user's library, credited to its author.

- `workouts/` holds one workout per file (`<herculean-workout>`).
- `programs/` holds one program per file (`<herculean-program>`). A program lists its loop and points to its workouts instead of copying them:
  `<workout ref="push-a" src="workouts/push-a.xml"/>`
- Paths like `src="workouts/push-a.xml"` are relative to the `herculean/` folder.
- Each folder has an `index.xml` the app reads, since static hosts can't list folders.

### Adding a submission

1. Put each workout file in `herculean/workouts/` and each program file in `herculean/programs/`. Ask contributors to use **Export** in Herculean so the author is already filled in, or add `author="Name"` to the `<workout>` or `<program>` tag yourself.
2. From the repo root, run `python3 herculean/build_catalog.py`. It rebuilds both `index.xml` files and warns about missing authors, duplicate ids, or programs pointing to workout files that don't exist.
3. Upload the folders.

Opened as a local file, user submissions can't load (browsers block it). Use **Import…** instead and select a program together with its workout files.

`herculean/examples/Herculean-example.xml` is a sample profile with 17 weeks of workouts and biometrics; open it to see a filled-in log (it replaces the profile in that browser).

## Files

Every file is named or namespaced for Herculean, so the whole set can be dropped into a repo that hosts other tools without overwriting anything.

```
herculean.html              the page (lives at the repo root)
herculean/
├── herculean.css           styles
├── herculean-core.js       app logic, charts, XML format
├── herculean-storage.js    saving to Herculean.xml and browser storage
├── hercule.svg             Hercule, the header logo and tab icon
├── programs/               submitted programs + index.xml
├── workouts/               submitted workouts + index.xml
├── build_catalog.py        rebuilds the two index.xml files
├── examples/               sample filled-in profile
├── LICENSE                 GNU General Public License v3
└── README.md
```

Browser storage uses keys starting with `ironlog.` and an IndexedDB database named `ironlog`, so it won't collide with other tools served from the same site.

## Hercule

Hercule, the Hercules beetle, lives in the header's logo slot (`herculean/hercule.svg`), in the same spot as the Smart Turtle and Dapper Studio mascots, and is the browser tab icon.

The page uses system fonts only, so it looks the same offline.

## License

Copyright (C) 2026 Coleman Nielsen

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. It is distributed WITHOUT ANY WARRANTY. See `LICENSE` for the full text.

The Herculean name and the Hercule character and logo are not licensed under the GPL and remain the property of Coleman Nielsen.
