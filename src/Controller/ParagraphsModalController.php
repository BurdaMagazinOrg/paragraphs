<?php

namespace Drupal\paragraphs\Controller;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\OpenModalDialogCommand;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Field\FieldConfigInterface;

/**
 * Controller for add more "Modal" mode for Paragraphs.
 *
 * @package Drupal\paragraphs\Controller
 */
class ParagraphsModalController extends ControllerBase {

  /**
   * Route callback that returns the Paragraphs form within a modal.
   *
   * @param \Drupal\Core\Field\FieldConfigInterface $field_config
   *   Field configuration.
   * @param string $uuid
   *   Unique ID.
   * @param string $id_prefix
   *   Prefix ID.
   * @param int $position
   *   Position where modal dialog is opened from. (-1 = last position)
   *
   * @return string
   *   Returns the Ajax response to open dialog.
   */
  public function paragraphsSelect(FieldConfigInterface $field_config, $uuid, $id_prefix, $position) {
    $form = \Drupal::formBuilder()->getForm('Drupal\paragraphs\Form\ParagraphsModalForm', $field_config, $uuid, $id_prefix, $position);

    $form['#attached']['library'][] = 'paragraphs/drupal.paragraphs.modal';
    $title = "Paragraphs types";
    $response = AjaxResponse::create()->addCommand(new OpenModalDialogCommand($title, $form, ['modal' => TRUE, 'width' => 800]));
    return $response;
  }

}
