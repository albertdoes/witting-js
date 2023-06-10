"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWitting = exports.induceWitting = exports.createStates = exports.State = exports.createState = exports.openStateRegister = void 0;
/* ----------------------------------------------------------------- */
function openStateRegister() {
    const REGISTER = {};
    return {
        addState(key, state) {
            state.get
                ? Object.assign(REGISTER, { [key]: state })
                : Object.assign(REGISTER, { [key]: createState(state) });
            return REGISTER[key];
        },
        getState(key) {
            return REGISTER[key];
        },
        delState(key) {
            delete REGISTER[key];
        }
    };
}
exports.openStateRegister = openStateRegister;
function createState(value) {
    const STATE_CORE = {
        state: value,
        preactions: {},
        reactions: {},
    };
    let attendantIndex = -1;
    return {
        get() { return STATE_CORE.state; },
        set(newState) {
            if (newState === STATE_CORE.state)
                return;
            for (const [_, preact] of Object.entries(STATE_CORE.preactions)) {
                preact(newState, STATE_CORE.state);
            }
            ;
            STATE_CORE.state = newState;
            for (const [_, react] of Object.entries(STATE_CORE.reactions)) {
                react(STATE_CORE.state);
            }
            ;
        },
        attend(react, preact, reactNow, preactNow) {
            if (!preact && !react)
                return { neglect() { } };
            attendantIndex += 1;
            const key = String(attendantIndex);
            preact && Object.assign(STATE_CORE.preactions, { [key]: preact });
            react && Object.assign(STATE_CORE.reactions, { [key]: react });
            preact && preactNow && preact(STATE_CORE.state);
            react && reactNow && react(STATE_CORE.state);
            return {
                neglect() {
                    delete STATE_CORE.preactions[key];
                    delete STATE_CORE.reactions[key];
                }
            };
        },
    };
}
exports.createState = createState;
function createStates(init) {
    const { addState, getState } = openStateRegister();
    if (Array.isArray(init)) {
        for (const [i, val] of init.entries()) {
            addState(String(i), val);
        }
        ;
    }
    else {
        for (const key in init) {
            addState(key, init[key]);
        }
        ;
    }
    ;
    return { getState };
}
exports.createStates = createStates;
function induceWitting(something, getState) {
    Object.assign(something, {
        isWitting() { return true; },
        setState(stateName, newValue) {
            getState(stateName).set(newValue);
        },
    });
    return something;
}
exports.induceWitting = induceWitting;
function isWitting(something) {
    return "isWitting" in Object.entries(something);
}
exports.isWitting = isWitting;
const State = createState;
exports.State = State;
