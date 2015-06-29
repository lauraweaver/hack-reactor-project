module.exports = (function() {
    var _ = {}

    // Helper functions for methods

    function isCollection(collection) {
        return collection.constructor === Array || collection.constructor === Object
    }

    function isFunction(func) {
        return func.constructor === Function
    }

    function identity(value) {
        return value;
    };

    function isUndefined(value) {
        return value === undefined
    }

    function indexOf(array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return i
            }
        }
        return -1
    }

    /**
     * Collections
     * - A collection can be an array or an object
     */

    _.each = function(collection, fn) {
        for (var i in collection) {
            fn(collection[i], i, collection)
        }
    }

    /**
     * Returns new collection of mapped values
     */
    _.map = function(collection, func) {
        var newCollection = null
        if (isCollection(collection)) {
            newCollection = collection.constructor()
            _.each(collection, function(item, i) {
                newCollection[i] = func(item)
            })
        }
        return newCollection
    }

    /**
     * Invokes method on every item in collection
     */
    _.invoke = function(collection, method) {
        var slice = Array.prototype.slice
        var args = slice.call(arguments, 2)
        return _.map(collection, function(item) {
            var func = null
            if (isFunction(method)) {
                func = method
            } else {
                func = item[method]
            }
            return func.apply(item, args)
        })
    }
        
    /**
     * Returns a new collection of each member that 
     * passes the predicate, a function that returns a bool
     */
    _.filter = function(collection, predicate) {
        var result = null
        if (isCollection(collection)) {
            result = collection.constructor()
            _.each(collection, function(item, i) {
                if (predicate(item)) {
                    if (result.constructor === Array) {
                        result.push(item)
                    } else {
                        result[i] = item
                    }
                }
            })
        }
        return result
    }

    /**
     * Returns a new collection of each member that 
     * does not pass the predicate
     * Opposite of filter
     */
    _.reject = function(collection, predicate) {
        var result = null
        if (isCollection(collection)) {
            result = collection.constructor()
            _.each(collection, function(item, i) {
                if (!predicate(item) && result.constructor === Array) {
                    result.push(item)
                } else if (!predicate(item)) {
                    result[i] = collection[i]
                }
            })
        }
        return result
    }

    // Returns result of reducing values in a collection by means of a callback

    _.reduce = function(collection, callback) {
        var result = null
        if (isCollection(collection)) {
            _.each(collection, function(item) {
                if (result === null) {
                    result = item
                } else {
                    result = callback(result, item)
                }
            })
        }
        return result
    }

    // Returns first item to return true based on predicate

    _.find = function(collection, predicate) {
        for (var i in collection) {
            if (predicate(collection[i])) {
                return collection[i]
            }
        }
        return undefined
    }

    // Returns the number of values in collection

    _.size = function(collection) {
        if (collection.constructor === Array) {
            return collection.length
        } else if (collection.constructor === Object) {
            return Object.keys(collection).length
        }
    }

    // Return true if every item in the collection passes the prediacte

    _.every = function(collection, predicate) {
        if (collection.constructor === Array) {
            for (var i=0; i < collection.length; i++) {
                if (!predicate(collection[i])) {
                    return false
                }
            }
        } else if (collection.constructor === Object) {
            for (var item in collection) {
                if (!predicate(collection[item])) {
                    return false
                }
            }
        } else {
            return undefined
        }
        return true
    }

    // Return true if at least one item in the collection passes the prediacte

    _.some = function(collection, predicate) {
        if (isCollection(collection)) {
            for (var i in collection) {
                if (predicate(collection[i])) {
                    return true
                }
            }
        }
        return false
    }

    // Returns true if the collection contains the value input

    _.contains = function(collection, value) {
        if (collection.constructor === Array) {
            return indexOf(collection, value) !== -1
        } else if (collection.constructor === Object) {
            for (var i in collection) {
                if (collection[i] === value) {
                    return true
                }
            }
        }
        return false
    }

    // Returns an array of property values

    _.pluck = function(collection, propertyName) {
        var result = null
        if (isCollection(collection)) {
            result = []
            _.each(collection, function(item, key) {
                if (key === propertyName) {
                    result.push(item)
                }
            })
        }
        return result
    }

    // Returns a sorted collection based on iteratee

    _.sortBy = function(collection, iteratee) {
        if (isCollection(collection)) {
            var array = []
            if (collection.constructor === Array) {
                array = collection
            } else {
                for (var i in collection) {
                    array.push(collection[i])
                }
            }

            return array.sort(function(a, b) {
                if (iteratee === undefined) {
                    return a - b
                } else {
                    return iteratee(a) - iteratee(b)
                }
            })
        }
        return undefined  
    }

    // Implements sortBy to return the max value based on iteratee

    _.max = function(collection, iteratee) {
        var sorted = _.sortBy(collection, iteratee)
        return sorted[sorted.length-1]
    }

    // Implements sortBy to return the min value based on iteratee

    _.min = function(collection, iteratee) {
        var sorted = _.sortBy(collection, iteratee)
        return sorted[0]
    }

    /** 
     * Returns array of two arrays--the first are values that pass the predicate,
     * the second are values that do not pass teh predicate
     */

    _.partition = function(collection, predicate) {
        var trueValues = []
        var falseValues = []

        _.each(collection, function(item) {
            if (predicate(item)) {
                trueValues.push(item)
            } else {
                falseValues.push(item)
            }
        })

        return [trueValues, falseValues]
    }

    /**
     * Returns object with the keys equalling the result of the iteratee and corresponding values. 
     * In this groupBy, iteratee must be a function.
     */

    _.groupBy = function(collection, iteratee) {
        if (isCollection(collection)) {
            var groups = {}
            if (iteratee.constructor === Function) {
                for (var i in collection) {
                    if (groups.hasOwnProperty(iteratee(collection[i]))) {
                        groups[iteratee(collection[i])].push(collection[i])
                    } else {
                        groups[iteratee(collection[i])] = [collection[i]]
                    }
                }
            }
            return groups
        }
        return undefined
    }

    // Returns a sample of n items in a collection

    _.sample = function(collection, n) {
        var sample = Array()

        if (collection.constructor === Array) {
            var random = Math.floor(Math.random() * collection.length)
            if (n === undefined) {
                return collection[random]
            } else {
                for(var i=1; i <= n; i++) {
                    random = Math.floor(Math.random() * collection.length)
                    sample.push(collection[random])
                }
            }
        } else if (collection.constructor === Object) {
            var listOfKeys = Array()
            for (var key in collection) {
                listOfKeys.push(key)
            }
            var random = Math.floor(Math.random() * listOfKeys.length)
            if (n === undefined) {
                return collection[listOfKeys[random]]
            } else {
                for(var i=1; i <= n; i++) {
                    random = Math.floor(Math.random() * listOfKeys.length)
                    sample.push(collection[listOfKeys[random]])
                }
            }
        }
        return sample
    }

    // Returns a new collection of each member that passes the predicate, a function that returns a bool

    _.toArray = function(collection) {
        if (collection.constructor === Array) {
            return collection
        } else if (collection.constructor === Object) {
            var arrayOfValues = Array()
            _.each(collection, function(item) {arrayOfValues.push(item)}) 
            return arrayOfValues
        }   
    }

    /**
     * Arrays
    */

    // Returns the array's first number; if n does not equal undefined, then it will return the first n values in array

    _.first = function(array, n) {
        if (n !== undefined) {
            return array.slice(0, n)
        } else {
            return array[0]
        }
    }

    // Returns everything except the last entry of the array or the last n entries of the array

    _.initial = function(array, n) {
        if (n === undefined) {
            n = array.length - 1
        }
        return array.slice(0, n)
    }

    // Returns the array's last number; if n does not equal undefined, then it will return the last n values in array

    _.last = function(array, n) {
        if (n !== undefined) {
            return array.slice(n, array.length)
        } else {
            return array[array.length - 1]
        }
    }

    // Returns array without first or n number of indexes

    _.rest = function(array, n) {
        if (n === undefined) {
            return array.slice(1)
        } else {
            return array.slice(n)
        }
    }

    // Returns array without falsy (false, null, 0, "", undefined and NaN) values

    _.compact = function(array) {
        return _.filter(array, identity)
    }

    // Returns array without values listed in arguments

    _.without = function(array, values) {
        var slice = Array.prototype.slice
        var values = slice.call(arguments, 1)
        var result = []
        for (var i=0; i < array.length; i++) {
            var bool = true
            for (var j=0; j < values.length; j++) {
                if (array[i] === values[j]) {
                    bool = false
                }
            }
            if (bool === true) {
                result.push(array[i])
            }
        }
        return result
    }

    // Returns a duplicate free array--does not use isSorted or iteratee

    _.uniq = function(array) {
        var newArray = null
        for (var i = 0; i < array.length; i++) {
            if (newArray === null) {
                newArray = Array()
                newArray.push(array[i])
            }
            var uniqValue = true
            for (var j = 0; j < newArray.length; j++) {
                if (array[i] === newArray[j]) {
                    uniqValue = false
                }
            } if (uniqValue === true) {
                newArray.push(array[i])
            }
        }
        return newArray
    }

    // Inputs an array of [key, value] pairs and outputs an object

    _.object = function(array) {
        var object = {}
        for (var i in array) {
            object[array[i][0]] = array[i][1]
        }
        return object
    }

    /** 
     * Returns the index at which value can be found in the array, or -1 if value is not present
     * Excludes binary search option included in Underscore.js
     */ 

    _.indexOf = function(array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return i
            }
        }
        return -1
    }

    // Returns the last index of a given value in an array

    _.lastIndexOf = function(array, value) {
        for (var i=array.length-1; i >= 0; i--) {
            if (array[i] === value) {
                return i
            }
        }
        return -1
    }

    // Returns first index of a value that passes a given predicate

    _.findIndex = function(array, predicate) {
        for (var i=0; i < array.length; i++) {
            if (predicate(array[i])) {
                return i
            }
        }
        return -1
    }

    // Returns last index of a value that passes a given predicate

    _.findLastIndex = function(array, predicate) {
        for (var i=array.length-1; i >= 0; i--) {
            if (predicate(array[i])) {
                return i
            }
        }
        return -1
    }

    // Returns a range of numbers based on given start, stop, and optional step

    _.range = function(start, stop, step) {
        var result = Array()
        if (step === undefined) {step = 1}
        if (stop < start) {
            for (var i=start; i > stop; i -= step) {
                result.push(i)
            }
        } else {
            for (var i=start; i < stop; i += step) {
                result.push(i)
            }
        }
        return result
    }
    
    return _
})()


//I hope you enjoyed reviewing this code! Thank you again for the opportunity.
