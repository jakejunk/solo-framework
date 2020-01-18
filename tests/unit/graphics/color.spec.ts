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
            const color = Color.FromHexString("Invalid");
            const result = color.equals(Color.BLACK);

            expect(result).to.be.true;
        });

        it("works for valid short-form hex strings", () =>
        {
            const color = Color.FromHexString("#000");
            const result = color.equals(Color.BLACK);

            expect(result).to.be.true;
        });

        it("works for valid long-form hex strings", () =>
        {
            const color = Color.FromHexString("#000000");
            const result = color.equals(Color.BLACK);

            expect(result).to.be.true;
        });

        it("works for valid short-form hex strings with alpha", () =>
        {
            const color = Color.FromHexString("#000f");
            const result = color.equals(Color.BLACK);

            expect(result).to.be.true;
        });

        it("works for valid long-form hex strings with alpha", () =>
        {
            const color = Color.FromHexString("#000000ff")
            const result = color.equals(Color.BLACK);

            expect(result).to.be.true;
        });
    });

    describe("equals()", () =>
    {
        it("always returns true when tested against the exact same color", () =>
        {
            const color = Color.FromInt(0xabcdef00);

            expect(color.equals(color)).to.be.true;
        });

        it("accounts for differences in alpha", () =>
        {
            const color1 = Color.FromInt(0xabcdef00);
            const color2 = Color.FromInt(0xabcdef01);

            expect(color1.equals(color2)).to.be.false;
        });
    });
});