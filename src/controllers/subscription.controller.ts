import { Request, Response, NextFunction } from "express";
import { SubscriptionService } from "../services/subscription.service";

// Crear una suscripción
export const createSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("req.body", req.body);
    const result = await SubscriptionService.createSubscription(req.body);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Obtener todas las suscripciones
export const getSubscriptions = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SubscriptionService.getSubscriptions();
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Obtener una suscripción por ID
export const getSubscriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await SubscriptionService.getSubscriptionById(id);
    if (!result.success) {
      res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Actualizar una suscripción
export const updateSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(req.body);
    const id = parseInt(req.params.id, 10);
    const result = await SubscriptionService.updateSubscription(id, req.body);
    if (!result.success) {
      res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Eliminar una suscripción
export const deleteSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await SubscriptionService.deleteSubscription(id);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};