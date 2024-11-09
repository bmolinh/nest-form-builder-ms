import { Injectable } from '@nestjs/common';

@Injectable()
export class FormsService {
  create() {
    return 'This action adds a new form';
  }

  findAll() {
    return `This action returns all forms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} form`;
  }

  update(id: number) {
    return `This action updates a #${id} form`;
  }

  remove(id: number) {
    return `This action removes a #${id} form`;
  }
}
