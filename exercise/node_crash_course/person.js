// Module Wrapper Function
// (function (exports, reqire, module, __filename, __dirname) {
//     //The whole module code is in these Function, so we have access to these Variables
// })

// console.log(__dirname, __filename);

class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greeting() {
        console.log(`My name is ${this.name} and I am ${this.age}`);
    }
}

module.exports = Person;