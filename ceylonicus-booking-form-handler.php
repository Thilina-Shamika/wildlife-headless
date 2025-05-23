<?php
/*
Plugin Name: Ceylonicus Booking Form Handler
Description: Handles submissions from the Book a Tour form and saves them as booking entries.
Version: 1.0
Author: Thilina Shamika
*/

if (!defined('ABSPATH')) exit;

// Register custom post type for bookings
add_action('init', function() {
    register_post_type('booking_entry', [
        'labels' => [
            'name' => 'Booking Entries',
            'singular_name' => 'Booking Entry',
        ],
        'public' => false,
        'show_ui' => true,
        'menu_icon' => 'dashicons-calendar-alt',
        'supports' => ['title', 'custom-fields'],
    ]);
});

// Register REST endpoint
add_action('rest_api_init', function() {
    register_rest_route('ceylonicus/v1', '/booking', [
        'methods' => 'POST',
        'callback' => 'ceylonicus_handle_booking_form',
        'permission_callback' => '__return_true',
    ]);
});

function ceylonicus_handle_booking_form($request) {
    $params = $request->get_json_params();

    // Check form ID
    if (empty($params['formId']) || $params['formId'] !== '69871d4') {
        return new WP_REST_Response(['success' => false, 'message' => 'Invalid form ID.'], 400);
    }

    // Sanitize and collect fields
    $fields = [
        'FirstName'        => sanitize_text_field($params['FirstName'] ?? ''),
        'your-email'       => sanitize_email($params['your-email'] ?? ''),
        'Phone'            => sanitize_text_field($params['Phone'] ?? ''),
        'ArrivalDate'      => sanitize_text_field($params['ArrivalDate'] ?? ''),
        'DepartureDate'    => sanitize_text_field($params['DepartureDate'] ?? ''),
        'ArrivalTime'      => sanitize_text_field($params['ArrivalTime'] ?? ''),
        'DepartureTime'    => sanitize_text_field($params['DepartureTime'] ?? ''),
        'Pax'              => sanitize_text_field($params['Pax'] ?? ''),
        'InterestedTour'   => sanitize_text_field($params['InterestedTour'] ?? ''),
        'SpecialRequests'  => sanitize_textarea_field($params['SpecialRequests'] ?? ''),
    ];

    // Basic validation
    if (empty($fields['FirstName']) || empty($fields['your-email']) || empty($fields['Phone']) || empty($fields['ArrivalDate']) || empty($fields['DepartureDate']) || empty($fields['ArrivalTime']) || empty($fields['DepartureTime']) || empty($fields['Pax']) || empty($fields['InterestedTour'])) {
        return new WP_REST_Response(['success' => false, 'message' => 'Please fill in all required fields.'], 400);
    }

    // Create booking entry
    $post_id = wp_insert_post([
        'post_type'   => 'booking_entry',
        'post_title'  => $fields['FirstName'] . ' - ' . $fields['ArrivalDate'],
        'post_status' => 'publish',
    ]);

    if (is_wp_error($post_id)) {
        return new WP_REST_Response(['success' => false, 'message' => 'Could not save booking.'], 500);
    }

    // Save fields as post meta
    foreach ($fields as $key => $value) {
        update_post_meta($post_id, $key, $value);
    }

    return new WP_REST_Response(['success' => true, 'message' => 'Booking received! We will contact you soon.'], 200);
} 