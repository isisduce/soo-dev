import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { TemplateEntity } from "../../../database/entities/template.entity";

@Injectable()
export class TemplateService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        @InjectRepository(TemplateEntity) private readonly commonRepository: Repository<TemplateEntity>,
    ) { }

    // async getTables(): Promise<ReadTemplateDto[]> {
    //     return this.commonRepository
    //         .createQueryBuilder("common")
    //         .select(["DISTINCT template_id"])
    //         .getRawMany();
    // }

    async getTables(): Promise<string[]> {
        // PostgreSQL 기준, 다른 DB는 쿼리 수정 필요
        const result = await this.dataSource.query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"
        );
        return result.map((row: any) => row.table_name);
    }

}
