<?php

namespace Drupal\paragraphs\Ajax;

use Drupal\Core\Ajax\CommandInterface;

/**
 * AJAX command to trigger related paragraph add on host form.
 */
class AddParagraphTypeCommand implements CommandInterface {

  /**
   * A unique identifier.
   *
   * @var string
   */
  protected $uuid;

  /**
   * A paragraphs bundle name.
   *
   * @var array
   */
  protected $paragraph_type;

  /**
   * Constructs a \Drupal\paragraphs\Ajax\AddParagraphTypeCommand object.
   *
   * @param string $uuid
   *   Entity browser instance UUID.
   */
  public function __construct($uuid, $paragraph_type) {
    $this->uuid = $uuid;
    $this->paragraph_type = $paragraph_type;
  }

  /**
   * Implements \Drupal\Core\Ajax\CommandInterface::render().
   */
  public function render() {
    return [
      'command' => 'paragraphs_add_paragraph',
      'uuid' => $this->uuid,
      'paragraph_type' => $this->paragraph_type,
    ];
  }

}
