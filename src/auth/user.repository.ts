import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialDto: AuthCredentialsDto): Promise<void> {
        let {username, password} = authCredentialDto

        let user = new User()
        user.username = username
        user.salt = await bcrypt.genSalt(10)
        user.password = await this.hashPassword(password, user.salt)

        try {
            await user.save()
        } catch (error) {
            if(error.code === '23505') {
                throw new ConflictException('Username already exists')
            } else {
                throw new InternalServerErrorException()
            }
               
        }
    }

    async validateUserPassword(authCredentialDto: AuthCredentialsDto): Promise<string> {
        const { username, password} = authCredentialDto
        const user = await this.findOne({username})
        
        if((user)&&(await this.validatePassword(password, user.password))) {
            return user.username
        } else { 
            return null
        }
    }

    private async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt)
    } 

    private async validatePassword(password: string, userPassword: string): Promise<boolean> {
        const hash = await bcrypt.compare(password, userPassword)
        return hash
    }
}