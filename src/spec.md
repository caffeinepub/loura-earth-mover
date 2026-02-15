# Specification

## Summary
**Goal:** Enable admin-only uploading and management of Gallery photos stored in canister state, and render uploaded photos in the public Gallery with a fallback to existing static images.

**Planned changes:**
- Add backend canister-state storage and admin-only APIs to upload gallery images (bytes, content type, filename, optional alt text), list images (metadata only), fetch an image by id (bytes + content type), and delete an image by id.
- Persist uploaded gallery images safely across canister upgrades while preserving existing stored state (inquiries, user profiles, access control), including a conditional migration if required.
- Add an admin-only Gallery management screen under the existing admin area (e.g., `#/admin/gallery`) to upload images, view the uploaded images list, and delete images with clear confirmation and English UI states/errors.
- Update the public Gallery to render uploaded images from the backend when present, otherwise continue showing the current three static local gallery assets; ensure lightbox navigation works for dynamically loaded images.
- Add React Query hooks for upload/list/fetch/delete and wire them into both the admin Gallery management UI and the public Gallery, including cache invalidation after upload/delete.

**User-visible outcome:** Admins can upload, view, and delete Gallery images in an admin page, and the public Gallery will show the uploaded images (or fall back to the existing static images when none are uploaded), with lightbox navigation working for both.
