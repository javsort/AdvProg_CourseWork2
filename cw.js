"use strict";
const cwlib = require( './cwlib.js' );

cwlib.on( 'ready', function( ) {
	cwlib.run(); 
} );

cwlib.on( 'data', function( data ) {
	 console.log( "pito = ", data );
} );

cwlib.setup( process.argv[2] ); 
