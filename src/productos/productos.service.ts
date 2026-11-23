import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { Producto } from './producto.entity.js';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,
  ) {}

  findAll(): Promise<Producto[]> {
    return this.productosRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  create(dto: CreateProductoDto): Promise<Producto> {
    const producto = this.productosRepository.create({
      nombre: dto.nombre.trim(),
      descripcion: dto.descripcion?.trim() || null,
      precio: dto.precio,
    });

    return this.productosRepository.save(producto);
  }

  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);

    if (dto.nombre !== undefined) {
      producto.nombre = dto.nombre.trim();
    }

    if (dto.descripcion !== undefined) {
      producto.descripcion = dto.descripcion.trim() || null;
    }

    if (dto.precio !== undefined) {
      producto.precio = dto.precio;
    }

    return this.productosRepository.save(producto);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    await this.productosRepository.remove(producto);

    return { mensaje: 'Producto eliminado correctamente' };
  }
}
