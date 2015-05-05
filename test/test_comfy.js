"use strict";

var assert = require("assert");
var comfy = require("../src/comfy");

var env = {
  "REQUIRED_PROP": "required_value",
  "OPTIONAL_PROP": "optional_value"
};

var config = comfy.build(function(c) {
  c.optional("optional_prop", "not_this");
  c.optional("non_existant_optional_prop", "fallback_value");

  c.required("required_prop");
}, env /* use the custom env object instead of process.env */);

assert.equal(config.requiredProp, "required_value");
assert.equal(config.required_prop, "required_value");

assert.equal(config.optionalProp, "optional_value");
assert.equal(config.optional_prop, "optional_value");

assert.equal(config.nonExistantOptionalProp, "fallback_value");

console.log("OK!");
