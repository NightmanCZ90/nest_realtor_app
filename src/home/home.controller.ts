import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { HomeResponseDto } from './dtos/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {

  constructor(private readonly homeService: HomeService) { }

  @Get()
  async getHomes(): Promise<HomeResponseDto[]> {
    const homes = await this.homeService.getHomes();

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
