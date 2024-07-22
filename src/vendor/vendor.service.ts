import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor) private vendorRepository: Repository<Vendor>,
  ) {}

  async getVendor(id: number): Promise<Vendor> {
    const vendor = this.vendorRepository.findOne({
      where: { id },
      relations: ['dishes'],
    });
    if (!vendor) throw new NotFoundException(`Vendor with id ${id} not found`);
    return vendor;
  }
}
