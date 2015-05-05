# comfy

![](http://i.imgur.com/Eq6r1Q2.png)

Configure your applications comfortably, using environment variables
and a simple DSL.

```js
var comfy = require("comfy");

// Define your configuration:

var config = comfy.build(function(c) {
  // Required properties:
  c.required("important_api_key");

  // Optional properties with defaults:
  c.optional("sky_color", "blue");

  // More complicated syntax if you're running low on your
  // LOC targets for this week:
  c.property("synergy", {
    transform: function (value) {
      return "Dynamically procrastinate B2C users " + value;
    }
  });
});

// Use it:

// process.env.SKY_COLOR === "red"
console.log(config.skyColor); // => "red"

// If snake_case is your thing, you can also stick to that:
console.log(config.sky_color) // => "red"
```

## Install:

```
npm install --save comfy
```

## Author

`comfy` was developed by Filipe Dobreira, on [@gabrielecirulli](https://github.com/gabrielecirulli)'s fairly comfortable couch. Contributions (to the code, not the couch thing) are welcome!
