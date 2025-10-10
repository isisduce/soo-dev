import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { TemplateEntity } from "../../entities/template.entity";

export default class CreateDevelopmentSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const userFactory = factoryManager.get(TemplateEntity);
        await userFactory.saveMany(5);
    }
}
