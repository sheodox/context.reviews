import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateSettings1604114827039 implements MigrationInterface {
    name = 'CreateSettings1604114827039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "speechSynthesis" boolean NOT NULL, "autoSpeechSynthesis" boolean NOT NULL, "userId" uuid, CONSTRAINT "REL_9175e059b0a720536f7726a88c" UNIQUE ("userId"), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "settings" ADD CONSTRAINT "FK_9175e059b0a720536f7726a88c7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" DROP CONSTRAINT "FK_9175e059b0a720536f7726a88c7"`);
        await queryRunner.query(`DROP TABLE "settings"`);
    }

}
