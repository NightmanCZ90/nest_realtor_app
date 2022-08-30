import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

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

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}