export class Ok<T>
{
    public constructor(readonly okValue: T) { }

    public isOk<T>(): this is Ok<T> { return true; }

    public isErr<TErr>(): this is Err<TErr> { return false; }

    /**
     * Returns the value of an `Ok` result.
     * If this result is instead of type `Error`, then the error value will be thrown.
     */
    public unwrapOk(): T
    {
        return this.okValue;
    }

    /**
     * Returns the value of an `Error` result.
     * If this result is instead of type `Ok`, then the ok value will be thrown.
     */
    public unwrapErr<TErr>(): TErr
    {
        throw this.okValue;
    }
}

export class Err<TErr>
{
    public constructor(readonly errorValue: TErr) { }

    public isOk<T>(): this is Ok<T> { return false; }

    public isErr<TErr>(): this is Err<TErr> { return true; }

    public unwrapOk<T>(): T
    {
        throw this.errorValue;
    }

    public unwrapError(): TErr
    {
        return this.errorValue;
    }
}

/**
 * A union representing either a result or an error.
 */
export type Result<T, TErr> = Ok<T> | Err<TErr>;