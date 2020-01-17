import { Color } from "../../../src/graphics/color";
import { expect } from "chai";
import "mocha";

describe("Color", () =>
{
    describe("FromHexString()", () =>
    {
        it("all components are within the range [0, 255] for all hex strings", () =>
        {
            const color = Color.FromHexString("#000000ff");

            expect(color.getR()).to.be.within(0, 255);
            expect(color.getG()).to.be.within(0, 255);
            expect(color.getB()).to.be.within(0, 255);
            expect(color.getA()).to.be.within(0, 255);
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

    describe("equals()", () =>
    {
        it("always returns true when tested against the exact same color", () =>
        {
            const color = new Color(0xabcdef00);

            expect(color.equals(color)).to.be.true;
        });

        it("accounts for differences in alpha", () =>
        {
            const color1 = new Color(0xabcdef00);
            const color2 = new Color(0xabcdef01);

            expect(color1.equals(color2)).to.be.false;
        });
    });
});