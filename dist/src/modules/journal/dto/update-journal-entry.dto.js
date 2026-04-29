"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateJournalEntryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_journal_entry_dto_1 = require("./create-journal-entry.dto");
class UpdateJournalEntryDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_journal_entry_dto_1.CreateJournalEntryDto, ['contentId'])) {
}
exports.UpdateJournalEntryDto = UpdateJournalEntryDto;
//# sourceMappingURL=update-journal-entry.dto.js.map