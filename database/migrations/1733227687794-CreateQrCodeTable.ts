  import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQrCodeTable1733227687794 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "qr_code" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" enum('text', 'url', 'email', 'whatsapp', 'wifi', 'social media') NOT NULL,
                "payload" character varying(255) NOT NULL,
                "qr_code" character varying(255) NOT NULL,
                "created_at" TIMESTAMP NOT NULL,
                CONSTRAINT "PK_1c6d9c4b7b5d4b6d9c4b7b5d4b6" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "qr_code";`);
    }

}
