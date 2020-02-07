import { expect } from "chai";
import { IsPowerOfTwo, SwapBytes } from "../../../src/math/bits";
import "mocha";

describe("Bits", () =>
{
    describe("SwapBytes()", () =>
    {
        it("swaps bytes for any 32-bit integer value", () =>
        {
            const int = 8675309;
            const reversed = SwapBytes(int);
            
            const intView = new Int32Array([reversed]);
            new Int8Array(intView.buffer).reverse();

            expect(int).to.equal(intView[0]);
        });

        it("roundtrips every 2 calls", () =>
        {
            const int = 8675309;
            const reversed = SwapBytes(int);
            const original = SwapBytes(reversed);

            expect(int).to.equal(original);
        });
    });

    describe("IsPowerOfTwo()", () =>
    {
        // Generates 32 unsigned power-of-two integers
        const powersOfTwo = Array.from({length: 32}, (_, i) => (1 << i) >>> 0);

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