import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FamilyRepositoryImplement } from '../repository/family.repository.imple';
import { CreateFamily, UpdateFamily } from '../dtos/family.dtos';
import { Family } from '../entities/family.entity';
import { Response } from 'src/response/response';

@Injectable()
export class FamilyService {
    constructor(private familyRepository: FamilyRepositoryImplement) {}
    findAll(limit: number, offset: number, page: number): Promise<Family[]> {
        return this.familyRepository.findAll(limit, offset, page)
    }
    async findById(id: number): Promise<Family> {
        const family = await this.familyRepository.findById(id);
        if (!family) {
            throw new NotFoundException("La Familia no existe");
        }
        return family
    }

    async create(family: CreateFamily[]): Promise<Response> {
        let res = new Response()
        try {
             await this.familyRepository.create(family)
             res.cod = 200
             res.message = `!Familia creada exitosamente!`
             res.status = true
            return res;
        }catch (err) {
            if (err && err.length > 0) {
                throw new BadRequestException(err);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }
    async update(id: number, family: UpdateFamily): Promise<Response>  {
        let res = new Response()
        const exist = this.findById(id);
        if (exist) {
            try {
                await this.familyRepository.update(id, family)
                res.cod = 200
                res.message = `!Familia actualiza exitosamente!`
                res.status = true
                return res;
           }catch (err) {
               if (err.message.includes("Duplicate entry")) {
                   throw new BadRequestException(`La familia: ${family.codigo_familia.toUpperCase()} - ${family.descripcion_familia.toUpperCase()} ya se encuentra registrada`);
               } else {
                   throw new InternalServerErrorException(err.message);
               }
           }
        } else {
            throw new NotFoundException("La Familia no existe");;
        }
    }
    
    async delete(id: number) {
        try {
            let res = new Response()
            await this.familyRepository.delete(id)
            res.cod = 200
            res.message = `!Familia Eliminada exitosamente!`
            res.status = true
            return res;
       }catch (err) {
          throw new InternalServerErrorException(err.message);
       }
    }
}
