import { describe, expect, it } from "vitest";
import { translations } from "./translations.js";

describe("language translations", () => {
  it("keeps English and Urdu UI keys in sync", () => {
    expect(Object.keys(translations.ur).sort()).toEqual(
      Object.keys(translations.en).sort(),
    );
    expect(Object.keys(translations.ur.categories).sort()).toEqual(
      Object.keys(translations.en.categories).sort(),
    );
    expect(Object.keys(translations.ur.badges).sort()).toEqual(
      Object.keys(translations.en.badges).sort(),
    );
    expect(Object.keys(translations.ur.products).sort()).toEqual(
      Object.keys(translations.en.products).sort(),
    );

    for (const productId of Object.keys(translations.en.products)) {
      expect(Object.keys(translations.ur.products[productId]).sort()).toEqual(
        Object.keys(translations.en.products[productId]).sort(),
      );
    }
  });
});
