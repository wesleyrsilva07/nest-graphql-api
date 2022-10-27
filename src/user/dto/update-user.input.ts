
import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsUUID } from "class-validator";

@InputType()
export class UpdateUserInput{
    @IsString()
    @IsOptional()
    @IsUUID()
    id?:string;
    

    @IsString()
    @IsNotEmpty({message: "Invalid characters"})
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsNotEmpty({message: "Invalid e-mail"})
    @IsOptional()
    email?: string;

    @IsString()
    @IsNotEmpty({message: "Password is required"})
    @IsOptional()
    password?: string;
}