

export class UserDto {
    id_user: number;
    us_username: string;
    us_full_name:string;
    role_idrole: number;
    us_fec_regis: Date;
    constructor(partial: Partial<UserDto>) {
        Object.assign(this, partial);
    }
}
