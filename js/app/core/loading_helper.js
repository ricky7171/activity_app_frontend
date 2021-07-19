var loadingContainer = $('#loading-container');
if(typeof window.defaultLoadingMessage == "undefined") {
    window.defaultLoadingMessage = loadingContainer.find('.loading-caption').text();
}

export function toggleLoading(isVisible = false, caption = "") {
    var caption = caption || window.defaultLoadingMessage;

    if(isVisible) {
        loadingContainer.find('.loading-caption').html(caption);
        loadingContainer.show();
    } else {
        loadingContainer.hide();
    }
}