import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSessionTable1730126021681 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "session" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "refresh_token" character varying(255) NOT NULL,
                "ip_address" character varying(255) NOT NULL,
                "user_agent" character varying(255) NOT NULL,
                "login_at" TIMESTAMP NOT NULL DEFAULT now(),
                "last_active_at" TIMESTAMP NOT NULL DEFAULT now(),
                "expires_at" TIMESTAMP NOT NULL,
                CONSTRAINT "UQ_2a5b9b2b9b5d4b6d9c4b7b5d4b6" UNIQUE ("refresh_token"),
                CONSTRAINT "PK_f55e7376b9b531a1c7f3d6a4e91" PRIMARY KEY ("id")
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "session";`);
    }

}
