"use strict";
const cwlib = require( './cwlib.js' );

let line = '';
let lineIndex = 0;
let longestSubstrings = [];

function isBalanced(str) {
    let counts = Array(26).fill(0);

    str.split('').forEach(char => {
        let index = char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);

        if (index >= 0 && index < 26) {
            counts[index] += (char === char.toUpperCase()) ? 1 : -1;
        }

    });


    return counts.every(count => count === 0);
}

function findSubstrings(line) {

    let stringAsChars = [...line];
    let items = stringAsChars.map((char, index) => [char, index]);

    //console.log("String as chars: ", stringAsChars);

    //subS = stringAsChars.map()*/

    let returnVal = [];

    returnVal = Array(line.length).fill().flatMap((_, i) => 
    Array(line.length - i + 1).fill().map((_, j) => {

        let sliced = line.slice(i, i + j);

        return {substring: sliced, indexStart: i, indexFinish: i + j - 1};
        //return sliced;
    })
    ).filter(sub => sub.substring.length > 0);

    //returnVal = returnVal.filter(sub => sub.substring.length > 0);
    returnVal = returnVal.filter(sub => isBalanced(sub.substring));

    returnVal.sort((a, b) => (a.indexFinish - a.indexStart) - (b.indexFinish - b.indexStart));
    
    console.log("Value to return: ", returnVal);
    // traverse returnnVal, for(sub in returnVal)
    // if sub is empty, remove it
    // if not, print [ indeOf(sub[0]) , indexOf(sub[sub.length - 1]) ]


    return returnVal;
}

function findLongest(substrings) {
    return substrings.reduce((longest, substring) => {

        if (substring.length > longest.length) {
            return substring;

        } else {
            return longest;

        }
    }, '');
}

cwlib.on( 'ready', function( ) {
	cwlib.run(); 
} );

cwlib.on( 'data', function( data ) {
    // Add data to line
    line += data;
} );

cwlib.on( 'reset', function() {
    console.log("\nData received: ", line);
    let substrings = findSubstrings(line);

    //console.log(`Balanced substrings for line ${lineIndex}:`, substrings);

    let longestInLine = findLongest(substrings);

    if (longestInLine.length > longestSubstrings.length) {
        longestSubstrings = [longestInLine];
    } else if (longestInLine.length === longestSubstrings.length) {
        longestSubstrings.push(longestInLine);
    }

    //console.log(`Longest balanced substrings for line ${lineIndex}:`, longestInLine, "\n");

    line = '';
    lineIndex++;
} );

cwlib.on( 'end', function() {
    // Print overall longest substrings
    console.log("Overall longest balanced substrings: ", longestSubstrings);
} );

cwlib.setup( process.argv[2]);