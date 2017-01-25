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
      $('.paragraphs-add-type-trigger-element', context)
        .once('add-click-handler')
        .on('click', function (event) {
          var $this = $(this);

          // Stop default execution of click event.
          event.preventDefault();
          event.stopPropagation();

          Drupal.modalAddParagraphs.setValues({
            add_more_select: $this.attr('data-type'),
            add_more_delta: $this.attr('data-delta')
          });

          // Close dialog afterwards.
          $this.closest('div.ui-dialog-content').dialog('close');
        });
    }
  };

  /**
   * Click handler for "+ Add" button between paragraphs.
   *
   * @type {Object}
   */
  Drupal.behaviors.modalAdd = {
    attach: function (context, settings) {
      $('.paragraph-type-add-modal-button', context)
        .once('add-click-handler')
        .on('click', function (event) {
          var $button = $(this);

          // Stop default execution of click event.
          event.preventDefault();
          event.stopPropagation();

          // TODO: get config from drupalSettings
          // Global data for dialog template.
          var config = {title: 'Add paragraph', delta: 1};

          // Get types from ComboBox.
          var $typeComboBox;
          if ($button.attr('name') === 'first_button_add_modal') {
            // Case for last button in list (of for empty list).
            $typeComboBox = $button
              .parent()
              .siblings('.js-hide')
              .find('[name$="[add_more_select]"]');

            config.delta = '';
          }
          else {
            // For button between paragraphs.
            $typeComboBox = $button
              .closest('table')
              .next()
              .find('[name$="[add_more_select]"]');

            config.delta = $button.closest('tr').index();
          }

          var paragraphTypes = [];
          $typeComboBox.find('option').each(function (index, optionElement) {
            var $option = $(optionElement);

            paragraphTypes.push(
              {
                'type': $option.attr('value'),
                'type-name': $option.text()
              }
            );
          });

          Drupal.modalAddParagraphs.openDialog(config, paragraphTypes);
        });
    }
  };

  /**
   * Namespace for modal related javascript methods.
   *
   * @type {Object}
   */
  Drupal.modalAddParagraphs = {};

  Drupal.modalAddParagraphs.openDialog = function (config, types) {

    // Method to apply data over template element.
    var applyData = function (data, $templateElement) {
      _.each(data, function (value, name) {
        var selector = '[data-' + name + ']';

        $templateElement.find(selector)
          .addBack(selector)
          .each(function (index, childElement) {
            var $child = $(childElement);
            var attrName = $child.attr('data-' + name);
            $child.removeAttr('data-' + name);

            if (attrName === 'content') {
              $child.text(value);
            }
            else {
              $child.attr(attrName, value);
            }
          });
      });
    };

    // Get dialog template and apply data on it.
    var $dialogTemplate = $('.paragraphs-add-dialog-template');

    var $dialog = $dialogTemplate.clone()
      .removeClass('paragraphs-add-dialog-template')
      .toggleClass('paragraphs-add-dialog')
      .appendTo($dialogTemplate.parent());

    applyData(config, $dialog);

    // Get row template and duplicate it for every paragraph type.
    var $rowTemplate = $dialog.find('.paragraphs-add-dialog-row-template');
    for (var i = 0; i < types.length; i++) {
      var $row = $rowTemplate.clone()
        .removeClass('paragraphs-add-dialog-row-template')
        .toggleClass('paragraphs-add-dialog-row')
        .appendTo($rowTemplate.parent());

      applyData(types[i], $row);
    }
    $rowTemplate.remove();

    // Open dialog after data is applied on template.
    $dialog.dialog({
      modal: true,
      resizable: false,
      close: function () {
        var $dialog = $(this);

        // Destroy dialog object.
        $dialog.dialog('destroy');

        // Remove created html element for dialog.
        $dialog.remove();
      }
    });

    // Attach behaviours to dialog.
    Drupal.behaviors.modalButtonAction.attach($dialog);
  };

  /**
   * Method to set hidden fields and trigger adding of paragraph.
   *
   * @param {Object} options
   *   Object with key value pair, where key is name of field that should be set
   *   and value is value for that field.
   */
  Drupal.modalAddParagraphs.setValues = function (options) {
    var $submitButton = $('.js-hide input[name$="_add_more"]');
    var $wrapper = $submitButton.parent();

    // Set all field values defined in otptions.
    _.each(options, function (fieldValue, fieldName) {
      var $field = $wrapper.find('[name$="[' + fieldName + ']"]');

      if ($field) {
        $field.val(fieldValue);
      }
    });

    // Trigger ajax call on add button.
    $submitButton.trigger('mousedown');
  };

}(jQuery, Drupal, drupalSettings));
