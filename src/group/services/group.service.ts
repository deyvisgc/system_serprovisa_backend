import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GroupRepositoryImplement } from '../repository/group.repository.imple';
import { Group } from '../entities/group.entity';
import { CreateGroup, UpdateGroup } from '../dtos/group.dto';
import { Response } from 'src/response/response';

@Injectable()
export class GroupService {
    constructor(private groupRepository: GroupRepositoryImplement) {}
    findAll(limit: number, offset: number, page: number, fech_ini: string, fech_fin: string, familia: number, linea: number): Promise<Group[]> {
        return this.groupRepository.findAll(limit, offset, page, fech_ini, fech_fin, familia, linea)
    }
    async findById(id: number): Promise<Group> {
        const grupo = await this.groupRepository.findById(id);
        if (!grupo) {
            throw new NotFoundException('Error', "El grupo no existe");
        }
        return grupo
    }

    async create(group: CreateGroup[]): Promise<Response> {
        let res = new Response()
        try {
             await this.groupRepository.create(group)
             res.cod = 200
             res.message = `!Grupo creado exitosamente!`
             res.status = true
            return res;
        }catch (err) {
            if (err && err.length > 0) {
                throw new ConflictException(err);
            } else {
                throw new InternalServerErrorException('Error', err.message);
            }
        }
    }
    async update(id: number, group: UpdateGroup): Promise<Response>  {

        let res = new Response()
        const exist = this.findById(id);
        if (exist) {
            try {
                await this.groupRepository.update(id, group)
                res.cod = 200
                res.message = `!Grupo actualizado exitosamente!`
                res.status = true
                return res;
           }catch (err) {
               if (err.message.includes("Duplicate entry")) {
                   throw new ConflictException('Error', `El Grupo: ${group.cod_gru.toUpperCase()} - ${group.des_gru.toUpperCase()} ya se encuentra registrado`);
               } else {
                   throw new InternalServerErrorException(err.message);
               }
           }
        } else {
            throw new NotFoundException('Error', "El grupo no existe");;
        }
    }
    
    async delete(id: number) {
        try {
            let res = new Response()
            await this.groupRepository.delete(id)
            res.cod = 200
            res.message = `!Grupo Eliminado exitosamente!`
            res.status = true
            return res;
       }catch (err) {
          throw new InternalServerErrorException('Error', err.message);
       }
    }
    async findByIdLinea(id: number): Promise<Group[]> {
        const linea = await this.groupRepository.findByIdLinea(id);
        if (!linea) {
            throw new NotFoundException('Error', "No existe grupos por esa linea no existe");
        }
        return linea
    }
    
}
