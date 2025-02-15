import {
    InstantiatedAbstractClassException,
    AbstractMethodNotImplementedException,
} from "./exceptions/index.js";

/**
 * This class is responsible for building the final prototype from a group of mixins
 */
class MixinBuilder {
    /**
     * Builds the final object or prototype that will inherit into the concrete class
     * @param  {...any} mixins classes that will inherit in the final class
     * @returns returns the final class that will inherit in the final context
     */
    static with(...mixins) {
        return mixins.reduce((BaseClass, mixin) => {
            if (
                typeof mixin === "function" &&
                /^class\s/.test(Function.prototype.toString.call(mixin))
            ) {
                // create an intermediate class that extends the BaseClass and applies the mixin
                const MixedClass = class extends BaseClass {
                    constructor(...args) {
                        super(...args);
                        const mixinInstance = new mixin(...args);

                        // copies properties and instance methods of the mixin
                        Object.getOwnPropertyNames(mixinInstance).forEach(
                            (name) => {
                                if (!this.hasOwnProperty(name)) {
                                    this[name] = mixinInstance[name];
                                }
                            }
                        );
                    }
                };

                // add static members from mixin class to the resulting class
                Object.getOwnPropertyNames(mixin).forEach((name) => {
                    if (
                        name !== "prototype" &&
                        name !== "length" &&
                        name !== "name"
                    ) {
                        MixedClass[name] = mixin[name];
                    }
                });

                // add the mixin prototype to the MixedClass prototype chain
                Object.setPrototypeOf(
                    MixedClass.prototype,
                    new Proxy(mixin.prototype, {
                        get(target, prop, receiver) {
                            return (
                                Reflect.get(target, prop, receiver) ||
                                Reflect.get(BaseClass.prototype, prop, receiver)
                            );
                        },
                    })
                );

                return MixedClass;
            }

            return mixin(BaseClass);
        }, class {});
    }

    /**
     * Ensures that the derived class implements all the specified abstract methods.
     * Throws an error if an attempt is made to instantiate the abstract class directly,
     * or if any of the abstract methods are not implemented in the derived class.
     *
     * @param {string[]} abstractMethods - An array of method names that must be implemented by the derived class.
     * @throws {InstantiatedAbstractClassException} If an attempt is made to instantiate the abstract class directly.
     * @throws {AbstractMethodNotImplementedException} If any of the abstract methods are not implemented in the derived class.
     */
    static abstract() {
        return class AbstractBase {
            constructor() {
                // Evita la instanciación directa de clases que usen `MixinBuilder.abstract()`
                if (new.target.__proto__.name === AbstractBase.name) {
                    throw new InstantiatedAbstractClassException(
                        `Cannot instantiate abstract class: ${this.constructor.name}`
                    );
                }

                const prototypeMethods = Object.getOwnPropertyNames(
                    new.target.prototype
                ).filter((prop) => prop !== "constructor");

                Object.getOwnPropertyNames(new.target.__proto__.prototype)
                    .filter((prop) => prop !== "constructor")
                    .forEach((name) => {
                        if (!prototypeMethods.includes(name)) {
                            throw new AbstractMethodNotImplementedException(
                                `Class "${
                                    new.target.__proto__.name
                                }" must implement: ${name} method`
                            );
                        }
                    });
            }
        };
    }
}
export { MixinBuilder };
