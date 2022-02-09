const { parseQueryString } = require("../core/url_helper");
const { axios, server } = require("../infra/api");

$(document).ready(function(){
    const data = parseQueryString(window.location.search);

    axios.post(`${server}/api/google/callback`, data)
        .then((res) => {
            const {data, token} = res.data;

            window.localStorage.setItem('APP_USER', btoa(JSON.stringify(data)))
            window.localStorage.setItem('APP_SID', token);

            window.location.replace(window.location.origin);
        })
        .catch(err => {
            const msg = err.response.message || 'ERROR, Try Again!'
            window.alert(msg);
        })
})