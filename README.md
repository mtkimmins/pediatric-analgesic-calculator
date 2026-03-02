# Pediatric Oral Analgesic Calculator (Web)

This repository contains a browser-based calculator converted from the spreadsheet `Pediatric Oral Analgesic Calculator.xlsx`.

## What it does

- Selects brand: `Tylenol` or `Advil`
- Selects formulation: `Infant Drops` or `Children's Liquid`
- Accepts weight in `kg` and `lbs` (uses kg when kg > 0; otherwise lbs / 2.2)
- Calculates:
  - Unrounded mg range
  - Unrounded mL dosing range
  - Rounded mL dose (nearest whole mL)
  - SIG text

## Run locally

Open `index.html` in your browser.

## Publish on GitHub Pages

1. Push this repository to GitHub.
2. Go to repository `Settings` -> `Pages`.
3. Under `Build and deployment`, choose `Deploy from a branch`.
4. Select branch `main` (or your default branch) and folder `/ (root)`.
5. Save. GitHub will provide a public URL.

## Medical disclaimer

This tool is for educational/informational use only. It is not medical advice and does not replace clinical judgment, local protocols, product monographs, or pharmacist/physician review.
