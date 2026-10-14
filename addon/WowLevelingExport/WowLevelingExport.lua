-- WowLevelingExport: genera un texto con tu personaje para pegarlo en la página "Mi personaje" de Rastro.
-- Formato (debe coincidir con src/app/models/character-export-format.const.ts):
-- WLE1^nombre^raza^clase^nivel^xp^xpSiguienteNivel^xpDescanso^zona^familiaMascota^nivelMascota^objetos^talentos
-- objetos: ranura:idObjeto:idEncantamiento:calidad:nombre separados por ~
-- talentos: árbol-fila-columna:rango separados por ,

local EXPORT_PREFIX = "WLE1"
local FIELD_SEPARATOR = "^"
local ITEM_SEPARATOR = "~"
local TALENT_SEPARATOR = ","
local FIRST_EQUIPMENT_SLOT = 1
local LAST_EQUIPMENT_SLOT = 19
local FRAME_NAME = "WowLevelingExportFrame"

-- Quita los caracteres que usa el formato como separadores
local function sanitize(text)
  return (tostring(text or ""):gsub("[%^~|]", ""))
end

local function buildEquipmentField()
  local items = {}
  for slotId = FIRST_EQUIPMENT_SLOT, LAST_EQUIPMENT_SLOT do
    local itemLink = GetInventoryItemLink("player", slotId)
    if itemLink then
      local itemId, enchantId = itemLink:match("item:(%d+):(%d*)")
      local itemName = itemLink:match("%[(.-)%]")
      local quality = GetInventoryItemQuality("player", slotId) or 1
      table.insert(items, table.concat({ slotId, itemId, enchantId ~= "" and enchantId or 0, quality, sanitize(itemName) }, ":"))
    end
  end
  return table.concat(items, ITEM_SEPARATOR)
end

local function buildTalentsField()
  local talents = {}
  for tabIndex = 1, GetNumTalentTabs() do
    for talentIndex = 1, GetNumTalents(tabIndex) do
      local name, _, tier, column, rank = GetTalentInfo(tabIndex, talentIndex)
      if name and rank and rank > 0 then
        table.insert(talents, string.format("%d-%d-%d:%d", tabIndex - 1, tier, column, rank))
      end
    end
  end
  return table.concat(talents, TALENT_SEPARATOR)
end

local function buildExportText()
  local _, raceToken = UnitRace("player")
  local _, classToken = UnitClass("player")
  local hasPet = UnitExists("pet")
  local fields = {
    EXPORT_PREFIX,
    sanitize(UnitName("player")),
    raceToken,
    classToken,
    UnitLevel("player"),
    UnitXP("player"),
    UnitXPMax("player"),
    GetXPExhaustion() or 0,
    sanitize(GetZoneText()),
    hasPet and sanitize(UnitCreatureFamily("pet")) or "",
    hasPet and UnitLevel("pet") or 0,
    buildEquipmentField(),
    buildTalentsField(),
  }
  return table.concat(fields, FIELD_SEPARATOR)
end

local exportFrame

local function createExportFrame()
  local frame = CreateFrame("Frame", FRAME_NAME, UIParent, "BasicFrameTemplateWithInset")
  frame:SetSize(520, 220)
  frame:SetPoint("CENTER")
  frame:SetFrameStrata("DIALOG")
  frame:SetMovable(true)
  frame:EnableMouse(true)
  frame:RegisterForDrag("LeftButton")
  frame:SetScript("OnDragStart", frame.StartMoving)
  frame:SetScript("OnDragStop", frame.StopMovingOrSizing)

  local title = frame:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
  title:SetPoint("TOP", 0, -6)
  title:SetText("Exportar personaje para Rastro")

  local hint = frame:CreateFontString(nil, "OVERLAY", "GameFontNormalSmall")
  hint:SetPoint("BOTTOM", 0, 14)
  hint:SetText("Pulsa Ctrl+C y pégalo en la página Mi personaje")

  local scrollFrame = CreateFrame("ScrollFrame", nil, frame, "UIPanelScrollFrameTemplate")
  scrollFrame:SetPoint("TOPLEFT", 14, -32)
  scrollFrame:SetPoint("BOTTOMRIGHT", -34, 36)

  local editBox = CreateFrame("EditBox", nil, scrollFrame)
  editBox:SetMultiLine(true)
  editBox:SetFontObject(ChatFontNormal)
  editBox:SetWidth(460)
  editBox:SetAutoFocus(true)
  editBox:SetScript("OnEscapePressed", function() frame:Hide() end)
  -- Si se escribe sin querer, se restaura el texto para no copiar algo roto
  editBox:SetScript("OnTextChanged", function(self, isUserInput)
    if isUserInput then
      self:SetText(frame.exportText)
      self:HighlightText()
    end
  end)
  scrollFrame:SetScrollChild(editBox)

  frame.editBox = editBox
  table.insert(UISpecialFrames, FRAME_NAME)
  return frame
end

local function showExportFrame()
  exportFrame = exportFrame or createExportFrame()
  exportFrame.exportText = buildExportText()
  exportFrame.editBox:SetText(exportFrame.exportText)
  exportFrame:Show()
  exportFrame.editBox:SetFocus()
  exportFrame.editBox:HighlightText()
end

SLASH_WOWLEVELINGEXPORT1 = "/exportpj"
SLASH_WOWLEVELINGEXPORT2 = "/wle"
SlashCmdList.WOWLEVELINGEXPORT = showExportFrame
