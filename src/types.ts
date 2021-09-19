interface Cloud {
  cumulonimbus: boolean,
  name: string,
  code: string,
  density: string,
  altitude: number,
}

export interface Weather {
  abbreviation: string,
  meaning: string,
}

export interface Airport {
  icao: string,
  iata: string,
  name: string,
  city: string,
  state: string,
  country: string,
  elevation: number,
  lat: number,
  lon: number,
  tz: string,
}

export interface Wind {
  direction: string,
  guest: number | null,
  unit: string,
  speed: number,
  variation: {
    min: number,
    max: number,
  } | null,
}

export interface Rvr {
  runway: string,
  visibility: { min: string, max: string } | string,
  trend: string, 
}

export interface DecodedMetar {
  airport: Airport | string,
  recorded_at: Date,
  wind: Wind,
  cavok: boolean,
  auto: boolean,
  visibility: number,
  min_visibility: { visibility: number, direction: string } | undefined,
  rvr: Rvr[],
  clouds: Cloud[],
  weather: Weather[],
  dewpoint: number,
  temperature: number,
  qnh: number,
  trend: {
    type: string,
    full: string,
  },
  vertical_visibility: string,
  fetchAirport: () => Promise<Airport | null>,
}
