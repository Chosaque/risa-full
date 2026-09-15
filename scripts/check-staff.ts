import assert from "node:assert/strict";
import { safePhotoUrl, validateStaff } from "../src/lib/staff";

const valid = { name_th: "ทดสอบ", email: "person@example.org", phone: "+66 2 123 4567", photo_url: "https://example.org/photo.jpg", photo_position: "top" };
assert.equal(validateStaff(valid), null);
assert.equal(validateStaff({ name_th: "ทดสอบ" }), null, "contacts and photo are optional");
assert.ok(validateStaff({ ...valid, name_th: " " }));
assert.ok(validateStaff({ ...valid, email: "invalid" }));
assert.ok(validateStaff({ ...valid, phone: "javascript:alert(1)" }));
assert.ok(validateStaff({ ...valid, photo_position: "random" }));
assert.ok(validateStaff({ ...valid, bio_en: "a".repeat(2001) }));
assert.equal(safePhotoUrl("javascript:alert(1)"), "");
assert.equal(safePhotoUrl("//example.org/tracker"), "");
assert.equal(safePhotoUrl("/uploads/portrait.jpg"), "/uploads/portrait.jpg");
assert.equal(safePhotoUrl(valid.photo_url), valid.photo_url);
console.log("Staff profile validation: 11 checks passed.");
