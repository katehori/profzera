const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');

const config = new DocumentBuilder()
  .setTitle('Documentação das APIs do ProfZera backend')
  .setDescription(`
    API completa para gestão de posts acadêmicos.
    - Rotas públicas: Listagem e leitura de posts
    - Rotas protegidas: Criação/edição (somente para professores, requer autenticação)
  `)
  .setVersion('1.0')
  .addTag('post')
  .build();

const document = SwaggerModule.createDocument(app, config)
SwaggerModule.setup('api', document)