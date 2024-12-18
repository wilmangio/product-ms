import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit{

  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log("BD Conectada");
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll( pagination:PaginationDto ) {
    const { page, limit }  = pagination;
    const totalPages = await this.product.count({ where: {available: true}});
    const lastPage = Math.ceil( totalPages / limit);
    return {
      data: await this.product.findMany({
        take: limit,
        skip: ( page - 1) * limit,
        where:{
          available: true
        }
      }),
      metadata:{
        page: page,
        total: totalPages,
        lastPage: lastPage,
      }
    } 
  }

  async findOne(id: number) {

    const product = await this.product.findFirst({ 
      where: { id: id, available:true } 
    });
    if( !product ){
      throw new RpcException({
        message: `No encontrado  #${id} product`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
      
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: ___, ...data }= updateProductDto;
    await this.findOne(id);

    return this.product.update({
      where: { id:id },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    // return this.product.delete({ where:{ id }});

    const product = await this.product.update({
      where:{ id: id},
      data:{
        available: false,
      }
    });

    return product;
  }

  async validateProduts( ids: number[] ){
      ids = Array.from(new Set(ids));
      const products = await this.product.findMany({
        where:{
          id:{
            in: ids
          }
        }
      });

      if(products.length !== ids.length){
        throw new RpcException({
          message: "Some product were not found",
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return products;
  }
}
