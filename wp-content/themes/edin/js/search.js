/**
 * search.js
 *
 * Handles toggling the search form.
 */
( function( $ ) {

	$( '.search-toggle' ).click( function() {
		$( 'html, body' ).scrollTop( 0 );
		$( this ).toggleClass( 'open' );
		$( this ).attr( 'aria-expanded', $( this ).attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );
		$( '.search-wrapper' ).toggle();
		$( '.menu-toggle' ).removeClass( 'open' );
		$( '.menu-toggle' ).attr( 'aria-expanded', 'false' );
		$( '.navigation-wrapper' ).hide();
	} );

} )( jQuery );
