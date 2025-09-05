<?php
/**
 * Plugin Name: InspoQuotes Embed
 * Description: Adds [inspoquotes theme="dark" align="left" token="default"] shortcode.
 * Version: 1.0.0
 * Author: InspoQuotes
 * License: MIT
 */
if (!defined('ABSPATH')) exit;

function iq_embed_shortcode($atts) {
  $a = shortcode_atts([
    'theme'  => 'dark',
    'align'  => 'left',
    'token'  => 'default',
    'target' => 'iq-widget-'.wp_generate_password(6,false,false)
  ], $atts, 'inspoquotes');

  $div = '<div id="'.esc_attr($a['target']).'"></div>';
  $src = 'https://inspoquotes.net/embed/dailyquote.js';
  $attrs = sprintf(
    ' data-theme="%s" data-align="%s" data-token="%s" data-target="%s"',
    esc_attr($a['theme']), esc_attr($a['align']), esc_attr($a['token']), esc_attr($a['target'])
  );
  return $div.'<script async src="'.$src.'"'.$attrs.'></script>';
}
add_shortcode('inspoquotes','iq_embed_shortcode');
