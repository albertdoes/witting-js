type StateCore<T> = {
    state: T,
    preactions: PreactionMap<T>;
    reactions: ReactionMap<T>;
};
type State<T> = {
    get: () => T,
    set: (newState: T) => void,
    attend: (
        react?: Reaction<T>,
        preact?: Preaction<T>,
        reactNow?: boolean,
        preactNow?: boolean
    ) => { neglect: () => void },
};
type StateMapInit = Map<string, State<any> | any>;
type StateMap = Map<string, State<any>>;

type Preaction<T> = (becoming: T, current?: T) => void;
type PreactionMap<T> = Map<string, Preaction<T>>;

type Reaction<T> = (state: T) => void;
type ReactionMap<T> = Map<string, Reaction<T>>;

type Registerer<Map, Value, Return> = (key: keyof Map, state: Value) => Return;
type Retriever<Map, Value> = (key: keyof Map) => Value;
type Remover<Map> = (key: keyof Map) => void;

interface Witting {
    isWitting: () => this is Witting,
    setState: <T> (stateID: string, newValue: T) => void,
}

type Map<Key extends string | number | symbol, Value> = { [K in Key]: Value; };

/* ----------------------------------------------------------------- */

function openStateRegister(): {
    addState: Registerer<StateMap, State<any> | any, State<any>>,
    getState: Retriever<StateMap, State<any>>,
    delState: Remover<StateMap>
} {
    const REGISTER: StateMap = {};
    return {
        addState<T extends {}>(key: keyof typeof REGISTER, state: State<T> | T) {
            (state as State<T>).get
            ? Object.assign(REGISTER, { [key]: state })
            : Object.assign(REGISTER, { [key]: createState(state) });
            return REGISTER[key];
        },
        getState(key: keyof typeof REGISTER) {
            return REGISTER[key];
        },
        delState(key: keyof typeof REGISTER) {
            delete REGISTER[key];
        }
    };
}

function createState<T>(value: T): State<T> {
    const STATE_CORE: StateCore<T> = {
        state: value,
        preactions: {},
        reactions: {},
    };
    let attendantIndex = -1;
    return {
        get() { return STATE_CORE.state; },
        set(newState) {
            if(newState === STATE_CORE.state) return;

            for(const [_, preact] of Object.entries(STATE_CORE.preactions)) {
                preact(newState, STATE_CORE.state);
            };

            STATE_CORE.state = newState;

            for(const [_, react] of Object.entries(STATE_CORE.reactions)) {
                react(STATE_CORE.state);
            };
        },
        attend(react?, preact?, reactNow?, preactNow?) {
            if(!preact && !react) return { neglect() {} };

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

function createStates(init: StateMapInit | any[]): { getState: Retriever<StateMap, State<any>> } {
    const { addState, getState } = openStateRegister();
    if(Array.isArray(init)) {
        for(const [i, val] of init.entries()) {
            addState(String(i), val);
        };
    } else {
        for(const key in init) {
            addState(key, init[key]);
        };
    };
    return { getState };
}

function induceWitting<T extends {}>(something: T, getState: Retriever<StateMap, State<T>>): T & Witting {
    Object.assign(something, {
        isWitting() { return true; },
        setState(stateName: string, newValue: T) {
            getState(stateName).set(newValue);
        },
    });
    return something as T & Witting;
}

function isWitting<T extends {}>(something: T): something is T & Witting {
    return "isWitting" in Object.entries(something);
}

const State = createState;

export type {
    Witting,
};
export {
    openStateRegister,
    createState,
    State,
    createStates,
    induceWitting,
    isWitting,
};