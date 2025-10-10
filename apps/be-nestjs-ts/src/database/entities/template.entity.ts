import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('template')
export class TemplateEntity {
    @PrimaryGeneratedColumn({ name: 'template_id', type: 'integer', comment: 'TemplateId', }) templateId: number;

    @Column({ name: 'name', type: 'varchar', nullable: false, comment: 'Template Name', })        name: string;
    @Column({ name: 'desc', type: 'varchar', nullable: false, comment: 'Template Description', }) description: string;

}
