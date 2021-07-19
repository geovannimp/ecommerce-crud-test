import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductPhoto extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    productId!: string;

    @Column()
    url!: string;

    @Column()
    fileName!: string;

}
