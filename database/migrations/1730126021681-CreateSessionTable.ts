import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSessionTable1730126021681 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "session" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "refreshToken" character varying(255) NOT NULL,
                "ipAddress" character varying(255) NOT NULL,
                "userAgent" character varying(255) NOT NULL,
                "loginAt" TIMESTAMP NOT NULL DEFAULT now(),
                "lastActiveAt" TIMESTAMP NOT NULL DEFAULT now(),
                "expireAt" TIMESTAMP NOT NULL,
                CONSTRAINT "PK_f55e7376b9b531a1c7f3d6a4e91" PRIMARY KEY ("id")
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "session";`);
    }

}
