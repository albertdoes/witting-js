"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_createStates = void 0;
const main_1 = require("../../main");
var should = require("should");
function test_createStates() {
    describe("createStates()", function () {
        it("should create multiple states and returns a getter function \n\t (from an array of values)", function () {
            const { getState } = (0, main_1.createStates)(["spam", 20300]);
            should(getState).not.undefined();
            should(getState("0").get()).equal("spam");
            should(getState("1").get()).equal(20300);
        });
        it("should create multiple states and returns a getter function \n\t (from a name-value map)", function () {
            const { getState } = (0, main_1.createStates)({ name: "mona", age: 20 });
            should(getState).not.undefined();
            should(getState("name").get()).equal("mona");
            should(getState("age").get()).equal(20);
        });
    });
}
exports.test_createStates = test_createStates;
;
