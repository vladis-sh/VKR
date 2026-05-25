import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import {
  ContentAdminController,
  LiveCodingController,
  RoadmapsController,
  TestCatalogController,
} from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    RoadmapsController,
    LiveCodingController,
    TestCatalogController,
    ContentAdminController,
  ],
  providers: [ContentService],
})
export class ContentModule {}
