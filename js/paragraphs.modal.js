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

}(jQuery, Drupal, drupalSettings));
