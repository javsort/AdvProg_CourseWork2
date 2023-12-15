// Author: 38880237
"use strict";
const cwlib = require( './cwlib.js' );

// Declare main variables to be used
let lineRead = '';
let lineIndex = 0;
let longestSubstrings = [];
let longestSubLength = 0;

// Check if string is balanced
function isBalanced(toBalance) {
    // Make array of 26 elements - for the alphabet
    let balance = Array(26).fill(0);

    // For each character in the string, increment or decrement the count at the index of the character
    toBalance.split('').forEach(char => {
        // Get the index of the character in the alphabet
        let val = char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);

        // If the index is valid, increment or decrement the count at the index depending on if it's upper or lower case
        if (val >= 0 && val < 26) {
            balance[val] += (char === char.toUpperCase()) ? 1 : -1;
        }

    });

    // If all counts are 0, the string is balanced (true), else it's false
    return balance.every(balance => balance === 0);
}

// function to find all substrings in a line, and return the largest
function findSubstrings(lineRead) {
    // declare the array to be returned
    let returnVal = [];

    // For each character in the line, get all substrings starting with that character
    returnVal = Array(lineRead.length).fill().flatMap((_, i) => 
    Array(lineRead.length - i + 1).fill().map((_, j) => {

        // Get the substring
        let sliced = lineRead.slice(i, i + j);

        // Return the substring as an object. Contains the the start and end index from the original array, and the line where it came from
        return {substring: sliced, indexStart: i, indexFinish: i + j - 1, lineIndex: lineIndex};
    })
    ).filter(toDel => toDel.substring.length > 0);          // Filter out empty substrings

    // Filter out substrings that aren't balanced
    returnVal = returnVal.filter(current => isBalanced(current.substring));

    // Sort the substrings by size for printing
    returnVal.sort((a, b) => (a.indexFinish - a.indexStart) - (b.indexFinish - b.indexStart));

    // Print the substrings found to console
    returnVal.forEach(toPrint => {
        console.log("[ " + toPrint.indexStart + ", " + toPrint.indexFinish + " ]");
    
    });

    // If it's already sorted by size, just get the last one and return all with the same size
    let longest = returnVal.filter(item => item.substring.length === returnVal[returnVal.length - 1].substring.length);
    
    // Turn the longest substrings into a string for printing
    let longestInLine = "";
    longest.forEach(toPrint => {
        longestInLine += "[ " + toPrint.indexStart + ", " + toPrint.indexFinish + " ], "; 
    });

    // Remove the last comma and space and print the longest substrings for this line
    console.log("Longest balanced substrings for this line: [", longestInLine.slice(0, -2),"]\n");

    // Return the longest substrings
    return longest;
}

// function to update the longest substrings
function updateLongest(substrings) {
    // If there are no substrings, return
    if(substrings.length === 0) {
        return;

        // If the length of the new substrings is longer than the current, set the new substrings to the longest
    } else if (longestSubLength < substrings[0].substring.length) {
        longestSubstrings = substrings;
        longestSubLength = substrings[0].substring.length;
        return;

        // If the length of the new substrings is equal to the current, add the new substrings to the longest
    } else if (longestSubLength === substrings[0].substring.length) {
        longestSubstrings = longestSubstrings.concat(substrings);
        return;

        // If the length of the new substrings is shorter than the current, return
    } else {
        return;
    }
}

// Start
cwlib.on( 'ready', function( ) {
	cwlib.run(); 

} );

// For each character, add it to the line
cwlib.on( 'data', function( data ) {
    // Add data to line
    lineRead += data;

} );

// When the line is reset, find the substrings and update the longest
cwlib.on( 'reset', function() {
    let substrings = findSubstrings(lineRead);

    updateLongest(substrings);

    // Reset the line and increment the line index
    lineRead = '';
    lineIndex++;
});

// When the end is reached, find and print the longest substrings
cwlib.on( 'end', function() {
    let subStringsFinal = printSubStrings(longestSubstrings);

    // Print overall longest substrings
    console.log("Overall longest balanced substrings: ", subStringsFinal);
} );

// function to print the substrings
function printSubStrings(subStrings) {
    let finalString = "\n";

    // Sort the substrings by line index
    subStrings.sort((a, b) => (a.lineIndex - b.lineIndex));

    // set a final string and a current line index to be used and edited
    let currentLineIndex = subStrings[0].lineIndex;
    let currentLineStrings = "";

    subStrings.forEach(currtItem => {
        // If the substring is on the same line as the current line, add it to the current line string
        if(currtItem.lineIndex === currentLineIndex){
            currentLineStrings += "[ " + currtItem.indexStart + ", " + currtItem.indexFinish + " ], ";
            
            // If the substring is on a different line, add the current line index and string to the final string, and reset the current line index and string
        } else {
            finalString += "[ " + currentLineIndex + ", [ " + currentLineStrings.slice(0, -2) + " ] ]\n" ;
            currentLineIndex = currtItem.lineIndex;
            currentLineStrings = "";
            currentLineStrings += "[ " + currtItem.indexStart + ", " + currtItem.indexFinish + " ], ";

        }
    });

    // Add the last line to the final string
    finalString += "[ " + currentLineIndex + ", [ " + currentLineStrings.slice(0, -2) + " ] ]\n" ;

    // Return the final string
    return finalString;
}

// Run the program
cwlib.setup( process.argv[2]);