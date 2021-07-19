export function showSnackBar(text, duration = 3) {
    var snackbarEl = $($.parseHTML('<div class="show" id="snackbar">' + text + '</div>'));
    $("body").append(snackbarEl);
    setTimeout(function () { snackbarEl.removeClass("show"); }, 3000);
}

export function showError(text) {
    return Swal.fire({
        title: 'Error',
        text: text,
        icon: 'error',
    });
}

export function showSuccess(text) {
    return Swal.fire({
        title: 'Success',
        text: text,
        icon: 'success',
    });
}