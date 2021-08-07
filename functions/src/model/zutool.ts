export interface ZutoolWeatherStatus {
    place_name: string
    place_id: string
    prefectures_id: string
    dateTime: string
    yesterday: Yesterday[]
    today: Today[]
    tommorow: Tommorow[]
    dayaftertomorrow: Dayaftertomorrow[]
  }
  
  export interface Yesterday {
    time: string
    weather: string
    temp: string
    pressure: string
    pressure_level: string
  }
  
  export interface Today {
    time: string
    weather: string
    temp: string
    pressure: string
    pressure_level: string
  }
  
  export interface Tommorow {
    time: string
    weather: string
    temp: string
    pressure: string
    pressure_level: string
  }
  
  export interface Dayaftertomorrow {
    time: string
    weather: string
    temp: string
    pressure: string
    pressure_level: string
  }
  