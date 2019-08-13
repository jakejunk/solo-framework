import { Color } from "../../src/graphics/color";
import { expect } from "chai";
import "mocha";

describe("Color", () =>
{
    describe("FromHexString()", () =>
    {
        it("all components are within the range [0, 1] for all hex strings", () =>
        {
            const color = Color.FromHexString("#000000ff");

            expect(color.r).within(0, 1);
            expect(color.g).within(0, 1);
            expect(color.b).within(0, 1);
            expect(color.a).within(0, 1);
        });

        it("returns Color.BLACK for all invalid hex strings", () =>
        {
            const result = Color.FromHexString("Invalid").equals(Color.BLACK);

            expect(result).to.be.true;
        });

        it("works for valid short-form hex strings", () =>
        {
            const result = Color.FromHexString("#000").equals(Color.BLACK);

            expect(result).to.be.true;
        });

        it("works for valid long-form hex strings", () =>
        {
            const result = Color.FromHexString("#000000").equals(Color.BLACK);

            expect(result).to.be.true;
        });

        it("works for valid short-form hex strings with alpha", () =>
        {
            const result = Color.FromHexString("#000f").equals(Color.BLACK);

            expect(result).to.be.true;
        });

        it("works for valid long-form hex strings with alpha", () =>
        {
            const result = Color.FromHexString("#000000ff").equals(Color.BLACK);

            expect(result).to.be.true;
        });
    });

    describe("toHexString()", () =>
    {
        it("works when all components are within the range [0, 1]", () =>
        {
            const hexString = new Color(1, 0, 0.5, 0.99999).toHexString();

            expect(hexString).equals("#ff007ffe");
        });

        it("clamps components outside of the range [0, 1]", () =>
        {
            const hexString = new Color(2, 2, -1, 1.01).toHexString();

            expect(hexString).equals("#ffff00ff");
        });
    });
});
