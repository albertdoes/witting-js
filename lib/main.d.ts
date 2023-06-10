type State<T> = {
    get: () => T;
    set: (newState: T) => void;
    attend: (react?: Reaction<T>, preact?: Preaction<T>, reactNow?: boolean, preactNow?: boolean) => {
        neglect: () => void;
    };
};
type StateMapInit = Map<string, State<any> | any>;
type StateMap = Map<string, State<any>>;
type Preaction<T> = (becoming: T, current?: T) => void;
type Reaction<T> = (state: T) => void;
type Registerer<Map, Value, Return> = (key: keyof Map, state: Value) => Return;
type Retriever<Map, Value> = (key: keyof Map) => Value;
type Remover<Map> = (key: keyof Map) => void;
interface Witting {
    isWitting: () => this is Witting;
    setState: <T>(stateID: string, newValue: T) => void;
}
type Map<Key extends string | number | symbol, Value> = {
    [K in Key]: Value;
};
declare function openStateRegister(): {
    addState: Registerer<StateMap, State<any> | any, State<any>>;
    getState: Retriever<StateMap, State<any>>;
    delState: Remover<StateMap>;
};
declare function createState<T>(value: T): State<T>;
declare function createStates(init: StateMapInit | any[]): {
    getState: Retriever<StateMap, State<any>>;
};
declare function induceWitting<T extends {}>(something: T, getState: Retriever<StateMap, State<T>>): T & Witting;
declare function isWitting<T extends {}>(something: T): something is T & Witting;
declare const State: typeof createState;
export type { Witting, };
export { openStateRegister, createState, State, createStates, induceWitting, isWitting, };
