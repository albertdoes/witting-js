# **Witting**

Witting is a minimal single-file library for state management.

## **Installation**

```bash
> npm i witting
```

## **Usage**
`witting` provides the following interfaces:

- [`createState()` or `State()`](#createState)
- [`openStateRegister()`](#openStateRegister)
- [`createStates()`](#createStates)
- [`induceWitting()`](#induceWitting)
- [`isWitting()`](#isWitting)

First, import `witting`:

```typescript
import * as witting from "witting";
import { functionInDemand } from "witting";

var witting = require("witting");
```
### **createState(), State()** {#createState}

#### **Example**

Creates a state and gets the core value:

```typescript
const stuff: State<string> = createState("anything");
// or const stuff = State("anything");

console.log(stuff.get());
```

Output:

```
> "anything"
```

Sets the core value:

```typescript
stuff.set("something");
console.log(stuff.get());
```

Output:

```
> "something"
```

Attends and prepare to react before and to changes:

```typescript
const { neglect } = stuff.attend(
    (state) => {
        console.log("after a change.");
    },
    (becoming, current) => {
        console.log("before a change.");
    }
);
stuff.set("everything");
```

Output:

```
> "before a change."
> "after a change."
```

The callbacks will not be invoked if set the same value:

```typescript
stuff.set("everything");
```

Output:

```
> [nothing gets printed]
```

The callbacks will also not be invoked after being neglected:

```typescript
neglect();
stuff.set("nothing");
```

Output:

```
> [nothing gets printed]
```

### **openStateRegister()**

#### **Example**

Creates a state register:

```typescript
const { addState, getState, delState } = openStateRegister();
```

Registers values "mona" and "lisa" as States with keys "person1" and "person2":

```typescript
addState("person1", createState("Mona"));
addState("person2", "Lisa").attend((state) => console.log("My name is now " + state));
```

Retrieves the state of key "person2" and set a value to it:

```typescript
getState("person2").set("Belle");
```

Output:

```
> "My name is now Belle"
```

## **Documentation**

At its heart, `State<T>` holds the target functionalities. An object that is `State<T>` wraps an actual value of type `T` together with `preactions` and `reactions` arrays of callbacks which callbacks from `preactions` are called before setting the core value and those from `reactions` after.

A `State<T>` exposes these interfaces:
- `get()` - returns the core value,
- `set(newValue: T)` - sets the core value and call preactions and reactions,
- `attend(react?: Reaction, preact?: Preaction, reactNow?: boolean = false, preactNow?: boolean = false): { neglect: () => void }` - registers the respective callbacks and return a function to unregister the callbacks.

    - The callbacks will not be invoked either if the candidate value and current value are the same or after the callbacks are neglected.

    - A `Preaction` is a function that, when called, receives two values: `becoming` and `currentValue` (optional).

    - A `Reaction`, similarly, is a function that accepts one parameter: `state`.

    - `preactNow` and `reactNow` determine whether the preactions or reactions are to be called right after the registration.