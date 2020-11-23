import { ConflictException, InternalServerErrorException } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { User } from "./user.entity"
import { UserRepository } from "./user.repository"

const mockCredentialDto = {
    username: 'test_user1',
    password: 'test_password'
}

describe('UserRepository', () => {
    let userRepository

    beforeEach( async () => {
        const module = await Test.createTestingModule({
            providers: [
                 UserRepository
            ]
        }).compile()

        userRepository = await module.get<UserRepository>(UserRepository)
    })

    describe('signUp', () => {
        let save

        beforeEach( () => {
            save = jest.fn(),
            userRepository.create = jest.fn().mockReturnValue({ save })
            
        })

        it('successfully signup user', () => {
            save.mockReturnValue(undefined)
            expect(userRepository.signUp(mockCredentialDto)).resolves.not.toThrow()
        })

        it('throw a conflict exception username already exist', () => {
            save.mockRejectedValue( {code : '23505' })
            expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(ConflictException)
        })

        it('throw a conflict exception username already exist', () => {
            save.mockRejectedValue( {code : '123213213' })
            expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(InternalServerErrorException)
        })
    })

    describe('validate password', () => {
        let user

        beforeEach( () => {
            userRepository.findOne = jest.fn()
            user = new User()
            user.username = 'testUser',
            user.validatePassword = jest.fn()
        })

        it('return username as validate success', async () => {
            userRepository.findOne.mockResolvedValue(user) 
            user.validatePassword.mockResolvedValue(true)
            const result = await userRepository.validateUserPassword(mockCredentialDto)
            expect(result).toEqual('testUser')
        })

        it('return null when user not found', async () => {
            userRepository.findOne.mockResolvedValue(null) 
            const result = await userRepository.validateUserPassword(mockCredentialDto)
            expect(user.validatePassword).not.toHaveBeenCalled
            expect(result).toBeNull()
        })

        it('return null when user is invalid', async () => {
            userRepository.findOne.mockResolvedValue(user)
            user.validatePassword.mockResolvedValue(false)
            const result = await userRepository.validateUserPassword(mockCredentialDto)
            expect(result).toBeNull()
        })
    })
})