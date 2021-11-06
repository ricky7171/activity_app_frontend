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

export function showWarning(text) {
    return Swal.fire({
        title: 'Warning',
        text: text,
        icon: 'warning'
    })
}

export async function showConfirmation(text) {
    return Swal.fire({
        title: 'Are you sure?',
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });
}