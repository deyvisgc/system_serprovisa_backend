import { Inject, Injectable } from "@nestjs/common";
import { AppConstants } from "src/util/Constantes.enum";
import * as mysql from 'mysql2';
import { Users } from "../entities/users.entity";
import { RoleRepositoryInterface } from "./role.repository.interface";
import { Role } from "../entities/role.entity";
@Injectable()
export class RoleRepositoryImplement implements RoleRepositoryInterface {
    constructor( @Inject(AppConstants.provideConnection) private connectionDB: mysql.Pool) {}
    findAll(): Promise<Role[]> {
        const sql = `SELECT * FROM  ${AppConstants.TABLA_ROLE} order by id_role`
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.connectionDB.query(sql);
                resolve(res[0]);
              } catch (error) {
                reject(error);
            }
        });
    }
    
}