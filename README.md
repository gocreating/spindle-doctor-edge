# Spindle Doctor Server

## Useful Info

```
Non-Admin:
5b3d9315f8818f04fcfe32d4
5O4sBBRnsJbxFSh4iSZt5rBlJedhV2dLuSNlAaxpoOuom5pIn7e6kSlWbZfCgKhd

Admin:
5b33db2c54902a10a0623a1a
QJ75nWGKECNkvykmC0vYQBpl1kUtb8EPjQrZFGWnBF3yu1S1BdkUqulLY1lYFZQi
```

```
Project ID: 5b33df7c2cbccf3cf0da874c
Session ID: 5b33eac4691c423134268c0e
Dataset ID: 5b798199c6589ae768870c68

POST /sessions-datasets
{
  "sessionId": "5b33eac4691c423134268c0e",
  "datasetId": "5b798199c6589ae768870c68"
}

POST /projects/{id}/sessions/{fk}/start
{
  "name": "test-session",
  "description": "ttttttestttttt",
  "featureFields": [
    "level_normalized_fft1"
  ],
  "targetField": "anomaly",
  "hyperParameters": {
    "--step-size": "32",
    "--hidden-size": "64",
    "--embedding-size": "128",
    "--symbol-size": "8",
    "--batch-size": "128",
    "--layer-depth": "2",
    "--dropout-rate": "0.1",
    "--learning-rates": [1, 500, 0.001],
    "--sample-size": "128",
    "--src-breakpoint": "../build/meta/phm2012/breakpoints-from-feature/breakpoint-8.csv"
  },
  "graphId": "5b3d8a6a163ca9622492cced"
}
```

## Development

```
/ $ npm run dev
```

## Production

```
/ $ npm run production
```

## Upload file from postman

1. Header

  No header needs to be set.

2. Body

  Select the `form-data` type. Add key `file`, select `File` option and pick the file you want to upload.

3. Send
