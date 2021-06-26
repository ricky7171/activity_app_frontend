export function render(html, item) {
    var tokens = html.split(/\$\{(.+?)\}/g);
    //example tokens : 
    //["<div>", "title", "</div><div>", "description", "</div>"]
    var finalHtml = tokens.map(function(token, i) {
        //token can be "<div>" (when i is odd) or "title" (when i is even)
        if(i%2 == 0) { //if even, that means token is just a html
            return token;
        } else { //if odd, that means token is a key of item. 
            return item[token];
        }  
    }).join('');

    return finalHtml;
}