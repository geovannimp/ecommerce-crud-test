import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateProductPhotoTable1626643089027 implements MigrationInterface {
    name = 'CreateProductPhotoTable1626643089027'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`CREATE TABLE "product_photo" ("id" SERIAL NOT NULL, "productId" character varying NOT NULL, "url" character varying NOT NULL, "fileName" character varying NOT NULL, CONSTRAINT "PK_6c701613676cfa922e429eb1bae" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "publishedAt"`);
    }

}
