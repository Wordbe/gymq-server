export interface Equipment {
  id: string;
  name: string;
  type: string;
  brand: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentCreateRequest {
  name: string;
  type: string;
  brand?: string;
}

export interface EquipmentUpdateRequest {
  name?: string;
  type?: string;
  brand?: string;
}

export interface EquipmentListItem {
  id: string;
  name: string;
  type: string;
  brand: string | null;
}