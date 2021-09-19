# METAR Decoder

Decode METAR weather reports to JavaScript objects.

## Installation

```sh
npm install metar-decoder
```

## Usage

```typescript
import { decode } from 'metar-decoder';

const decoded = decode('EDDF 061150Z 06009KT 5000 RA FEW005 SCT007 BKN009 08/07 Q1014 TEMPO 4000');

// Fetch a full airport object
const airport = await decoded.fetchAirport();
```

## METAR Object

```json
{
  "rvr": [],
  "clouds": [
    {
      "name":"few",
      "code":"FEW",
      "density":"1/8 - 2/8",
      "cumulonimbus":false,
      "altitude":500
    },
    {
      "name":"scattered",
      "code":"SCT",
      "density":"3/8 - 4/8",
      "cumulonimbus":false,
      "altitude":700
    },
    {
      "name":"broken",
      "code":"BKN",
      "density":"5/8 – 7/8",
      "cumulonimbus":false,
      "altitude":900
    }
  ],
  "weather":[
    {
      "abbreviation":"RA",
      "meaning":"rain"
    }
  ],
  "auto":false,
  "cavok":false,
  "airport":"EDDF",
  "recorded_at":"2021-09-06T11:50:00.000Z",
  "wind":{
    "direction":"060",
    "speed":9,
    "guest":null,
    "unit":"KT"
  },
  "visibility":5000,
  "dewpoint":7,
  "temperature":8,
  "qnh":1014,
  "trend":{
    "type":"TEMPO",
    "full":"TEMPO 4000"
  }
}
```

## Airport Object

```json
{
  "icao":"EDDF",
  "iata":"FRA",
  "name":"Frankfurt am Main International Airport",
  "city":"Frankfurt-am-Main",
  "state":"Hesse",
  "country":"DE",
  "elevation":364,
  "lat":50.0264015198,
  "lon":8.543129921,
  "tz":"Europe/Berlin"
}
```

## Types

This project is completely type safe. Take a look to our [typescript interfaces](/src/types.ts) if you need a detailed description of the metar decoder response.

## TODO

* Runway condition
