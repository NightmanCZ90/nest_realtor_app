import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

const mockUser = {
  id: 1,
  name: 'Jan Novak',
  email: 'test@test.com',
  phone: '123 456 7890'
}

const mockHome = {
  id: 1,
  address: 'Lipovska 1167/52',
  city: 'Jesenik',
  price: 2250000,
  propertyType: PropertyType.CONDO,
  numberOfBathrooms: 1,
  numberOfBedrooms: 2,
  image: 'img1'
}

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            getHomes: jest.fn().mockReturnValue([]),
            getRealtorByHomeId: jest.fn().mockReturnValue(mockUser),
            updateHomeById: jest.fn().mockReturnValue(mockHome)
          }
        },
        PrismaService
      ]
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  describe('getHomes', () => {
    it('should construct filter object correctly', async () => {
      const mockGetHomes = jest.fn().mockReturnValue([]);
      jest.spyOn(homeService, 'getHomes').mockImplementation(mockGetHomes);

      await controller.getHomes('Jesenik', '50000');
      expect(mockGetHomes).toBeCalledWith({
        city: 'Jesenik',
        price: {
          gte: 50000,
        }
      });
    });
  });

  describe('updateHome', () => {
    const updateHome = {
      address: 'Kap 1',
      numberOfBathrooms: 2,
      numberOfBedrooms: 2,
      city: 'Sumperk',
      landSize: 123,
      price: 999,
      propertyType: PropertyType.RESIDENTIAL,
      images: [
        {
          url: 'src9'
        }
      ]
    }
    const mockUserInfo = {
      name: 'Petr Novak',
      id: 13,
      iat: 4,
      exp: 1,
    }

    it('should throw unauth error if realtor didn\'t create home', async () => {
      await expect(controller.updateHome(1, updateHome, mockUserInfo)).rejects.toThrowError(UnauthorizedException);
    });
  });
});
