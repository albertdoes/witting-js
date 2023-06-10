import { createStates } from "../../main";

var should = require("should");

export function test_createStates() {
    describe("createStates()", function() {
        
        it("should create multiple states and returns a getter function \n\t (from an array of values)", function() {
            const { getState } = createStates(["spam", 20300]);
            should(getState).not.undefined();
            should(getState("0").get()).equal("spam");
            should(getState("1").get()).equal(20300);
        });

        it("should create multiple states and returns a getter function \n\t (from a name-value map)", function() {
            const { getState } = createStates({ name: "mona", age: 20 });
            should(getState).not.undefined();
            should(getState("name").get()).equal("mona");
            should(getState("age").get()).equal(20);
        });
    });
};