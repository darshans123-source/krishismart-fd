import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { sendError } from '../utils/response.js';
import { db } from '../models/database.js';
import { AdminRole, AdminUser } from '../types/index.js';

export interface AuthenticatedAdminRequest extends Request {
  admin?: AdminUser;
}

export const authenticateAdmin = (req: AuthenticatedAdminRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    sendError(res, 'Admin authentication token is missing or malformed', 401);
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; email: string; role: AdminRole };
    const admin = db.admins.get(decoded.id);

    if (!admin || admin.status !== 'Active') {
      sendError(res, 'Admin account not found or inactive', 403);
      return;
    }

    req.admin = admin;
    next();
  } catch (err: any) {
    sendError(res, 'Session expired or invalid admin token', 401);
  }
};

export const requireSuperAdmin = (req: AuthenticatedAdminRequest, res: Response, next: NextFunction): void => {
  if (!req.admin || req.admin.role !== 'Super Admin') {
    sendError(res, 'Access denied: Super Admin permission required', 403);
    return;
  }
  next();
};

export const requireAdminRole = (req: AuthenticatedAdminRequest, res: Response, next: NextFunction): void => {
  if (!req.admin || (req.admin.role !== 'Super Admin' && req.admin.role !== 'Admin')) {
    sendError(res, 'Access denied: Administrator privileges required', 403);
    return;
  }
  next();
};

export const requireEditorRole = (req: AuthenticatedAdminRequest, res: Response, next: NextFunction): void => {
  if (!req.admin) {
    sendError(res, 'Access denied: Editor credentials required', 403);
    return;
  }
  next();
};
