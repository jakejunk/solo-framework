import { FunctionCounterGame } from "../../generators/game.gen";
import { GameTimer } from "../../../src/core/gameTimer";
import { Timestep } from "../../../src/core/timestep";
import { expect } from "chai";
import "mocha";

describe("GameTimer", () =>
{
    // Tests for changing timestep

    describe("setTargetFrameTime()", () =>
    {
        it("roundtrips with getTargetFrameTime() if value is >= 0", () =>
        {
            const timer = new GameTimer();
            const targetFrameTime = 1000 / 60;

            timer.setTargetFrameTime(targetFrameTime);

            expect(timer.getTargetFrameTime()).to.equal(targetFrameTime);
        });

        it("clamps values < 0 to 0", () =>
        {
            const timer = new GameTimer();
            const targetFrameTime = -0.000001;

            timer.setTargetFrameTime(targetFrameTime);
            const actualFrameTime = timer.getTargetFrameTime();

            expect(actualFrameTime).to.not.equal(targetFrameTime);
            expect(actualFrameTime).to.equal(0);
        });
    });

    describe("getTotalGameTime()", () =>
    {
        describe("when running with a fixed timestep...", () =>
        {
            it("does not increase in value if the target frame time has not yet elapsed", () =>
            {
                const targetFrameTime = 1000 / 60;
                const timer = new GameTimer(Timestep.FIXED, targetFrameTime);
                const game = new FunctionCounterGame();

                const startTime = timer.getTotalGameTime();

                timer.tickGame(game, targetFrameTime - 1);

                const nextTime = timer.getTotalGameTime();

                expect(startTime).to.equal(nextTime);
            });

            it("only increases in multiples of the target frame time", () =>
            {
                const targetFrameTime = 1000 / 60;
                const timer = new GameTimer(Timestep.FIXED, targetFrameTime);
                const game = new FunctionCounterGame();

                const startTime = timer.getTotalGameTime();

                timer.tickGame(game, targetFrameTime + 1);

                const nextTime = timer.getTotalGameTime();
                const totalElapsed = nextTime - startTime;

                expect(totalElapsed).to.equal(targetFrameTime);
            });
        });
    });

    describe("isRunningSlow()", () =>
    {
        describe("when running with a fixed timestep...", () =>
        {
            it("returns true after performing multiple updates for > 5 frames", () =>
            {
                const targetFrameTime = 1000 / 60;
                const timer = new GameTimer(Timestep.FIXED, targetFrameTime);
                const game = new FunctionCounterGame();

                // 6 slow updates
                for (let i = 0, timestamp = 0; i < 6; i += 1)
                {
                    timestamp += (targetFrameTime * 2) + 1;

                    timer.tickGame(game, timestamp);
                }

                expect(timer.isRunningSlow()).to.be.true;
            });

            it("returns false after 'catching up' with prior slow frames", () =>
            {
                const targetFrameTime = 1000 / 60;
                const timer = new GameTimer(Timestep.FIXED, targetFrameTime);
                const game = new FunctionCounterGame();

                let timestamp = 0;

                // 6 slow updates
                for (let i = 0; i < 6; i += 1)
                {
                    timestamp += (targetFrameTime * 2) + 1;

                    timer.tickGame(game, timestamp);
                }

                // 6 normal updates
                for (let i = 0; i < 6; i += 1)
                {
                    timestamp += targetFrameTime;

                    timer.tickGame(game, timestamp);
                }

                expect(timer.isRunningSlow()).to.be.false;
            });
        });

        describe("when running with a variable timestep...", () =>
        {
            it("returns false after performing multiple updates for > 5 frames", () =>
            {
                const targetFrameTime = 1000 / 60;
                const timer = new GameTimer(Timestep.VARIABLE, targetFrameTime);
                const game = new FunctionCounterGame();

                // 6 slow updates
                for (let i = 0, timestamp = 0; i < 6; i += 1)
                {
                    timestamp += (targetFrameTime * 2) + 1;

                    timer.tickGame(game, timestamp);
                }

                expect(timer.isRunningSlow()).to.be.false;
            });
        });
    });
});
