import { Activite } from "../activites/activite.model";

export interface GestionKpi {
  id?:number;
  nameKpi: string;
  label: string;
  description?: string;
  activiteId?:number;
  activite?:Activite;
}
