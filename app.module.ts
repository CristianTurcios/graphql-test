import { Module } from '@nestjs/common';
import { PasswordCardsController } from './password-cards.controller';
import { PasswordCardsService } from './password-cards.service';
import { PASSWORD_DATA, PASSWORD_DATA_TOKEN } from "./data/password-data";

@Module({
    imports: [],
    controllers: [PasswordCardsController],
    providers: [
        /** Use a token for initial password cards to facilitate consistency is tests.
         * Cannot be used when using a database
         * */
        {provide: PASSWORD_DATA_TOKEN, useValue: PASSWORD_DATA},
        PasswordCardsService,
    ],
})
export class AppModule {}
