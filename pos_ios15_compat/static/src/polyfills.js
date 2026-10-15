// @odoo-module ignore
// Polyfills for Safari 15.6 (iPadOS 15, e.g. iPad Air 2). Each one only installs
// when the browser lacks the feature, so modern browsers are unaffected.
(function () {
    "use strict";

    function define(target, name, value) {
        if (target && !(name in target)) {
            Object.defineProperty(target, name, {
                value,
                writable: true,
                configurable: true,
                enumerable: false,
            });
        }
    }

    function toIntegerOrInfinity(value) {
        const n = Number(value);
        if (Number.isNaN(n) || n === 0) {
            return 0;
        }
        if (!Number.isFinite(n)) {
            return n;
        }
        return Math.trunc(n);
    }

    // Array change-by-copy methods (Safari 16)
    define(Array.prototype, "toSorted", function toSorted(compareFn) {
        if (compareFn !== undefined && typeof compareFn !== "function") {
            throw new TypeError("The comparison function must be either a function or undefined");
        }
        return Array.prototype.slice.call(this).sort(compareFn);
    });
    define(Array.prototype, "toReversed", function toReversed() {
        return Array.prototype.slice.call(this).reverse();
    });
    define(Array.prototype, "toSpliced", function toSpliced(...args) {
        const copy = Array.prototype.slice.call(this);
        copy.splice(...args);
        return copy;
    });
    define(Array.prototype, "with", function (index, value) {
        const copy = Array.prototype.slice.call(this);
        const len = copy.length;
        let i = toIntegerOrInfinity(index);
        if (i < 0) {
            i += len;
        }
        if (i < 0 || i >= len) {
            throw new RangeError("Invalid index : " + index);
        }
        copy[i] = value;
        return copy;
    });

    // Array.prototype.findLast / findLastIndex (Safari 15.4, kept for older 15.x)
    define(Array.prototype, "findLast", function findLast(fn, thisArg) {
        for (let i = this.length - 1; i >= 0; i--) {
            if (fn.call(thisArg, this[i], i, this)) {
                return this[i];
            }
        }
        return undefined;
    });
    define(Array.prototype, "findLastIndex", function findLastIndex(fn, thisArg) {
        for (let i = this.length - 1; i >= 0; i--) {
            if (fn.call(thisArg, this[i], i, this)) {
                return i;
            }
        }
        return -1;
    });

    // Array.fromAsync (Safari 16.4)
    define(Array, "fromAsync", async function fromAsync(items, mapFn, thisArg) {
        const result = [];
        let i = 0;
        if (items && typeof items[Symbol.asyncIterator] === "function") {
            for await (const item of items) {
                result.push(mapFn ? await mapFn.call(thisArg, item, i) : item);
                i++;
            }
        } else {
            for (const item of Array.from(items)) {
                const value = await item;
                result.push(mapFn ? await mapFn.call(thisArg, value, i) : value);
                i++;
            }
        }
        return result;
    });

    // Object.groupBy / Map.groupBy (Safari 17.4)
    define(Object, "groupBy", function groupBy(items, callback) {
        const groups = Object.create(null);
        let i = 0;
        for (const item of items) {
            const key = callback(item, i++);
            (groups[key] || (groups[key] = [])).push(item);
        }
        return groups;
    });
    define(Map, "groupBy", function groupBy(items, callback) {
        const groups = new Map();
        let i = 0;
        for (const item of items) {
            const key = callback(item, i++);
            if (!groups.has(key)) {
                groups.set(key, []);
            }
            groups.get(key).push(item);
        }
        return groups;
    });

    // Set methods (Safari 17)
    function setLike(other) {
        if (other instanceof Set) {
            return other;
        }
        if (other && typeof other.has === "function" && typeof other.keys === "function") {
            return new Set(other.keys());
        }
        throw new TypeError("argument must be set-like");
    }
    define(Set.prototype, "union", function union(other) {
        const result = new Set(this);
        for (const v of setLike(other)) {
            result.add(v);
        }
        return result;
    });
    define(Set.prototype, "intersection", function intersection(other) {
        const o = setLike(other);
        return new Set([...this].filter((v) => o.has(v)));
    });
    define(Set.prototype, "difference", function difference(other) {
        const o = setLike(other);
        return new Set([...this].filter((v) => !o.has(v)));
    });
    define(Set.prototype, "symmetricDifference", function symmetricDifference(other) {
        const o = setLike(other);
        const result = new Set(this);
        for (const v of o) {
            if (this.has(v)) {
                result.delete(v);
            } else {
                result.add(v);
            }
        }
        return result;
    });
    define(Set.prototype, "isSubsetOf", function isSubsetOf(other) {
        const o = setLike(other);
        return [...this].every((v) => o.has(v));
    });
    define(Set.prototype, "isSupersetOf", function isSupersetOf(other) {
        return [...setLike(other)].every((v) => this.has(v));
    });
    define(Set.prototype, "isDisjointFrom", function isDisjointFrom(other) {
        const o = setLike(other);
        return [...this].every((v) => !o.has(v));
    });

    // Promise.withResolvers (Safari 17.4; Odoo also polyfills it in web, harmless twice)
    define(Promise, "withResolvers", function withResolvers() {
        let resolve, reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { promise, resolve, reject };
    });

    // AbortSignal.timeout (Safari 16) and AbortSignal.any (Safari 17.4).
    // Used by the Epson ePOS printer code for every receipt.
    if (typeof AbortSignal !== "undefined" && typeof AbortController !== "undefined") {
        define(AbortSignal, "timeout", function timeout(ms) {
            const controller = new AbortController();
            setTimeout(() => {
                let reason;
                try {
                    reason = new DOMException("The operation timed out.", "TimeoutError");
                } catch {
                    reason = new Error("The operation timed out.");
                    reason.name = "TimeoutError";
                }
                controller.abort(reason);
            }, ms);
            return controller.signal;
        });
        define(AbortSignal, "any", function any(signals) {
            const controller = new AbortController();
            for (const signal of signals) {
                if (signal.aborted) {
                    controller.abort(signal.reason);
                    return controller.signal;
                }
            }
            for (const signal of signals) {
                signal.addEventListener("abort", () => controller.abort(signal.reason), {
                    once: true,
                });
            }
            return controller.signal;
        });
    }
})();
