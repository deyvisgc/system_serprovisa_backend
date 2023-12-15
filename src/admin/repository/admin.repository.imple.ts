import { Inject, Injectable } from "@nestjs/common";
import { AppConstants } from "src/util/Constantes.enum";
import * as mysql from 'mysql2';
import { AdminRepositoryInterface } from "./admin.repository.interface";
import { Users } from "../entities/users.entity";
import { RegisterAdminDto, UpdateAdminDto } from "../dtos/register.dtos";
@Injectable()
export class AdminRepositoryImplement implements AdminRepositoryInterface {
    constructor( @Inject(AppConstants.provideConnection) private connectionDB: mysql.Pool) {}

    findByEmail(email: string): Promise<Users> {
        const sql = `SELECT * FROM ${AppConstants.TABLA_USERS} where us_username = ?` ;
        const values = [email];
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.connectionDB.query(sql, values);
                resolve(res[0][0] as Users);
              } catch (error) {
                reject(error);
            }
        });
    }
    findAll(limit: number, offset: number, page: number): Promise<any> {
        offset = (page - 1) * limit;
        let sql = `SELECT us.id_user, us.us_username, us.us_full_name, us.us_fec_regis, ro.ro_name FROM ${AppConstants.TABLA_USERS} 
        as us inner join ${AppConstants.TABLA_ROLE} as ro on us.role_idrole = ro.id_role
        and ro.ro_name <> "Super Admin"
        order by id_user desc limit ${limit} offset ${offset}`
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.connectionDB.query(sql);
                sql = `SELECT count(*) as count FROM ${AppConstants.TABLA_USERS} as us inner join ${AppConstants.TABLA_ROLE} as ro on us.role_idrole = ro.id_role`
                const count = await this.connectionDB.query(sql);
                const result = {
                    limit: +limit,
                    offset,
                    totalRegistros: count && count[0].length > 0 ? count[0][0].count: 0,
                    registros: res[0]
                }
                resolve(result);
              } catch (error) {
                reject(error);
            }
        });
    }
    findById(id: number): Promise<Users> {
        const sql = `SELECT id_user, us_username, us_full_name, role_idrole  FROM ${AppConstants.TABLA_USERS}  where id_user = ?` ;
        const values = [id];
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.connectionDB.query(sql, values);
                resolve(res[0][0] as Users);
              } catch (error) {
                reject(error);
            }
        });
    }
    async create(user: RegisterAdminDto): Promise<boolean> {
        const sql = `INSERT INTO ${AppConstants.TABLA_USERS} (us_username, us_password, us_full_name, role_idrole, us_fec_regis) VALUES (?, ?, ?, ?, ?)` ;

        return new Promise(async (resolve, reject) => {
            try {
                const values = [user.email, user.password, user.name, user.id_rol, new Date()];
                 await this.connectionDB.query(sql, values);
                resolve(true)
              } catch (error) {
                reject(error)
            }
        });
    }
    update(id: number, user: UpdateAdminDto): Promise<boolean> {
        const sql = `UPDATE ${AppConstants.TABLA_USERS} set us_username = ?, us_full_name = ?, role_idrole = ? WHERE id_user = ?` ;
        const values = [user.email, user.name, user.id_rol, id];
        return new Promise(async (resolve, reject) => {
            try {
                await this.connectionDB.query(sql, values);
                resolve(true)
              } catch (error) {
                reject(error)
            }
        });
    }
    delete(id: number): Promise<boolean> {
        const sql = `DELETE FROM ${AppConstants.TABLA_USERS} WHERE id_user = ?` ;
        const values = [id];
        return new Promise(async (resolve, reject) => {
            try {
                await this.connectionDB.query(sql, values);
                resolve(true)
              } catch (error) {
                reject(error)
            }
        });
    }
    getCountDashboard(): Promise<any> {
        const sqlFamily = `SELECT count(*) as total FROM ${AppConstants.TABLA_FAMILIA} where status_fam = 1` ;
        const sqlLinea = `SELECT count(*) as total FROM ${AppConstants.TABLA_LINEA} where status_line = 1` ;
        const sqlGrupo = `SELECT count(*) as total FROM ${AppConstants.TABLA_GRUPO} where status_gru = 1` ;
        const sqlProducto = `SELECT count(*) as total FROM ${AppConstants.TABLA_PRODUCTO} where status_product = 1` ;
        return new Promise(async (resolve, reject) => {
            try {
                const resFamili = await this.connectionDB.query(sqlFamily);
                const resLinea = await this.connectionDB.query(sqlLinea);
                const resGrupo = await this.connectionDB.query(sqlGrupo);
                const resProducto = await this.connectionDB.query(sqlProducto);
                const result = {
                    total_familia: resFamili && resFamili[0].length > 0 ? resFamili[0][0].total: 0,
                    total_linea: resLinea && resLinea[0].length > 0 ? resLinea[0][0].total: 0,
                    total_grupo: resGrupo && resGrupo[0].length > 0 ? resGrupo[0][0].total: 0,
                    total_producto: resProducto && resProducto[0].length > 0 ? resProducto[0][0].total: 0,
                }
                resolve(result);
              } catch (error) {
                reject(error);
            }
        });
    }
    
}