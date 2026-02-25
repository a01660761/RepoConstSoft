/*
 * Example functions to practice JavaScript
 *
 * Manuel Montero
 * 18 de Febrero, 2026
 */

"use strict";

function firstNonRepeating(str) {
    const candidates = []; // empty array
    // Check every character in the string
    for (let i = 0; i < str.length; i++) {
        // Compare against the candidates
        let found = false;
        for (let cand of candidates) {
            if (cand.char == str[i]) {
                cand.count += 1;
                found = true;
            }
        }
        if (!found) {
            candidates.push({char: str[i], count: 1});
        }
    }


    // Look for the first char that appeared only once
    for (let index in candidates) {
        if (candidates[index].count == 1) {
            return candidates[index].char;
        }
    }
}


/*
Escribe una función llamada bubbleSort que implemente el algoritmo 'bubble-sort' 
para ordenar una lista de números.
*/
function bubbleSort(arr) {
    const arrLength = arr.length;
    let isSwapped;

    for ( let i = 0; i < arrLength; i++) {
        isSwapped = false;

        for (let j = 0; j < arrLength - i -1; j++) {
            if (arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1],arr[j]]
                isSwapped = true;
            }
        }

        // si no hay mas swaps, el arreglo ya está
        if (!isSwapped) {
            break;
        }
    }
    return arr;
}


/* 
Escribe dos funciones: la primera con nombre invertArray que invierta un arreglo de números y 
regrese un nuevo arreglo con el resultado; la segunda, con nombre invertArrayInplace,que modifique 
el mismo arreglo que se pasa como argumento. No se permite usar la función integrada 'reverse'.
*/

function invertArray(arr) {
    const newArray = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        newArray.push(arr[i]);
    }

    return newArray;
}

function invertArrayInplace(arr) {
    let left = 0;
    let right = arr.length - 1;
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
}


/* 
Escribe una función llamada capitalize que reciba una cadena de texto y regrese una nueva con la primer 
letra de cada palabra en mayúscula.
*/
function capitalize(str) {
    const text = str.split(" "); // divide un string en un array de sub-strings, basado en un sperador en especifico
    for (let i = 0; i < text.length; i++) {
        text[i] = text[i].charAt(0).toUpperCase() + text[i].slice(1); // el 'slice(1)' regresa el string a partir del indice 1 sin la primer letra
    }

    return text.join(" "); // opuesto a split
}

/*
Escribe una función llamada mcd que calcule el máximo común divisor de dos números.
*/
function mcd(x, y) {
    if (x == 0) { // el algortmo de Euclides
        return y;
    }
    return mcd(y % x, x);
}

/* Crea una función llamada hackerSpeak que cambie una cadena de texto a 'Hacker Speak'. 
Por ejemplo, para la cadena 'Javascript es divertido', su hacker speak es: 'J4v45c1pt 35 d1v3rt1d0'.
*/
function hackerSpeak(str) {
    const replacements = { // no me va con un vector, asi que uso un objeto
        'a': '4',
        'e': '3',
        'i': '1',
        'o': '0',
        's' : '5',
        'g' : '9',
    };


    let result = '';
    for (let char of str) {
        if (char in replacements) { // existe en el objeto o undefined
            result += replacements[char];
        } else {
            result += char;
        }
    }
    return result;
}


/*
Escribe una función llamada factorize que reciba un número, y regrese una lista con todos sus factores. Por ejemplo:
factorize(12) --> [1, 2, 3, 4, 6, 12].
*/
function factorize(num) {
    const factors = []; // reminder para mi: factor = divirros que no deja residuo

    for (let i = 1; i <= num; i++) {
        if (num % i === 0) {
            factors.push(i); // JAVASCRIPT = ARRAYS DINAMICOS SIN LIMITE SDE TAMAÑO
        }
    }


    return factors;
}

/*
Escribe una función llamada deduplicate que quite los elementos duplicados de un arreglo 
y regrese una lista con los elementos que quedan. Por ejemplo:
deduplicate([1, 0, 1, 1, 0, 0]) -> [1, 0]
*/
function deduplicate(arr) {
    const uniqueElements = [];

    for (let element of arr) {
        let isDuplicate = false;
        for (let unique of uniqueElements) {
            if (element === unique) {
                isDuplicate = true;
                break;
            }
        }
        if (!isDuplicate) {
            uniqueElements.push(element);
        }
    }


    return uniqueElements;
}


