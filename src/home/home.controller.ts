import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dtos/home.dto';
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
  getHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHomeById(id);
  }

  @Post()
  createHome(@Body() body: CreateHomeDto) {
    return this.homeService.createHome(body);
  }

  @Put(':id')
  updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto
  ) {
    return this.homeService.updateHomeById(id, body);
  }

  @Delete(':id')
  deleteHome(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.homeService.deleteHomeById(id);
  }
}
