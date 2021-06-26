export function showSnackBar(text, duration = 3) {
    var snackbarEl = $($.parseHTML('<div class="show" id="snackbar">' + text + '</div>'));
    $("body").append(snackbarEl);
    setTimeout(function () { snackbarEl.removeClass("show"); }, 3000);
}