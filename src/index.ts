import axios from 'axios';

import { clouds, rvrTrend, trends, weather } from './constants';
import { IAirport, ICloud, IDecoded, IWind } from './types';
import { inHgtoHpa, matchExact } from './utils';

export function decode(metar: string): IDecoded | null {
  const data = {} as IDecoded;

  const sections = metar.split(' ');

  if (sections.length === 0) 
    return null;

  data.rvr = [];
  data.clouds = [];
  data.weather = [];
  data.auto = sections[1] === 'AUTO';
  data.cavok = metar.includes('CAVOK');  
  if (data.cavok) 
    data.visibility = 9999;

  // WEATHER
  for (let i = sections.length - 1; i >= 0; i--) {
    if (weather[sections[i]]) {
      const uncodedWeather = sections[i];
      data.weather.push({
        abbreviation: uncodedWeather,
        meaning: weather[uncodedWeather],
      });
      sections.splice(i, 1);
    }
  }  

  // AIRPORT
  data.airport = sections.shift() as string;

  // TIME
  const timeSection = sections.shift() as string;
  const now = new Date();  
  data.recorded_at = new Date(Date.UTC(
    now.getFullYear(), 
    now.getMonth(), 
    Number(timeSection.slice(0, 2)),
    Number(timeSection.slice(2, 4)),
    Number(timeSection.slice(4, 6)),
  ));

  // WIND
  const windSection = sections.shift() as string;
  data.wind = {} as IWind;
  data.wind.direction = windSection.slice(0, 3);
  data.wind.speed = Number(windSection.slice(3, 5));

  if (windSection[5] === 'G') {
    data.wind.guest = Number(windSection.slice(5, 7));
    data.wind.unit = windSection.slice(7, 9);
  } else {
    data.wind.guest = null;
    data.wind.unit = windSection.slice(5, 7);
  }  

  // VARIATION
  if (/(\d){3}V(\d){3}/g.test(sections[0])) {
    const [min, max] = (sections.shift() as string).split('V').map(Number);
    data.wind.variation = {
      min,
      max,
    };
  }
    
  // VISIBILITY
  if (!data.cavok) {
    data.visibility = Number(sections.shift());    
    
    // MIN VISIBILITY
    if (matchExact(/(\d){4}(W|E|N|S|(NE)|(NW)|(SE)|(SW))?/, sections[0])) {      
      const min_visibility = sections.shift() as string; 
      data.min_visibility = {
        visibility: Number(min_visibility.slice(0, 4)),
        direction: min_visibility.slice(4, min_visibility.length),
      };
    }
  }

  // RVR
  while (sections[0].startsWith('R')) {
    const [runway, visibility] = (sections.shift() as string).substring(1).split('/');

    const isVariable = visibility.includes('V');

    data.rvr.push({
      runway,
      visibility: !isVariable 
        ? visibility.slice(0, visibility.length - 1)
        : {
          min: visibility.slice(0, 4),
          max: visibility.slice(5, 9),
        },
      trend: rvrTrend[visibility.slice(-1)],
    });
  }

  // CLOUDS
  if (/((SCT)|(BKN)|(FEW)|(OVC))(\d{3})((CB)|(TCB))?/.test(sections[0])) {
    while(clouds.map((c) => c.code).includes(sections[0].slice(0, 3))) {
      const uncodedCloud = sections.shift() as string;
      const cloud = clouds.find((c) => c.code === uncodedCloud.slice(0, 3)) as ICloud;
  
      data.clouds.push({
        ...cloud,
        cumulonimbus: uncodedCloud.includes('CB'), 
        altitude: Number(uncodedCloud.slice(3, 6)) * 100,
      });
    }
  }

  if (sections[0].startsWith('VV')) {
    const vv = sections.shift() as string;

    data.vertical_visibility = vv.substring(2);
  }

  // TEMP
  if (/(\d){2}\/(\d){2}/.test(sections[0])) {
    const [temperature, dewpoint] = (sections.shift() as string).split('/').map(Number);

    data.dewpoint = dewpoint,
    data.temperature = temperature;
  }

  // BARO
  if (matchExact(/(Q|A)(\d){4}/, sections[0])) {
    const baro = sections.shift() as string;

    data.qnh = baro.startsWith('A') 
      ? inHgtoHpa(Number(`${baro.slice(1, 3)}.${baro.slice(2, 5)}`)) 
      : Number(baro.slice(1, 5));
  }

  // TREND
  if (trends[sections[0]]) {
    data.trend = {
      type: trends[sections[0]],
      full: sections.join(' '),
    };
  }  

  data.fetchAirport = async (): Promise<IAirport | null> => {
    if (typeof data.airport === 'object')
      return data.airport;

    try {
      const { data: json } = await axios.get(`https://airports.larrrssss.workers.dev/${data.airport}`);
  
      if (json.status && json.status === 404)
        return null;
      
      data.airport = json as IAirport;
      return data.airport;
    } catch (e) {
      return null;
    }
  };  
  
  return data;
}