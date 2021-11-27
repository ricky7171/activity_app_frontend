import * as templateHelper from "../../core/template_helper";
import * as alertHelper from "../../core/alert_helper";
import { getVideoCover } from "../../core/media_helper";
import MediaGalleryDataProxy from "../../data_proxy/mediaGalleryDataProxy";
import MediaGalleryService from "../../business_logic/service/mediaGalleryService";
import CategoryDataProxy from "../../data_proxy/categoryDataProxy";
import CategoryService from "../../business_logic/service/categoryService";
import { chunkArray } from "../../business_logic/shared/utils";
import { axios } from "../../infra/api";
export default class MediaGalleryComponent {
  constructor() {
    this.mediaService = new MediaGalleryService(new MediaGalleryDataProxy());
    this.categoryService = new CategoryService(new CategoryDataProxy());
  }

  async fetchMediaGallery(categoryId) {
    let command = null;

    if(categoryId) {
      command = await this.mediaService.getByCategoryIdCommand(categoryId).execute();
    } else {
      command = await this.mediaService.getAllCommand().execute();
    }

    if (command.success) {
      const data = command.value;
      if (data.success) {
        const list = data.response.data;
        this.render(list);
      }
    }
  }

  render(data) {
    const layoutClasses = [
      '',
      '',
      'tall',
      'wide',
      '',
      '',
      '',
      'tall',
      'big',
      'wide',
      'big',
      'tall',
    ];

    
    let rowMediaContentTpl = $(
      'script[data-template="media-content-template"]'
    ).text();
    var tempMediaContentHtml = "";
    var groupByChunk = chunkArray(data, layoutClasses.length);
    
    groupByChunk.forEach((data) => {
      data.forEach((media, index) => {
        var className = layoutClasses[index];

        if(media.type !== 'image') {
          className += ' playable';
        }
        
        var contentMedia = {
          className,
          imageSource: media.thumbnail_url,
          source: JSON.stringify(media),
        };

        tempMediaContentHtml += templateHelper.render(
          rowMediaContentTpl,
          contentMedia
        )
      })
    })

    $('.media-content-wrapper').html(tempMediaContentHtml);
  }
  
  async fetchCategories() {
    const command = await this.categoryService.getByTypeCommand('media').execute();

    if (command.success) {
      const data = command.value;
      if (data.success) {
        const list = data.response.data;
        this.renderCategory(list);
      }
    }
  }

  renderCategory(data) {
    let tempFilterContentHtml = "";
    let tempOptionContentHtml = "";
    let tempListContentHtml = "";
    const itemFilterTpl = $(
      'script[data-template="media-filter-item"]'
    ).text();    
    const optionCategoryTpl = $(
      'script[data-template="media-category-option"]'
    ).text();
    const listCategoryTpl = $(
      'script[data-template="media-category-list-template"]'
    ).text();

    // default value for filter
    const defaultContent = {
      id: '',
      name: 'All',
    }
    tempFilterContentHtml += templateHelper.render(itemFilterTpl, defaultContent);
    
    data.forEach(category => {
      const content = {
        id: category.id,
        name: category.name,
        dataJson: JSON.stringify(category)
      };

      tempFilterContentHtml += templateHelper.render(itemFilterTpl, content);
      tempOptionContentHtml += templateHelper.render(optionCategoryTpl, content);
      tempListContentHtml += templateHelper.render(listCategoryTpl, content);
    });
    
    $('#media-wrapper').find('.dropdown-menu').html(tempFilterContentHtml);
    $('.form-media-wrapper').find('select[name=category_id]').each(function(){
      $(this).html(tempOptionContentHtml);
    });
    $('.media-list-category').html(tempListContentHtml);
  }
  
  handleChangeType(evt) {
    const el = evt.target;
    const value = $(el).val();
    const wrapper = $(el).closest('.form-media-wrapper');
    if(value == 'youtube') {
      wrapper.find('.file-media').hide();
      wrapper.find('.youtube-link-input').show();
    } else {
      wrapper.find('.file-media').show();
      wrapper.find('.youtube-link-input').hide();
      wrapper.find('.file-media').find('input[name=file]').prop('accept', `${value}/*`)
    }
  }

