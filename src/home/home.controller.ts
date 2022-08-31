import { Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { HomeResponseDto } from './dtos/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {

  constructor(private readonly homeService: HomeService) { }

  @Get()
  async getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {

    // This should be in the service, not in controller - this creates a lot of redundant code
    const filters = {
      city,
      price: {
        gte: minPrice && parseFloat(minPrice),
        lte: maxPrice && parseFloat(maxPrice),
      },
      propertyType,
    }

    const homes = await this.homeService.getHomes(filters);

    return homes;
  }

  @Get(':id')
  getHome() {
    return 'getHome';
  }

  @Post()
  createHome() {
    return 'createHome';
  }

  @Put(':id')
  updateHome() {
    return 'updateHome';
  }

  @Delete(':id')
  deleteHome() {
    return 'deleteHome'
  }
}
