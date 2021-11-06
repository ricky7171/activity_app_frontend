import HttpDataProxy from "./httpDataProxy";

class MediaGalleryDataProxy extends HttpDataProxy {
  constructor() {
    super("mediaGallery");
  }

  getByCategoryId(categoryId) {
    return this._handleResponseFrom(this._api.requestApi(`${this._entity}.get`, {}, `?category_id=${categoryId}`));
  }
  
  insert(data) {
    const formData = new FormData();
    formData.append('type', data.type || '');
    formData.append('file', data.file || '');
    formData.append('value', data.value || '');
    formData.append('thumbnail', data.thumbnail || '');
    formData.append('category_id', data.category_id || '');

    return this._handleResponseFrom(
      this._api.requestApi(`${this._entity}.add`, formData)
    );
  }
}

export default MediaGalleryDataProxy;