  async getValueForm(wrapper) {
    var attributes = {
      type: wrapper.find('select[name=type]').val(),
      category_id: wrapper.find('select[name=category_id]').val(),
    }
    if(attributes.type == 'youtube') {
      attributes.value = wrapper.find('input[name=youtube_link]').val();
    } else {
      const files = wrapper.find('input[name=file]').prop('files');
      if(files.length) {
        attributes.file = files[0];
      }
    }

    if(attributes.type == 'video') {
      const thumbnailSource = await getVideoCover(attributes.file, 1);
      attributes.thumbnail = thumbnailSource;
    }

    return attributes;
  }

  resetForm(wrapper) {
    wrapper.find('select[name=type]').val('image').trigger('change');
    wrapper.find('input[name=file]').val('').trigger('change');
    wrapper.find('input[name=file]').prop('files', null);
    wrapper.find('.preview-area').css('background-image', '');
  }

  resetCategoryForm(wrapper) {
    wrapper.find('input[name=category_id]').val('');
    wrapper.find('input[name=category_name]').val('').trigger('change');
  }
  
  async generatePreview(el) {
    const wrapper = $(el).closest('.form-media-wrapper');
    const attributes = await this.getValueForm(wrapper);
    let imageSource = "";

    if(attributes.type == 'youtube') {
      const youtubeId = attributes.value.substr(attributes.value.indexOf('?v=')+3)
      imageSource = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    } else if(attributes.type == 'image'){
      if(attributes.file) {
        imageSource = URL.createObjectURL(attributes.file);
      }
    } else if(attributes.type == 'video') {
      if(attributes.thumbnail) {
        imageSource = URL.createObjectURL(attributes.thumbnail);
      }
    }
  
    wrapper.find('.preview-area').css('background-image', `url(${imageSource})`)
  }

  async handleSaveMedia(el, callback) {
    const wrapper = $(el).closest('.form-media-wrapper');
    const attributes = await this.getValueForm(wrapper);

    let loadingLabel = '<i class="fa fa-spin fa-spinner"></i> Save Changes';
    let label = loadingLabel;
    $(el).html(label);
    $(el).prop('disabled', true);

    axios.defaults.onUploadProgress = (progressEvent) => {
      const progres = Math.round( (progressEvent.loaded * 100) / progressEvent.total )

      $(el).html(`<i class="fa fa-spin fa-spinner"></i> Save Changes ${progres}%`);
    }
    
    const command = await this.mediaService.insertCommand(attributes).execute();
    if (command.success == false) {
      const firstErrorMsg = command.errors[0].message;
      alertHelper.showError(firstErrorMsg);
      label = 'Save Changes';
      
      $(el).html(label);
      $(el).prop('disabled', false);
      return;
    }
    
    if(command.success) {
      const data = command.value;
      label = 'Save Changes';
      if(data.success) {

        if(typeof callback == 'function') {
          callback();
        }

        this.resetForm(wrapper);
        alertHelper.showSnackBar('Successfully Uploaded');
      } else {
        alertHelper.showError('Upload failed');
      }
    }

    $(el).html(label);
    $(el).prop('disabled', false);
  }

  async handleSaveCategory(el, callback) {
    const wrapper = $(el).closest('.form-category-wrapper');
    const attributes = {
      type: 'media',
      name: wrapper.find('input[name=category_name]').val(),
    };
    const id = wrapper.find('input[name=category_id]').val();
    const loadingLabel = '<i class="fa fa-spin fa-spinner"></i> Save Changes';
    let label = loadingLabel;
    $(el).html(label);
    $(el).prop('disabled', true);
    let command = null;
    if(id) {
      attributes.id = id;
      command = await this.categoryService.updateCommand(attributes).execute();
    } else {
      command = await this.categoryService.insertCommand(attributes).execute();
    }
    if (command.success == false) {
      const firstErrorMsg = command.errors[0].message;
      alertHelper.showError(firstErrorMsg);
      label = 'Save Changes';
      $(el).html(label);
      $(el).prop('disabled', false);
      return;
    }
    
    if(command.success) {
      const data = command.value;
      if(data.success) {
        label = 'Save Changes';

        if(typeof callback == 'function') {
          callback();
        }

        this.resetCategoryForm(wrapper);
        alertHelper.showSnackBar('Successfully Saved');
      }
    }

    $(el).html(label);
    $(el).prop('disabled', false);
  }
  
