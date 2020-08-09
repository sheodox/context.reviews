import {MigrationInterface, QueryRunner} from "typeorm";

export class init1596920850378 implements MigrationInterface {
    name = 'init1596920850378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "oauthId" text NOT NULL, "displayName" text NOT NULL, "profileImage" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT timezone('utc', now()), "oauthProvider" character varying(20) NOT NULL, "raw" text NOT NULL, CONSTRAINT "UQ_2e89173fa19a61572ca27aca54e" UNIQUE ("oauthId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "phrases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phrase" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT timezone('utc', now()), "deleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "userId" uuid NOT NULL, CONSTRAINT "PK_f7ffbe7963e64d31d215f4126e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e499462bf68bdfea3f867f186c" ON "phrases" ("userId", "deleted") `);
        await queryRunner.query(`CREATE INDEX "IDX_35ca8e413bbbdfc7a313e0a8bd" ON "phrases" ("userId", "phrase") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_35ca8e413bbbdfc7a313e0a8bd"`);
        await queryRunner.query(`DROP INDEX "IDX_e499462bf68bdfea3f867f186c"`);
        await queryRunner.query(`DROP TABLE "phrases"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
