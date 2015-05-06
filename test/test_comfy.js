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

  c.optional("with_alias", "aliased_value", { alias: "aliased_name" });
}, env /* use the custom env object instead of process.env */);

// Present required:
assert.equal(config.requiredProp, "required_value");
assert.equal(config.required_prop, "required_value");

// Present optionals:
assert.equal(config.optionalProp, "optional_value");
assert.equal(config.optional_prop, "optional_value");

// Missing optional with default value:
assert.equal(config.nonExistantOptionalProp, "fallback_value");

// Aliasing
assert.equal(config.aliasedName, "aliased_value");
assert.equal(config.aliased_name, "aliased_value");

console.log("OK!");
