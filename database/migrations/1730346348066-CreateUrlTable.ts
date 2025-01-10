import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUrlTable1730346348066 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "url" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NULL,
                "url_origin" character varying(255) NOT NULL,
                "url_id" character varying(255) NOT NULL,
                "url_short" character varying(255) NOT NULL,
                "expires_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_at" TIMESTAMP NOT NULL,
                CONSTRAINT "UQ_1c6d9c4b7b5d4b6d9c4b7b5d4b6" UNIQUE ("url_id"),
                CONSTRAINT "PK_1c6d9c4b7b5d4b6d9c4b7b5d4b6 PRIMARY KEY ("id")
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "url";`);
    }

}
