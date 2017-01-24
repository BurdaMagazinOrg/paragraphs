<?php

namespace Drupal\paragraphs\Controller;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\OpenModalDialogCommand;
use Drupal\Core\Controller\ControllerBase;

/**
 * Controller for add more "Modal" mode for Paragraphs.
 *
 */
class ParagraphsModalController extends ControllerBase {

  /**
   * Route callback that returns the Paragraphs form within a modal.
   *
   * @return string
   *   Returns the Ajax response to open dialog.
   */
  public function paragraphsSelect($field_config, $uuid, $id_prefix) {
    $form = \Drupal::formBuilder()->getForm('Drupal\paragraphs\Form\ParagraphsModalForm', $field_config, $uuid, $id_prefix);

    $form['#attached']['library'][] = 'paragraphs/paragraphs.modal';
    $title = "Paragraphs types";
    $response = AjaxResponse::create()->addCommand(new OpenModalDialogCommand($title, $form, ['modal' => TRUE, 'width' => 800]));
    return $response;
  }

}
