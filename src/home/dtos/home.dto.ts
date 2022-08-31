import { PropertyType } from '@prisma/client';

export class Realtor {
  name: string;
  email: string;
  phone: string;
}

export class HomeResponseDto {
  id: number;
  address: string;

  @Expose({ name: 'numberOfBedrooms'})
  number_of_bedrooms: number;

  @Expose({ name: 'numberOfBathrooms'})
  number_of_bathrooms: number;

  city: string;

  @Expose({ name: 'listedDate'})
  listed_date: Date;

  price: number;

  image: string;

  @Expose({ name: 'landSize'})
  land_size: number;

  @Expose({ name: 'propertyType'})
  property_type: PropertyType;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Exclude()
  realtor_id: number;

  @Expose()
  realtor: Realtor;

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}