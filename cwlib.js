"use strict";

const fs = require( 'fs' );
let interval = 25;
let input_buffer = [];
let hooks = {
	ready: noop,
	data: noop,
	reset: noop,
	end: noop
};
 
/**
 * A no-operation function, placeholder for each hook
 */
function noop(){
	// Do nothing
};

/**
 * A function to hook specific events.
 *
 * Expects two parameters:
 *     A hook string
 *     A function to handle this hook
 *
 * Valid hooks are:
 *     'ready' - handler is called to start the processing of input
 *     'data' - handler is called repeatedly with each input character
 *     'reset' - handler is called for each new line
 *     'end' - handler is called once when all data is complete
 */
module.exports.on = function( hook, handler ) {
	hooks[hook] = handler;
};

/**
 * Requests that data begin being processed.
 *
 * Must be called after setup().
 */
module.exports.run = function() {
	sendByte();
};

/**
 * Sets up the library to run a set of tests.
 *
 * Accepts two arguments:
 *   - fileName [required] - the data filename;
 *   - ioDelay [optional] - How long to wait between data events, in milliseconds. Defaults to 25ms
 *
 * Must be called before run().
 */
module.exports.setup = function( fileName, ioDelay = 25 ) {
	interval = ioDelay;
	let dataFile = fs.createReadStream( fileName, { encoding: 'utf8', fd: null } );
	dataFile.on('readable', function() {
		let chunk;
		while (null !== (chunk = dataFile.read(1))) {
			input_buffer.push( chunk[0] );
		}
	});
	dataFile.on( 'end', function() {
			hooks['ready']();
	}
		 );
}

let index = 0;
function sendByte() {
	if( input_buffer[index].charAt(0) === '\n' )
		hooks['reset']();
	else
		hooks['data']( input_buffer[index].charAt(0) );
	index++;

	if( index >= input_buffer.length ) {
		hooks['end']();
	}
	else
		setTimeout( sendByte, interval );
}