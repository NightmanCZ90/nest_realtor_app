import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { HomeResponseDto } from './dtos/home.dto';

interface GetHomesParam {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}

interface Image {
  url: string
}

interface CreateHomeParams {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  price: number;
  landSize: number;
  propertyType: PropertyType;
  images: Image[];
}

const homeSelect = {
  id: true,
  address: true,
  city: true,
  price: true,
  property_type: true,
  number_of_bathrooms: true,
  number_of_bedrooms: true,
}

@Injectable()
export class HomeService {

  constructor(private readonly prismaService: PrismaService) { }

  async getHomes(filters: GetHomesParam): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        ...homeSelect,
        images: {
          select: {
            url: true,
          },
          take: 1,
        }
      },
      where: filters,
    });

    if (homes.length === 0) {
      throw new NotFoundException();
    }

    return homes.map(home => {
      const fetchedHome = { ...home, image: home.images[0]?.url };
      delete fetchedHome.images;
      return new HomeResponseDto(fetchedHome);
    });
  }

  async getHomeById(id: number): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.findUnique({
      where: { id },
      select: {
        ...homeSelect,
        images: {
          select: {
            url: true,
          },
        },
        realtor: {
          select: {
            name: true,
            email: true,
            phone: true,
          }
        }
      },
    });

    if (!home) {
      throw new NotFoundException();
    }

    return new HomeResponseDto(home);
  }

  async createHome({
    address,
    city,
    images,
    landSize,
    numberOfBathrooms,
    numberOfBedrooms,
    price,
    propertyType,
  }: CreateHomeParams) {
    const home = await this.prismaService.home.create({
      data: {
        address,
        city,
        land_size: landSize,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        price,
        property_type: propertyType,
        realtor_id: 1,
        images: {
          create: images
        }
      },
    });

    return new HomeResponseDto(home);
  }
}
