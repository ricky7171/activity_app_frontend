const { server } = require("../infra/api")

if(window.localStorage.getItem('APP_USER') && window.localStorage.getItem('APP_SID')) {
    window.location.replace(`${window.location.origin}`);
}

$('#doLogin').click(function(){
    window.location.replace(`${server}/api/google/redirect`);
})