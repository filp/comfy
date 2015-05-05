// comfy is good for your health, dummy
//
// Developed by Filipe Dobreira in Gabriele's living room couch.

"use strict";

/**
 * Tiny helper defining the syntax for defining properties, and
 * container for the resolved properties.
 *
 * @class
 */
function Comfy(env) {
  this.env = env;
}

/**
 * Defines a required property.
 *
 * @example
 * this.required("github_api_key");
 *
 * @example
 * // Same as the following:
 * this.property("github_api_key", { required: true });
 *
 * @arg  {string} name
 * @arg  {Object} options
 */
Comfy.prototype.required = function (name, options) {
  var newOptions = this.withOptions(options);

  newOptions.required = true;

  this.property(name, newOptions);
};

/**
 * Defines an optional property.
 *
 * @example
 * this.optional("s3_bucket", "default_bucket_ident")
 *
 * @example
 * // Same as the following:
 * this.property
 *
 * @arg  {string} name
 * @arg  defaultValue
 * @arg  {Object} options
 */
Comfy.prototype.optional = function (name, defaultValue, options) {
  var newOptions = this.withOptions(options);

  if (typeof defaultValue === "undefined") {
    throw "Optional property " + name + " with no default (got undefined)";
  }

  newOptions.optional = true;
  newOptions.defaultValue = defaultValue;

  this.property(name, newOptions);
};

/**
 * Defines a property. This method is the lowest level API available
 * for defining configuration through comfy; for more concise options
 * see other methods: required, optional
 *
 * @arg {string} name
 * @arg {Object} options
 */
Comfy.prototype.property = function (name, options) {
  var opts = this.withOptions(options);

  var envName = this.nameToEnvKey(name);
  var envValue = this.env[envName];

  if (typeof envValue === "undefined") {
    if (opts.optional) {
      envValue = opts.defaultValue;
    } else {
      throw "Required property " + envName + " not present in env:" + this.env;
    }
  }

  if (opts.transform) {
    envValue = opts.transform.call(null, envValue);
  }

  this.setProperty(name, envValue);
};

/**
 * @param {string} name
 * @param value
 */
Comfy.prototype.setProperty = function (name, value) {
  this[name] = value;
  this[this.nameToCamelCaseKey(name)] = value;
};

/**
 * Transforms a snake_case property name into the correct name format
 * to scan for a matching environment variable.
 *
 * @param {string} name
 * @returns {string}
 */
Comfy.prototype.nameToEnvKey = function (name) {
  return name.toUpperCase();
};

/**
 * Transforms a snake_case property name into camelCase
 *
 * @param {string} name
 * @returns {string}
 */
Comfy.prototype.nameToCamelCaseKey = function (name) {
  return name.replace(/(\_\w)/g, function (m) {
    return m[1].toUpperCase();
  });
};

/**
 * Normalizes the options object and discards anything it
 * doesn't understand.
 *
 * @todo Complain loudly if an unknown property is provided
 *
 * @arg {Object} options
 * @returns {Object}
 */
Comfy.prototype.withOptions = function (options) {
  var opts = options || {};

  return {
    required: opts.required || false,
    transform: opts.transform || null,
    optional: opts.optional || false,
    defaultValue: opts.defaultValue || undefined
  };
};

module.exports = {
  build: function (definition, customEnv) {
    var env = customEnv || process.env;
    var config = new Comfy(env);

    definition.call(null, config);

    return config;
  }
};
