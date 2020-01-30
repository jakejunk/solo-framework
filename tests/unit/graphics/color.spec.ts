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

        it("all components are correctly ordered", () =>
        {
            const color = Color.FromHexString("#12345678");

            expect(color.getR()).to.equal(0x12);
            expect(color.getG()).to.equal(0x34);
            expect(color.getB()).to.equal(0x56);
            expect(color.getA()).to.equal(0x78);
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

    describe("FromInt()", () =>
    {
        it("all components are correctly ordered", () =>
        {
            const color = Color.FromInt(0x12345678);

            expect(color.getR()).to.equal(0x12);
            expect(color.getG()).to.equal(0x34);
            expect(color.getB()).to.equal(0x56);
            expect(color.getA()).to.equal(0x78);
        });
    });

    describe("FromComponents()", () =>
    {
        it("all components are correctly assigned", () =>
        {
            const color = Color.FromComponents(0x12, 0x34, 0x56, 0x78);

            expect(color.getR()).to.equal(0x12);
            expect(color.getG()).to.equal(0x34);
            expect(color.getB()).to.equal(0x56);
            expect(color.getA()).to.equal(0x78);
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

    describe("setR()", () =>
    {
        it("roundtrips with getR()", () =>
        {
            const value = 4;
            const color = Color.FromInt(0);

            color.setR(value);

            expect(color.getR()).to.equal(value);
        });

        it("values > 255 do not affect other components", () =>
        {
            const color = Color.FromInt(0);

            color.setR(500);

            expect(color.getG()).to.equal(0);
            expect(color.getB()).to.equal(0);
            expect(color.getA()).to.equal(0);
        });
    });

    describe("setG()", () =>
    {
        it("roundtrips with getG()", () =>
        {
            const value = 255;
            const color = Color.FromInt(0);

            color.setG(value);

            expect(color.getG()).to.equal(value);
        });

        it("values > 255 do not affect other components", () =>
        {
            const color = Color.FromInt(0);

            color.setG(500);

            expect(color.getR()).to.equal(0);
            expect(color.getB()).to.equal(0);
            expect(color.getA()).to.equal(0);
        });
    });

    describe("setB()", () =>
    {
        it("roundtrips with getB()", () =>
        {
            const value = 128;
            const color = Color.FromInt(0);

            color.setB(value);

            expect(color.getB()).to.equal(value);
        });

        it("values > 255 do not affect other components", () =>
        {
            const color = Color.FromInt(0);

            color.setB(500);

            expect(color.getR()).to.equal(0);
            expect(color.getG()).to.equal(0);
            expect(color.getA()).to.equal(0);
        });
    });

    describe("setA()", () =>
    {
        it("roundtrips with getA()", () =>
        {
            const value = 12;
            const color = Color.FromInt(0);

            color.setA(value);

            expect(color.getA()).to.equal(value);
        });

        it("values > 255 do not affect other components", () =>
        {
            const color = Color.FromInt(0);

            color.setA(500);

            expect(color.getR()).to.equal(0);
            expect(color.getG()).to.equal(0);
            expect(color.getB()).to.equal(0);
        });
    });
});