import { test, describe } from 'node:test';
import assert from 'node:assert';
import type { Equipment, EquipmentCreateRequest } from '../src/types/equipment.js';

describe('Equipment API Tests', () => {
  test('POST /equipment - should create new equipment', async () => {
    const equipmentData: EquipmentCreateRequest = {
      name: 'Test Treadmill',
      type: 'Cardio',
      brand: 'TestBrand'
    };

    const response = await fetch('http://localhost:8080/equipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(equipmentData)
    });

    assert.strictEqual(response.status, 201);
    const data: Equipment = await response.json();
    assert.ok(data.id);
    assert.strictEqual(data.name, equipmentData.name);
    assert.strictEqual(data.type, equipmentData.type);
    assert.strictEqual(data.brand, equipmentData.brand);
    assert.ok(data.createdAt);
    assert.ok(data.updatedAt);
  });

  test('POST /equipment - should return error for missing required fields', async () => {
    const incompleteData = {
      name: 'Test Equipment'
    };

    const response = await fetch('http://localhost:8080/equipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incompleteData)
    });

    assert.strictEqual(response.status, 400);
    const data: { error: string } = await response.json();
    assert.ok(data.error);
  });

  test('GET /equipment - should return list of equipment', async () => {
    const response = await fetch('http://localhost:8080/equipment');
    
    assert.strictEqual(response.status, 200);
    const data = await response.json();
    assert.ok(Array.isArray(data));
  });

  test('GET /equipment/:id - should return specific equipment', async () => {
    const createResponse = await fetch('http://localhost:8080/equipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Equipment',
        type: 'Strength'
      })
    });

    const createdEquipment: Equipment = await createResponse.json();
    
    const response = await fetch(`http://localhost:8080/equipment/${createdEquipment.id}`);
    
    assert.strictEqual(response.status, 200);
    const data: Equipment = await response.json();
    assert.strictEqual(data.id, createdEquipment.id);
  });

  test('GET /equipment/:id - should return 404 for non-existent equipment', async () => {
    const response = await fetch('http://localhost:8080/equipment/non-existent-id');
    
    assert.strictEqual(response.status, 404);
    const data: { error: string } = await response.json();
    assert.ok(data.error);
  });

  test('PUT /equipment/:id - should update equipment', async () => {
    const createResponse = await fetch('http://localhost:8080/equipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Old Name',
        type: 'Strength'
      })
    });

    const createdEquipment: Equipment = await createResponse.json();
    
    const updateResponse = await fetch(`http://localhost:8080/equipment/${createdEquipment.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'New Name'
      })
    });

    assert.strictEqual(updateResponse.status, 200);
    const updatedData: Equipment = await updateResponse.json();
    assert.strictEqual(updatedData.name, 'New Name');
    assert.strictEqual(updatedData.type, 'Strength');
  });

  test('DELETE /equipment/:id - should delete equipment', async () => {
    const createResponse = await fetch('http://localhost:8080/equipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'To Delete',
        type: 'Cardio'
      })
    });

    const createdEquipment: Equipment = await createResponse.json();
    
    const deleteResponse = await fetch(`http://localhost:8080/equipment/${createdEquipment.id}`, {
      method: 'DELETE'
    });

    assert.strictEqual(deleteResponse.status, 204);
    
    const getResponse = await fetch(`http://localhost:8080/equipment/${createdEquipment.id}`);
    assert.strictEqual(getResponse.status, 404);
  });
});