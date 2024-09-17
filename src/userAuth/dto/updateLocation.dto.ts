// src/userAuth/dto/Location.dto.ts
import { IsNumber } from "class-validator";

export class UpdateLocationDto {
    @IsNumber()
    lat: number;
  
    @IsNumber()
    lng: number;
  }