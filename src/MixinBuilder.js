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
}
export { MixinBuilder };
