import re

with open('DAILY_CHECKLIST.md', 'r') as f:
    content = f.read()

# Make sure we don't duplicate
if 'Selling Flow' not in content:
    with open('DAILY_CHECKLIST.md', 'a') as f:
        f.write("\n- **2026-09-20**:\n")
        f.write("  - Implemented Selling Flow (8% Standard Seller Fee). Created `/sell` page and `/api/sell` endpoint.\n")
        f.write("  - Added Adyen KYC verification simulation and banner, inventory selection, and dynamic fee calculation (6% for >$1000 items).\n")
