// Los vendedores de reputación y de honor de los campos de batalla salen en los datos como "Vendor" de una zona.
// Aquí se convierten en procedencia JcJ con su facción, para no recomendar a la Horda recompensas de la Alianza.

const ARATHI_ALLIANCE_NAMES = /^(Highlander's|Talisman of Arathor|Cloak of the Honor Guard|Sageclaw)/;
const ARATHI_ALLIANCE_ITEM_IDS = [20069]; // Ironbark Staff: hay una copia por facción
const ALTERAC_ALLIANCE_NAMES = /^(Stormpike|Don Rodrigo's|Gnoll Skin Bandolier|Electrified Dagger)/;
const ALTERAC_HORDE_NAMES = /^(Frostwolf|Don Julio's|Harpy Hide Quiver|Glacial Blade)/;

/** Reputación o rango de honor que vende cada objeto, según la zona del vendedor y el nombre. */
function findPvpVendor(itemId, itemName, place) {
  if (place === 'The Barrens') return { faction: 'horde', label: 'Warsong Outriders', place: 'Warsong Gulch' };
  if (place === 'Ashenvale') return { faction: 'alliance', label: 'Silverwing Sentinels', place: 'Warsong Gulch' };
  if (place === 'Arathi Highlands') {
    return ARATHI_ALLIANCE_NAMES.test(itemName) || ARATHI_ALLIANCE_ITEM_IDS.includes(itemId)
      ? { faction: 'alliance', label: 'The League of Arathor', place: 'Arathi Basin' }
      : { faction: 'horde', label: 'The Defilers', place: 'Arathi Basin' };
  }
  if (place === 'Alterac Mountains') {
    if (ALTERAC_ALLIANCE_NAMES.test(itemName)) return { faction: 'alliance', label: 'Stormpike Guard', place: 'Alterac Valley' };
    if (ALTERAC_HORDE_NAMES.test(itemName)) return { faction: 'horde', label: 'Frostwolf Clan', place: 'Alterac Valley' };
    return { faction: 'both', label: 'Frostwolf Clan o Stormpike Guard', place: 'Alterac Valley' };
  }
  if (place === 'Orgrimmar') return { faction: 'horde', label: 'Rango de honor', place: 'Orgrimmar' };
  if (place === 'Stormwind City') return { faction: 'alliance', label: 'Rango de honor', place: 'Stormwind City' };
  return null;
}

export function applyPvpVendorSource(itemId, itemName, source) {
  if (source?.kind !== 'vendor') return source;
  const pvpVendor = findPvpVendor(itemId, itemName, source.place);
  return pvpVendor ? { ...source, kind: 'pvp', ...pvpVendor } : source;
}
