"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_createState = void 0;
const main_1 = require("../../main");
var should = require("should");
function test_createState() {
    describe("createState()", function () {
        it("should create a state", function () {
            const state = (0, main_1.createState)(0);
            should(state).not.undefined();
        });
        describe(".get()", function () {
            const state = (0, main_1.createState)(0);
            it("should retrieve the value", function () {
                should(state.get()).equal(0);
            });
        });
        describe(".set()", function () {
            const state = (0, main_1.createState)(0);
            it("should set a new value", function () {
                state.set(1);
                should(state.get()).equal(1);
            });
        });
        describe(".attend()", function () {
            const state = (0, main_1.createState)(0);
            let preactionCount = 0;
            let reactionCount = 0;
            let neglect1;
            let neglect2;
            it("should register a proactive callback and return a destructor", function () {
                const { neglect } = state.attend(undefined, () => { preactionCount += 1; });
                should(neglect).not.undefined();
                neglect1 = neglect;
            });
            it("should register a reactive callback and return a destructor", function () {
                const { neglect } = state.attend(() => { reactionCount += 1; });
                should(neglect).not.undefined();
                neglect2 = neglect;
            });
            it("should execute callbacks upon value set", function () {
                state.set(1);
                should(preactionCount).equal(1);
                should(reactionCount).equal(1);
            });
            it("should not execute callbacks if set the same value", function () {
                state.set(1);
                should(preactionCount).equal(1);
                should(reactionCount).equal(1);
            });
            it("should not execute callbacks anymore after unsubscribing", function () {
                neglect1();
                neglect2();
                state.set(2);
                should(preactionCount).equal(1);
                should(reactionCount).equal(1);
            });
        });
    });
}
exports.test_createState = test_createState;
