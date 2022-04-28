export function groupBy(list, funcGetValue) {
    const result = list.reduce(function (r, a) {
        const value = funcGetValue(a);
        r[value] = r[value] || [];
        r[value].push(a);
        return r;
    }, Object.create(null));

    return result;
}