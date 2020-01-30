import { FunctionCounterGame } from "../_generators/core/game.gen";
import { GameTimer } from "../../../src/core/gameTimer";
import { Timestep } from "../../../src/core/timestep";
import { expect } from "chai";
import "mocha";

describe("GameTimer", () =>
{
    describe("setTimestep()", () =>
    {
        it("roundtrips with getTimestep()", () =>
        {
            const timer = new GameTimer();

            timer.setTimestep(Timestep.FIXED);
            expect(timer.getTimestep()).to.equal(Timestep.FIXED);

            timer.setTimestep(Timestep.VARIABLE);
            expect(timer.getTimestep()).to.equal(Timestep.VARIABLE);
        });

        it("isRunningSlow() is false after switching to Timestep.VARIABLE", () =>
        {
            const targetFrameTime = 1000 / 60;
            const slowElapsedTime = (targetFrameTime * 2) + 1;
            const timer = new GameTimer(Timestep.FIXED, targetFrameTime);
            const game = new FunctionCounterGame();

            // 6 slow updates
            for (let i = 0, timestamp = 0; i < 6; i += 1)
            {
                timestamp += slowElapsedTime;

                timer.tickGame(game, timestamp, false);
            }

            expect(timer.isRunningSlow()).to.be.true;

            timer.setTimestep(Timestep.VARIABLE);

            expect(timer.isRunningSlow()).to.be.false;
        });
    });

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
            it("does not increase if the target frame time has not yet elapsed", () =>
            {
                const targetFrameTime = 1000 / 60;
                const timer = new GameTimer(Timestep.FIXED, targetFrameTime);
                const game = new FunctionCounterGame();

                const startTime = timer.getTotalGameTime();

                timer.tickGame(game, targetFrameTime - 1, false);

                const nextTime = timer.getTotalGameTime();

                expect(startTime).to.equal(nextTime);
            });

            it("only increases in multiples of the target frame time", () =>
            {
                const targetFrameTime = 1000 / 60;
                const timer = new GameTimer(Timestep.FIXED, targetFrameTime);
                const game = new FunctionCounterGame();

                const startTime = timer.getTotalGameTime();

                timer.tickGame(game, targetFrameTime + 1, false);

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

                    timer.tickGame(game, timestamp, false);
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

                    timer.tickGame(game, timestamp, false);
                }

                // 6 normal updates
                for (let i = 0; i < 6; i += 1)
                {
                    timestamp += targetFrameTime;

                    timer.tickGame(game, timestamp, false);
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

                    timer.tickGame(game, timestamp, false);
                }

                expect(timer.isRunningSlow()).to.be.false;
            });
        });
    });

    describe("tickGame()", () =>
    {
        it("clamps minimum elapsed time to 0ms", () =>
        {
            const timer = new GameTimer();
            const game = new FunctionCounterGame();

            timer.tickGame(game, -1, false);

            expect(timer.getTotalGameTime()).to.equal(0);
        });

        it("clamps maximum elapsed time to 100ms", () =>
        {
            const timer = new GameTimer();
            const game = new FunctionCounterGame();

            timer.tickGame(game, 101, false);

            expect(timer.getTotalGameTime()).to.equal(100);
        });

        describe("when running with a variable timestep...", () =>
        {
            it("calls Game.onUpdate() only once per tick, for any elapsed time", () =>
            {
                const timer = new GameTimer();
                const game = new FunctionCounterGame();
                const elapsedTime = 234;

                timer.tickGame(game, elapsedTime, false);

                expect(game.updateCalls).to.equal(1);
            });

            it("calls Game.onDraw() only once per tick, for any elapsed time", () =>
            {
                const timer = new GameTimer();
                const game = new FunctionCounterGame();
                const elapsedTime = 567;

                timer.tickGame(game, elapsedTime, false);

                expect(game.drawCalls).to.equal(1);
            });
        });

        describe("when running with a fixed timestep...", () =>
        {
            it("does not call Game.onUpdate() if the target frame time has not yet elapsed", () =>
            {
                const targetFrameTime = 1000 / 60;
                const timer = new GameTimer(Timestep.FIXED, targetFrameTime);
                const game = new FunctionCounterGame();

                timer.tickGame(game, targetFrameTime - 1, false);

                expect(game.updateCalls).to.equal(0);
            });

            it("calls Game.onUpdate() multiple times if at least 2x the target frame time has elapsed", () =>
            {
                const targetFrameTime = 1000 / 60;
                const timer = new GameTimer(Timestep.FIXED, targetFrameTime);
                const game = new FunctionCounterGame();

                timer.tickGame(game, targetFrameTime * 2, false);

                expect(game.updateCalls).to.be.greaterThan(1);
            });

            it("calls Game.onUpdate() multiple times if at least 2x the target frame time has accumulated", () =>
            {
                const targetFrameTime = 1000 / 60;
                const timestamp1 = targetFrameTime - 1;
                const timestamp2 = timestamp1 + targetFrameTime + 1;
                const timer = new GameTimer(Timestep.FIXED, targetFrameTime);
                const game = new FunctionCounterGame();

                // Buffer up just enough time to avoid an update here
                timer.tickGame(game, timestamp1, false);
                expect(game.updateCalls).to.equal(0);

                timer.tickGame(game, timestamp2, false);
                expect(game.updateCalls).to.be.greaterThan(1);
            });

            it("calls Game.onDraw() only once per tick, for any elapsed time", () =>
            {
                const timer = new GameTimer(Timestep.FIXED, 1000 / 60);
                const game = new FunctionCounterGame();

                timer.tickGame(game, 234, false);

                expect(game.drawCalls).to.equal(1);
            });
        });
    });
});
