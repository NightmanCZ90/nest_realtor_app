import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { homeSelect, HomeService } from './home.service';

const mockGetHomes = [
  {
      id: 2,
      address: 'Podskalska 393/5',
      city: 'Praha',
      price: 8000000,
      propertyType: PropertyType.CONDO,
      numberOfBathrooms: 1,
      numberOfBedrooms: 3,
      image: 'img3'
  },
  {
      id: 1,
      address: 'Lipovska 1167/52',
      city: 'Jesenik',
      price: 2250000,
      propertyType: PropertyType.CONDO,
      numberOfBathrooms: 1,
      numberOfBedrooms: 2,
      image: 'img1'
  }
]

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeService, {
        provide: PrismaService,
        useValue: {
          home: {
            findMany: jest.fn().mockReturnValue([])
          }
        }
      }],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getHomes', () => {
    const filters = {
      city: 'Jesenik',
      price: {
        gte: 1000000,
        lte: 3000000
      },
      propertyType: PropertyType.CONDO,
    }

    it('should call prisma home.findMany with correct params', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);

      jest.spyOn(prismaService.home, 'findMany').mockImplementation(mockPrismaFindManyHomes);
      await service.getHomes(filters);

      expect(mockPrismaFindManyHomes).toBeCalledWith({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1,
          }
        },
        where: filters
      });
    });
  });
});