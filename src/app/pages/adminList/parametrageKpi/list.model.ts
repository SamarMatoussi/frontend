import { GestionKpi } from "../kpi/list.model";

export interface GestionParametrageKpi {
  id?:number;
  name: string;
  description?: string;
  min?: number;
  max?: number;
  appreciation?: string;
  kpi?: GestionKpi;
  kpiId?:number;
  type_color?: any;
  status_color?: any;
}
