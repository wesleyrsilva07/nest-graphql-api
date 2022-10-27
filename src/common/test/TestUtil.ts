import { User } from "../../user/user.entity";


export default class TestUtil{
    static giveAMeAValidUser(): User{
        const user = new User();
        user.email = 'valid@gmail.com';
        user.name = 'Teste do nome';
        user.id = '1';
        user.password = '123456'
        return user;
    }
}