"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_openStateRegister = void 0;
const main_1 = require("../../main");
var should = require("should");
function test_openStateRegister() {
    describe("openStateRegister()", function () {
        it("should create a state register", function () {
            const { addState, getState, delState } = (0, main_1.openStateRegister)();
            should(addState).not.undefined();
            should(getState).not.undefined();
            should(delState).not.undefined();
        });
        describe(".addState()", function () {
            const { addState, getState } = (0, main_1.openStateRegister)();
            it("should register a state", function () {
                addState("name", "mona");
                should(getState("name").get()).equal("mona");
            });
        });
        describe(".getState()", function () {
            const { addState, getState } = (0, main_1.openStateRegister)();
            addState("name", "mona");
            it("should retrieve a state", function () {
                const x = getState("name");
                should(x.get()).equal("mona");
                x.set("lisa");
                should(x.get()).equal("lisa");
            });
        });
        describe(".delState()", function () {
            const { addState, getState, delState } = (0, main_1.openStateRegister)();
            addState("name", "mona");
            it("should remove a state", function () {
                delState("name");
                const x = getState("name");
                should(x).undefined();
            });
        });
    });
}
exports.test_openStateRegister = test_openStateRegister;
