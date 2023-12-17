import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GroupRepositoryImplement } from '../repository/group.repository.imple';
import { Group } from '../entities/group.entity';
import { CreateGroup, UpdateGroup } from '../dtos/group.dto';
import { Response } from 'src/response/response';
import { ImportarService } from 'src/common/importar/importar.service';

@Injectable()
export class GroupService {
  constructor(
    private groupRepository: GroupRepositoryImplement,
    private importarService: ImportarService,
  ) {}
  findAll(
    limit: number,
    offset: number,
    page: number,
    fech_ini: string,
    fech_fin: string,
    familia: number,
    linea: number,
  ): Promise<Group[]> {
    return this.groupRepository.findAll(
      limit,
      offset,
      page,
      fech_ini,
      fech_fin,
      familia,
      linea,
    );
  }
  async findById(id: number): Promise<Group> {
    const grupo = await this.groupRepository.findById(id);
    if (!grupo) {
      throw new NotFoundException('Error', 'El grupo no existe');
    }
    return grupo;
  }

  async create(group: CreateGroup[]): Promise<Response> {
    let res = new Response();
    try {
      await this.groupRepository.create(group);
      res.cod = 200;
      res.message = `!Grupo creado exitosamente!`;
      res.status = true;
      return res;
    } catch (err) {
      if (err && err.length > 0) {
        throw new ConflictException(err);
      } else {
        throw new InternalServerErrorException('Error', err.message);
      }
    }
  }
  async update(id: number, group: UpdateGroup): Promise<Response> {
    let res = new Response();
    const exist = this.findById(id);
    if (exist) {
      try {
        await this.groupRepository.update(id, group);
        res.cod = 200;
        res.message = `!Grupo actualizado exitosamente!`;
        res.status = true;
        return res;
      } catch (err) {
        if (err.message.includes('Duplicate entry')) {
          throw new ConflictException(
            'Error',
            `El Grupo: ${group.cod_gru.toUpperCase()} - ${group.des_gru.toUpperCase()} ya se encuentra registrado`,
          );
        } else {
          throw new InternalServerErrorException(err.message);
        }
      }
    } else {
      throw new NotFoundException('Error', 'El grupo no existe');
    }
  }

  async delete(id: number) {
    try {
      let res = new Response();
      await this.groupRepository.delete(id);
      res.cod = 200;
      res.message = `!Grupo Eliminado exitosamente!`;
      res.status = true;
      return res;
    } catch (err) {
      throw new InternalServerErrorException('Error', err.message);
    }
  }
  async findByIdLinea(id: number): Promise<Group[]> {
    const linea = await this.groupRepository.findByIdLinea(id);
    if (!linea) {
      throw new NotFoundException(
        'Error',
        'No existe grupos por esa linea no existe',
      );
    }
    return linea;
  }
  async exportarExcel(
    fech_ini: string,
    fech_fin: string,
    familia: number,
    linea: number
  ) {
    const sheetName = 'Grupo';
    const columnHeaders = [
      'Codigo Grupo',
      'Descripción Grupo',
      'Familia',
      'Linea',
      'Codigo en Conjunto',
      'Total Productos',
      'Fecha Registro'
    ];
    const data = await this.groupRepository.findAll(
      100000,
      0,
      1,
      fech_ini,
      fech_fin,
      familia,
      linea
    );
    const listGrupo = [];
    data.registros.forEach((row) => {
      const ro = [
        row.cod_gru,
        row.des_gru,
        `${row.cod_fam}-${row.des_fam}`,
        `${row.cod_line}-${row.des_line}`,
        row.cod_gru_final,
        row.total_product,
        row.fec_regis
      ];
      listGrupo.push(ro);
    });
    return await this.importarService.exportarExcel(
      sheetName,
      columnHeaders,
      listGrupo
    );
  }
  async exportarPdf(
    fech_ini: string,
    fech_fin: string,
    familia: number,
    linea: number
  ): Promise<ArrayBuffer> {
    const columnHeaders = [
      'Codigo Grupo',
      'Descripción Grupo',
      'Familia',
      'Linea',
      'Codigo en Conjunto',
      'Total Productos',
      'Fecha Registro'
    ];
    const data = await this.groupRepository.findAll(
      100000,
      0,
      1,
      fech_ini,
      fech_fin,
      familia,
      linea
    );
    const listGrupo = [];
    data.registros.forEach((row) => {
      const fecRegis = new Date(row.fec_regis).toISOString().slice(0, 10);
      const ro = [
        row.cod_gru,
        row.des_gru,
        `${row.cod_fam}-${row.des_fam}`,
        `${row.cod_line}-${row.des_line}`,
        row.cod_gru_final,
        row.total_product,
        fecRegis
      ];
      listGrupo.push(ro);
    });
    return this.importarService.exportarPdf(
      listGrupo,
      columnHeaders,
      'Reporte de Grupos de Productos'
    );
  }
}
