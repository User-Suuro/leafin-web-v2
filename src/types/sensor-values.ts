export interface SensorData {
  connected: boolean;
  time: string;
  date: string;
  ph: number;
  turbid: number;
  water_temp: number;
  tds: number;
  float_switch: boolean;
  nh3_gas: number;
  created_at: number; 
}
