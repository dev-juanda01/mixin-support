# mixin-support

**Library for JavaScript mixin support, provides an easy and useful interface for the implementation of this powerful concept.**

## Description

`mixin-support` is a library designed to simplify the implementation of mixins in JavaScript. By using this library, developers can easily create classes that inherit from multiple mixins, enhancing code reuse and modularity.

## Installation

To install the library, you can use npm:

```
npm install mixin-support

```

Or if you are using yarn:

```
yarn add mixin-support
```


## Usage

The core of the library is the `MixinBuilder` class, which provides a static method `with` to create a class that combines multiple mixins.

### Example

Here's a basic example demonstrating how to use `mixin-support`:

```
import { MixinBuilder } from 'mixin-support';

// Define some mixins
class MixinA {
    constructor() {
        this.name = 'MixinA';
    }
    greet() {
        console.log(`Hello from ${this.name}`);
    }
}

class MixinB {
    constructor() {
        this.type = 'MixinB';
    }
    describe() {
        console.log(`This is ${this.type}`);
    }
}

// Create a new class that combines the mixins
class CombinedClass extends MixinBuilder.with(MixinA, MixinB) {
    constructor() {
        super();
    }
}

const instance = new CombinedClass();
instance.greet();      // Output: Hello from MixinA
instance.describe();   // Output: This is MixinB

```

### Advanced Example

For more advanced usage, you can include mixins that add static methods or properties to the final class:

```
class StaticMixin {
    static staticMethod() {
        console.log('This is a static method');
    }
}

// Create a new class that combines the mixins
class AdvancedClass extends MixinBuilder.with(MixinA, MixinB, StaticMixin) {
    constructor() {
        super();
    }
}

AdvancedClass.staticMethod();  // Output: This is a static method

const advancedInstance = new AdvancedClass();
advancedInstance.greet();      // Output: Hello from MixinA
advancedInstance.describe();   // Output: This is MixinB

```

## API

### `MixinBuilder`

#### `static with(...mixins)`

This static method takes any number of mixins and returns a new class that incorporates the properties and methods of each mixin. Mixins can be either classes or functions that return classes.

* **Parameters** :
* `...mixins`: The mixins to include in the final class.
* **Returns** : The final class that includes all the mixins.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or feature requests.
