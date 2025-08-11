import express, { Request, Response } from 'express';
import equipmentStore from '../data/equipmentStore.js';
import type { EquipmentCreateRequest, EquipmentUpdateRequest } from '../types/equipment.js';

const router = express.Router();

router.post('/', (req: Request<{}, {}, EquipmentCreateRequest>, res: Response) => {
  try {
    const { name, type, brand } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        error: 'Name and type are required fields'
      });
    }

    const newEquipment = equipmentStore.create({ name, type, brand });
    
    res.status(201).json(newEquipment);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

router.get('/', (_req: Request, res: Response) => {
  try {
    const equipmentList = equipmentStore.findAll();
    res.json(equipmentList);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

router.get('/:id', (req: Request<{ id: string }>, res: Response) => {
  try {
    const equipment = equipmentStore.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({
        error: 'Equipment not found'
      });
    }

    res.json(equipment);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

router.put('/:id', (req: Request<{ id: string }, {}, EquipmentUpdateRequest>, res: Response) => {
  try {
    const { name, type, brand } = req.body;
    const updateData: EquipmentUpdateRequest = {};

    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (brand !== undefined) updateData.brand = brand;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'No valid fields to update'
      });
    }

    const updatedEquipment = equipmentStore.update(req.params.id, updateData);
    
    if (!updatedEquipment) {
      return res.status(404).json({
        error: 'Equipment not found'
      });
    }

    res.json(updatedEquipment);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

router.delete('/:id', (req: Request<{ id: string }>, res: Response) => {
  try {
    const deleted = equipmentStore.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Equipment not found'
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;