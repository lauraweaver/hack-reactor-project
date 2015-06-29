var _ = require('./project')

var assert = function(condition, message) {
    if (!condition) {
        message = message || "Assertion failed"
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message
    }
}

/**
 * Copied from http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html
 * for the purposes of testing this project. It has been modified to work recursively 
 * to check equivalency of arrays and objects (lines(29-37))
 */
function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName].constructor !== b[propName].constructor) {
            // If values do not have the same type, they are not
            // equal and the objects are not equivalent
            return false;
        }
        if (a[propName].constructor === Array || a[propName].constructor === Object) {
            if (!isEquivalent(a[propName], b[propName])) {
                return false;
            }
        } else if (a[propName] !== b[propName]) {
            // If values of same property are not equal,
            // objects are not equivalent
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}


var array = [5, 1, 2, 3, 4, 5]

var array2 = ["number", "object", "array", "bool", "function", "object"]

var array3 = [NaN, "", "object", 0, "object", undefined]

var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];

var object = {
    state: "Kansas",
    capital: "Topeka", 
    universities: ["KU", "K-State"], 
    flower: "Sunflower",
    population: 2904000, 
}

var object2 = {
    twelve: 12,
    one: 1,
    two: 2,
    three: 3,
    four: 4
}

function consoleLog(input) {
    console.log(input)
}

function plusOne(item) {
    return parseInt(item) + 1
}

// Test for _.each():
// _.each(object, function(item) {consoleLog(item)})
// _.each(array, function(item) {console.log(item)})

// Test for map():
assert(isEquivalent(_.map(object2, plusOne), {twelve: 13, one: 2, two: 3, three: 4, four: 5}))
assert(isEquivalent(_.map(array, function(item){return parseInt(item) + 1}), [6, 2, 3, 4, 5, 6]))
assert(isEquivalent(_.map(array, plusOne), [6, 2, 3, 4, 5, 6]))

// Test for invoke():
assert(isEquivalent(_.invoke([[2, 3, 5, 4, 1, 7, 6], [6, 3, 2, 1, 4, 5, 7]], 'sort'), [[ 1, 2, 3, 4, 5, 6, 7 ], [ 1, 2, 3, 4, 5, 6, 7 ]]))

// Test for filter(): 
assert(isEquivalent(_.filter(object, function(item) {
    return item === "Kansas" || item === "Topeka"}), { state: 'Kansas', capital: 'Topeka' }))
assert(isEquivalent(_.filter(array, function(item) {
    return item % 2 !== 0}), [5, 1, 3, 5]))

// Test for reject():
assert(isEquivalent(_.reject(object, function(item) {
    return item === "Kansas" || item === "Topeka"}), 
    {universities: ['KU', 'K-State'], flower: 'Sunflower', population: 2904000}))
assert(isEquivalent(_.reject(array, function(item) {return item % 2 !== 0}), [ 2, 4 ]))

// // Test for reduce():
assert(_.reduce(object2, function(result, item){return result + item}) === 22)
assert(_.reduce(array, function(result, item) {return result + item}) === 20)

// // Test for find():
assert(_.find(object, function(item) {
    return item === "Kansas"}) === "Kansas")
assert(_.find(array, function(item) {return item % 2 === 0}) === 2)

// // Test for size():
assert(_.size(object) === 5)
assert(_.size(object2) === 5)
assert(_.size(array) === 6)

// Test for every():
assert(_.every(object, function(item) {
    return item === "Kansas"}) === false)
assert(_.every(array, function(item) {
    return item.constructor === Number}) === true) 

// Test for some():
assert(_.some(object, function(item) {
    return item === "San Francisco"}) === false)
assert(_.some(array, function(item) {return item % 2 === 0}) === true)

// Test for _.contains():
assert(_.contains(array, 0) === false)
assert(_.contains(object, "California") === false)

// Test for pluck():
assert(isEquivalent(_.pluck(object, 'state'), ['Kansas']))
assert(isEquivalent(_.pluck(array, '0'), [5]))

// Test for _.sortBy():
assert(isEquivalent(_.sortBy(stooges, function(stooge){ return stooge.age; }), 
    [ {name: 'moe', age: 40}, {name: 'larry', age: 50}, 
    {name: 'curly', age: 60}]))
