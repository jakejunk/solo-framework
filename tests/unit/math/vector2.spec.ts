import { Vector2 } from "../../../src/math/vector2";
import { expect } from "chai";
import "mocha";

describe("Vector2", () =>
{
    describe("scale()", () =>
    {
        it("equals (0, 0) when scaled by 0", () =>
        {
            const v = new Vector2(47, 7);
            v.scale(0);

            expect(v.getLength()).to.equal(0);
        });

        it("equals (0, 0) if Vector2.ZERO is scaled by anything", () =>
        {
            const v = Vector2.ZERO;
            v.scale(768234);

            expect(v.getLength()).to.equal(0);
        });

        it("remains unchanged when scaled by 1", () =>
        {
            const v = new Vector2(35, 675);
            const originalLength = v.getLength();
            
            v.scale(1);

            expect(v.getLength()).to.equal(originalLength);
        });

        it("doubles in length when scaled by 2", () =>
        {
            const v = new Vector2(45, 67);
            const originalLength = v.getLength();
            
            v.scale(2);

            expect(v.getLength()).to.equal(originalLength * 2);
        });
    });

    describe("normalize()", () =>
    {
        it("does not change the length of Vector2.ZERO", () =>
        {
            const v = Vector2.ZERO;
            v.normalize();

            expect(v.getLength()).to.equal(0);
        });

        it("results in length ~= 1, for any non-zero vector", () =>
        {
            const v = new Vector2(0.1, 0.1);
            v.normalize();

            expect(v.getLength()).to.be.within(0.9999999999999999, 1.000000000000001);
        });
    });

    describe("dot()", () =>
    {
        it("is the sum of the products of each component", () =>
        {
            const x1 = 25;
            const y1 = 75;
            const x2 = 3;
            const y2 = 5;
            const v1 = new Vector2(x1, y1);
            const v2 = new Vector2(x2, y2);

            expect(v1.dot(v2)).to.equal(x1 * x2 + y1 * y2);
        });

        it("equals getLengthSquared() when performed with itself", () =>
        {
            const v = new Vector2(354, 576);

            expect(v.dot(v)).to.equal(v.getLengthSquared());
        });

        it("is commutative", () =>
        {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);

            expect(v1.dot(v2)).to.equal(v2.dot(v1));
        });

        it("equals 0 when performed with orthogonal vectors", () =>
        {
            const v1 = new Vector2(2, 2);
            const v2 = new Vector2(-2, 2);

            expect(v1.dot(v2)).to.equal(0);
        });
    });

    describe("getLength()", () =>
    {
        it("equals getLengthSquared() for Vector2.ZERO", () =>
        {
            const v = Vector2.ZERO;

            expect(v.getLength()).to.equal(v.getLengthSquared());
        });

        it("equals getLengthSquared() if getLength() equals 1", () =>
        {
            const v = Vector2.UNIT_X;

            expect(v.getLength()).to.equal(v.getLengthSquared());
        });

        it("is < getLengthSquared() if getLength() > 1", () =>
        {
            const v = new Vector2(1, 1);

            expect(v.getLength()).to.be.lessThan(v.getLengthSquared());
        });

        it("is > getLengthSquared() if getLength() < 1", () =>
        {
            const v = new Vector2(0.1, 0.1);

            expect(v.getLength()).to.be.greaterThan(v.getLengthSquared());
        });
    });
});
