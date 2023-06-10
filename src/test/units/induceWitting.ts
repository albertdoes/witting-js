import { induceWitting, openStateRegister } from "../../main";

var should = require("should");

export function test_induceWitting() {
    describe("induceWitting()", function() {
        const athlete = {
            "energy": 100,
            "sweat": 0,
        };

        const { addState, getState } = openStateRegister();
        addState("action", "idle").attend((state) => {
            switch(state) {
                case "idle":
                    break;
                case "run":
                    athlete.energy -= 5;
                    athlete.sweat += 10;
                default:
                    break;
            }
        });

        const sa_athlete = induceWitting(athlete, getState);

        it("should make an object state-aware and return the resulting object itself", function() {
            should(sa_athlete).equal(athlete);
        });

        it("should make the object able to identify itself as state-aware", function() {
            should(sa_athlete.isWitting()).true();
        });

        it("should make the object own the state", function() {
            sa_athlete.setState("action", "run");
            should(athlete.energy).equal(95);
            should(athlete.sweat).equal(10);
        });
    });
};