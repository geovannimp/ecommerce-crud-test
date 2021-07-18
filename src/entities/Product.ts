import { BaseEntity, Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column()
    price!: number;

    @Column()
    userId!: number

    @Column({ nullable: true })
    publishedAt?: Date | null

    @DeleteDateColumn()
    deletedAt?: Date;
}
