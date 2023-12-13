"use strict";
const cwlib = require( './cwlib.js' );

let line = '';
let lineIndex = 0;
let balancedSubstrings = [];
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
    return Array(line.length).fill().flatMap((_, i) => 
        Array(line.length - i + 1).fill().map((_, j) => 
            line.slice(i, i + j)
        )
    ).filter(isBalanced);
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
    line += data;
} );

cwlib.on( 'reset', function() {
    let substrings = findSubstrings(line);
    let longestInLine = findLongest(substrings);
    if (longestInLine.length > longestSubstrings.length) {
        longestSubstrings = [longestInLine];
    } else if (longestInLine.length === longestSubstrings.length) {
        longestSubstrings.push(longestInLine);
    }
    console.log(`Longest balanced substrings for line ${lineIndex}:`, longestInLine);
    line = '';
    lineIndex++;
} );

cwlib.on( 'end', function() {
    console.log("Overall longest balanced substrings: ", longestSubstrings);
} );

cwlib.setup( process.argv[2] );