assert(isEquivalent(_.sortBy(array2, function(a) {return a.length}), 
    [ 'bool', 'array', 'number', 'object', 'object', 'function' ]))
assert(isEquivalent(_.sortBy(object2), [ 1, 2, 3, 4, 12 ]))

// Test for _.max():
assert(_.max(array) === 5)
assert(isEquivalent(_.max(stooges, function(stooge){ return stooge.age; }), 
    {name: 'curly', age: 60}))
assert(_.max(array2, function(a) {return a.length}) === 'function')

// Test for _.min():

assert(_.min(array) === 1)
assert(isEquivalent(_.min(stooges, function(stooge){ return stooge.age; }), 
    {name: 'moe', age: 40}))
assert(_.min(array2, function(a) {return a.length}) === 'bool')

// Test for partition():
assert(isEquivalent(_.partition(object, function(item) {
    return item === "Kansas"}), 
    [[ 'Kansas' ],['Topeka', ['KU', 'K-State'], 'Sunflower', 2904000 ]]))
assert(isEquivalent(_.partition(array, function(item) {
    return item % 2 === 0}), [[ 2, 4 ], [ 1, 3, 5, 5 ]]))

// Test for _.groupBy():
assert(isEquivalent(_.groupBy([1.3, 2.1, 2.4], 
    function(num){ return Math.floor(num)}), {'1':[1.3], '2':[2.1, 2.4]}))

// Test for sample():
// console.log(_.sample(object))
// console.log(_.sample(object, 3))
// console.log(_.sample(array))
// console.log(_.sample(array, 2))

// Test for toArray():
assert(isEquivalent(_.toArray(object), 
    ['Kansas', 'Topeka', ['KU', 'K-State'], 'Sunflower', 2904000]))
assert(isEquivalent(_.toArray(object2), [ 12, 1, 2, 3, 4 ]))
assert(isEquivalent(_.toArray(array), [1, 2, 3, 4, 5, 5]))

// Test for first():
assert(_.first(array) === 1)
assert(isEquivalent(_.first(array, 2), [1, 2]))

// Test for initial():
assert(isEquivalent(_.initial([1, 2, 3, 4]), [1, 2, 3]))
assert(isEquivalent(_.initial([1, 2, 3, 4], 2), [1, 2]))

// Test for last():
assert(_.last([1, 2, 3, 4]) === 4)
assert(isEquivalent(_.last([1, 2, 3, 4], 2), [3, 4]))

// Test for _.rest():
assert(isEquivalent(_.rest([1, 2, 3, 4]), [2, 3, 4]))
assert(isEquivalent(_.rest([1, 2, 3, 4], 2), [3, 4]))

// Test for _.compact():
assert(isEquivalent(_.compact(array3), ['object', 'object']))

// Test for _.without():
assert(isEquivalent(_.without([1, 2, 3, 4, 5, 6, 7], 2, 1, 7), [3, 4, 5, 6]))

// Test for _.uniq():
assert(isEquivalent(_.uniq(array), [1, 2, 3, 4, 5]))
assert(isEquivalent(_.uniq(array2), ['bool', 'array', 'number', 'object', 'function']))


// Test for _.object():
assert(isEquivalent(_.object([['one', 1], ['two', 2], ['three', 3], 
    ['four', 4]]), {one: 1, two: 2, three: 3, four: 4}))

// Test for _.indexOf():
assert(_.indexOf(array2, "object") === 3)

// Test for _.lastIndexOf():
assert(_.lastIndexOf(array3, "object") === 4)

// Test for _.findIndex():
assert(_.findIndex(array2, function(item) {return item === "object"}) === 3)

// Test for _.findLastIndex():
assert(_.findLastIndex(array3, function(item) {return item === "object"}) === 4)

// Test for _.range():
assert(isEquivalent(_.range(1, -9, 2), [1, -1, -3, -5, -7]))
assert(isEquivalent(_.range(1, 11, 2), [ 1, 3, 5, 7, 9 ]))
assert(isEquivalent(_.range(1, 21), 
    [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ]))

console.log("All tests passed!")
