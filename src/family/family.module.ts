import { Module } from '@nestjs/common';
import { FamilyService } from './services/family.service';
import { FamilyRepositoryImplement } from './repository/family.repository.imple';
import { FamilyController } from './controllers/family.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [FamilyService, FamilyRepositoryImplement],
  controllers: [FamilyController]
})
export class FamilyModule {}