/*
Escribe una función llamada findShortestString que reciba como parámetro una lista de cadenas de texto, 
y regrese la longitud de la cadena más corta.
*/
function findShortestString(arr) {
    if (arr.length === 0) {
        return 0;
    }

    let shortestLength = arr[0].length;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].length < shortestLength) {
            shortestLength = arr[i].length;
        }
    }


    return shortestLength;
}


/*
Escribe una función llamada isPalindrome que revise si una cadena de texto es un palíndromo o no.
*/
function isPalindrome(str) {
    let first = 0;
    let last = str.length - 1;

    while (first < last) {
        if (str[first] !== str[last]) {
            return false;
        }

        first++;
        last--;
    }

    
    return true;
}


/*
Escribe una función llamada sortStrings que tome una lista de cadena de textos y devuelva una nueva 
lista con todas las cadenas en orden alfabético.
*/
function sortStrings(arr) {
    const slice = arr.slice(); // crea una copia del arreglo original
    slice.sort();
    return slice;
}


/*
Escribe una función llamada stats que tome una lista de números y devuelva una lista con dos 
elementos: el promedio y la moda. Por ejemplo:
stats([8, 4, 2, 6, 8, 13, 17, 2, 4, 8]) -> [ 7.2, 8 ]
*/
function stats(arr) {
    if (arr.length === 0) {
        return [0, 0];
    }

    let sum = 0;
    for (let num of arr) {
        sum += num;
    }

    let avg = sum / arr.length;


    const frequency = {};
    for (let num of arr) {
        if (num in frequency) {
            frequency[num]++;
        } else {
            frequency[num] = 1;
        }
    }

    let maxFreq = 0;
    let mode = null;
    for (let num in frequency) {
        if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
            mode = Number(num); //'Number' para convertir la clave del objeto a un numero
        }
    }

    return [avg, mode];
}


/*
Escribe una función llamada popularString que tome una lista de cadenas de texto 
y devuelva la cadena más frecuente.
*/
function popularString(arr) {
    if (arr.length === 0) {
        return "";
    }

    const frequency = {};
    for (let str of arr) {
        if (str in frequency) {
            frequency[str]++;
        } else {
            frequency[str] = 1;
        }
    }

    let maxFreq = 0;
    let popular = null;
    for (let str in frequency) {
        if (frequency[str] > maxFreq) {
            maxFreq = frequency[str];
            popular = str;
        }
    }

    return popular;
}


/*
Escribe una función llamada isPowerOf2 que tome un número y devuelva verdadero si es una 
potencia de dos, falso de lo contrario.
*/
function isPowerOf2(num) {
    if (num <= 0) {
        return false;
    }

    while (num % 2 === 0) {
        num /= 2;
    }

    return num === 1;
}


/*
Escribe una función llamada sortDescending que tome una lista de números y devuelva 
una nueva lista con todos los números en orden descendente.
*/
function sortDescending(arr) {
    const result = arr.slice(); // crea una copia del arreglo original

    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result.length - 1; j++) {
            if (result[j] < result[j + 1]) {
                let temp = result[j];
                result[j] = result[j + 1];
                result[j + 1] = temp;
            }
        }
    }

    return result;
}





export {
    firstNonRepeating,
    bubbleSort,
    invertArray,
    invertArrayInplace,
    capitalize,
    mcd,
    hackerSpeak,
    factorize,
    deduplicate,
    findShortestString,
    isPalindrome,
    sortStrings,
    stats,
    popularString,
    isPowerOf2,
    sortDescending,
};

// Se lo pedí a Chat, no me estaba funcionando el "node.js" en terminal; no tengo ni la menor idea de que hace
if (import.meta.url === new URL(process.argv[1], "file:").href) {
  console.log("=== DEMO ===");
  console.log("sortStrings:", sortStrings(["z", "a", "m"]));
  console.log("stats:", stats([8, 4, 2, 6, 8, 13, 17, 2, 4, 8]));
  console.log("popularString:", popularString(["a", "b", "a"]));
  console.log("sortDescending:", sortDescending([5, 2, 9, 1]));
}
