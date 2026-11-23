import { describe, expect, it } from "vitest";
import { cartReducer } from "./cartReducer.js";

const mug = { id: "mug", name: "Ceramic mug", price: 28 };

describe("cartReducer", () => {
  it("adds a product and increments its quantity when added again", () => {
    const once = cartReducer([], { type: "add", product: mug });
    const twice = cartReducer(once, { type: "add", product: mug });

    expect(twice).toEqual([{ ...mug, quantity: 2 }]);
  });

  it("removes an item when its quantity is set to zero", () => {
    const state = [{ ...mug, quantity: 1 }];

    expect(cartReducer(state, { type: "set-quantity", id: mug.id, quantity: 0 }))
      .toEqual([]);
  });

  it("rejects invalid quantities and unknown actions", () => {
    expect(() =>
      cartReducer([], { type: "set-quantity", id: mug.id, quantity: -1 }),
    ).toThrow(RangeError);
    expect(() => cartReducer([], { type: "unexpected" })).toThrow(
      "Unknown cart action",
    );
  });

  it("clears every item", () => {
    expect(
      cartReducer([{ ...mug, quantity: 2 }], { type: "clear" }),
    ).toEqual([]);
  });
});
