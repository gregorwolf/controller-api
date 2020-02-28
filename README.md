# Access XS Controller API from CAP

Sample project to consume the XS Controller API from CAP

## Run local

To run against the local mock service [controller-api-mock](https://github.com/gregorwolf/controller-api-mock) you have to create a file named *default-env.json* with the following content:

```
{
  "VCAP_SERVICES": {
  },
  "destinations": [
    {
      "name": "controller-config",
      "url": "http://localhost:3000/v2"
    }
  ]
}
```

Then execute:

`npm run setup`

Followed by:

`npm start`