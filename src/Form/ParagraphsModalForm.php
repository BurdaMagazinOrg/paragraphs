<?php

namespace Drupal\paragraphs\Form;

use Drupal\Component\Utility\Html;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\field\Entity\FieldConfig;
use Drupal\paragraphs\Ajax\AddParagraphTypeCommand;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a base form for "Modal" add mode for paragraph types.
 */
class ParagraphsModalForm extends FormBase {

  /**
   * The query factory to create entity queries.
   *
   * @var \Drupal\Core\Entity\Query\QueryFactory
   */
  protected $queryFactory;

  /**
   * Constructs a new ParagraphsModalForm object.
   *
   * @param \Drupal\Core\Entity\Query\QueryFactory $query_factory
   *   The entity query object.
   */
  public function __construct(QueryFactory $query_factory) {
    $this->queryFactory = $query_factory;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity.query')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'paragraphs_modal_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, FieldConfig $field_config = null, $uuid = null, $id_prefix = NULL) {
    $form_state->addBuildInfo('uuid', $uuid);
    $form['#attached']['library'][] = 'paragraphs/paragraphs.modal';
    $form['#attached']['library'][] = 'core/drupal.states';

    $form['paragraphs_types'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => [
          'paragraphs_types_container'
        ]
      ]
    ];
    $form['paragraphs_types']['tabs'] = [
      '#type' => 'markup',
      '#markup' => '<ul><li><a href="#paragraphs-types__all">All</a></li></ul>'
    ];
    $form['paragraphs_types']['all'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => [
          'paragraphs-types__all'
        ],
        'id' => [
          'paragraphs-types__all'
        ]
      ]
    ];
    $target_bundles = $field_config->getSetting('handler_settings')['target_bundles'];
    $paragraphs_types  =\Drupal::entityTypeManager()->getStorage('paragraphs_type')->loadMultiple($target_bundles);

    foreach ($paragraphs_types as $id => $paragraph_type) {
      $element = [];
      $wrapper_id = Html::getUniqueId($id_prefix . '-add-more-wrapper');
      $element['add_more']['add_more_button_' . $paragraph_type->id()] = array(
        '#type' => 'submit',
        '#name' => strtr($id_prefix, '-', '_') . '_' . $paragraph_type->id() . '_add_more',
        '#value' => $paragraph_type->label(),
        '#attributes' => array('class' => array('field-add-more-submit')),
        '#limit_validation_errors' => array(),
        '#submit' => array(array(get_class($this), 'addMoreSubmit')),
        '#ajax' => array(
          'callback' => array(get_class($this), 'addMoreAjax'),
          'wrapper' => $wrapper_id,
          'effect' => 'fade',
        ),
        '#bundle_machine_name' => $paragraph_type->id(),
      );
      $form['paragraphs_types']['all'][$paragraph_type->id()] = $element;
    }

    return $form;
  }

  public static function addMoreAjax(array $form, FormStateInterface $form_state) {
    $build_info = $form_state->getBuildInfo();
    $uuid = $build_info['uuid'];
    $response = new AjaxResponse();

    $command = new AddParagraphTypeCommand($uuid, $form_state->getTriggeringElement()['#bundle_machine_name']);
    $response->addCommand($command);
    // return $element;
    $command = new CloseModalDialogCommand();
    $response->addCommand($command);
    return $response;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
  }

  /**
   * {@inheritdoc}
   */
  public static function addMoreSubmit(array $form, FormStateInterface $form_state) {
    $form_state->setRebuild();
  }
}
