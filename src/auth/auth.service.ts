import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService){}
    
    async validateUser(data: AuthInput): Promise<AuthType>{
        console.log("validando");
        const user =  await this.userService.findUserByEmail(data.email);
        console.log(data.password, "Senha no data")
        console.log(user.password, "Senha no user")
        const validPassword = bcrypt.compareSync(data.password, user.password);
        // const validPassword = bcrypt.compareSync("2", "1");
        console.log(validPassword, "Validacao")

        if(!validPassword){
            throw new UnauthorizedException('Incorrect Password');
        }

        const token = await this.jwtToken(user);
        return {
            user, token
        }
    }
    
    private async jwtToken(user: User): Promise<string>{
        const payload = {
            username: user.name,
            sub: user.id 
        };
        
        return this.jwtService.signAsync(payload)
    }
}
