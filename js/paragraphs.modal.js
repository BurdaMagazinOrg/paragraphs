/**
 * @file paragraphs.modal.js
 *
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  Drupal.behaviors.bodyTabs = {
    attach: function (context, settings) {
      $('.paragraphs_types_container ul', context).each(function () {
        var $this = $(this);
        $this.parent().tabs();
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
          var $addMoreWrapper;
          if ($button.attr('name') === 'first_button_add_modal') {
            // Case for last button in list (of for empty list).
            $addMoreWrapper = $button
              .parent()
              .siblings('.js-hide')
              .parent();

            config.delta = '';
          }
          else {
            // For button between paragraphs.
            $addMoreWrapper = $button
              .closest('table')
              .next()
              .children('.js-hide')
              .parent();

            config.delta = $button.closest('tr').index();
          }

          var $typeComboBox = $addMoreWrapper.find('[name$="[add_more_select]"]');

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

          Drupal.modalAddParagraphs.openDialog($addMoreWrapper, config, paragraphTypes);
        });
    }
  };

  /**
   * Namespace for modal related javascript methods.
   *
   * @type {Object}
   */
  Drupal.modalAddParagraphs = {};

  Drupal.modalAddParagraphs.openDialog = function ($context, config, types) {

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
    var $dialogTemplate = $('.paragraphs-add-dialog-template', $context);

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

    // Attach behaviours to dialog action triggering elements.
    $('.paragraphs-add-type-trigger-element', $dialog)
      .once('add-click-handler')
      .on('click', function (event) {
        var $this = $(this);

        // Stop default execution of click event.
        event.preventDefault();
        event.stopPropagation();

        Drupal.modalAddParagraphs.setValues(
          $context,
          {
            add_more_select: $this.attr('data-type'),
            add_more_delta: $this.attr('data-delta')
          }
        );

        // Close dialog afterwards.
        $this.closest('div.ui-dialog-content').dialog('close');
      });
  };

  /**
   * Method to set hidden fields and trigger adding of paragraph.
   *
   * @param {Object} $context
   *   Jquery object containing element where form for submitting exists.
   * @param {Object} options
   *   Object with key value pair, where key is name of field that should be set
   *   and value is value for that field.
   */
  Drupal.modalAddParagraphs.setValues = function ($context, options) {
    var $submitButton = $('.js-hide input[name$="_add_more"]', $context);
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
