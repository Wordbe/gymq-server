import express, { Request, Response } from 'express';
import userStore from '../data/userStore.js';
import type { UserCreateRequest, UserLoginRequest, UserUpdateRequest } from '../types/user.js';

const router = express.Router();

function authenticateUser(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  const sessionId = authHeader.substring(7);
  const user = userStore.getUserBySession(sessionId);
  
  if (!user) {
    return res.status(401).json({
      error: 'Invalid session'
    });
  }

  req.user = user;
  next();
}

router.post('/register', (req: Request<{}, {}, UserCreateRequest>, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Email, password, and name are required fields'
      });
    }

    const newUser = userStore.create({ email, password, name, phone });
    
    if (!newUser) {
      return res.status(400).json({
        error: 'Email already exists'
      });
    }

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

router.post('/login', (req: Request<{}, {}, UserLoginRequest>, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const user = userStore.findByEmail(email);
    
    if (!user || !userStore.validatePassword(user, password)) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const sessionId = userStore.createSession(user.id);
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      sessionId
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

router.get('/me', authenticateUser, (req: Request, res: Response) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

router.put('/me', authenticateUser, (req: Request<{}, {}, UserUpdateRequest>, res: Response) => {
  try {
    const { name, phone, password } = req.body;
    const updateData: UserUpdateRequest = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (password !== undefined) updateData.password = password;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'No valid fields to update'
      });
    }

    const updatedUser = userStore.update(req.user!.id, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

router.delete('/me', authenticateUser, (req: Request, res: Response) => {
  try {
    const deleted = userStore.delete(req.user!.id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'User not found'
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