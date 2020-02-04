import { expect } from "chai";
import { IsPowerOfTwo } from "../../../src/math/bits";
import "mocha";

describe("Bits", () =>
{
    describe("IsPowerOfTwo()", () =>
    {
        const powersOfTwo = [
            1,       2 << 0,  2 << 1,  2 << 2,  2 << 3,  2 << 4,  2 << 5,  2 << 6,  
            2 << 7,  2 << 8,  2 << 9,  2 << 10, 2 << 11, 2 << 12, 2 << 13, 2 << 14, 
            2 << 15, 2 << 16, 2 << 17, 2 << 18, 2 << 19, 2 << 20, 2 << 21, 2 << 22, 
            2 << 23, 2 << 24, 2 << 25, 2 << 26, 2 << 27, 2 << 28, 2 << 29, 2 << 30,
        ];

        it("returns true for powers of two", () =>
        {
            for (const powerOfTwo of powersOfTwo)
            {
                expect(IsPowerOfTwo(powerOfTwo)).to.be.true;
            }
        });

        it("returns false for non powers of two", () =>
        {
            for (const powerOfTwo of powersOfTwo)
            {
                const nonPowerOfTwo = (powerOfTwo === 2)
                    ? powerOfTwo + 1
                    : powerOfTwo - 1;

                expect(IsPowerOfTwo(nonPowerOfTwo)).to.be.false;
            }
        });
    });
});