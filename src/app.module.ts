import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FamilyModule } from './family/family.module';
import { LineaModule } from './linea/linea.module';
import { GroupModule } from './group/group.module';
import {ConfigModule} from "@nestjs/config"
import { DatabaseModule } from './database/database.module';
import { enviroments } from './enviroments';
import { AdminModule } from './admin/admin.module';
import config from './config';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [
    FamilyModule,
    LineaModule, 
    GroupModule,
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env', // obtengo el archivo ambiente,
      load: [config],
      isGlobal: true
    }),
    DatabaseModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService,  {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  }],
})
export class AppModule {}
