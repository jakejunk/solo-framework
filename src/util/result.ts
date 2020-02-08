/**
 * A union representing either a result or an error.
 */
export type Result<T, E> = Ok<T, E> | Err<T, E>;

interface ResultBase<T, E>
{
    isOk(): boolean;

    isErr(): boolean;

    /**
     * Returns the value of an `Ok` result.
     * If this result is instead of type `Err`, then the error value will be thrown.
     */
    unwrap(): T;

    /**
     * Returns the value of an `Err` result.
     * If this result is instead of type `Ok`, then the ok value will be thrown.
     */
    unwrapErr(): E;

    /**
     * Maps a `Result<T, E>` to a `Result<U, E>` by applying the provided function.
     * `Err` values will remain unmodified.
     */
    map<U>(fn: (val: T) => U): Result<U, E>;


    /**
     * Maps a `Result<T, E>` to a `Result<E, F>` by applying the provided function.
     * `Ok` values will remain unmodified.
     */
    mapErr<F>(fn: (errVal: E) => F): Result<T, F>;
}

export class Ok<T, E> implements ResultBase<T, E>
{
    public constructor(readonly okValue: T) { }

    public isOk(): this is Ok<T, E> { return true; }

    public isErr(): this is Err<T, E> { return false; }

    public unwrap(): T { return this.okValue; }

    public unwrapErr(): E { throw this.okValue; }

    public map<U>(fn: (val: T) => U): Result<U, E> { return new Ok(fn(this.okValue)); }

    public mapErr<F>(fn: (errVal: E) => F): Result<T, F> { return new Ok(this.okValue); }
}

export class Err<T, E> implements ResultBase<T, E>
{
    public constructor(readonly errValue: E) { }

    public isOk(): this is Ok<T, E> { return false; }

    public isErr(): this is Err<T, E> { return true; }

    public unwrap(): T { throw this.errValue; }

    public unwrapErr(): E { return this.errValue; }

    public map<U>(fn: (val: T) => U): Result<U, E> { return new Err(this.errValue); }

    public mapErr<F>(fn: (errVal: E) => F): Result<T, F> { return new Err(fn(this.errValue)); }
}