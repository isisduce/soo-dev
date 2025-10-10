import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationsSample implements MigrationInterface {
    name = 'MigrationsSample'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE tb_templates (
                template_id     SERIAL          NOT NULL
            ,   name            VARCHAR(200)    NOT NULL
            ,   description     VARCHAR(500)    NOT NULL
            ,   CONSTRAINT tb_templates_pk      PRIMARY KEY (template_id)
            );
            COMMENT ON COLUMN tb_templates.template_id  IS 'Template ID';
            COMMENT ON COLUMN tb_templates.name         IS 'Template Name';
            COMMENT ON COLUMN tb_templates.description  IS 'Template Description';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE tb_templates`);
    }

}
