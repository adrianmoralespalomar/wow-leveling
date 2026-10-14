export const STORAGE_KEYS = {
  LEVEL: 'rastro.level',
  TALENT_BUILD_ID: 'rastro.talentBuildId',
  PVP_TALENT_BUILD_ID: 'rastro.pvpTalentBuildId',
  GAME_MODE: 'rastro.gameMode',
  INCLUDE_RANDOM_DROPS: 'rastro.includeRandomDrops',
  CHARACTER_EXPORT: 'rastro.characterExport',
  PET_FAMILY_NAME: 'rastro.petFamilyName',
  /** sessionStorage: refresco de datos en curso cuando ng serve recarga la página. */
  PENDING_DATA_REFRESH: 'rastro.pendingDataRefresh',
} as const;
