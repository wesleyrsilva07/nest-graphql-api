import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from '../common/test/TestUtil';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () =>{
    let service: UserService;

    const mockRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService,
            {
                provide: getRepositoryToken(User),
                useValue: mockRepository,
            },
        ],
        }).compile();
        service = module.get<UserService>(UserService);
    });
    beforeEach(() => {
        mockRepository.find.mockReset();
        mockRepository.findOne.mockReset();
        mockRepository.create.mockReset();
        mockRepository.save.mockReset();
        mockRepository.update.mockReset();
        mockRepository.delete.mockReset();
    })

    it('shold be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAllUsers', () => {
        it('shoulld be list all users', async() =>{
            const user = TestUtil.giveAMeAValidUser();
            mockRepository.find.mockReturnValue([user, user]);
            const users = await service.findAllUsers();
            expect(users).toHaveLength(2);
            expect(mockRepository.find).toHaveBeenCalledTimes(1);
        });
    });

    describe('findUserById', () => {
        it('shoulld find a existing user', async() =>{
            const user = TestUtil.giveAMeAValidUser();
            mockRepository.findOne.mockReturnValue(user);
            const userFound = await service.findUserById('1');
            expect(userFound).toMatchObject({name: user.name})
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
        });
        it('should not find a existing user and return a exception', async () => {
            mockRepository.findOne.mockReturnValue(null);
            expect(await service.findUserById('3')).rejects.toBeInstanceOf(NotFoundException);
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
        })
    });

    describe('findUserByEmail', () => {
        it('shoulld find a existing user', async() =>{
            const user = TestUtil.giveAMeAValidUser();
            mockRepository.findOne.mockReturnValue(user);
            const userFound = await service.findUserByEmail('a@gmail.com');
            expect(userFound).toMatchObject({name: user.name})
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
        });
        it('should not find a existing user and return a exception', async () => {
            mockRepository.findOne.mockReturnValue(null);
            expect(await service.findUserByEmail("b@gmail.com")).rejects.toBeInstanceOf(NotFoundException);
            expect(mockRepository.findOne).toEqual(User);
        })
    });

    describe('create user', () => {
        it('should create a user',async () => {
            const user = TestUtil.giveAMeAValidUser();
            mockRepository.save.mockReturnValue(user);
            mockRepository.create.mockResolvedValue(user);
            const savedUSer = await service.createUser(user);
            expect(savedUSer).toMatchObject(user);
            expect(mockRepository.create).toBeCalledTimes(1);
            expect(mockRepository.save).toBeCalledTimes(1);
        })
    
        it('should return a exception when doesnt create a user', async () => {
            const user = TestUtil.giveAMeAValidUser();
            mockRepository.save.mockReturnValue(null);
            mockRepository.create.mockResolvedValue(user);

            await service.createUser(user).catch(e => {
                expect(e).toBeInstanceOf(InternalServerErrorException);
                expect(e).toMatchObject({
                    message: 'Problem to create a user. Try again',
                });
            });
            expect(mockRepository.create).toBeCalledTimes(1);
            expect(mockRepository.save).toBeCalledTimes(1);
        });
    });

    describe('updateUser', () => {
        it('should update a user', async () => {
            const user = TestUtil.giveAMeAValidUser();
            const updatedUser = {name: "Nome atualizado"};
            mockRepository.findOne.mockReturnValue(user);
            mockRepository.update.mockReturnValue({
                ...user,
                ...updatedUser,
            });
            mockRepository.create.mockReturnValue({
                ...user,
                ...updatedUser,
            });

            const resultUser = await service.updateUser('1', {
                ...user,
                name: 'Nome atualizado'
            });
            expect(resultUser).toMatchObject(updatedUser);
            expect(mockRepository.create).toBeCalledTimes(1);
            expect(mockRepository.findOne).toBeCalledTimes(1);
            expect(mockRepository.update).toBeCalledTimes(1);
        });
    });

    describe('deteleUser', () => {
        it('should delete a exinting user', async () => {
            const user = TestUtil.giveAMeAValidUser();
            mockRepository.delete.mockReturnValue(user);
            mockRepository.findOne.mockReturnValue(user);
            const deletedUSer = await service.deleteUser('1');
            expect(deletedUSer).toBe(true);
            expect(mockRepository.findOne).toBeCalledTimes(1);
            expect(mockRepository.delete).toBeCalledTimes(1);
        });
        it('should delete a inexinting user', async () => {
            const user = TestUtil.giveAMeAValidUser();
            mockRepository.delete.mockReturnValue(null);
            mockRepository.findOne.mockReturnValue(user);
            const deletedUSer = await service.deleteUser('5');
            expect(deletedUSer).toBe(false);
            expect(mockRepository.findOne).toBeCalledTimes(1);
            expect(mockRepository.delete).toBeCalledTimes(1);
        })
    });

})