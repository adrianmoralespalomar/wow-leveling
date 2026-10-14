import { CharacterExport } from './character-export.interface';

export type CharacterParseResult = { character: CharacterExport; error: null } | { character: null; error: string };
