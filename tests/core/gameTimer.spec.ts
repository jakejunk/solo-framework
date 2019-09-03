import { GameTimer } from "../../src/core/gameTimer";
import { expect } from "chai";
import "mocha";

describe("GameTimer", () =>
{
    describe("setFps()", () =>
    {
        it("roundtrips with getFps() if value is not < 1", () =>
        {
            const desiredFps = 45;
            const timer = new GameTimer();

            timer.setFps(desiredFps);

            expect(timer.getFps()).to.equal(desiredFps);
        });

        it("clamps values < 1 to 1", () =>
        {
            const desiredFps = 0.9999;
            const timer = new GameTimer();

            timer.setFps(desiredFps);
            const actualFps = timer.getFps();

            expect(actualFps).to.not.equal(desiredFps);
            expect(actualFps).to.equal(1);
        });
    });

    describe("setMinFps()", () =>
    {
        it("roundtrips with getMinFps() if value is not < 1", () =>
        {
            const desiredMinFps = 1;
            const timer = new GameTimer();

            timer.setMinFps(desiredMinFps);

            expect(timer.getMinFps()).to.equal(desiredMinFps);
        });

        it("clamps values < 1 to 1", () =>
        {
            const desiredMinFps = 0.9999;
            const timer = new GameTimer();

            timer.setMinFps(desiredMinFps);
            const actualFps = timer.getMinFps();

            expect(actualFps).to.not.equal(desiredMinFps);
            expect(actualFps).to.equal(1);
        });
    });
});
