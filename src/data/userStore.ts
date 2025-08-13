import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import type { User, UserCreateRequest, UserUpdateRequest, UserResponse, Session } from '../types/user.js';

class UserStore {
  private users: User[] = [];
  private sessions: Session[] = [];

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  private userToResponse(user: User): UserResponse {
    const { password, ...userResponse } = user;
    return userResponse;
  }

  create(userData: UserCreateRequest): UserResponse | null {
    const existingUser = this.users.find(user => user.email === userData.email);
    if (existingUser) {
      return null;
    }

    const newUser: User = {
      id: uuidv4(),
      email: userData.email,
      password: this.hashPassword(userData.password),
      name: userData.name,
      phone: userData.phone || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.users.push(newUser);
    return this.userToResponse(newUser);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  validatePassword(user: User, password: string): boolean {
    return user.password === this.hashPassword(password);
  }

  update(id: string, updateData: UserUpdateRequest): UserResponse | null {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }

    const updatedUser: User = {
      ...this.users[userIndex],
      ...updateData,
      password: updateData.password ? this.hashPassword(updateData.password) : this.users[userIndex].password,
      id,
      updatedAt: new Date().toISOString()
    };

    this.users[userIndex] = updatedUser;
    return this.userToResponse(updatedUser);
  }

  delete(id: string): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    this.sessions = this.sessions.filter(session => session.userId !== id);
    return true;
  }

  createSession(userId: string): string {
    const sessionId = uuidv4();
    const session: Session = {
      id: sessionId,
      userId,
      createdAt: new Date().toISOString()
    };
    
    this.sessions.push(session);
    return sessionId;
  }

  findSession(sessionId: string): Session | undefined {
    return this.sessions.find(session => session.id === sessionId);
  }

  deleteSession(sessionId: string): boolean {
    const sessionIndex = this.sessions.findIndex(session => session.id === sessionId);
    
    if (sessionIndex === -1) {
      return false;
    }

    this.sessions.splice(sessionIndex, 1);
    return true;
  }

  getUserBySession(sessionId: string): UserResponse | null {
    const session = this.findSession(sessionId);
    if (!session) {
      return null;
    }

    const user = this.findById(session.userId);
    if (!user) {
      return null;
    }

    return this.userToResponse(user);
  }
}

export default new UserStore();