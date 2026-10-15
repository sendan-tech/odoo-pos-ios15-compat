// @odoo-module ignore
// TEST ONLY: delete APIs missing from Safari 15.6 so a modern browser behaves like iPadOS 15.
(function () {
    const removed = [];
    function drop(target, label, names) {
        for (const n of names) {
            if (target && n in target) {
                delete target[n];
                removed.push(label + "." + n);
            }
        }
    }
    drop(Array.prototype, "Array.prototype", ["toSorted", "toReversed", "toSpliced", "with"]);
    drop(Array, "Array", ["fromAsync"]);
    drop(Object, "Object", ["groupBy"]);
    drop(Map, "Map", ["groupBy"]);
    drop(Promise, "Promise", ["withResolvers"]);
    drop(Set.prototype, "Set.prototype", ["union", "intersection", "difference", "symmetricDifference", "isSubsetOf", "isSupersetOf", "isDisjointFrom"]);
    drop(AbortSignal, "AbortSignal", ["timeout", "any"]);
    window.__ios15_emulated = removed;
    console.warn("[pos_ios15_emulate] removed:", removed.join(", "));
})();
