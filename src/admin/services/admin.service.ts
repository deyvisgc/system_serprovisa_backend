import {  ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AdminRepositoryImplement } from '../repository/admin.repository.imple';
import { Users } from '../entities/users.entity';
import { Response } from 'src/response/response';
import { compareHash, generateHash } from 'src/util/handleBcrypt';
import { Login } from '../dtos/auth.dtos';
import { JwtService } from '@nestjs/jwt';
import { RegisterAdminDto, UpdateAdminDto } from '../dtos/register.dtos';
import { RoleRepositoryImplement } from '../repository/role.repository.imple';

@Injectable()
export class AdminService {
    constructor(private adminRepository: AdminRepositoryImplement, private jwtService: JwtService, private roleService: RoleRepositoryImplement) {}
    async findAll(limit: number, offset: number, page: number): Promise<Users[]> {
        return this.adminRepository.findAll(limit, offset, page)
    }
    async getCountDashboard(): Promise<any[]> {
        return this.adminRepository.getCountDashboard()
    }
    
    async findById(id: number): Promise<Users> {
        const users = await this.adminRepository.findById(id);
        if (!users) {
            throw new NotFoundException("Error", "El usuario no existe");
        }
        return users
    }

    async create(userBody: RegisterAdminDto): Promise<Response> {
        let res = new Response()
        try {
            const { password, ...user } = userBody;
            console.log(password)
            const userParse = {
                ...user,
                password: await generateHash(password),
            };
             await this.adminRepository.create(userParse)
             res.cod = 200
             res.message = `!Usuario creado exitosamente!`
             res.status = true
            return res;
        }catch (err) {
            console.log(err)
            if (err.message.includes("Duplicate entry")) {
                throw new ConflictException("Error", `Email ${userBody.email} ya existe`);
            }
            throw new InternalServerErrorException("Error", err.message);
        }
    }

    async login(login: Login): Promise<any> {
        const { email, password } = login;
        const userExist = await this.adminRepository.findByEmail(email);
        if (!userExist) throw new NotFoundException("Error", `El email ${email} no existe`);
        const isCheck = await compareHash(password, userExist.us_password);
        if (!isCheck)  new UnauthorizedException({ message: `La contraseña es incorrecta`});
        const payload = {role: userExist.role_idrole, name: userExist.us_full_name, email: userExist.us_username , id: userExist.id_user}
        return {
            access_token: await this.jwtService.signAsync(payload),
        }
    }
    async update(id: number, users: UpdateAdminDto): Promise<any>  {
        let res = new Response()
        const exist = this.findById(id);
        if (exist) {
            try {
                await this.adminRepository.update(id, users)
                res.cod = 200
                res.message = `!Usuario actualizado exitosamente!`
                res.status = true
                return res;
           }catch (err) {
               if (err.message.includes("Duplicate entry")) {
                return new ConflictException({message: `El email: ${users.email} ya se encuentra registrado`});
               } else {
                   throw new InternalServerErrorException("Error", err.message);
               }
           }
        } else {
            throw new NotFoundException("Error", "El usuario No existe");;
        }
    }
    
    async delete(id: number) {
        try {
            let res = new Response()
            await this.adminRepository.delete(id)
            res.cod = 200
            res.message = `!Usuario Eliminado exitosamente!`
            res.status = true
            return res;
       }catch (err) {
          throw new InternalServerErrorException("Error", err.message);
       }
    }
    async validateUser(username: string): Promise<any> {
        const user = await this.adminRepository.findByEmail(username);
        if (user) {
          const { us_password, ...result } = user;
          return result;
        }
        return null;
    }
    async findRole() {
        return this.roleService.findAll();
    }
}
