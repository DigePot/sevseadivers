import { Service } from '../models/index.js';
import tryCatch from '../utils/tryCatch.js';
import AppError from '../utils/appErorr.js';

export const createService = tryCatch(async (req, res, next) => {
  const { name, description, imageUrl, price, duration } = req.body;
  if (!name || !description || !price) {
    return next(new AppError('Name, description, and price are required', 400));
  }
  const service = await Service.create({ name, description, imageUrl, price, duration });
  res.status(201).json(service);
});

export const getAllServices = tryCatch(async (req, res) => {
  const services = await Service.findAll();
  res.json(services);
});

export const getServiceById = tryCatch(async (req, res, next) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) return next(new AppError('Service not found', 404));
  res.json(service);
});

export const updateService = tryCatch(async (req, res, next) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) return next(new AppError('Service not found', 404));
  const { name, description, imageUrl, price, duration } = req.body;
  await service.update({ name, description, imageUrl, price, duration });
  res.json(service);
});

export const deleteService = tryCatch(async (req, res, next) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) return next(new AppError('Service not found', 404));
  await service.destroy();
  res.json({ message: 'Service deleted' });
}); 