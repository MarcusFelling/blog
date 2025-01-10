/* global screen_reader_text */
( function( $ ) {

	/**
	 * A function to add classes to body depending on window width.
	 */
	function body_class() {

		window_width = $( window ).width();
		$( 'body' ).removeClass( 'small-screen medium-screen large-screen' );
		if ( window_width >= 1020 ) {
			$( 'body' ).addClass( 'small-screen medium-screen large-screen' );
		} else if ( window_width >= 768 ) {
			$( 'body' ).addClass( 'small-screen medium-screen' );
		} else if ( window_width >= 600 ) {
			$( 'body' ).addClass( 'small-screen' );
		}

	}

	$( window ).load( function() {

		body_class();

		/* Add dropdown toggle to Custom Menus Widget items */
		$( '.widget_nav_menu ul:not([id^="menu-social"]) .page_item_has_children > a, .widget_nav_menu ul:not([id^="menu-social"]) .menu-item-has-children > a' ).after( '<button class="dropdown-toggle" aria-expanded="false">' + screen_reader_text.expand + '</button>' );

		/* Toggle child menu items */
		$( '.dropdown-toggle' ).click( function( e ) {
			e.preventDefault();
			$( this ).toggleClass( 'toggle-on' );
			$( this ).prev( 'a' ).toggleClass( 'toggle-on' );
			$( this ).next( '.children, .sub-menu' ).toggleClass( 'toggle-on' );
			$( this ).attr( 'aria-expanded', $( this ).attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );
			$( this ).html( $( this ).html() === screen_reader_text.expand ? screen_reader_text.collapse : screen_reader_text.expand )
		} );

	} ).resize( body_class );

} )( jQuery );
