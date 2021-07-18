import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateEmailQueueTable1626487382573 implements MigrationInterface {
    name = 'CreateEmailQueueTable1626487382573'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`CREATE TABLE "email_queue" ("id" SERIAL NOT NULL, "to" character varying NOT NULL, "body" text NOT NULL, "isSent" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_b6c031a57087af131ed0176e17c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "email_queue"`);
    }

}
