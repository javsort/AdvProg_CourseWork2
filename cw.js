"use strict";
const cwlib = require( './cwlib.js' );

// Declare main variables to be used
let line = '';
let lineIndex = 0;
let longestSubstrings = [];
let longestSubLength = 0;

// Check if string is balanced
function isBalanced(str) {
    // Make array of 26 elements - for the alphabet
    let counts = Array(26).fill(0);

    // For each character in the string, increment or decrement the count at the index of the character
    str.split('').forEach(char => {
        let index = char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);

        if (index >= 0 && index < 26) {
            counts[index] += (char === char.toUpperCase()) ? 1 : -1;
        }

    });

    return counts.every(count => count === 0);
}

function findSubstrings(line) {
    let returnVal = [];

    returnVal = Array(line.length).fill().flatMap((_, i) => 
    Array(line.length - i + 1).fill().map((_, j) => {

        let sliced = line.slice(i, i + j);

        return {substring: sliced, indexStart: i, indexFinish: i + j - 1, lineIndex: lineIndex};
    })
    ).filter(sub => sub.substring.length > 0);

    returnVal = returnVal.filter(sub => isBalanced(sub.substring));

    returnVal.sort((a, b) => (a.indexFinish - a.indexStart) - (b.indexFinish - b.indexStart));

    returnVal.forEach(sub => {
        console.log("[ " + sub.indexStart + ", " + sub.indexFinish + " ]");
    
    });

    // If it's already sorted by size, just get the last one
    let longest = returnVal.filter(sub => sub.substring.length === returnVal[returnVal.length - 1].substring.length);
    
    let longestInLine = "";
    longest.forEach(sub => {
        longestInLine += "[ " + sub.indexStart + ", " + sub.indexFinish + " ], "; 
    });

    console.log("Longest balanced substrings for this line: [", longestInLine.slice(0, -2),"]\n");

    return longest;
}

function updateLongest(substrings) {
    if(substrings.length === 0) {
        return;

    } else if (longestSubLength < substrings[0].substring.length) {
        longestSubstrings = substrings;
        longestSubLength = substrings[0].substring.length;
        return;

    } else if (longestSubLength === substrings[0].substring.length) {
        longestSubstrings = longestSubstrings.concat(substrings);
        return;

    } else {
        return;

    }
}

// Start
cwlib.on( 'ready', function( ) {
	cwlib.run(); 

} );

cwlib.on( 'data', function( data ) {
    // Add data to line
    line += data;

} );

cwlib.on( 'reset', function() {
    let substrings = findSubstrings(line);

    updateLongest(substrings);

    line = '';
    lineIndex++;
} );

cwlib.on( 'end', function() {
    let subStringsFinal = printSubStrings(longestSubstrings);

    // Print overall longest substrings
    console.log("Overall longest balanced substrings: ",subStringsFinal);
} );

function printSubStrings(subStrings) {
    let finalString = "\n";

    subStrings.sort((a, b) => (a.lineIndex - b.lineIndex));

    let currentLineIndex = subStrings[0].lineIndex;
    let currentLineStrings = "";

    subStrings.forEach(sub => {
        if(sub.lineIndex === currentLineIndex){
            currentLineStrings += "[ " + sub.indexStart + ", " + sub.indexFinish + " ], ";
            
        } else {
            finalString += "[ " + currentLineIndex + ", [ " + currentLineStrings.slice(0, -2) + " ] ]\n" ;

            currentLineIndex = sub.lineIndex;

            currentLineStrings = "";
            
            currentLineStrings += "[ " + sub.indexStart + ", " + sub.indexFinish + " ], ";
        }
    });

    finalString += "[ " + currentLineIndex + ", [ " + currentLineStrings.slice(0, -2) + " ] ]\n" ;

    return finalString;
}

cwlib.setup( process.argv[2]);