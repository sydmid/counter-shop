import re

with open('DAILY_CHECKLIST.md', 'r') as f:
    content = f.read()

# Make sure we don't duplicate
if 'High Trustpilot rating (4.8–4.9/5 from 35,000+ reviews)' not in content and False:
    with open('DAILY_CHECKLIST.md', 'a') as f:
        f.write("\n- **2026-10-04**:\n")
        f.write("  - Implemented High Trustpilot rating (4.8–4.9/5 from 35,000+ reviews).\n")
        f.write("  - Added Trustpilot rating component to `app/page.tsx` beneath the hero section's trusted badge.\n")
        f.write("  - Added Trustpilot rating to `components/layout/Footer.tsx` along with API latency.\n")

if 'Implemented High Trustpilot rating' not in content:
  with open('DAILY_CHECKLIST.md', 'a') as f:
      f.write("\n- **2026-10-04**:\n")
      f.write("  - Implemented High Trustpilot rating (4.8–4.9/5 from 35,000+ reviews).\n")
      f.write("  - Added Trustpilot rating component to `app/page.tsx` beneath the hero section's trusted badge.\n")
      f.write("  - Added Trustpilot rating to `components/layout/Footer.tsx` along with API latency.\n")
