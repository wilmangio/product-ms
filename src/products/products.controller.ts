import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //@Post()
  @MessagePattern({ cmd: 'create_product' })
  create(/*@Body()*/@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  //@Get()
  @MessagePattern({ cmd: 'find_all_product' })
  findAll( /*@Query()*/@Payload() pagination:PaginationDto ) {
    return this.productsService.findAll( pagination );
  }

  //@Get(':id')
  @MessagePattern({ cmd: 'find_one_product' })
  findOne(/*@Param('id')*/ @Payload('id', ParseIntPipe) id: number) {// con Payload busca en el objeto el id
    return this.productsService.findOne(id);
  }

  //@Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  update(/*@Param('id') id: string, @Body() updateProductDto: UpdateProductDto*/
    @Payload() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  //@Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  remove(/*@Param('id')*/ @Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @MessagePattern({ cmd: 'validate_produts' })
  validateProduts(@Payload() ids: number[]){
    return this.productsService.validateProduts(ids);
  }
}
