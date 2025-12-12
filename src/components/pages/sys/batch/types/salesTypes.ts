export type Summary = {
  revenue?: number;
  expense?: number;
  netProfit?: number;
  roi?: number;
};

export type Transaction = {
  id: number;
  date: string;
  product: string;
  total: number;
  customer: string | null;
};

export type MonthlyData = {
  month: string;
  fish_sales: number;
  plant_sales: number;
  expenses: number;
};