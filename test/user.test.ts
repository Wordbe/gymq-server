import { strict as assert } from 'assert';
import { test, describe } from 'node:test';

const API_BASE = 'http://localhost:8080';

async function request(method: string, path: string, data?: any, headers?: Record<string, string>) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE}${path}`, options);
  
  let result;
  const contentType = response.headers.get('content-type');
  
  if (response.status === 204) {
    result = null;
  } else if (contentType && contentType.includes('application/json')) {
    result = await response.json();
  } else {
    result = { error: await response.text() };
  }
  
  return { status: response.status, data: result };
}

describe('User Management API', () => {
  let sessionId: string;
  const testUser = {
    email: 'testuser@example.com',
    password: 'testpass123',
    name: '테스트사용자',
    phone: '010-1111-2222'
  };

  test('POST /users/register - 회원가입 성공', async () => {
    const response = await request('POST', '/users/register', testUser);
    
    assert.equal(response.status, 201);
    assert.equal(response.data.email, testUser.email);
    assert.equal(response.data.name, testUser.name);
    assert.equal(response.data.phone, testUser.phone);
    assert.ok(response.data.id);
    assert.ok(response.data.createdAt);
    assert.equal(response.data.password, undefined); // 비밀번호는 응답에 포함되지 않아야 함
  });

  test('POST /users/register - 이메일 중복 실패', async () => {
    const response = await request('POST', '/users/register', testUser);
    
    assert.equal(response.status, 400);
    assert.ok(response.data.error);
  });

  test('POST /users/login - 로그인 성공', async () => {
    const response = await request('POST', '/users/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    assert.equal(response.status, 200);
    assert.equal(response.data.user.email, testUser.email);
    assert.equal(response.data.user.name, testUser.name);
    assert.ok(response.data.sessionId);
    
    sessionId = response.data.sessionId;
  });

  test('POST /users/login - 잘못된 비밀번호로 로그인 실패', async () => {
    const response = await request('POST', '/users/login', {
      email: testUser.email,
      password: 'wrongpassword'
    });
    
    assert.equal(response.status, 401);
    assert.ok(response.data.error);
  });

  test('GET /users/me - 내정보 조회 성공', async () => {
    const response = await request('GET', '/users/me', null, {
      'Authorization': `Bearer ${sessionId}`
    });
    
    assert.equal(response.status, 200);
    assert.equal(response.data.email, testUser.email);
    assert.equal(response.data.name, testUser.name);
    assert.equal(response.data.phone, testUser.phone);
  });

  test('GET /users/me - 인증 없이 조회 실패', async () => {
    const response = await request('GET', '/users/me');
    
    assert.equal(response.status, 401);
    assert.ok(response.data.error);
  });

  test('PUT /users/me - 내정보 수정 성공', async () => {
    const updateData = {
      name: '수정된이름',
      phone: '010-9999-8888'
    };
    
    const response = await request('PUT', '/users/me', updateData, {
      'Authorization': `Bearer ${sessionId}`
    });
    
    assert.equal(response.status, 200);
    assert.equal(response.data.name, updateData.name);
    assert.equal(response.data.phone, updateData.phone);
    assert.equal(response.data.email, testUser.email); // 이메일은 변경되지 않아야 함
  });

  test('DELETE /users/me - 회원 탈퇴 성공', async () => {
    const response = await request('DELETE', '/users/me', null, {
      'Authorization': `Bearer ${sessionId}`
    });
    
    assert.equal(response.status, 204);
    assert.equal(response.data, null);
  });

  test('GET /users/me - 탈퇴 후 세션 만료 확인', async () => {
    const response = await request('GET', '/users/me', null, {
      'Authorization': `Bearer ${sessionId}`
    });
    
    assert.equal(response.status, 401);
    assert.ok(response.data.error);
  });
});