export interface ICloud {
  name: string,
  code: string,
  density: string,
}

export interface IAirport {
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

export interface IWind {
  direction: string,
  guest: number | null,
  unit: string,
  speed: number,
  variation: {
    min: number,
    max: number,
  } | null,
}

export interface IRvr {
  runway: string,
  visibility: { min: string, max: string } | string,
  trend: string, 
}

export interface IDecoded {
  airport: IAirport | string,
  recorded_at: Date,
  wind: IWind,
  cavok: boolean,
  auto: boolean,
  visibility: number,
  min_visibility: { visibility: number, direction: string } | undefined,
  rvr: IRvr[],
  clouds: {
    cumulonimbus: boolean,
    name: string,
    code: string,
    density: string,
    altitude: number,
  }[],
  weather: {
    abbreviation: string,
    meaning: string,
  }[],
  dewpoint: number,
  temperature: number,
  qnh: number,
  trend: {
    type: string,
    full: string,
  },
  vertical_visibility: string,
  fetchAirport: () => Promise<IAirport | null>,
}