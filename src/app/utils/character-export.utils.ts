import {
  CHARACTER_EXPORT_FIELD_COUNT,
  CHARACTER_EXPORT_FIELD_SEPARATOR,
  CHARACTER_EXPORT_ITEM_SEPARATOR,
  CHARACTER_EXPORT_PREFIX,
  CHARACTER_EXPORT_TALENT_SEPARATOR,
} from '../models/character-export-format.const';
import { CharacterParseResult } from '../models/character-parse-result.type';
import { EquippedItem } from '../models/equipped-item.interface';

export function parseCharacterExport(rawText: string): CharacterParseResult {
  const fields = rawText.trim().split(CHARACTER_EXPORT_FIELD_SEPARATOR);
  if (fields[0] !== CHARACTER_EXPORT_PREFIX)
    return { character: null, error: 'El texto no empieza por WLE1. Cópialo entero desde la ventana de /exportpj.' };
  if (fields.length !== CHARACTER_EXPORT_FIELD_COUNT)
    return { character: null, error: 'Faltan datos: vuelve a copiar el texto completo desde el juego.' };
  const [, name, race, className, level, experience, experienceToLevel, rested, zone, petFamily, petLevel, items, talents] =
    fields;
  return {
    error: null,
    character: {
      name,
      race,
      className,
      level: Number(level),
      experience: Number(experience),
      experienceToLevel: Number(experienceToLevel),
      restedExperience: Number(rested),
      zone,
      pet: petFamily ? { family: petFamily, level: Number(petLevel) } : null,
      equipment: items ? items.split(CHARACTER_EXPORT_ITEM_SEPARATOR).map(parseEquippedItem) : [],
      talentRanks: parseTalentRanks(talents),
    },
  };
}

function parseEquippedItem(rawItem: string): EquippedItem {
  const [slotId, itemId, enchantId, quality, ...nameParts] = rawItem.split(':');
  return {
    slotId: Number(slotId),
    itemId: Number(itemId),
    enchantId: Number(enchantId) || 0,
    quality: Number(quality) || 1,
    name: nameParts.join(':'),
  };
}

function parseTalentRanks(rawTalents: string): Record<string, number> {
  if (!rawTalents) return {};
  return Object.fromEntries(
    rawTalents.split(CHARACTER_EXPORT_TALENT_SEPARATOR).map((rawTalent) => {
      const [talentId, rank] = rawTalent.split(':');
      return [talentId, Number(rank)];
    }),
  );
}
