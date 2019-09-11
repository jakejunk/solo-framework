import { Color } from "../../../src/graphics/color";
import { expect } from "chai";
import "mocha";

describe("Color", () =>
{
    describe("FromHexString()", () =>
    {
        it("all components are within the range [0, 1] for all hex strings", () =>
        {
            const color = Color.FromHexString("#000000ff");

            expect(color.r).to.be.within(0, 1);
            expect(color.g).to.be.within(0, 1);
            expect(color.b).to.be.within(0, 1);
            expect(color.a).to.be.within(0, 1);
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

            expect(hexString).to.equal("#ff007ffe");
        });

        it("clamps when components are outside the range of [0, 1]", () =>
        {
            const hexString = new Color(2, 2, -1, 1.01).toHexString();

            expect(hexString).to.equal("#ffff00ff");
        });
    });

    describe("equals()", () =>
    {
        it("always returns true when tested against the exact same color", () =>
        {
            const color = new Color(1, 0, 0.5, 0.99999);

            expect(color.equals(color)).to.be.true;
        });

        it("accounts for differences in alpha", () =>
        {
            const color1 = new Color(1, 0, 0.5, 0.51);
            const color2 = new Color(1, 0, 0.5, 0.5);

            expect(color1.equals(color2)).to.be.false;
        });
    });
});
