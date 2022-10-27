import { Field, ObjectType, ID, HideField } from "@nestjs/graphql";
import { hashPasswordTransform } from "../common/helpers/crypto";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@ObjectType()
@Entity()
export class User{

    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({
        transformer: hashPasswordTransform,
    })
    @HideField()
    password: string;

}