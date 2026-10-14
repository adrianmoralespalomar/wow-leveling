/**
 * Formato del texto que genera el addon WowLevelingExport (/exportpj):
 * WLE1^nombre^raza^clase^nivel^xp^xpSiguienteNivel^xpDescanso^zona^familiaMascota^nivelMascota^objetos^talentos
 * objetos: ranura:idObjeto:idEncantamiento:calidad:nombre separados por ~
 * talentos: árbol-fila-columna:rango separados por ,
 */
export const CHARACTER_EXPORT_PREFIX = 'WLE1';
export const CHARACTER_EXPORT_FIELD_SEPARATOR = '^';
export const CHARACTER_EXPORT_FIELD_COUNT = 13;
export const CHARACTER_EXPORT_ITEM_SEPARATOR = '~';
export const CHARACTER_EXPORT_TALENT_SEPARATOR = ',';
