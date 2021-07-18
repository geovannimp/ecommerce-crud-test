import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EmailQueue extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    to!: string;

    @Column({ type: 'text' })
    body!: string;

    @Column({ default: false })
    isSent!: boolean;
}
