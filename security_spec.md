# Zero-Trust Security Specification (Phase 0)

This document maps data integrity bounds and evaluates the application against unauthorized access vectors.

## 1. Data Invariants

1. **Customers Directory**:
   - Only authorized and logged-in Super Administrators can modify or suspend customer profiles.
   - Every customer must have a valid name, email, and phone number.
   - Custom field keys inside customer profiles like `status` must be validated to prevent arbitrary state alteration.

2. **Mistris / Technicians list**:
   - Technicians' NID numbers and identity verification documents must exist.
   - Authenticated Admins approve or suspend technicians. Changing these values is forbidden for public requests.
   - Featured flag updates are strictly controlled.

3. **Booking Dispatches**:
   - Only the assigned technician or original customer may read detailed operational dispatches.
   - Status updates must transition through correct state paths.

## 2. The Dirty Dozen Payloads (Malicious Vectors)

1. **Unauthenticated NID Injection (Customer)**: Injecting NID card values into an random user's document path.
2. **Privilege Escalation (Customer)**: Promoting a normal user status to unrestricted Admin status.
3. **Malicious ID Poisoning**: Registering a technician with an ID that has a 12KB length.
4. **Self-Featured Status Creation**: Setting `isFeatured: true` from client SDK without admin verification.
5. **Rating Spoofing**: Artificially overwriting `rating` to 5.0 without valid completed jobs.
6. **Negative Payout Modification**: Sending reverse transaction numbers or empty revenue amounts.
7. **Bypassing NID Verification**: Direct field injection of `nidVerified: true` from web console without NID pdf proof validation.
8. **Suspended Activation Bypass**: Reactivating a suspended account by spoofing status flags.
9. **Spamming System Logs**: Dumping fake terminal logs via client.
10. **Hijacking Active Dispatches**: Modifying other clients' active bookings status codes.
11. **Negative Spare pricing**: Listing shop items with negative values or free costs.
12. **Promo Theft**: Overwriting expired coupon dates or setting 100% fixed monetary discounts.

---

## 3. Deployment Rules Draft Plan

We will enforce exact rules validation using `firestore.rules` containing strong schema checkers.