  showDetail(el) {
    if($(el).is('img')) {
      el = $(el).closest('.media-content-item');
    }
    
    const source = $(el).data('source');
    const template = {
      image: 'script[data-template="media-detail-image-template"]',
      video: 'script[data-template="media-detail-video-template"]',
      youtube: 'script[data-template="media-detail-youtube-template"]'
    }
    const selectedTemplate = $(template[source.type]).text();
    const content = {
      media_id: source.id,
      source: source.value_url
    }

    if(source.type == 'youtube') {
      const youtubeId = source.value_url.substr(source.value_url.indexOf('?v=')+3)
      content.source = youtubeId;
    }

    const temp = templateHelper.render(
      selectedTemplate,
      content
    )
    $('#modalDetailMedia').find('.modal-body').html(temp)
    
    $('#modalDetailMedia').modal('show');
  }
  
  handleEditCategory(el) {
    const wrapper = $(el).closest('.list-group-item');
    const data = wrapper.data('category');

    $('.form-category-wrapper').find('input[name=category_id]').val(data.id);
    $('.form-category-wrapper').find('input[name=category_name]').val(data.name);
  }

  async handleDeleteCategory(el) {
    var result = await alertHelper.showConfirmation("Your category will be delete and cannot be restore");

    // - if user cancel delete
    if(!result.isConfirmed) return;

    const wrapper = $(el).closest('.list-group-item');
    const data = wrapper.data('category');

    const command = await this.categoryService.destroyCommand(data.id).execute();
    if(command.success) {
      const data = command.value;
      if(data.success) {
        $('#modalFormMedia').modal('hide');
        this.fetchCategories();
      }
    }
    
  }

  async handleDeleteMedia(el) {
    var result = await alertHelper.showConfirmation("Your media will be delete and cannot be restore");

    // - if user cancel delete
    if(!result.isConfirmed) return;

    const wrapper = $(el).closest('#modalDetailMedia');
    const mediaId = wrapper.find('input[name=media_id]').val();

    const command = await this.mediaService.destroyCommand(mediaId).execute();
    if(command.success) {
      const data = command.value;
      if(data.success) {
        $('#modalDetailMedia').modal('hide');
        this.fetchMediaGallery();
        alertHelper.showSnackBar('Successfully Deleted');
      }
    }
    
  }
  
  initiate() {
    this.handleChangeType($('.form-media-wrapper select[name=type]')[0]);
    $('.form-media-wrapper select[name=type]').on('change', this.handleChangeType)
    $('.form-media-wrapper input[name=file]').on('change', (evt) => this.generatePreview(evt.target))
    $('.form-media-wrapper input[name=youtube_link]').on('keyup change', (evt) => this.generatePreview(evt.target))
    $('.form-media-wrapper .btn-save-media').on('click', (evt) => {
      this.handleSaveMedia(evt.target, () => {
        if($('#modalFormMedia').length) {
          $('#modalFormMedia').modal('hide');

          this.fetchMediaGallery();
        }
      })
    })

    $('.form-category-wrapper .btn-save-category').on('click', (evt) => {
      this.handleSaveCategory(evt.target, () => {
        if($('#modalFormMedia').length) {
          $('#modalFormMedia').modal('hide');

          this.fetchCategories();
        }
      })
    })

    $('body').on('click', '.media-content-item', (evt) => this.showDetail(evt.target))

    $('body').on('click', '#media-wrapper .filter-category', (evt) => {
      evt.preventDefault();
      // filter category
      var categoryid = $(evt.target).data('categoryid');
      this.fetchMediaGallery(categoryid);
    })
    
    this.fetchMediaGallery();
    this.fetchCategories();

    // assign event to category actions
    $('body').on('click', '.btn-edit-category', (evt) => this.handleEditCategory(evt.target));
    $('body').on('click', '.btn-delete-category', (evt) => this.handleDeleteCategory(evt.target));
    $('body').on('click', '.btn-delete-media', (evt) => this.handleDeleteMedia(evt.target));
  }
}