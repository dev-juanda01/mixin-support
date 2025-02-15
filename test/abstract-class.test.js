import { MixinBuilder } from "../src/index.js";

class A extends MixinBuilder.abstract() {
    prepare() {}
}

// const a = new A();
// a.prepare();

class B extends A {
    // prepare() {
    //     console.log("print log B prepare");
    // }
}

const b = new B();
b.prepare();
