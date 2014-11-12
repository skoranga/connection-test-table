connection-test-table
=====================

Test dependent service host/port to check if the connection can be established and print the result in tabular structure.

While development usually we depand on inhouse or public STAGE/QA/SANDBOX services and it's very common to find these services flaky. To find if your node app is not working as expected because of bad host/server down/server unreachable, you can use this module at server startup.


### How to Use


```javascript
    var connectionTester = require('connection-test-table');

    var config = {};
    var jsonData = {};
    connectionTester.test(config, jsonData, [callback]);
```


### Config

  - **title**: Title of the table. [optional]
  - **showcolors**: show results in colors. default `true` [optional]
  - **showOnlyErrors**: show only error results. default `false` [optional]

```javascript

    var config = {
        title: 'My awesome title',
        showcolors: true,
        showOnlyErrors: false
    };
```

### Data format

Data should to be a JSON with service information. Service information can be any level deep as long as it contains host/port schema.

```javascript

{
    "paypal": {
        "protocol": "https:",
        "host": "api.paypal.com",
        "port": 443
    },
    "google": {
        "maps": {
            "protocol": "https:",
            "host": "maps.googleapis.com"
        },
        "translate": {
            "protocol": "https:",
            "host": "www.googleapis.com"
        }
    }
}

```

For more examples, check test fixtures.


### Screenshots

![Success case while connecting to public APIs](/assets/success_connections.png)

![Error case while connecting to unreachable Stages](/assets/error_connections.png)
