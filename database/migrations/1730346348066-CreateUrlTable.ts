import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUrlTable1730346348066 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "url" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "url" character varying(255) NOT NULL,
                "urlId" character varying(255) NOT NULL,
                "expiresAt" TIMESTAMP NOT NULL DEFAULT now(),
                "createdAt" TIMESTAMP NOT NULL,
                CONSTRAINT "UQ_1c6d9c4b7b5d4b6d9c4b7b5d4b6" UNIQUE ("urlId"),
                CONSTRAINT "PK_1c6d9c4b7b5d4b6d9c4b7b5d4b6 PRIMARY KEY ("id")
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "url";`);
    }

}
