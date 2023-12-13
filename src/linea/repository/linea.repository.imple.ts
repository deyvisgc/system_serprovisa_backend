import { Inject, Injectable } from '@nestjs/common';
import { AppConstants } from 'src/util/Constantes.enum';
import * as mysql from 'mysql2';
import { LineaRepositoryInterface } from './linea.repository.interface';
import { Linea } from '../entities/linea';
import { CreateLinea, UpdateLinea } from '../dtos/linea.dtos';
@Injectable()
export class LineaRepositoryImplement implements LineaRepositoryInterface {
  constructor(
    @Inject(AppConstants.provideConnection) private connectionDB: mysql.Pool,
  ) {}
  findByIdFamilia(id: number): Promise<Linea[]> {
    const sql = `SELECT * FROM ${AppConstants.TABLA_LINEA} where family_id_fam = ? and status_line = 1`;
    const values = [id];
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.connectionDB.query(sql, values);
        resolve(res[0] as Linea[]);
      } catch (error) {
        reject(error);
      }
    });
  }
  findAll(limit: number, offset: number, page: number): Promise<any> {
    offset = (page - 1) * limit;
    let sql = `SELECT li.*, fa.cod_fam, fa.des_fam FROM ${AppConstants.TABLA_LINEA} as li inner join 
        ${AppConstants.TABLA_FAMILIA} as fa on li.family_id_fam = fa.id_fam where status_line = 1  order by id_line asc limit ${limit} offset ${offset}`;
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.connectionDB.query(sql);
        sql = `SELECT count(*) as count FROM ${AppConstants.TABLA_LINEA} as li inner join 
                ${AppConstants.TABLA_FAMILIA} as fa on li.family_id_fam = fa.id_fam where status_line = 1`;
        const count = await this.connectionDB.query(sql);
        const result = {
          limit,
          offset,
          totalRegistros: count && count[0].length > 0 ? count[0][0].count : 0,
          registros: res[0],
        };
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
  findById(id: number): Promise<Linea> {
    const sql = `SELECT * FROM ${AppConstants.TABLA_LINEA} where id_line = ? and  status_line = 1`;
    const values = [id];
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.connectionDB.query(sql, values);
        resolve(res[0][0] as Linea);
      } catch (error) {
        reject(error);
      }
    });
  }
  async create(linea: CreateLinea[]): Promise<boolean> {
    const sql = `INSERT INTO ${AppConstants.TABLA_LINEA} (cod_line, des_line, status_line, family_id_fam) VALUES (?, ?, ?, ?)`;
    let errors = [];
    return new Promise(async (resolve, reject) => {
      const validateError = await this.validateDuplicados(linea);
      if (validateError.length > 0) {
        reject(validateError);
        return;
      }
      for (const f of linea) {
        const values = [f.cod_line.toUpperCase(), f.des_line.toUpperCase(), '1', f.id_familia];
        try {
          await this.connectionDB.query(sql, values);
        } catch (error) {
          errors.push(error);
        }
      }

      if (errors.length > 0) {
        reject(errors);
      } else {
        resolve(true);
      }
    });
  }
  update(id: number, linea: UpdateLinea): Promise<boolean> {
    const sql = `UPDATE ${AppConstants.TABLA_LINEA} set cod_line = ?, des_line = ?, family_id_fam = ?  WHERE id_line = ?`;

    const values = [linea.cod_line.toUpperCase(), linea.des_line.toUpperCase(), linea.id_familia, id];
    return new Promise(async (resolve, reject) => {
      try {
        await this.connectionDB.query(sql, values);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
  delete(id: number): Promise<boolean> {
    const sql = `UPDATE  ${AppConstants.TABLA_LINEA} set status_line = 0 WHERE id_line = ? `;
    const values = [id];
    return new Promise(async (resolve, reject) => {
      try {
        await this.connectionDB.query(sql, values);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
  async validateDuplicados(family: CreateLinea[]) {
    const sql = `select * from ${AppConstants.TABLA_LINEA} where cod_line = ? limit 1`;
    const errors = [];

    for (const item of family) {
      const values = [item.cod_line];

      try {
        const result = await this.connectionDB.query(sql, values);

        if (result[0].length > 0) {
          const error = {
            mensaje: `La Linea: ${item.cod_line.toUpperCase()} - ${item.des_line.toUpperCase()} ya se encuentra registada`,
          };
          errors.push(error);
        }
      } catch (error) {
        console.error(`Error en la consulta SQL para ${item.cod_line}`, error);
        const errorObj = {
          mensaje: `Error en la consulta SQL para ${item.cod_line}`,
        };
        errors.push(errorObj);
      }
    }

    if (errors.length > 0) {
      return errors;
    } else {
      return [];
    }
  }
}
