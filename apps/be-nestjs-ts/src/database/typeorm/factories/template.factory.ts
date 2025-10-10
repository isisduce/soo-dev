import { setSeederFactory } from 'typeorm-extension';
import { TemplateEntity } from "../../entities/template.entity";

export default setSeederFactory(TemplateEntity, (faker) => {
    const template = new TemplateEntity();
    template.templateId = faker.datatype.number({ min: 1, max: 1000 });
    template.name = faker.lorem.words(3);
    template.description = faker.lorem.sentence();
    return template;
});
