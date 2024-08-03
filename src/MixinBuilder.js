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
        return mixins.reduce((object, mixin) => {
            // Check if mixin is a class
            if (typeof mixin === "function" && /^class\s/.test(Function.prototype.toString.call(mixin))) {

                const classMixin = class extends object {

                    constructor(...args) {

                        super(...args);
                        const instance = new mixin(...args);

                        Object.getOwnPropertyNames(instance).forEach((name) => {
                            this[name] = instance[name];
                        });

                        Object.getOwnPropertyNames(mixin.prototype).forEach((name) => {
                            if (name !== "constructor") {
                                this[name] = instance[name].bind(instance);
                            }
                        });
                    }
                };

                // Add static members from mixin class to the resulting class
                Object.getOwnPropertyNames(mixin).forEach((name) => {
                    if (
                        name !== "prototype" &&
                        name !== "length" &&
                        name !== "name"
                    ) {
                        classMixin[name] = mixin[name];
                    }
                });

                return classMixin;
            }

            // Assume mixin is a function that returns a class
            return mixin(object);
        }, class {});
    }
}
export { MixinBuilder };
