/**
 * @file paragraphs.modal.js
 *
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  Drupal.AjaxCommands.prototype.paragraphs_add_paragraph = function (ajax, response, status) {
    $('select[data-uuid="' + response.uuid + '"]').val(response.paragraph_type);
    $('input[data-uuid="' + response.uuid + '"]').trigger('mousedown');
  };

  Drupal.behaviors.bodyTabs = {
    attach: function (context, settings) {
      $('.paragraphs_types_container ul', context).each(function () {
        var $this = $(this);
        $this.parent().tabs();
      });
    }
  };

  /**
   * Add behaviour to modal dialog paragraph type buttons.
   *
   * @type {Object}
   */
  Drupal.behaviors.modalButtonAction = {
    attach: function (context, settings) {
      $('.paragraphs-modal-form input.field-add-more-submit', context)
        .once('add-click-handler')
        .on('click', function (event) {
          var $this = $(this);

          // Stop default execution of click event.
          event.preventDefault();
          event.stopPropagation();

          // Handle click event to trigger loading of new paragraph.
          if (drupalSettings && drupalSettings.paragraphs && drupalSettings.paragraphs.modal) {
            var buttonName = $this.attr('name');

            if (drupalSettings.paragraphs.modal[buttonName]) {
              var config = drupalSettings.paragraphs.modal[buttonName];

              Drupal.modalAddParagraphs.setValues({
                add_more_select: config['type'],
                add_more_delta: parseInt(config['position'], 10)
              });
            }
          }

          // Close dialog afterwards.
          $this.parents('div.ui-dialog-content').dialog('close');
        });
    }
  };

  /**
   * Namespace for modal related javascript methods.
   *
   * @type {Object}
   */
  Drupal.modalAddParagraphs = {};

  /**
   * Method to set hidden fields and trigger adding of paragraph.
   *
   * @param {Object} options
   *   Object with key value pair, where key is name of field that should be set
   *   and value is value for that field.
   */
  Drupal.modalAddParagraphs.setValues = function (options) {
    var submitButton = $('[data-drupal-selector="edit-field-paragraphs-add-more-add-more-button"]');
    var wrapper = submitButton.parent();

    // Set all field values defined in otptions.
    _.each(options, function (fieldValue, fieldName) {
      var field = wrapper.find('[name$="[' + fieldName + ']"]');

      if (field) {
        field.val(fieldValue);
      }
    });

    // Trigger ajax call on add button.
    submitButton.trigger('mousedown');
  };

}(jQuery, Drupal, drupalSettings));
