import { Err, Ok } from "../../../src/util/result";
import { expect } from "chai";
import "mocha";

describe("Result (Ok)", () =>
{
    describe("isOk()", () =>
    {
        it("returns true", () =>
        {
            const okResult = new Ok(1);

            expect(okResult.isOk()).to.be.true;
        });
    });

    describe("isErr()", () =>
    {
        it("returns false", () =>
        {
            const okResult = new Ok(1);

            expect(okResult.isErr()).to.be.false;
        });
    });

    describe("unwrap()", () =>
    {
        it("returns the ok value", () =>
        {
            const value = 1;
            const okResult = new Ok(value);

            expect(okResult.unwrap()).to.equal(value);
        });
    });

    describe("unwrapErr()", () =>
    {
        it("throws the ok value", () =>
        {
            const value = 1;
            const okResult = new Ok(value);

            expect(_ => okResult.unwrapErr()).to.throw;
        });
    });

    describe("map()", () =>
    {
        it("new result remains Ok", () =>
        {
            const okResult = new Ok(1);
            const mappedResult = okResult.map(v => v.toString());

            expect(mappedResult.isOk()).to.be.true;
        });

        it("new result contains mapped value of Ok", () =>
        {
            const value = 1;
            const mappingFunc = (v: number) => v.toString();
            const mappedValue = mappingFunc(value);

            const okResult = new Ok(value);
            const mappedResult = okResult.map(mappingFunc);

            expect(mappedResult.unwrap()).to.equal(mappedValue);
        });
    });

    describe("mapErr()", () =>
    {
        it("new result remains Ok", () =>
        {
            const okResult = new Ok(1);
            const mappedResult = okResult.mapErr(v => v.toString());

            expect(mappedResult.isOk()).to.be.true;
        });

        it("new result contains original Ok value", () =>
        {
            const value = 1;
            const okResult = new Ok(value);
            const mappedResult = okResult.mapErr(v => v.toString());

            expect(mappedResult.unwrap()).to.equal(value);
        });
    });
});

describe("Result (Err)", () =>
{
    describe("isOk()", () =>
    {
        it("returns false", () =>
        {
            const errResult = new Err(1);

            expect(errResult.isOk()).to.be.false;
        });
    });

    describe("isErr()", () =>
    {
        it("returns true", () =>
        {
            const errResult = new Err(1);

            expect(errResult.isErr()).to.be.true;
        });
    });

    describe("unwrap()", () =>
    {
        it("throws the error value", () =>
        {
            const errValue = 1;
            const errResult = new Err(errValue);

            expect(_ => errResult.unwrap()).to.throw;
        });
    });

    describe("unwrapErr()", () =>
    {
        it("returns the error value", () =>
        {
            const errValue = 1;
            const errResult = new Err(errValue);

            expect(errResult.unwrapErr()).to.equal(errValue);
        });
    });

    describe("map()", () =>
    {
        it("new result remains Err", () =>
        {
            const errResult = new Err(1);
            const mappedResult = errResult.map(v => v.toString());

            expect(mappedResult.isErr()).to.be.true;
        });

        it("new result contains original Err value", () =>
        {
            const value = 1;
            const errResult = new Err(value);
            const mappedResult = errResult.map(v => v.toString());

            expect(mappedResult.unwrapErr()).to.equal(value);
        });
    });

    describe("mapErr()", () =>
    {
        it("new result remains Err", () =>
        {
            const errResult = new Err(1);
            const mappedResult = errResult.mapErr(v => v.toString());

            expect(mappedResult.isErr()).to.be.true;
        });

        it("new result contains mapped value of Ok", () =>
        {
            const value = 1;
            const mappingFunc = (v: number) => v.toString();
            const mappedValue = mappingFunc(value);

            const errResult = new Err(value);
            const mappedResult = errResult.mapErr(mappingFunc);

            expect(mappedResult.unwrapErr()).to.equal(mappedValue);
        });
    });
});