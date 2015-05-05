// comfy is good for your health, dummy
//
// Developed by Filipe Dobreira in Gabriele's living room couch.

"use strict";

/**
 * Tiny helper defining the syntax for defining properties.
 *
 * @class
 */
function ComfyDsl() {
  this.properties = [];
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
ComfyDsl.prototype.required = function (name, options) {
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
ComfyDsl.prototype.optional = function (name, defaultValue, options) {
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
ComfyDsl.prototype.property = function (name, options) {
  this.properties.push([name, options]);
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
ComfyDsl.prototype.withOptions = function (options) {
  return {
    required: options.required || false,
    transform: options.transform || null,
    optional: options.optional || false,
    defaultValue: options.defaultValue || undefined
  };
};

module.exports = {
  build: function (definition, customScope) {
    var dsl = new ComfyDsl();
    var scope = customScope || process.env;

    definition.call(null, dsl);

    return dsl.resolveAndSetProperties(this, scope);
  }
};
