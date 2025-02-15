/**
 *
 * @returns error to abstract method not implemented
 */
function AbstractMethodNotImplementedException(msg ) {
    return new Error(msg || "method must be implemented");
}

AbstractMethodNotImplementedException.prototype = Object.create(Error.prototype);

/**
 *
 * @returns error to instantiated abstract class
 */
function InstantiatedAbstractClassException(msg) {
    return new Error(msg || "Class is of abstract type and can't be instantiated");
}

InstantiatedAbstractClassException.prototype = Object.create(Error.prototype);

export {
  AbstractMethodNotImplementedException,
  InstantiatedAbstractClassException 
}