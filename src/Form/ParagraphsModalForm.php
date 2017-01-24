<?php

namespace Drupal\paragraphs\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Entity\Query\QueryFactory;
use Drupal\field\Entity\FieldConfig;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class ParagraphsModalForm.
 *
 * @package Drupal\paragraphs\Form
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
  public function buildForm(array $form, FormStateInterface $form_state, FieldConfig $field_config = NULL, $uuid = '', $id_prefix = '', $position = -1) {
    $form_state->addBuildInfo('uuid', $uuid);
    $form['#attached']['library'][] = 'paragraphs/drupal.paragraphs.modal';
    $form['#attached']['library'][] = 'core/drupal.states';

    $form['paragraphs_types'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => [
          'paragraphs_types_container',
        ],
      ],
    ];

    $form['paragraphs_types']['tabs'] = [
      '#type' => 'markup',
      '#markup' => '<ul><li><a href="#paragraphs-types__all">All</a></li></ul>',
    ];

    $form['paragraphs_types']['all'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => [
          'paragraphs-types__all',
        ],
        'id' => [
          'paragraphs-types__all',
        ],
      ],
    ];

    $target_bundles = $field_config->getSetting('handler_settings')['target_bundles'];
    $paragraphs_types = \Drupal::entityTypeManager()
      ->getStorage('paragraphs_type')
      ->loadMultiple($target_bundles);

    $drupalSettings = ['paragraphs' => ['modal' => []]];
    foreach ($paragraphs_types as $id => $paragraph_type) {
      $element = [];

      $elementName = strtr($id_prefix, '-', '_') . '_' . $paragraph_type->id() . '_add_more';
      $element['add_more']['add_more_button_' . $paragraph_type->id()] = [
        '#type' => 'submit',
        '#name' => $elementName,
        '#value' => $paragraph_type->label(),
        '#attributes' => [
          'class' => ['field-add-more-submit'],
        ],
        '#bundle_machine_name' => $paragraph_type->id(),
      ];
      $form['paragraphs_types']['all'][$paragraph_type->id()] = $element;

      // Add settings for created button.
      $drupalSettings['paragraphs']['modal'][$elementName] = [
        'type' => $paragraph_type->id(),
        'position' => $position,
      ];
    }

    $form['#attached']['drupalSettings'] = $drupalSettings;

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $form_state->setRebuild();
  }

}
