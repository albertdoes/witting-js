"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createState_1 = require("./units/createState");
const createStates_1 = require("./units/createStates");
const openStateRegister_1 = require("./units/openStateRegister");
const induceWitting_1 = require("./units/induceWitting");
(0, createState_1.test_createState)();
(0, createStates_1.test_createStates)();
(0, openStateRegister_1.test_openStateRegister)();
(0, induceWitting_1.test_induceWitting)();