export const parseQueryString = (queryString) => {
    const query = {};

    const pairs = (queryString[0] === "?"
        ? queryString.substr(1)
        : queryString
    ).split("&");

    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split("=");
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
    }

    // return object
    return query;
};

export const updateUrl = (queryParam = {}, replaceOrAddParam = false) => {
    const url = window.location.protocol + "//" + window.location.host + window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    Object.keys(queryParam).forEach(keyName => {
        searchParams.set(keyName, queryParam[keyName]);
    })
    
    const newUrl = `${url}?${searchParams.toString()}`;

    if(history.pushState) {
        history.pushState({path: newUrl}, '', newUrl)
    } else {
        window.location.replace(newUrl);
    }
}