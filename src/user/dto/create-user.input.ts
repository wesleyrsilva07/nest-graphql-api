import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsEmail } from "class-validator";

@InputType()
export class CreateUserInput{
    @IsString()
    @IsNotEmpty({message: "Invalid characters"})
    name: string;

    @IsEmail()
    @IsNotEmpty({message: "Invalid e-mail"})
    email: string;

    @IsString()
    @IsNotEmpty({message: "Password is required"})
    password: string;
}