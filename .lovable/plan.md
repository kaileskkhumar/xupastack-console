

## Buy Me a Coffee Integration

BMC link: `https://buymeacoffee.com/kailesk`

### Changes

#### 1. Copy QR code image to project
Copy `user-uploads://bmc_qr.png` → `src/assets/bmc-qr.png` for use in components.

#### 2. Create `src/components/console/DonationPopup.tsx`
A modal dialog that appears once after gateway creation. Emotional solo-founder appeal:
- "You just created your first gateway — for free."
- "I'm Kailesk, a solo founder funding XupaStack out of pocket. Every coffee keeps this service alive and free for everyone."
- QR code image + "Buy Me a Coffee" button linking to `https://buymeacoffee.com/kailesk`
- "Maybe later" dismiss button
- Uses `localStorage` key `xupastack_donated_dismissed` so it only shows once per browser.

#### 3. Create `src/components/console/DonationBanner.tsx`
A slim sticky top strip for the console dashboard:
- "XupaStack is free because of people like you — Support the solo founder behind it" + ☕ Buy Me a Coffee button
- Dismissible with an X (stores in localStorage so it stays dismissed)

#### 4. Update `src/components/layout/ConsoleLayout.tsx`
Add `<DonationBanner />` above `<main>` so it's visible on all console pages.

#### 5. Update `src/pages/console/ConsoleNew.tsx`
After successful `createApp.mutateAsync()`, set a flag (e.g. `localStorage.setItem("xupastack_show_donation", "1")`) before navigating.

#### 6. Update `src/pages/console/ConsoleDetail.tsx`
On mount, check for the `xupastack_show_donation` flag. If set, show `<DonationPopup />` and clear the flag.

#### 7. Update `src/pages/Donate.tsx`
- Replace placeholder "Donate" buttons with actual links to `https://buymeacoffee.com/kailesk`
- Add the QR code image
- Add personal solo-founder copy

#### 8. Update `src/components/console/detail/DonationCard.tsx` and `src/components/home/DonateSection.tsx`
Point all donation links to `https://buymeacoffee.com/kailesk` instead of `/donate` (or keep `/donate` as an intermediary — both link through).

