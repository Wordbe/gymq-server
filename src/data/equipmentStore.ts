import { v4 as uuidv4 } from 'uuid';
import type { Equipment, EquipmentCreateRequest, EquipmentUpdateRequest, EquipmentListItem } from '../types/equipment.js';

class EquipmentStore {
  private equipment: Equipment[] = [];

  create(equipmentData: EquipmentCreateRequest): Equipment {
    const newEquipment: Equipment = {
      id: uuidv4(),
      name: equipmentData.name,
      type: equipmentData.type,
      brand: equipmentData.brand || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.equipment.push(newEquipment);
    return newEquipment;
  }

  findAll(): EquipmentListItem[] {
    return this.equipment.map(eq => ({
      id: eq.id,
      name: eq.name,
      type: eq.type,
      brand: eq.brand
    }));
  }

  findById(id: string): Equipment | undefined {
    return this.equipment.find(eq => eq.id === id);
  }

  update(id: string, updateData: EquipmentUpdateRequest): Equipment | null {
    const equipmentIndex = this.equipment.findIndex(eq => eq.id === id);
    
    if (equipmentIndex === -1) {
      return null;
    }

    const updatedEquipment: Equipment = {
      ...this.equipment[equipmentIndex],
      ...updateData,
      id,
      updatedAt: new Date().toISOString()
    };

    this.equipment[equipmentIndex] = updatedEquipment;
    return updatedEquipment;
  }

  delete(id: string): boolean {
    const equipmentIndex = this.equipment.findIndex(eq => eq.id === id);
    
    if (equipmentIndex === -1) {
      return false;
    }

    this.equipment.splice(equipmentIndex, 1);
    return true;
  }
}

export default new EquipmentStore();