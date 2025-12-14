export interface SensorData {
  connected: boolean;
  time: string;
  date: string;
  ph: number;
  turbid: number;
  water_temp: number;
  tds: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  created_at: number;
  history?: SensorData[];
}
