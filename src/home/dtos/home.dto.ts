import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';

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

class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}