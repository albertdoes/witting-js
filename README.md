# **Witting**

`v1.1.0`

Witting is a minimal single-file library for state management.

---

## **Installation**

```bash
> npm i witting
```

---

## **Usage**

`witting` provides the following interfaces:

- [`createState()` | `State()`](#createState)
- [`openStateRegister()`](#openStateRegister)
- [`createStates()`](#createStates)
- [`induceWitting()`](#induceWitting)
- [`isWitting()`](#isWitting)

---

First, import `witting`:

```typescript
import * as witting from "witting";
import { functionInDemand } from "witting";

var witting = require("witting");
```

---

<h3 id="createState">
    <strong>createState(), State()</strong>
</h3>

Creates a state and gets the core value:

```typescript
const stuff: State<string> = createState("anything");
// or const stuff = State("anything");

console.log(stuff.get());
```

```
> "anything"
```

Sets the core value:

```typescript
stuff.set("something");
console.log(stuff.get());
```

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

```
> "before a change."
> "after a change."
```

The callbacks will not be invoked if set the same value:

```typescript
stuff.set("everything");
```

```
> [nothing gets printed]
```

The callbacks will also not be invoked after being neglected:

```typescript
neglect();
stuff.set("nothing");
```

```
> [nothing gets printed]
```

---

<h3 id="openStateRegister">
    <strong>openStateRegister()</strong>
</h3>

Creates a state register:

```typescript
const { addState, getState, delState } = openStateRegister();
```

Registers values "mona" and "lisa" as States with keys "person1" and "person2". The second argument can be either the value or a state with the value itself:

```typescript
addState("person1", createState("Mona"));
addState("person2", "Lisa").attend((state) => console.log("My name is now " + state));
```

Retrieves the state of key "person2" and set a value to it:

```typescript
getState("person2").set("Belle");
```

```
> "My name is now Belle"
```

Removes the state of key "person2":

```typescript
delState("person2");
console.log(getState("person2"));
```

```
> undefined
```

---

<h3 id="createStates">
    <strong>createStates()</strong>
</h3>

Creates multiple states from an array of values and stores them in an internal state register. `getState()` is exposed so that the states can be accessed:

```typescript
const { getState } = createStates(["foo", "bar", "chocolate"]);
```

To retrieve them, strings of their indices are passed to `getState()`:

```typescript
getState("1").set("fool");
```

The argument can also be a linear object other than an array. With this, custom keys can be associated with the states:

```typescript
const { getState } = createStates({
    rigel: 8.005,
    sirius: 230,
    ross: 5000,
});
```

---

<h3 id="induceWitting">
    <strong>induceWitting()</strong>
</h3>

Suppose we have a template element:

```html
<template id="traffic-light">
    <div class="traffic-light wrapper" data-color="red">
        <span class="message">stop</span>
    </div>
    <style>
        .traffic-light.wrapper[data-color = "red"] {
            background-color: red;
        }
        .traffic-light.wrapper[data-color = "yellow"] {
            background-color: yellow;
        }
        .traffic-light.wrapper[data-color = "green"] {
            background-color: greend;
        }
    <style>
</template>
```

Binds `Witting` state with respective objects, by exposing a `setState()` onto the object:

```typescript
function TrafficLightComponent(): HTMLElement & Witting {
    const template = document.getElementByID("traffic-light") as HTMLTemplateElement;
    const component = template.content.cloneNode(true) as HTMLElement;

    const wrapper = component.querySelector(".wrapper") as HTMLElement;
    const message = component.querySelector(".message") as HTMLElement;

    const { privateGetter: getState } = createStates({
        text: "stop",
    });
    privateGetter("text").attend((state) => {
        message.textContent = state;
    });

    const { publicGetter: getState } = createStates({
        color: "red",
    });
    publicGetter("color").attend((state) => {
        const text = privateGetter("text");
        switch(state) {
            case "red": text.setState("stop"); break;
            case "yellow": text.setState("wait"); break;
            case "green": text.setState("go"); break;
            default: break;
        };
        wrapper.setAttribute("data-color", state);
    });

    // inducing `Witting` on `component`
    induceWitting(component, publicGetter);
    return component as HTMLElement & Witting;
}
```

The above code is a rough implementation of a `TrafficLightComponent` which changes color and associated messages.

`TrafficLightComponent` possess 2 states: the private `text` and public `color`. `text`'s value depends upon `color`'s value and gets displayed as `textContent` of the component.

`color` may be mutated outside of the component such as in a handler of `"click"` event. But `color` itself shouldn't be exposed to the outside.

By *inducing `Witting`* on `TrafficLightComponent` and exposing a `setState()` on the component directly, `color` can now be mutated from the outside without the need to appear explicitly on the outside.

```typescript
const trafficLight = TrafficLightComponent();
const changeButton = document.createElement("button");

let pressCount = 0;
changeButton.addEventListener("click", () => {
    pressCount += 1;
    pressCount %= 3;

    switch(pressCount) {
        case 0: trafficLight.setState("red"); break;
        case 1: trafficLight.setState("yellow"); break;
        case 2: trafficLight.setState("green");
    };
});

document.append(trafficLight, changeButton);
```

Every time `changeButton` gets clicked, the color of `wrapper` will change circling through `"red"`, `"yellow"` and `"green"` and the text will change accordingly.

`induceWitting()` attaches two methods to the objects that gets induced `Witting`: `isWitting()` which always return `true` and `setState()` which allows mutating the **internal public** state owned by the object.

---

<h3 id="isWitting">
    <strong>isWitting()</strong>
</h3>

Checks if the argument is `Witting` or not:

```typescript
console.log(isWitting(trafficLight));
console.log(isWitting(2));
```

```
> true
> false
```

**Note:** being `Witting` is owning some internal states and exposing a method for mutating them along with a method which tells the object is `Witting`. The condition is achieved by calling and passing the object to `induceWitting()`.

---

## **License**

The core files of the library are covered by MIT license.

All rights reserved. © 2023 Sai Aung Kyaw Htet

Dev-dependencies are covered by respective licenses and all the credits and copyrights go to respective authors.