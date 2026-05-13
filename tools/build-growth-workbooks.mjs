import fs from 'node:fs/promises';
import path from 'node:path';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const ROOT = '/Users/brandmanager/ashmo/ashmo-website';
const OUTPUT_DIR = path.join(ROOT, 'outputs', '20260419-growth-workbooks');
const PREVIEW_DIR = path.join(OUTPUT_DIR, 'previews');
const PUBLIC_DIR = path.join(ROOT, 'public', 'downloads', 'restaurant-growth');
const TEMPLATE_DATE = '19-Apr-2026';

const COLORS = {
  navy: '#0F172A',
  slate: '#334155',
  blueFill: '#E7F1FF',
  blueLine: '#B7D0F8',
  inputFill: '#FFF4E5',
  inputLine: '#F4C27A',
  greenFill: '#EAFBF3',
  greenLine: '#A7E3C1',
  roseFill: '#FFF1F2',
  roseLine: '#F4C5CB',
  sand: '#F6F1EA',
  canvas: '#F7FAFC',
  panel: '#FFFFFF',
  panelAlt: '#EEF4F8',
  teal: '#0F766E',
  amber: '#F59E0B',
  indigo: '#4F46E5',
  coral: '#EA580C',
  text: '#111827',
  muted: '#52606D',
  white: '#FFFFFF',
  border: '#D9E2EC',
  borderStrong: '#C4D0DD',
};

const FORMATS = {
  currency0: '"AED" #,##0;[Red]-"AED" #,##0',
  currency2: '"AED" #,##0.00;[Red]-"AED" #,##0.00',
  percent0: '0%',
  percent1: '0.0%',
  percent2: '0.00%',
  integer: '#,##0',
  decimal1: '#,##0.0',
  decimal2: '#,##0.00',
  date: 'dd-mmm-yyyy',
};

const STATUS_SOURCE = 'Not started,In progress,Approved,Ready,Live,Complete,Blocked';
const YES_NO_SOURCE = 'Yes,No';
const PRIORITY_SOURCE = 'High,Medium,Low';
const PLATFORM_SOURCE = 'Instagram,Facebook,TikTok,Google,WhatsApp,Email,SMS,Push,In-store,Aggregator,Influencer,PR,OOH';
const CHANNEL_SOURCE = 'Meta,Google Search,Google Maps,TikTok,Email,SMS,WhatsApp,Push,In-store,Flyers,Influencers,Aggregators';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function colLetter(colNumber) {
  let dividend = colNumber;
  let columnName = '';
  while (dividend > 0) {
    const modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    dividend = Math.floor((dividend - modulo) / 26);
  }
  return columnName;
}

function a1(row1, col1, row2 = row1, col2 = col1) {
  return `${colLetter(col1)}${row1}:${colLetter(col2)}${row2}`;
}

function setValues(sheet, row, col, matrix) {
  const rowCount = matrix.length;
  const colCount = matrix[0]?.length ?? 1;
  sheet.getRange(a1(row, col, row + rowCount - 1, col + colCount - 1)).values = matrix;
}

function setFormulas(sheet, row, col, matrix) {
  const rowCount = matrix.length;
  const colCount = matrix[0]?.length ?? 1;
  sheet.getRange(a1(row, col, row + rowCount - 1, col + colCount - 1)).formulas = matrix;
}

function styleRange(sheet, rangeAddress, options = {}) {
  const range = sheet.getRange(rangeAddress);
  if (options.fillColor) range.format.fill.color = options.fillColor;
  if (options.fontColor) range.format.font.color = options.fontColor;
  if (options.bold !== undefined) range.format.font.bold = options.bold;
  if (options.italic !== undefined) range.format.font.italic = options.italic;
  if (options.fontSize) range.format.font.size = options.fontSize;
  if (options.wrapText !== undefined) range.format.wrapText = options.wrapText;
  if (options.hAlign) range.format.horizontalAlignment = options.hAlign;
  if (options.vAlign) range.format.verticalAlignment = options.vAlign;
  if (options.numberFormat) range.setNumberFormat(options.numberFormat);
  if (options.rowHeightPx) range.format.rowHeightPx = options.rowHeightPx;
  if (options.columnWidthPx) range.format.columnWidthPx = options.columnWidthPx;
  return range;
}

function setColumnWidths(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidthPx = width;
  });
}

function applyOutline(range, color = COLORS.border) {
  ['top', 'bottom', 'left', 'right'].forEach((edge) => {
    range.format.borders[edge].style = 'continuous';
    range.format.borders[edge].weight = 1;
    range.format.borders[edge].color = color;
  });
}

function applyGrid(range, color = COLORS.border) {
  ['top', 'bottom', 'left', 'right', 'insideHorizontal', 'insideVertical'].forEach((edge) => {
    range.format.borders[edge].style = 'continuous';
    range.format.borders[edge].weight = 1;
    range.format.borders[edge].color = color;
  });
}

function applyBottomBorder(range, color = COLORS.border) {
  range.format.borders.bottom.style = 'continuous';
  range.format.borders.bottom.weight = 1;
  range.format.borders.bottom.color = color;
}

function paintCanvas(sheet, lastCol = 12, lastRow = 100) {
  sheet.showGridLines = false;
  styleRange(sheet, a1(1, 1, lastRow, lastCol), {
    fillColor: COLORS.canvas,
    fontColor: COLORS.text,
    fontSize: 10,
  });
}

function addSheetTitle(sheet, title, subtitle, lastCol = 9) {
  paintCanvas(sheet, lastCol + 2, 140);
  sheet.getRange(a1(1, 1, 2, lastCol)).merge();
  sheet.getRange('A1').values = [[title]];
  styleRange(sheet, a1(1, 1, 2, lastCol), {
    fillColor: COLORS.navy,
    fontColor: COLORS.white,
    bold: true,
    fontSize: 22,
    wrapText: true,
    vAlign: 'center',
    rowHeightPx: 34,
  });

  sheet.getRange(a1(3, 1, 4, lastCol)).merge();
  sheet.getRange('A3').values = [[subtitle]];
  styleRange(sheet, a1(3, 1, 4, lastCol), {
    fillColor: COLORS.panelAlt,
    fontColor: COLORS.muted,
    fontSize: 10,
    wrapText: true,
    vAlign: 'center',
    rowHeightPx: 26,
  });
  applyOutline(sheet.getRange(a1(1, 1, 4, lastCol)), COLORS.borderStrong);
}

function addDocumentControl(sheet, startRow, fields) {
  setValues(sheet, startRow, 1, [['Document control', '', '', '']]);
  sheet.getRange(a1(startRow, 1, startRow, 4)).merge();
  styleRange(sheet, a1(startRow, 1, startRow, 4), {
    fillColor: COLORS.panelAlt,
    fontColor: COLORS.text,
    bold: true,
    fontSize: 12,
  });
  applyOutline(sheet.getRange(a1(startRow, 1, startRow, 4)), COLORS.borderStrong);

  fields.forEach(([label, value], index) => {
    const row = startRow + 1 + index;
    setValues(sheet, row, 1, [[label, value]]);
    styleRange(sheet, a1(row, 1), { fillColor: COLORS.panel, bold: true, fontSize: 10, fontColor: COLORS.muted });
    styleRange(sheet, a1(row, 2), { fillColor: COLORS.inputFill, fontSize: 10, fontColor: COLORS.text });
    applyGrid(sheet.getRange(a1(row, 1, row, 2)));
  });
}

function addInstructionList(sheet, startRow, title, items, widthCols = 9) {
  sheet.getRange(a1(startRow, 1, startRow, widthCols)).merge();
  setValues(sheet, startRow, 1, [[title]]);
  styleRange(sheet, a1(startRow, 1, startRow, widthCols), {
    fillColor: COLORS.panelAlt,
    fontColor: COLORS.text,
    bold: true,
    fontSize: 12,
  });
  applyOutline(sheet.getRange(a1(startRow, 1, startRow, widthCols)), COLORS.borderStrong);

  items.forEach((item, index) => {
    const row = startRow + 1 + index;
    sheet.getRange(a1(row, 1, row, widthCols)).merge();
    setValues(sheet, row, 1, [[`${index + 1}. ${item}`]]);
    styleRange(sheet, a1(row, 1, row, widthCols), {
      fillColor: COLORS.panel,
      wrapText: true,
      fontSize: 10,
      rowHeightPx: 26,
    });
    applyBottomBorder(sheet.getRange(a1(row, 1, row, widthCols)));
  });
}

function addLegend(sheet, row, col = 1) {
  setValues(sheet, row, col, [
    ['Input cell', 'Starter assumption or editable user entry'],
    ['Formula cell', 'Calculated output - keep these logic cells intact'],
    ['Control note', 'Use this area for assumptions, approvals, and reviewer sign-off'],
  ]);
  styleRange(sheet, a1(row, col, row + 2, col), {
    fillColor: COLORS.inputFill,
    bold: true,
    fontSize: 10,
  });
  styleRange(sheet, a1(row + 1, col), { fillColor: COLORS.blueFill, bold: true, fontSize: 10 });
  styleRange(sheet, a1(row + 2, col), { fillColor: COLORS.greenFill, bold: true, fontSize: 10 });
  styleRange(sheet, a1(row, col + 1, row + 2, col + 1), {
    fillColor: COLORS.panel,
    fontSize: 10,
    wrapText: true,
  });
  applyGrid(sheet.getRange(a1(row, col, row + 2, col + 1)));
}

function styleMetricTable(sheet, overallRange, headerRange, labelRange, valueRange) {
  styleRange(sheet, overallRange, { fillColor: COLORS.panel });
  styleRange(sheet, headerRange, {
    fillColor: COLORS.navy,
    fontColor: COLORS.white,
    bold: true,
    fontSize: 10,
    rowHeightPx: 24,
  });
  styleRange(sheet, labelRange, {
    fillColor: COLORS.panel,
    fontColor: COLORS.muted,
    fontSize: 10,
    rowHeightPx: 30,
  });
  styleRange(sheet, valueRange, {
    fillColor: COLORS.blueFill,
    fontColor: COLORS.text,
    bold: true,
    fontSize: 13,
    hAlign: 'right',
    rowHeightPx: 30,
  });
  applyGrid(sheet.getRange(overallRange), COLORS.borderStrong);
}

function styleCompactTable(sheet, overallRange, headerRange, bodyRange, rightAlignedRanges = []) {
  styleRange(sheet, overallRange, { fillColor: COLORS.panel });
  styleRange(sheet, headerRange, {
    fillColor: COLORS.navy,
    fontColor: COLORS.white,
    bold: true,
    fontSize: 10,
    rowHeightPx: 24,
    wrapText: true,
  });
  styleRange(sheet, bodyRange, {
    fillColor: COLORS.panel,
    fontColor: COLORS.text,
    fontSize: 10,
    rowHeightPx: 26,
    wrapText: true,
  });
  rightAlignedRanges.forEach((rangeAddress) => {
    styleRange(sheet, rangeAddress, { hAlign: 'right' });
  });
  applyGrid(sheet.getRange(overallRange), COLORS.borderStrong);
}

function styleChart(chart, seriesColors = [COLORS.teal, COLORS.amber]) {
  chart.chartArea.format.fill.color = COLORS.panelAlt;
  chart.chartArea.format.line.color = COLORS.borderStrong;
  chart.plotArea.format.fill.color = COLORS.panel;
  chart.plotArea.format.line.color = COLORS.border;
  chart.legend.position = 'bottom';
  chart.legend.textStyle.color = COLORS.muted;
  chart.legend.textStyle.fontSize = 10;
  chart.titleTextStyle.color = COLORS.text;
  chart.titleTextStyle.fontSize = 14;
  chart.titleTextStyle.bold = true;

  const count = Math.min(chart.series.length, seriesColors.length);
  for (let index = 0; index < count; index += 1) {
    const color = seriesColors[index];
    chart.series.getItemAt(index).format.fill.color = color;
    chart.series.getItemAt(index).format.line.color = color;
  }
}

function addSimpleListValidation(sheet, rangeAddress, source) {
  sheet.getRange(rangeAddress).dataValidation = {
    allowBlank: true,
    list: { inCellDropDown: true, source },
  };
}

function addDecimalValidation(sheet, rangeAddress, min = 0, max = 100000000) {
  sheet.getRange(rangeAddress).dataValidation = {
    rule: {
      type: 'decimal',
      operator: 'between',
      formula1: min,
      formula2: max,
    },
    errorAlert: {
      style: 'stop',
      title: 'Invalid value',
      message: `Enter a decimal between ${min} and ${max}.`,
    },
  };
}

function addWholeValidation(sheet, rangeAddress, min = 0, max = 1000000) {
  sheet.getRange(rangeAddress).dataValidation = {
    rule: {
      type: 'whole',
      operator: 'between',
      formula1: min,
      formula2: max,
    },
    errorAlert: {
      style: 'stop',
      title: 'Invalid value',
      message: `Enter a whole number between ${min} and ${max}.`,
    },
  };
}

function buildSetupSheet(wb, { title, subtitle, audience, outcome, focusAreas, relatedTabs }) {
  const sheet = wb.worksheets.add('Setup');
  setColumnWidths(sheet, [220, 260, 220, 220, 220, 220, 220, 220]);
  addSheetTitle(sheet, title, subtitle, 8);
  addDocumentControl(sheet, 6, [
    ['Audience', audience],
    ['Primary outcome', outcome],
    ['Version', '1.0'],
    ['Last updated', TEMPLATE_DATE],
    ['Editable cells', 'Amber cells'],
    ['Review rhythm', 'Weekly during active campaigns, monthly for planning'],
  ]);
  addInstructionList(sheet, 14, 'What this workbook helps you control', focusAreas, 8);
  addLegend(sheet, 14 + focusAreas.length + 3);
  const tabRow = 14 + focusAreas.length + 8;
  setValues(sheet, tabRow, 1, [['Tab', 'Purpose']]);
  setValues(
    sheet,
    tabRow + 1,
    1,
    relatedTabs.map((tab) => [tab.name, tab.purpose]),
  );
  styleCompactTable(
    sheet,
    a1(tabRow, 1, tabRow + relatedTabs.length, 2),
    a1(tabRow, 1, tabRow, 2),
    a1(tabRow + 1, 1, tabRow + relatedTabs.length, 2),
  );
  sheet.freezePanes.freezeRows(4);
  return sheet;
}

function addTableSheet({ wb, name, title, subtitle, columns, rows, instructions = [] }) {
  const sheet = wb.worksheets.add(name);
  setColumnWidths(sheet, columns.map((column) => column.width));
  addSheetTitle(sheet, title, subtitle, columns.length);

  let rowPointer = 6;
  if (instructions.length > 0) {
    addInstructionList(sheet, rowPointer, 'How to use this tab', instructions, Math.min(columns.length, 10));
    rowPointer += instructions.length + 3;
  }

  const headerRow = rowPointer;
  const firstDataRow = headerRow + 1;
  const lastDataRow = firstDataRow + rows.length - 1;
  setValues(sheet, headerRow, 1, [columns.map((column) => column.header)]);
  setValues(sheet, firstDataRow, 1, rows);
  styleCompactTable(
    sheet,
    a1(headerRow, 1, lastDataRow, columns.length),
    a1(headerRow, 1, headerRow, columns.length),
    a1(firstDataRow, 1, lastDataRow, columns.length),
    columns
      .map((column, index) => ({ column, index }))
      .filter(({ column }) => column.align === 'right')
      .map(({ index }) => a1(firstDataRow, index + 1, lastDataRow, index + 1)),
  );

  columns.forEach((column, index) => {
    const colIndex = index + 1;
    const rangeAddress = a1(firstDataRow, colIndex, lastDataRow, colIndex);
    if (column.fill === 'input') {
      styleRange(sheet, rangeAddress, { fillColor: COLORS.inputFill });
    } else if (column.fill === 'formula') {
      styleRange(sheet, rangeAddress, { fillColor: COLORS.blueFill });
    } else if (column.fill === 'good') {
      styleRange(sheet, rangeAddress, { fillColor: COLORS.greenFill });
    }
    if (column.format) {
      styleRange(sheet, rangeAddress, { numberFormat: column.format });
    }
    if (column.validation?.type === 'list') {
      addSimpleListValidation(sheet, rangeAddress, column.validation.source);
    } else if (column.validation?.type === 'whole') {
      addWholeValidation(sheet, rangeAddress, column.validation.min, column.validation.max);
    } else if (column.validation?.type === 'decimal') {
      addDecimalValidation(sheet, rangeAddress, column.validation.min, column.validation.max);
    }
  });

  sheet.freezePanes.freezeRows(headerRow);
  return { sheet, headerRow, firstDataRow, lastDataRow };
}

function addMetricBlock(sheet, startRow, title, metrics) {
  setValues(sheet, startRow, 1, [[title, 'Value']]);
  setValues(
    sheet,
    startRow + 1,
    1,
    metrics.map((metric) => [metric.label, null]),
  );
  metrics.forEach((metric, index) => {
    setFormulas(sheet, startRow + 1 + index, 2, [[metric.formula]]);
    if (metric.format) {
      styleRange(sheet, a1(startRow + 1 + index, 2), { numberFormat: metric.format });
    }
  });
  styleMetricTable(
    sheet,
    a1(startRow, 1, startRow + metrics.length, 2),
    a1(startRow, 1, startRow, 2),
    a1(startRow + 1, 1, startRow + metrics.length, 1),
    a1(startRow + 1, 2, startRow + metrics.length, 2),
  );
}

function buildBrandPositioningBriefWorkbook() {
  const wb = Workbook.create();
  buildSetupSheet(wb, {
    title: 'Restaurant Brand Positioning Brief',
    subtitle:
      'Use this workbook to tighten concept clarity before you spend harder on campaigns, menu launches, or store growth.',
    audience: 'Founders, brand leads, cafe operators, and repositioning teams',
    outcome: 'A clearer strategic narrative, sharper audience logic, and a visible gap between current and desired brand strength.',
    focusAreas: [
      'Define what the brand should be remembered for and which customer it should matter to first.',
      'Stress-test concept clarity across menu, price position, delivery fit, and store experience cues.',
      'Use the scorecard to identify where the brand feels fuzzy before media budgets increase.',
    ],
    relatedTabs: [
      { name: 'Brand_Canvas', purpose: 'Capture the working positioning, proofs, offer cues, and store realities.' },
      { name: 'Audience_Personas', purpose: 'Define the occasions, needs, triggers, and barriers that matter commercially.' },
      { name: 'Scorecard', purpose: 'Score the current and target brand state and make the gap visible for leadership.' },
    ],
  });

  addTableSheet({
    wb,
    name: 'Brand_Canvas',
    title: 'Brand Canvas',
    subtitle: 'Answer the commercial questions that shape how the brand is perceived in-market.',
    instructions: [
      'Replace the starter copy with real answers from founders, operators, guest feedback, and field observation.',
      'Keep answers commercially specific: price position, trade area, hero items, delivery behavior, and memory structures.',
    ],
    columns: [
      { header: 'Area', width: 190 },
      { header: 'Working answer', width: 280, fill: 'input' },
      { header: 'Evidence or operating note', width: 340, fill: 'input' },
      { header: 'Status', width: 120, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
    ],
    rows: [
      ['Core promise', 'Coffee-led neighborhood cafe with premium quality and practical speed.', 'Strong lunch trade but weak afternoon identity.', 'In progress'],
      ['Best guest', 'Office worker needing a dependable daily ritual.', 'Repeat frequency highest from weekday 8am-11am.', 'In progress'],
      ['Signature memory', 'A fast, calm stop with one hero item people mention by name.', 'Guests recall the pistachio latte more than the food.', 'Not started'],
      ['Hero products', 'Coffee, pastries, breakfast bundles, iced afternoon drinks.', 'Pastry attach rate drops after 11am.', 'Approved'],
      ['Price position', 'Premium but still justifiable for habit-based visits.', 'Bundle logic currently hides value rather than clarifying it.', 'Not started'],
      ['Store cues', 'Warm service, visible bar workflow, clear grab-and-go zone.', 'Counter congestion is hurting the premium feel at peak.', 'In progress'],
      ['Delivery fit', 'Selective menu, high-confidence drinks, clear bundling.', 'Delivery menu is too broad and inconsistent with store promise.', 'In progress'],
      ['Competitive edge', 'Speed + quality + approachable brand language.', 'Competitors feel trendier online but less dependable in-store.', 'Approved'],
    ],
  });

  addTableSheet({
    wb,
    name: 'Audience_Personas',
    title: 'Audience Persona Map',
    subtitle: 'Define the real use cases the brand needs to win, not just a generic demographic description.',
    instructions: [
      'Keep personas tied to visit occasions, urgency, budget reality, and why they would choose you over a nearby alternative.',
    ],
    columns: [
      { header: 'Persona', width: 170 },
      { header: 'Visit occasion', width: 220, fill: 'input' },
      { header: 'Primary need', width: 220, fill: 'input' },
      { header: 'Trigger', width: 210, fill: 'input' },
      { header: 'Barrier', width: 210, fill: 'input' },
      { header: 'Hero message', width: 240, fill: 'input' },
      { header: 'Priority', width: 100, fill: 'input', validation: { type: 'list', source: PRIORITY_SOURCE } },
    ],
    rows: [
      ['Office regular', 'Pre-work or mid-morning coffee run', 'Fast, consistent quality', 'Visible speed and easy pickup', 'Queue friction', 'Your reliable premium coffee stop before work starts.', 'High'],
      ['Remote worker', 'Two-hour sit-down session', 'Comfort and low-friction repeat spend', 'Power sockets and quiet energy', 'Poor seating turnover plan', 'Settle in without losing service speed.', 'Medium'],
      ['Afternoon meet-up', 'Informal catch-up or client chat', 'Good drinks with easy sharing food', 'Social ambiance and visual menu items', 'No clear afternoon reason to visit', 'A polished afternoon pause with better drinks.', 'Medium'],
      ['Weekend family', 'Casual breakfast or snack visit', 'Comfort, kids-friendly flow, easy bundles', 'Visible value and easy ordering', 'Confusing menu and no bundle cues', 'A simple premium stop everyone can agree on.', 'Low'],
    ],
  });

  const scorecard = wb.worksheets.add('Scorecard');
  setColumnWidths(scorecard, [180, 130, 130, 130, 320, 120, 120]);
  addSheetTitle(
    scorecard,
    'Brand Positioning Scorecard',
    'Score the current and target state across the commercial dimensions that make the brand easier to sell and remember.',
    7,
  );
  setValues(scorecard, 8, 1, [['Dimension', 'Current', 'Target', 'Gap', 'Why it matters']]);
  setValues(scorecard, 9, 1, [
    ['Concept clarity', 3, 5, null, 'Can the market understand you in one line without explanation?'],
    ['Differentiation', 2, 4, null, 'Would a guest describe you differently from the nearby alternatives?'],
    ['Offer architecture', 3, 5, null, 'Do hero items and bundles reinforce the same story?'],
    ['Store experience cues', 3, 4, null, 'Does the on-site experience match the positioning you market?'],
    ['Delivery-fit discipline', 2, 4, null, 'Can the brand survive beyond the four walls without losing coherence?'],
    ['Retention leverage', 2, 5, null, 'Is there a clear reason a first-time guest becomes a regular?'],
  ]);
  for (let row = 9; row <= 14; row += 1) {
    setFormulas(scorecard, row, 4, [[`=C${row}-B${row}`]]);
  }
  styleCompactTable(scorecard, 'A8:E14', 'A8:E8', 'A9:E14', ['B9:D14']);
  styleRange(scorecard, 'B9:C14', { fillColor: COLORS.inputFill });
  styleRange(scorecard, 'D9:D14', { fillColor: COLORS.blueFill, numberFormat: FORMATS.integer });
  styleRange(scorecard, 'B9:C14', { numberFormat: FORMATS.integer });
  addWholeValidation(scorecard, 'B9:C14', 1, 5);
  addMetricBlock(scorecard, 8, 'Leadership view', [
    { label: 'Average current score', formula: '=AVERAGE(B9:B14)', format: FORMATS.decimal1 },
    { label: 'Average target score', formula: '=AVERAGE(C9:C14)', format: FORMATS.decimal1 },
    { label: 'Largest gap', formula: '=MAX(D9:D14)', format: FORMATS.integer },
    { label: 'Dimensions below 3 today', formula: '=COUNTIF(B9:B14,"<3")', format: FORMATS.integer },
  ]);
  scorecard.charts.add('ColumnClustered', scorecard.getRange('A8:C14'), 'Auto');
  const brandChart = scorecard.charts.getItemAt(0);
  brandChart.title.text = 'Current vs target brand strength';
  brandChart.setPosition(scorecard.getRange('G8:N23'));
  brandChart.width = 650;
  brandChart.height = 320;
  styleChart(brandChart, [COLORS.teal, COLORS.amber]);

  return {
    wb,
    filename: 'restaurant-brand-positioning-brief.xlsx',
    previewSheets: [{ sheetName: 'Scorecard', range: 'A1:N23', file: 'restaurant-brand-positioning-brief.png' }],
  };
}

function buildAnnualMarketingPlanWorkbook() {
  const wb = Workbook.create();
  buildSetupSheet(wb, {
    title: 'Annual Restaurant Marketing Plan',
    subtitle:
      'Plan the year with commercial intent: themes, campaigns, offers, channel mix, owners, and measurable outcomes.',
    audience: 'Restaurant founders, marketing leads, multi-store brand managers',
    outcome: 'A 12-month campaign rhythm with clearer ownership, seasonal planning, and budget visibility.',
    focusAreas: [
      'Organize campaigns across the full year rather than reacting week to week.',
      'Tie each month to a business objective, not just a creative theme.',
      'Keep a visible seasonal moments library so promotions are planned in advance.',
    ],
    relatedTabs: [
      { name: 'Plan', purpose: 'The master monthly marketing plan and KPI ownership tracker.' },
      { name: 'Moments_Library', purpose: 'A seasonal idea bank with key marketing moments to adapt for your market.' },
      { name: 'Dashboard', purpose: 'A fast management view of spend, status, and monthly campaign intensity.' },
    ],
  });

  addTableSheet({
    wb,
    name: 'Plan',
    title: 'Monthly Plan',
    subtitle: 'One line per month. Add sub-campaigns below if your brand runs multiple pushes inside the same month.',
    instructions: [
      'Use one primary campaign line per month before adding extra layers.',
      'Keep the hero offer and KPI tied to the actual commercial problem you are solving.',
    ],
    columns: [
      { header: 'Month', width: 90 },
      { header: 'Theme or campaign', width: 220, fill: 'input' },
      { header: 'Business objective', width: 190, fill: 'input' },
      { header: 'Priority audience', width: 180, fill: 'input' },
      { header: 'Hero offer or moment', width: 220, fill: 'input' },
      { header: 'Key channels', width: 220, fill: 'input' },
      { header: 'Budget', width: 110, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 500000 } },
      { header: 'Primary KPI', width: 160, fill: 'input' },
      { header: 'Owner', width: 150, fill: 'input' },
      { header: 'Status', width: 110, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
      { header: 'Notes', width: 240, fill: 'input' },
    ],
    rows: [
      ['Jan', 'Reset routine campaign', 'Win weekday frequency', 'Office workers', 'Coffee + breakfast bundle', 'Meta,Google,Email,In-store', 7000, 'Repeat visits', 'Brand lead', 'Approved', 'Push habit-building after holiday slowdown.'],
      ['Feb', 'Valentine social menu', 'Lift evening covers', 'Couples and social diners', 'Limited dessert pairings', 'Instagram,TikTok,Email', 9000, 'Reservations', 'Marketing manager', 'Not started', 'Keep photogenic assets ready by late January.'],
      ['Mar', 'Ramadan sharing offers', 'Increase group orders', 'Families and office teams', 'Iftar bundles', 'Meta,Google,WhatsApp,Aggregator', 12000, 'Bundle orders', 'Growth lead', 'In progress', 'Local partnership angle for group orders.'],
      ['Apr', 'Eid celebration push', 'Maximize seasonal volume', 'Family gatherings', 'Holiday sharing menu', 'Meta,Google Maps,CRM', 15000, 'Net sales', 'Brand lead', 'Not started', 'Refresh profile imagery and opening hours.'],
      ['May', 'Morning routine reboot', 'Recover breakfast traffic', 'Nearby residents', 'Fast grab-and-go breakfast', 'Meta,Flyers,Google Maps', 6000, 'Breakfast transactions', 'Store marketing lead', 'Approved', 'Test one hyperlocal office route per week.'],
      ['Jun', 'Cold drinks summer launch', 'Grow afternoon demand', 'Students and mall traffic', 'Hero iced drinks', 'Instagram,TikTok,In-store', 8000, 'Afternoon sales', 'Content lead', 'Ready', 'Prioritize UGC and handheld drink shots.'],
      ['Jul', 'Delivery comfort menu', 'Protect summer sales mix', 'Home delivery diners', 'Meal bundles', 'Aggregator,Meta,SMS', 8500, 'Delivery contribution', 'Growth lead', 'Ready', 'Keep menu short and margin-aware.'],
      ['Aug', 'Back-to-routine prep', 'Warm up September demand', 'Families and offices', 'Pre-order breakfast packs', 'Email,WhatsApp,Meta', 5000, 'Pre-orders', 'CRM lead', 'Not started', 'Use the month for list cleaning and retargeting.'],
      ['Sep', 'Back-to-school and work', 'Drive weekday traffic', 'Parents and office workers', 'Coffee + pastry value set', 'Meta,Google,Local partnerships', 10000, 'Weekday covers', 'Store marketing lead', 'In progress', 'Bundle office and school pickup windows.'],
      ['Oct', 'Seasonal menu drop', 'Increase AOV', 'Existing regulars', 'Pumpkin and autumn bundles', 'Instagram,Email,In-store', 7500, 'Average check', 'Brand lead', 'Not started', 'Use founder story and product education content.'],
      ['Nov', 'Corporate catering push', 'Open a new revenue stream', 'Office admins', 'Meeting packages', 'LinkedIn,Email,Sales outreach', 6500, 'Catering leads', 'Partnership manager', 'Not started', 'Build sample platters and lead forms.'],
      ['Dec', 'Holiday gifting and gatherings', 'Maximize festive spend', 'Groups and loyal guests', 'Gift cards and celebration menus', 'Meta,Email,WhatsApp,In-store', 14000, 'Gift card sales', 'Marketing manager', 'Not started', 'Open VIP early access to best guests first.'],
    ],
  });

  addTableSheet({
    wb,
    name: 'Moments_Library',
    title: 'Seasonal Moments Library',
    subtitle: 'Edit the starter list for your country, city, audience, and service model.',
    instructions: [
      'These are prompts, not instructions. Remove what does not fit the brand or the market.',
    ],
    columns: [
      { header: 'Month', width: 90 },
      { header: 'Moment', width: 190, fill: 'input' },
      { header: 'Commercial angle', width: 250, fill: 'input' },
      { header: 'Activation idea', width: 280, fill: 'input' },
    ],
    rows: [
      ['Jan', 'New year reset', 'Routine and habit rebuilding', 'Monthly coffee passport or weekday breakfast reset'],
      ['Jan', 'Winter comfort', 'Hot drinks and warm food', 'Soup + sandwich and signature hot beverage pairings'],
      ['Jan', 'Health-focused demand', 'Lighter menu choices', 'Protein bowls, smoothies, or no-sugar callouts'],
      ['Feb', 'Valentine week', 'Date-night or gifting', 'Dessert duos, reservations priority, special packaging'],
      ['Feb', 'Sports finals', 'Watch-party demand', 'Group bundles and snack boxes'],
      ['Feb', 'Mid-quarter lull', 'Traffic recovery', 'Afternoon add-on and second-visit incentive'],
      ['Mar', 'Ramadan', 'Sharing, family, and evening trade', 'Iftar bundles and WhatsApp reminders'],
      ['Mar', 'Mother’s Day', 'Celebratory visits', 'Set menu or gifting bundle'],
      ['Mar', 'Spring refresh', 'New season product drop', 'Pastel drinks, lighter menu storytelling'],
      ['Apr', 'Eid', 'High-spend social dining', 'Celebration menus, gift cards, extended hours'],
      ['Apr', 'School break', 'Family occasions', 'Kids bundles and family pickup offers'],
      ['Apr', 'Outdoor season', 'Terrace or patio trade', 'Golden-hour drink content'],
      ['May', 'Exam season', 'Student traffic', 'Study bundles and extended seating offers'],
      ['May', 'Office routine reset', 'Weekday footfall', 'Coffee subscriptions or meeting trays'],
      ['May', 'Early summer heat', 'Cold beverage demand', 'Iced hero item launch'],
      ['Jun', 'Summer kickoff', 'Daypart extension', 'Late-evening cold drink push'],
      ['Jun', 'Father’s Day', 'Group dining or gifting', 'Prix fixe or take-home grilling packs'],
      ['Jun', 'Tourist season', 'Discovery traffic', 'Google profile refresh and tourist-friendly menu content'],
      ['Jul', 'Staycation season', 'Local indulgence', 'Weekend brunch or lounge set menus'],
      ['Jul', 'Delivery-heavy weather', 'Off-premise shift', 'Delivery-only bundles and sponsor bursts'],
      ['Jul', 'Community collaborations', 'Local reach expansion', 'Partner giveaways or event tie-ins'],
      ['Aug', 'Quiet month', 'Retention over acquisition', 'VIP recovery campaign and list hygiene'],
      ['Aug', 'Back-to-school prep', 'Routine planning', 'Lunchbox or school pickup prep'],
      ['Aug', 'Menu cleanup', 'Operational focus', 'Retire weak items and prep autumn assets'],
      ['Sep', 'Back to school', 'High-frequency morning trade', 'Breakfast value set and office commuter signage'],
      ['Sep', 'Back to office', 'Corporate lunch and coffee', 'Meeting catering and prepaid coffee passes'],
      ['Sep', 'New season content', 'Brand refresh', 'Founder story + product education sequence'],
      ['Oct', 'Autumn launch', 'Seasonal relevance', 'New menu drop with creator seeding'],
      ['Oct', 'Halloween', 'High-UGC moment', 'Limited treats and costume content'],
      ['Oct', 'National coffee day', 'Category leadership', 'Hero item sampling and loyalty push'],
      ['Nov', 'Singles Day / shopping season', 'Impulse gifting', 'Gift cards and take-home bundles'],
      ['Nov', 'Corporate event season', 'Large-order revenue', 'Private event or catering push'],
      ['Nov', 'National day / local holidays', 'Community relevance', 'Patriotic menu moments and store decor'],
      ['Dec', 'Holiday parties', 'Group revenue', 'Set menus and reservation priority'],
      ['Dec', 'Festive gifting', 'Retail-style sales', 'Gift boxes, subscriptions, and gift cards'],
      ['Dec', 'Year-end reflection', 'Retention and feedback', 'VIP thank-you campaign and guest survey'],
    ],
  });

  const dashboard = wb.worksheets.add('Dashboard');
  setColumnWidths(dashboard, [170, 130, 120, 110, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120]);
  addSheetTitle(
    dashboard,
    'Annual Plan Dashboard',
    'Use this view to review budget weight, campaign readiness, and the monthly rhythm of the plan.',
    14,
  );
  addMetricBlock(dashboard, 8, 'Management summary', [
    { label: 'Annual planned budget', formula: '=SUM(Plan!G8:G19)', format: FORMATS.currency0 },
    { label: 'Average monthly budget', formula: '=AVERAGE(Plan!G8:G19)', format: FORMATS.currency0 },
    { label: 'Campaigns live or ready', formula: '=COUNTIF(Plan!J8:J19,"Ready")+COUNTIF(Plan!J8:J19,"Live")+COUNTIF(Plan!J8:J19,"Complete")', format: FORMATS.integer },
    { label: 'Moments in library', formula: '=COUNTA(Moments_Library!A8:A43)', format: FORMATS.integer },
  ]);
  setValues(dashboard, 15, 1, [['Month', 'Planned budget']]);
  MONTHS.forEach((month, index) => {
    const row = 16 + index;
    setValues(dashboard, row, 1, [[month]]);
    setFormulas(dashboard, row, 2, [[`=Plan!G${8 + index}`]]);
  });
  styleCompactTable(dashboard, 'A15:B27', 'A15:B15', 'A16:B27', ['B16:B27']);
  styleRange(dashboard, 'B16:B27', { numberFormat: FORMATS.currency0, fillColor: COLORS.blueFill });
  const planChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A15:B27'), 'Auto');
  planChart.title.text = 'Planned budget by month';
  planChart.setPosition(dashboard.getRange('D8:N24'));
  planChart.width = 720;
  planChart.height = 330;
  styleChart(planChart, [COLORS.teal]);

  return {
    wb,
    filename: 'annual-restaurant-marketing-plan.xlsx',
    previewSheets: [{ sheetName: 'Dashboard', range: 'A1:N24', file: 'annual-restaurant-marketing-plan.png' }],
  };
}

function buildPromotionTrackerWorkbook() {
  const wb = Workbook.create();
  buildSetupSheet(wb, {
    title: 'Restaurant Promotion Tracker',
    subtitle:
      'Track whether promotions created profitable demand or simply moved volume at a poor margin.',
    audience: 'Operators, growth leads, marketing managers, store teams',
    outcome: 'A clearer view of offer quality, discount leakage, and which campaigns deserve to repeat.',
    focusAreas: [
      'Separate revenue from net contribution so discount-led growth is reviewed properly.',
      'Track promotion objectives and post-campaign learning, not just the dates the campaign ran.',
      'Use the dashboard to identify which campaigns created the strongest commercial return.',
    ],
    relatedTabs: [
      { name: 'Tracker', purpose: 'Track live and completed promotions with spend, revenue, and MROI logic.' },
      { name: 'Dashboard', purpose: 'Review total spend, total revenue, and promotion-level return side by side.' },
    ],
  });

  const tracker = addTableSheet({
    wb,
    name: 'Tracker',
    title: 'Promotion Tracker',
    subtitle: 'Use one line per campaign, offer, or localized push.',
    instructions: [
      'Discount cost is separate from media spend so the real offer cost stays visible.',
      'Net contribution is calculated using attributed revenue, gross margin, spend, and discount leakage.',
    ],
    columns: [
      { header: 'Promo ID', width: 90, fill: 'input' },
      { header: 'Promotion', width: 210, fill: 'input' },
      { header: 'Objective', width: 160, fill: 'input' },
      { header: 'Channel', width: 140, fill: 'input', validation: { type: 'list', source: CHANNEL_SOURCE } },
      { header: 'Audience', width: 160, fill: 'input' },
      { header: 'Start date', width: 110, fill: 'input', format: FORMATS.date },
      { header: 'End date', width: 110, fill: 'input', format: FORMATS.date },
      { header: 'Spend', width: 110, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 250000 } },
      { header: 'Discount cost', width: 120, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 250000 } },
      { header: 'Redemptions', width: 95, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 0, max: 200000 } },
      { header: 'Attributed revenue', width: 140, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 1000000 } },
      { header: 'Gross margin %', width: 120, fill: 'input', format: FORMATS.percent1, align: 'right', validation: { type: 'decimal', min: 0, max: 1 } },
      { header: 'Net contribution', width: 135, fill: 'formula', format: FORMATS.currency0, align: 'right' },
      { header: 'MROI', width: 90, fill: 'formula', format: FORMATS.percent1, align: 'right' },
      { header: 'Status', width: 110, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
      { header: 'Learning', width: 240, fill: 'input' },
    ],
    rows: [
      ['PR-001', 'Breakfast combo reset', 'Drive weekday frequency', 'Meta', 'Office commuters', new Date('2026-01-10'), new Date('2026-01-24'), 3200, 1800, 540, 19800, 0.68, null, null, 'Complete', 'Strongest Monday-Wednesday response before 10:30am.'],
      ['PR-002', 'Valentine dessert duo', 'Lift evening tickets', 'Instagram', 'Couples', new Date('2026-02-06'), new Date('2026-02-15'), 4200, 2500, 260, 18600, 0.72, null, null, 'Complete', 'Content quality mattered more than discount depth.'],
      ['PR-003', 'Ramadan family sharing bundle', 'Increase group orders', 'WhatsApp', 'Families', new Date('2026-03-03'), new Date('2026-03-28'), 2600, 3600, 410, 24400, 0.64, null, null, 'Live', 'Bundle uptake rises after 4pm reminder sends.'],
      ['PR-004', 'Cold brew launch week', 'Grow afternoon sales', 'TikTok', 'Students', new Date('2026-06-03'), new Date('2026-06-09'), 5100, 900, 310, 16200, 0.7, null, null, 'Approved', 'UGC drove most of the conversion lift.'],
      ['PR-005', 'Summer delivery meal deal', 'Defend delivery mix', 'Aggregator', 'Home delivery', new Date('2026-07-07'), new Date('2026-07-31'), 4800, 5400, 680, 31800, 0.56, null, null, 'Ready', 'Needs packaging note to reduce refund risk.'],
      ['PR-006', 'Back-to-school breakfast set', 'Recover morning traffic', 'Google Search', 'Parents', new Date('2026-09-01'), new Date('2026-09-20'), 3800, 2100, 390, 17400, 0.67, null, null, 'Not started', 'Promote near schools and commuter roads only.'],
    ],
  });
  for (let row = tracker.firstDataRow; row <= tracker.lastDataRow; row += 1) {
    setFormulas(tracker.sheet, row, 13, [[`=IF(OR(K${row}=0,L${row}=0),"",K${row}*L${row}-H${row}-I${row})`]]);
    setFormulas(tracker.sheet, row, 14, [[`=IF((H${row}+I${row})=0,"",M${row}/(H${row}+I${row}))`]]);
  }
  styleRange(tracker.sheet, `M${tracker.firstDataRow}:N${tracker.lastDataRow}`, { fillColor: COLORS.blueFill });

  const dashboard = wb.worksheets.add('Dashboard');
  setColumnWidths(dashboard, [170, 130, 200, 140, 140, 140, 140, 140, 140, 140]);
  addSheetTitle(
    dashboard,
    'Promotion Performance Dashboard',
    'Use this view to decide which promotions to repeat, cut, or redesign.',
    10,
  );
  addMetricBlock(dashboard, 8, 'Promotion summary', [
    { label: 'Total spend', formula: '=SUM(Tracker!H8:H13)', format: FORMATS.currency0 },
    { label: 'Total discount cost', formula: '=SUM(Tracker!I8:I13)', format: FORMATS.currency0 },
    { label: 'Attributed revenue', formula: '=SUM(Tracker!K8:K13)', format: FORMATS.currency0 },
    { label: 'Average MROI', formula: '=AVERAGE(Tracker!N8:N13)', format: FORMATS.percent1 },
  ]);
  setValues(dashboard, 15, 1, [['Promotion', 'Spend', 'Attributed revenue']]);
  for (let index = 0; index < 6; index += 1) {
    const row = 16 + index;
    setFormulas(dashboard, row, 1, [[`=Tracker!B${8 + index}`]]);
    setFormulas(dashboard, row, 2, [[`=Tracker!H${8 + index}`]]);
    setFormulas(dashboard, row, 3, [[`=Tracker!K${8 + index}`]]);
  }
  styleCompactTable(dashboard, 'A15:C21', 'A15:C15', 'A16:C21', ['B16:C21']);
  styleRange(dashboard, 'B16:C21', { numberFormat: FORMATS.currency0, fillColor: COLORS.blueFill });
  const promoChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A15:C21'), 'Auto');
  promoChart.title.text = 'Revenue generated vs spend by promotion';
  promoChart.setPosition(dashboard.getRange('E8:K23'));
  promoChart.width = 640;
  promoChart.height = 320;
  styleChart(promoChart, [COLORS.amber, COLORS.teal]);

  return {
    wb,
    filename: 'restaurant-promotion-tracker.xlsx',
    previewSheets: [{ sheetName: 'Dashboard', range: 'A1:K23', file: 'restaurant-promotion-tracker.png' }],
  };
}

function buildContentCalendarWorkbook() {
  const wb = Workbook.create();
  buildSetupSheet(wb, {
    title: 'Cafe Content Calendar',
    subtitle:
      'Plan content with enough structure to support brand building, product pushes, and local relevance at the same time.',
    audience: 'Cafe founders, social teams, content producers, marketing managers',
    outcome: 'A balanced publishing system with clear pillars, approvals, and paid-support decisions.',
    focusAreas: [
      'Balance promotional content with founder story, menu storytelling, and community relevance.',
      'Track production status so content does not fall apart at approval or shoot stage.',
      'Keep the dashboard focused on volume, mix, and publishing readiness.',
    ],
    relatedTabs: [
      { name: 'Calendar', purpose: 'The master publishing calendar across platforms and campaigns.' },
      { name: 'Shoot_Tracker', purpose: 'Production tasks, owners, and delivery dates for photo or video assets.' },
      { name: 'Dashboard', purpose: 'Count content by platform and pillar and review what is actually ready.' },
    ],
  });

  addTableSheet({
    wb,
    name: 'Calendar',
    title: 'Publishing Calendar',
    subtitle: 'Use one row per planned post, reel, or story burst.',
    instructions: [
      'Keep pillars balanced. Too many pure offer posts weakens the brand over time.',
      'Mark paid support explicitly so creative and media stay coordinated.',
    ],
    columns: [
      { header: 'Publish date', width: 110, fill: 'input', format: FORMATS.date },
      { header: 'Platform', width: 120, fill: 'input', validation: { type: 'list', source: 'Instagram,TikTok,Facebook,LinkedIn,Stories,Google Business Profile' } },
      { header: 'Content pillar', width: 150, fill: 'input', validation: { type: 'list', source: 'Menu hero,Brand story,Founder,UGC,Offer,Community,Education' } },
      { header: 'Format', width: 120, fill: 'input', validation: { type: 'list', source: 'Reel,Carousel,Story,Still,Post,Short video' } },
      { header: 'Campaign', width: 170, fill: 'input' },
      { header: 'CTA', width: 170, fill: 'input' },
      { header: 'Store or market', width: 150, fill: 'input' },
      { header: 'Owner', width: 120, fill: 'input' },
      { header: 'Status', width: 120, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
      { header: 'Paid support', width: 100, fill: 'input', validation: { type: 'list', source: YES_NO_SOURCE } },
      { header: 'Asset link or note', width: 260, fill: 'input' },
    ],
    rows: [
      [new Date('2026-06-01'), 'Instagram', 'Menu hero', 'Reel', 'Summer iced launch', 'Try the new iced pistachio latte', 'Main branch', 'Content lead', 'Approved', 'Yes', 'Handheld drink shot + quick pour clip'],
      [new Date('2026-06-03'), 'TikTok', 'UGC', 'Short video', 'Summer iced launch', 'Save for your next coffee run', 'Main branch', 'Social exec', 'In progress', 'Yes', 'Customer reaction compilation'],
      [new Date('2026-06-05'), 'Instagram', 'Founder', 'Story', 'Brand story week', 'Meet the people behind the menu', 'Main branch', 'Founder', 'Ready', 'No', 'Phone-shot morning prep story'],
      [new Date('2026-06-07'), 'Facebook', 'Community', 'Post', 'Neighborhood event', 'See you at the weekend market', 'Main branch', 'Store lead', 'Ready', 'No', 'Partner event artwork'],
      [new Date('2026-06-09'), 'Instagram', 'Offer', 'Carousel', 'Morning combo push', 'Weekday breakfast set', 'Main branch', 'Brand lead', 'Approved', 'Yes', 'Bundle price frame + product stills'],
      [new Date('2026-06-11'), 'Stories', 'Education', 'Story', 'Menu education', 'Why cold foam works here', 'Main branch', 'Bar lead', 'Not started', 'No', 'Talk-to-camera explainer'],
      [new Date('2026-06-13'), 'TikTok', 'Brand story', 'Reel', 'Weekend social energy', 'Your afternoon reset, not just coffee', 'Main branch', 'Content lead', 'Not started', 'No', 'Ambient cafe energy shots'],
      [new Date('2026-06-15'), 'Instagram', 'UGC', 'Carousel', 'Community proof', 'Tagged by regulars this week', 'Main branch', 'Social exec', 'Approved', 'No', 'Permission requests complete'],
      [new Date('2026-06-17'), 'Google Business Profile', 'Offer', 'Post', 'Maps visibility', 'Cold drinks now available', 'Main branch', 'SEO lead', 'Ready', 'No', 'Use same imagery as menu launch'],
      [new Date('2026-06-19'), 'Instagram', 'Menu hero', 'Reel', 'Weekend dessert push', 'New soft serve affogato', 'Main branch', 'Content lead', 'In progress', 'Yes', 'Need plated hero shot'],
      [new Date('2026-06-21'), 'Stories', 'Community', 'Story', 'Local partner highlight', 'Featuring our bakery partner', 'Main branch', 'Store lead', 'Ready', 'No', 'Cross-tag partner story'],
      [new Date('2026-06-24'), 'Instagram', 'Offer', 'Still', 'Afternoon recovery', '3-5pm pastry add-on', 'Main branch', 'Brand lead', 'Not started', 'Yes', 'Need clean pricing lockup'],
    ],
  });

  addTableSheet({
    wb,
    name: 'Shoot_Tracker',
    title: 'Shoot & Production Tracker',
    subtitle: 'Track the asset work behind the calendar so publishing does not fail at production stage.',
    instructions: ['Use this for shoots, edit rounds, approvals, captions, and creator handoffs.'],
    columns: [
      { header: 'Asset', width: 220, fill: 'input' },
      { header: 'Type', width: 130, fill: 'input', validation: { type: 'list', source: 'Photo,Video,Story pack,Caption set,UGC request' } },
      { header: 'Campaign', width: 170, fill: 'input' },
      { header: 'Owner', width: 130, fill: 'input' },
      { header: 'Due date', width: 110, fill: 'input', format: FORMATS.date },
      { header: 'Status', width: 120, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
      { header: 'Notes', width: 300, fill: 'input' },
    ],
    rows: [
      ['Iced launch hero reel', 'Video', 'Summer iced launch', 'Content lead', new Date('2026-05-29'), 'Approved', 'Edit locked. Paid cutdown due same day.'],
      ['Breakfast combo stills', 'Photo', 'Morning combo push', 'Photographer', new Date('2026-06-04'), 'In progress', 'Need overhead and handheld variants.'],
      ['Founder intro story set', 'Story pack', 'Brand story week', 'Founder', new Date('2026-06-02'), 'Ready', 'One-take and subtitle friendly.'],
      ['Partner bakery feature', 'Caption set', 'Local partner highlight', 'Social exec', new Date('2026-06-18'), 'Not started', 'Awaiting partner approval.'],
    ],
  });

  const dashboard = wb.worksheets.add('Dashboard');
  setColumnWidths(dashboard, [190, 130, 160, 120, 120, 120, 120, 120, 120]);
  addSheetTitle(
    dashboard,
    'Content Dashboard',
    'Review platform mix, pillar balance, and live publishing readiness at a glance.',
    9,
  );
  addMetricBlock(dashboard, 8, 'Publishing summary', [
    { label: 'Total planned posts', formula: '=COUNTA(Calendar!A8:A19)', format: FORMATS.integer },
    { label: 'Approved or ready', formula: '=COUNTIF(Calendar!I8:I19,"Approved")+COUNTIF(Calendar!I8:I19,"Ready")+COUNTIF(Calendar!I8:I19,"Live")+COUNTIF(Calendar!I8:I19,"Complete")', format: FORMATS.integer },
    { label: 'Paid-supported assets', formula: '=COUNTIF(Calendar!J8:J19,"Yes")', format: FORMATS.integer },
    { label: 'Production items open', formula: '=COUNTIF(Shoot_Tracker!F8:F11,"Not started")+COUNTIF(Shoot_Tracker!F8:F11,"In progress")', format: FORMATS.integer },
  ]);
  setValues(dashboard, 15, 1, [['Platform', 'Planned posts']]);
  const platforms = ['Instagram', 'TikTok', 'Facebook', 'Stories', 'Google Business Profile'];
  platforms.forEach((platform, index) => {
    const row = 16 + index;
    setValues(dashboard, row, 1, [[platform]]);
    setFormulas(dashboard, row, 2, [[`=COUNTIF(Calendar!B8:B19,"${platform}")`]]);
  });
  styleCompactTable(dashboard, 'A15:B20', 'A15:B15', 'A16:B20', ['B16:B20']);
  styleRange(dashboard, 'B16:B20', { fillColor: COLORS.blueFill, numberFormat: FORMATS.integer });
  const contentChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A15:B20'), 'Auto');
  contentChart.title.text = 'Planned content by platform';
  contentChart.setPosition(dashboard.getRange('D8:J22'));
  contentChart.width = 620;
  contentChart.height = 320;
  styleChart(contentChart, [COLORS.indigo]);

  return {
    wb,
    filename: 'cafe-content-calendar.xlsx',
    previewSheets: [{ sheetName: 'Dashboard', range: 'A1:J22', file: 'cafe-content-calendar.png' }],
  };
}

function addBudgetMatrixSheet(wb, name, title, subtitle, categories, monthValues) {
  const sheet = wb.worksheets.add(name);
  setColumnWidths(sheet, [210, ...Array(12).fill(95), 110]);
  addSheetTitle(sheet, title, subtitle, 14);
  setValues(sheet, 8, 1, [['Channel', ...MONTHS, 'Total']]);
  categories.forEach((category, index) => {
    const row = 9 + index;
    setValues(sheet, row, 1, [[category, ...monthValues[index], null]]);
    setFormulas(sheet, row, 14, [[`=SUM(B${row}:M${row})`]]);
  });
  setValues(sheet, 9 + categories.length, 1, [['Total', ...Array(12).fill(null), null]]);
  for (let col = 2; col <= 13; col += 1) {
    setFormulas(sheet, 9 + categories.length, col, [[`=SUM(${colLetter(col)}9:${colLetter(col)}${8 + categories.length})`]]);
  }
  setFormulas(sheet, 9 + categories.length, 14, [[`=SUM(N9:N${8 + categories.length})`]]);
  styleCompactTable(
    sheet,
    a1(8, 1, 9 + categories.length, 14),
    a1(8, 1, 8, 14),
    a1(9, 1, 9 + categories.length, 14),
    [a1(9, 2, 9 + categories.length, 14)],
  );
  styleRange(sheet, a1(9, 2, 8 + categories.length, 13), { fillColor: COLORS.inputFill, numberFormat: FORMATS.currency0 });
  styleRange(sheet, a1(9, 14, 9 + categories.length, 14), { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  sheet.freezePanes.freezeRows(8);
  return sheet;
}

function buildAnnualBudgetPlannerWorkbook() {
  const wb = Workbook.create();
  const categories = [
    'Brand campaigns',
    'Local store marketing',
    'Performance ads',
    'Content production',
    'CRM & loyalty',
    'Influencers / PR',
    'Photography / video',
    'POS / print / signage',
    'Launch support',
    'Experiment budget',
  ];
  const budgetValues = [
    [7000, 9000, 12000, 15000, 6000, 8000, 8500, 5000, 10000, 7500, 6500, 14000],
    [2500, 2500, 4000, 3500, 4500, 3500, 4200, 2800, 4600, 4200, 3800, 5200],
    [4500, 5000, 6500, 7000, 4800, 5200, 6000, 4200, 6300, 5600, 5200, 7500],
    [3800, 4200, 4300, 4800, 3600, 4300, 4500, 3200, 4700, 4200, 3900, 5200],
    [1500, 1700, 2200, 2400, 1800, 1900, 2100, 1700, 2300, 2200, 2100, 2800],
    [1800, 2200, 2600, 2800, 1600, 2000, 1900, 1500, 2500, 2600, 2400, 3200],
    [2500, 1800, 2300, 2700, 1500, 1800, 1900, 1400, 2400, 2600, 2000, 2600],
    [1200, 1500, 1700, 2100, 1500, 1600, 1700, 1300, 1800, 1600, 1500, 2200],
    [0, 0, 2500, 3000, 0, 0, 2200, 0, 0, 2600, 0, 0],
    [1000, 1200, 1500, 1500, 1000, 1200, 1300, 1000, 1500, 1400, 1200, 1600],
  ];
  const actualValues = budgetValues.map((row, rowIndex) =>
    row.map((value, colIndex) => Math.round(value * (0.9 + ((rowIndex + colIndex) % 5) * 0.06))),
  );

  buildSetupSheet(wb, {
    title: 'Annual Marketing Budget Planner',
    subtitle: 'Plan and review restaurant marketing spend with actual-vs-plan visibility by channel and by month.',
    audience: 'Founders, growth leads, finance-aware marketing managers, expansion teams',
    outcome: 'A clear view of where marketing money is committed, drifting, or underutilized across the year.',
    focusAreas: [
      'Keep budget control visible by channel, not just one monthly total.',
      'Review plan vs actual before overspend becomes a year-end story.',
      'Use the dashboard to explain where variance is happening and why.',
    ],
    relatedTabs: [
      { name: 'Budget', purpose: 'The annual plan by marketing channel and month.' },
      { name: 'Actuals', purpose: 'What was actually spent, using the same channel structure.' },
      { name: 'Dashboard', purpose: 'Monthly variance summary for operator and finance review.' },
    ],
  });

  addBudgetMatrixSheet(wb, 'Budget', 'Budget Plan', 'Set the intended monthly spend before the year starts moving.', categories, budgetValues);
  addBudgetMatrixSheet(wb, 'Actuals', 'Actual Spend', 'Use the same channel lines so variance conversations stay clean.', categories, actualValues);

  const dashboard = wb.worksheets.add('Dashboard');
  setColumnWidths(dashboard, [180, 130, 130, 130, 130, 120, 120, 120, 120, 120, 120, 120, 120]);
  addSheetTitle(
    dashboard,
    'Budget Control Dashboard',
    'Compare planned and actual spend before budget drift becomes permanent.',
    13,
  );
  addMetricBlock(dashboard, 8, 'Budget view', [
    { label: 'Planned annual spend', formula: '=Budget!N19', format: FORMATS.currency0 },
    { label: 'Actual annual spend', formula: '=Actuals!N19', format: FORMATS.currency0 },
    { label: 'Variance', formula: '=Actuals!N19-Budget!N19', format: FORMATS.currency0 },
    { label: 'Variance %', formula: '=IF(Budget!N19=0,"",(Actuals!N19-Budget!N19)/Budget!N19)', format: FORMATS.percent1 },
  ]);
  setValues(dashboard, 15, 1, [['Month', 'Planned', 'Actual']]);
  MONTHS.forEach((month, index) => {
    const row = 16 + index;
    const col = 2 + index;
    setValues(dashboard, row, 1, [[month]]);
    setFormulas(dashboard, row, 2, [[`=Budget!${colLetter(col)}19`]]);
    setFormulas(dashboard, row, 3, [[`=Actuals!${colLetter(col)}19`]]);
  });
  styleCompactTable(dashboard, 'A15:C27', 'A15:C15', 'A16:C27', ['B16:C27']);
  styleRange(dashboard, 'B16:C27', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  const budgetChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A15:C27'), 'Auto');
  budgetChart.title.text = 'Planned vs actual spend by month';
  budgetChart.setPosition(dashboard.getRange('E8:M24'));
  budgetChart.width = 700;
  budgetChart.height = 330;
  styleChart(budgetChart, [COLORS.teal, COLORS.coral]);

  return {
    wb,
    filename: 'annual-marketing-budget-planner.xlsx',
    previewSheets: [{ sheetName: 'Dashboard', range: 'A1:M24', file: 'annual-marketing-budget-planner.png' }],
  };
}

function buildMarketingROICalculatorWorkbook() {
  const wb = Workbook.create();
  buildSetupSheet(wb, {
    title: 'Marketing ROI Calculator',
    subtitle:
      'Review campaign efficiency through spend, acquisition, revenue, and gross-profit logic instead of vanity reporting.',
    audience: 'Growth leads, founders, performance marketers, operator-analysts',
    outcome: 'A campaign review sheet that connects spend to revenue quality, customer cost, and blended MROI.',
    focusAreas: [
      'Keep gross profit visible so revenue-heavy but margin-poor campaigns are questioned early.',
      'Compare CAC and MROI side by side rather than defaulting to one metric.',
      'Use the dashboard to review blended performance across campaigns.',
    ],
    relatedTabs: [
      { name: 'Campaigns', purpose: 'Campaign-level performance inputs and calculated efficiency metrics.' },
      { name: 'Dashboard', purpose: 'Blended view of spend, revenue, CAC, and MROI.' },
    ],
  });

  const campaigns = addTableSheet({
    wb,
    name: 'Campaigns',
    title: 'Campaign Inputs',
    subtitle: 'Enter one line per campaign, ad set, or test cell you want to compare.',
    instructions: ['Use influenced revenue when available. If not, use your best attributable revenue estimate.'],
    columns: [
      { header: 'Channel', width: 120, fill: 'input', validation: { type: 'list', source: PLATFORM_SOURCE } },
      { header: 'Campaign', width: 220, fill: 'input' },
      { header: 'Spend', width: 110, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 500000 } },
      { header: 'Impressions', width: 110, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 0, max: 100000000 } },
      { header: 'Clicks', width: 95, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 0, max: 5000000 } },
      { header: 'Conversions', width: 110, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 0, max: 1000000 } },
      { header: 'New customers', width: 115, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 0, max: 500000 } },
      { header: 'Influenced revenue', width: 140, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 2000000 } },
      { header: 'Gross margin %', width: 110, fill: 'input', format: FORMATS.percent1, align: 'right', validation: { type: 'decimal', min: 0, max: 1 } },
      { header: 'Gross profit', width: 120, fill: 'formula', format: FORMATS.currency0, align: 'right' },
      { header: 'CTR', width: 90, fill: 'formula', format: FORMATS.percent2, align: 'right' },
      { header: 'CPC', width: 100, fill: 'formula', format: FORMATS.currency2, align: 'right' },
      { header: 'CPA', width: 100, fill: 'formula', format: FORMATS.currency0, align: 'right' },
      { header: 'CAC', width: 100, fill: 'formula', format: FORMATS.currency0, align: 'right' },
      { header: 'MROI', width: 90, fill: 'formula', format: FORMATS.percent1, align: 'right' },
      { header: 'ROAS', width: 90, fill: 'formula', format: FORMATS.decimal2, align: 'right' },
    ],
    rows: [
      ['Meta', 'Breakfast commuter lookalike', 6500, 420000, 8200, 520, 210, 28600, 0.67, null, null, null, null, null, null, null],
      ['Google Search', 'Near me breakfast intent', 3800, 145000, 4900, 410, 180, 24800, 0.71, null, null, null, null, null, null, null],
      ['Google Maps', 'Store visit campaign', 2200, 84000, 1900, 160, 96, 11200, 0.68, null, null, null, null, null, null, null],
      ['TikTok', 'Cold drinks creator cut', 4400, 390000, 6200, 340, 150, 19800, 0.64, null, null, null, null, null, null, null],
      ['Email', 'VIP early access menu drop', 900, 28000, 2100, 260, 72, 15400, 0.8, null, null, null, null, null, null, null],
      ['WhatsApp', 'Ramadan family bundle reminder', 1200, 24000, 1800, 290, 88, 17100, 0.66, null, null, null, null, null, null, null],
    ],
  });
  for (let row = campaigns.firstDataRow; row <= campaigns.lastDataRow; row += 1) {
    setFormulas(campaigns.sheet, row, 10, [[`=IF(OR(H${row}=0,I${row}=0),"",H${row}*I${row})`]]);
    setFormulas(campaigns.sheet, row, 11, [[`=IF(D${row}=0,"",E${row}/D${row})`]]);
    setFormulas(campaigns.sheet, row, 12, [[`=IF(E${row}=0,"",C${row}/E${row})`]]);
    setFormulas(campaigns.sheet, row, 13, [[`=IF(F${row}=0,"",C${row}/F${row})`]]);
    setFormulas(campaigns.sheet, row, 14, [[`=IF(G${row}=0,"",C${row}/G${row})`]]);
    setFormulas(campaigns.sheet, row, 15, [[`=IF(C${row}=0,"",(J${row}-C${row})/C${row})`]]);
    setFormulas(campaigns.sheet, row, 16, [[`=IF(C${row}=0,"",H${row}/C${row})`]]);
  }
  styleRange(campaigns.sheet, `J${campaigns.firstDataRow}:P${campaigns.lastDataRow}`, { fillColor: COLORS.blueFill });

  const dashboard = wb.worksheets.add('Dashboard');
  setColumnWidths(dashboard, [190, 130, 210, 140, 140, 140, 140, 140, 140, 140]);
  addSheetTitle(
    dashboard,
    'Campaign ROI Dashboard',
    'Use this view to compare whether each channel is earning the right to stay in the plan.',
    10,
  );
  addMetricBlock(dashboard, 8, 'Blended metrics', [
    { label: 'Total spend', formula: '=SUM(Campaigns!C8:C13)', format: FORMATS.currency0 },
    { label: 'Influenced revenue', formula: '=SUM(Campaigns!H8:H13)', format: FORMATS.currency0 },
    { label: 'Blended CAC', formula: '=IF(SUM(Campaigns!G8:G13)=0,"",SUM(Campaigns!C8:C13)/SUM(Campaigns!G8:G13))', format: FORMATS.currency0 },
    { label: 'Blended MROI', formula: '=IF(SUM(Campaigns!C8:C13)=0,"",(SUM(Campaigns!J8:J13)-SUM(Campaigns!C8:C13))/SUM(Campaigns!C8:C13))', format: FORMATS.percent1 },
  ]);
  setValues(dashboard, 15, 1, [['Campaign', 'Spend', 'Gross profit']]);
  for (let index = 0; index < 6; index += 1) {
    const row = 16 + index;
    setFormulas(dashboard, row, 1, [[`=Campaigns!B${8 + index}`]]);
    setFormulas(dashboard, row, 2, [[`=Campaigns!C${8 + index}`]]);
    setFormulas(dashboard, row, 3, [[`=Campaigns!J${8 + index}`]]);
  }
  styleCompactTable(dashboard, 'A15:C21', 'A15:C15', 'A16:C21', ['B16:C21']);
  styleRange(dashboard, 'B16:C21', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  const roiChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A15:C21'), 'Auto');
  roiChart.title.text = 'Spend vs gross profit by campaign';
  roiChart.setPosition(dashboard.getRange('E8:K23'));
  roiChart.width = 640;
  roiChart.height = 320;
  styleChart(roiChart, [COLORS.coral, COLORS.teal]);

  return {
    wb,
    filename: 'marketing-roi-calculator.xlsx',
    previewSheets: [{ sheetName: 'Dashboard', range: 'A1:K23', file: 'marketing-roi-calculator.png' }],
  };
}

function buildStoreLaunchChecklistWorkbook() {
  const wb = Workbook.create();
  buildSetupSheet(wb, {
    title: 'Store Launch Marketing Checklist',
    subtitle:
      'Control the full launch window from pre-opening buzz through the first 30 days of trading.',
    audience: 'Expansion teams, founders, area managers, brand and marketing leads',
    outcome: 'A launch sequence that covers digital, local, in-store, and CRM work instead of collapsing into one weekend event.',
    focusAreas: [
      'Separate pre-launch, opening-week, and first-30-day tasks so momentum does not end after day one.',
      'Keep local outreach, Google readiness, and content production visible alongside launch offers.',
      'Use the dashboard to spot which launch phase is slipping before the store goes live.',
    ],
    relatedTabs: [
      { name: 'Checklist', purpose: 'The master launch tracker across phases, owners, and deadlines.' },
      { name: 'Launch_Calendar', purpose: 'A week-by-week rhythm for the soft opening, launch burst, and first 30 days.' },
      { name: 'Dashboard', purpose: 'Completion status by phase so launch readiness is easy to review.' },
    ],
  });

  addTableSheet({
    wb,
    name: 'Checklist',
    title: 'Launch Checklist',
    subtitle: 'Use one row per launch task. Add as many operational or local tasks as needed.',
    instructions: [
      'Keep this shared with operators so marketing launch work stays grounded in actual opening reality.',
    ],
    columns: [
      { header: 'Phase', width: 150, fill: 'input', validation: { type: 'list', source: 'Pre-launch,Soft opening,Launch week,First 30 days' } },
      { header: 'Task', width: 270, fill: 'input' },
      { header: 'Channel or area', width: 170, fill: 'input' },
      { header: 'Owner', width: 120, fill: 'input' },
      { header: 'Due date', width: 110, fill: 'input', format: FORMATS.date },
      { header: 'Status', width: 110, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
      { header: 'Priority', width: 100, fill: 'input', validation: { type: 'list', source: PRIORITY_SOURCE } },
      { header: 'Budget', width: 110, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 200000 } },
      { header: 'Notes', width: 250, fill: 'input' },
    ],
    rows: [
      ['Pre-launch', 'Claim and verify Google Business Profile', 'Google / local SEO', 'SEO lead', new Date('2026-04-10'), 'In progress', 'High', 0, 'Set ordering and menu links before launch.'],
      ['Pre-launch', 'Build launch landing page and lead capture', 'Website / CRM', 'Growth lead', new Date('2026-04-12'), 'Approved', 'High', 0, 'Collect VIP waitlist before opening week.'],
      ['Pre-launch', 'Finalize launch content shoot', 'Content', 'Content lead', new Date('2026-04-15'), 'Ready', 'High', 4500, 'Need storefront, hero items, and team shots.'],
      ['Soft opening', 'Friends and family service', 'Store experience', 'GM', new Date('2026-04-18'), 'Not started', 'High', 3500, 'Use feedback form and test full menu flow.'],
      ['Soft opening', 'Micro-influencer seeding', 'Social / PR', 'Brand lead', new Date('2026-04-19'), 'Approved', 'Medium', 2500, 'Invite only locally relevant creators.'],
      ['Launch week', 'Grand opening offer live', 'In-store + Meta', 'Growth lead', new Date('2026-04-22'), 'Not started', 'High', 7000, 'Keep offer margin-aware and time-limited.'],
      ['Launch week', 'Local flyer and partner drop', 'Trade area', 'Store lead', new Date('2026-04-22'), 'In progress', 'Medium', 1800, 'Focus offices, gyms, and residential buildings.'],
      ['Launch week', 'Launch-day stories and UGC reposts', 'Social', 'Social exec', new Date('2026-04-22'), 'Ready', 'High', 0, 'Prepare story templates before day one.'],
      ['First 30 days', 'Welcome-back CRM sequence', 'Email / WhatsApp', 'CRM lead', new Date('2026-04-27'), 'Not started', 'High', 1200, 'Target launch-week guests with second-visit offer.'],
      ['First 30 days', 'Review generation push', 'Google / reputation', 'Store lead', new Date('2026-04-29'), 'Ready', 'Medium', 0, 'Train team to ask at peak satisfaction moments.'],
      ['First 30 days', 'First menu performance review', 'Menu / analytics', 'GM', new Date('2026-05-05'), 'Not started', 'High', 0, 'Check hero items, attach rates, and waste.'],
      ['First 30 days', 'Local office partnership test', 'Trade area', 'Partnership lead', new Date('2026-05-07'), 'Not started', 'Medium', 1500, 'Lunch vouchers and meeting platters.'],
    ],
  });

  addTableSheet({
    wb,
    name: 'Launch_Calendar',
    title: 'Launch Rhythm',
    subtitle: 'A simple week-by-week plan to keep the launch moving after the opening event.',
    columns: [
      { header: 'Week', width: 100, fill: 'input' },
      { header: 'Focus', width: 180, fill: 'input' },
      { header: 'Primary message', width: 220, fill: 'input' },
      { header: 'Hero channel', width: 150, fill: 'input' },
      { header: 'KPI', width: 140, fill: 'input' },
      { header: 'Owner', width: 120, fill: 'input' },
    ],
    rows: [
      ['W-2', 'Awareness build', 'We open soon - join the local list', 'Meta + landing page', 'Lead capture', 'Growth lead'],
      ['W-1', 'Soft opening proof', 'See the store, team, and first reactions', 'Stories + creators', 'Content saves', 'Content lead'],
      ['Launch week', 'Grand opening urgency', 'Come in now while the opening offer is live', 'Meta + in-store', 'Transactions', 'GM'],
      ['Week 2', 'Return visit', 'Back for the second trip, not just the first one', 'CRM', 'Repeat visits', 'CRM lead'],
      ['Week 3', 'Local partnerships', 'We are part of this neighborhood', 'Trade area', 'Partner traffic', 'Store lead'],
      ['Week 4', 'Habit formation', 'Build the weekday or weekend ritual', 'Meta + CRM', 'Frequency', 'Growth lead'],
    ],
  });

  const dashboard = wb.worksheets.add('Dashboard');
  setColumnWidths(dashboard, [180, 130, 200, 140, 140, 140, 140, 140]);
  addSheetTitle(
    dashboard,
    'Launch Dashboard',
    'Review completion by phase before the store or campaign goes live.',
    8,
  );
  addMetricBlock(dashboard, 8, 'Launch readiness', [
    { label: 'Total tasks', formula: '=COUNTA(Checklist!A8:A19)', format: FORMATS.integer },
    { label: 'Completed tasks', formula: '=COUNTIF(Checklist!F8:F19,"Complete")+COUNTIF(Checklist!F8:F19,"Live")', format: FORMATS.integer },
    { label: 'Blocked tasks', formula: '=COUNTIF(Checklist!F8:F19,"Blocked")', format: FORMATS.integer },
    { label: 'Launch budget', formula: '=SUM(Checklist!H8:H19)', format: FORMATS.currency0 },
  ]);
  setValues(dashboard, 15, 1, [['Phase', 'Completed / live tasks']]);
  const phases = ['Pre-launch', 'Soft opening', 'Launch week', 'First 30 days'];
  phases.forEach((phase, index) => {
    const row = 16 + index;
    setValues(dashboard, row, 1, [[phase]]);
    setFormulas(dashboard, row, 2, [[`=COUNTIFS(Checklist!A8:A19,"${phase}",Checklist!F8:F19,"Complete")+COUNTIFS(Checklist!A8:A19,"${phase}",Checklist!F8:F19,"Live")`]]);
  });
  styleCompactTable(dashboard, 'A15:B19', 'A15:B15', 'A16:B19', ['B16:B19']);
  styleRange(dashboard, 'B16:B19', { fillColor: COLORS.blueFill, numberFormat: FORMATS.integer });
  const launchChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A15:B19'), 'Auto');
  launchChart.title.text = 'Completed tasks by launch phase';
  launchChart.setPosition(dashboard.getRange('D8:I22'));
  launchChart.width = 560;
  launchChart.height = 320;
  styleChart(launchChart, [COLORS.teal]);

  return {
    wb,
    filename: 'store-launch-marketing-checklist.xlsx',
    previewSheets: [{ sheetName: 'Dashboard', range: 'A1:I22', file: 'store-launch-marketing-checklist.png' }],
  };
}

function buildLocalStoreMarketingPlannerWorkbook() {
  const wb = Workbook.create();
  buildSetupSheet(wb, {
    title: 'Local Store Marketing Planner',
    subtitle: 'Plan local demand generation around the trade area instead of using generic campaigns everywhere.',
    audience: 'Single-store operators, branch marketers, area managers, founders',
    outcome: 'A sharper local plan that prioritizes the right zones, partners, and hyperlocal campaigns.',
    focusAreas: [
      'Score the trade area before choosing tactics so local spend follows real opportunity.',
      'Use the activity planner to track community partnerships, geo campaigns, and attributable visits.',
      'Keep local marketing accountable through visible budget and traffic outcomes.',
    ],
    relatedTabs: [
      { name: 'Trade_Area', purpose: 'Score the zones, segments, and local opportunities around the store.' },
      { name: 'Activity_Planner', purpose: 'Track campaigns, partners, spend, and attributable visits.' },
      { name: 'Dashboard', purpose: 'Review local budget, traffic, and priority zones.' },
    ],
  });

  const tradeArea = addTableSheet({
    wb,
    name: 'Trade_Area',
    title: 'Trade Area Scorecard',
    subtitle: 'Score the local opportunities around the store before you choose channels.',
    columns: [
      { header: 'Zone', width: 170, fill: 'input' },
      { header: 'Primary segment', width: 190, fill: 'input' },
      { header: 'Opportunity score', width: 110, fill: 'input', align: 'right', validation: { type: 'whole', min: 1, max: 5 } },
      { header: 'Brand fit', width: 95, fill: 'input', align: 'right', validation: { type: 'whole', min: 1, max: 5 } },
      { header: 'Ease of reach', width: 110, fill: 'input', align: 'right', validation: { type: 'whole', min: 1, max: 5 } },
      { header: 'Priority score', width: 110, fill: 'formula', format: FORMATS.decimal1, align: 'right' },
      { header: 'Local note', width: 260, fill: 'input' },
    ],
    rows: [
      ['Office corridor', 'Weekday coffee and lunch buyers', 5, 5, 4, null, 'Best for breakfast, coffee passes, and catering leads.'],
      ['Residential towers', 'Weekend and evening diners', 4, 4, 3, null, 'Needs stronger family or convenience angle.'],
      ['School cluster', 'Parents and pickup traffic', 4, 3, 4, null, 'Works best with timed pickup offers.'],
      ['Gym / wellness strip', 'Health-focused regulars', 3, 4, 5, null, 'Category fit strong if product story is visible.'],
      ['Mall spillover', 'Impulse leisure traffic', 3, 3, 2, null, 'Good for seasonal visibility, weak for routine behavior.'],
    ],
  });
  for (let row = tradeArea.firstDataRow; row <= tradeArea.lastDataRow; row += 1) {
    setFormulas(tradeArea.sheet, row, 6, [[`=ROUND(AVERAGE(C${row}:E${row}),1)`]]);
  }
  styleRange(tradeArea.sheet, `F${tradeArea.firstDataRow}:F${tradeArea.lastDataRow}`, { fillColor: COLORS.blueFill });

  addTableSheet({
    wb,
    name: 'Activity_Planner',
    title: 'Activity Planner',
    subtitle: 'Track the local tactics and partnerships that are supposed to move store traffic.',
    columns: [
      { header: 'Month', width: 90, fill: 'input', validation: { type: 'list', source: MONTHS.join(',') } },
      { header: 'Tactic', width: 210, fill: 'input' },
      { header: 'Area or partner', width: 190, fill: 'input' },
      { header: 'Budget', width: 110, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 150000 } },
      { header: 'Expected reach', width: 115, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 0, max: 1000000 } },
      { header: 'Attributed visits', width: 120, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 0, max: 1000000 } },
      { header: 'Status', width: 110, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
      { header: 'Notes', width: 260, fill: 'input' },
    ],
    rows: [
      ['May', 'Commuter geo-targeted Meta ads', 'Office corridor', 2600, 18000, 320, 'Live', '3km radius with breakfast creative only.'],
      ['May', 'Gym partner shaker card', 'Wellness strip', 1200, 1200, 84, 'Approved', 'Redeemable on post-workout smoothies.'],
      ['Jun', 'School pickup offer flyers', 'School cluster', 900, 2500, 96, 'Ready', 'Test only Tue-Thu first.'],
      ['Jun', 'Residential tower sampling', 'Marina towers', 1800, 700, 64, 'Not started', 'Need property management approval.'],
      ['Jul', 'Weekend market pop-up', 'Community event', 2200, 3200, 130, 'In progress', 'Bundle with loyalty scan.'],
      ['Sep', 'Office catering pitch drop', 'Office corridor', 1500, 600, 22, 'Not started', 'Pair with meeting platter PDF.'],
    ],
  });

  const dashboard = wb.worksheets.add('Dashboard');
  setColumnWidths(dashboard, [190, 130, 190, 140, 140, 140, 140, 140]);
  addSheetTitle(
    dashboard,
    'Local Marketing Dashboard',
    'Review where the store should focus local effort and how much demand each tactic is creating.',
    8,
  );
  addMetricBlock(dashboard, 8, 'Local summary', [
    { label: 'Average priority score', formula: '=AVERAGE(Trade_Area!F8:F12)', format: FORMATS.decimal1 },
    { label: 'Total local budget', formula: '=SUM(Activity_Planner!D8:D13)', format: FORMATS.currency0 },
    { label: 'Attributed visits', formula: '=SUM(Activity_Planner!F8:F13)', format: FORMATS.integer },
    { label: 'Live or approved plays', formula: '=COUNTIF(Activity_Planner!G8:G13,"Live")+COUNTIF(Activity_Planner!G8:G13,"Approved")+COUNTIF(Activity_Planner!G8:G13,"Ready")', format: FORMATS.integer },
  ]);
  setValues(dashboard, 15, 1, [['Zone', 'Priority score']]);
  for (let index = 0; index < 5; index += 1) {
    const row = 16 + index;
    setFormulas(dashboard, row, 1, [[`=Trade_Area!A${8 + index}`]]);
    setFormulas(dashboard, row, 2, [[`=Trade_Area!F${8 + index}`]]);
  }
  styleCompactTable(dashboard, 'A15:B20', 'A15:B15', 'A16:B20', ['B16:B20']);
  styleRange(dashboard, 'B16:B20', { fillColor: COLORS.blueFill, numberFormat: FORMATS.decimal1 });
  const localChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A15:B20'), 'Auto');
  localChart.title.text = 'Priority by trade-area zone';
  localChart.setPosition(dashboard.getRange('D8:I22'));
  localChart.width = 560;
  localChart.height = 320;
  styleChart(localChart, [COLORS.indigo]);

  return {
    wb,
    filename: 'local-store-marketing-planner.xlsx',
    previewSheets: [{ sheetName: 'Dashboard', range: 'A1:I22', file: 'local-store-marketing-planner.png' }],
  };
}

function buildMenuLaunchPlannerWorkbook() {
  const wb = Workbook.create();
  buildSetupSheet(wb, {
    title: 'Menu Launch and Offer Planner',
    subtitle:
      'Use this file to launch menu items with better margin visibility, hero-item logic, and asset readiness.',
    audience: 'Brand teams, chefs, menu marketers, founders, product leads',
    outcome: 'A tighter launch process where item economics, storytelling, and rollout assets align before launch day.',
    focusAreas: [
      'Keep price, food cost, and gross profit visible while planning new menu pushes.',
      'Track whether each launch item has the creative, in-store, and delivery assets required to sell.',
      'Use the dashboard to compare expected revenue and expected gross profit by item.',
    ],
    relatedTabs: [
      { name: 'Launch_Items', purpose: 'The commercial and rollout details for each new item or bundle.' },
      { name: 'Asset_Checklist', purpose: 'A simple tracker for the assets needed to support the launch properly.' },
      { name: 'Dashboard', purpose: 'Forecast the gross profit and launch readiness of the plan.' },
    ],
  });

  const launchItems = addTableSheet({
    wb,
    name: 'Launch_Items',
    title: 'Launch Items',
    subtitle: 'One row per item, bundle, or offer you are preparing to push.',
    columns: [
      { header: 'Item or offer', width: 220, fill: 'input' },
      { header: 'Category', width: 130, fill: 'input' },
      { header: 'Daypart', width: 110, fill: 'input' },
      { header: 'Launch date', width: 110, fill: 'input', format: FORMATS.date },
      { header: 'Price', width: 100, fill: 'input', format: FORMATS.currency2, align: 'right', validation: { type: 'decimal', min: 0, max: 5000 } },
      { header: 'Food cost', width: 100, fill: 'input', format: FORMATS.currency2, align: 'right', validation: { type: 'decimal', min: 0, max: 5000 } },
      { header: 'Margin %', width: 95, fill: 'formula', format: FORMATS.percent1, align: 'right' },
      { header: 'Hero item', width: 90, fill: 'input', validation: { type: 'list', source: YES_NO_SOURCE } },
      { header: 'Channel focus', width: 150, fill: 'input' },
      { header: 'Forecast units', width: 110, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 0, max: 1000000 } },
      { header: 'Forecast revenue', width: 130, fill: 'formula', format: FORMATS.currency0, align: 'right' },
      { header: 'Forecast GP', width: 120, fill: 'formula', format: FORMATS.currency0, align: 'right' },
      { header: 'Status', width: 110, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
    ],
    rows: [
      ['Iced pistachio latte', 'Beverage', 'Afternoon', new Date('2026-06-05'), 28, 9.5, null, 'Yes', 'Instagram + in-store', 2400, null, null, 'Approved'],
      ['Breakfast duo combo', 'Bundle', 'Morning', new Date('2026-05-10'), 34, 13.5, null, 'Yes', 'Meta + flyers', 1800, null, null, 'Ready'],
      ['Affogato soft serve', 'Dessert', 'Evening', new Date('2026-06-20'), 32, 11, null, 'No', 'Instagram + creators', 900, null, null, 'In progress'],
      ['Family iftar box', 'Bundle', 'Evening', new Date('2026-03-08'), 149, 58, null, 'Yes', 'WhatsApp + Meta', 420, null, null, 'Live'],
      ['Protein smoothie upgrade', 'Add-on', 'Anytime', new Date('2026-05-22'), 12, 3.2, null, 'No', 'In-store + CRM', 3200, null, null, 'Not started'],
    ],
  });
  for (let row = launchItems.firstDataRow; row <= launchItems.lastDataRow; row += 1) {
    setFormulas(launchItems.sheet, row, 7, [[`=IF(E${row}=0,"",(E${row}-F${row})/E${row})`]]);
    setFormulas(launchItems.sheet, row, 11, [[`=E${row}*J${row}`]]);
    setFormulas(launchItems.sheet, row, 12, [[`=(E${row}-F${row})*J${row}`]]);
  }
  styleRange(launchItems.sheet, `G${launchItems.firstDataRow}:L${launchItems.lastDataRow}`, { fillColor: COLORS.blueFill });

  addTableSheet({
    wb,
    name: 'Asset_Checklist',
    title: 'Asset Checklist',
    subtitle: 'Track whether the launch has the operational and marketing support it needs.',
    columns: [
      { header: 'Asset', width: 210, fill: 'input' },
      { header: 'Channel', width: 150, fill: 'input' },
      { header: 'Owner', width: 120, fill: 'input' },
      { header: 'Due date', width: 110, fill: 'input', format: FORMATS.date },
      { header: 'Status', width: 110, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
      { header: 'Notes', width: 290, fill: 'input' },
    ],
    rows: [
      ['Hero photo set', 'Instagram / aggregators', 'Content lead', new Date('2026-05-28'), 'Ready', 'Need clean menu-board crop too.'],
      ['Story captions', 'Stories / WhatsApp', 'Brand lead', new Date('2026-05-29'), 'In progress', 'Draft benefit-led copy, not just price.'],
      ['Menu board update', 'In-store', 'Store lead', new Date('2026-06-01'), 'Not started', 'Coordinate with ops for print timing.'],
      ['Delivery thumbnail resize', 'Aggregator', 'Growth lead', new Date('2026-06-02'), 'Approved', 'Use same hero shot across platforms.'],
      ['Staff tasting notes', 'Front of house', 'GM', new Date('2026-06-03'), 'Ready', 'Train teams on when to upsell it.'],
    ],
  });

  const dashboard = wb.worksheets.add('Dashboard');
  setColumnWidths(dashboard, [190, 130, 200, 140, 140, 140, 140, 140, 140]);
  addSheetTitle(
    dashboard,
    'Menu Launch Dashboard',
    'Review which items are commercially attractive and operationally ready to push.',
    9,
  );
  addMetricBlock(dashboard, 8, 'Launch summary', [
    { label: 'Average margin %', formula: '=AVERAGE(Launch_Items!G8:G12)', format: FORMATS.percent1 },
    { label: 'Forecast revenue', formula: '=SUM(Launch_Items!K8:K12)', format: FORMATS.currency0 },
    { label: 'Forecast gross profit', formula: '=SUM(Launch_Items!L8:L12)', format: FORMATS.currency0 },
    { label: 'Assets ready or approved', formula: '=COUNTIF(Asset_Checklist!E8:E12,"Ready")+COUNTIF(Asset_Checklist!E8:E12,"Approved")+COUNTIF(Asset_Checklist!E8:E12,"Complete")', format: FORMATS.integer },
  ]);
  setValues(dashboard, 15, 1, [['Item', 'Forecast revenue', 'Forecast GP']]);
  for (let index = 0; index < 5; index += 1) {
    const row = 16 + index;
    setFormulas(dashboard, row, 1, [[`=Launch_Items!A${8 + index}`]]);
    setFormulas(dashboard, row, 2, [[`=Launch_Items!K${8 + index}`]]);
    setFormulas(dashboard, row, 3, [[`=Launch_Items!L${8 + index}`]]);
  }
  styleCompactTable(dashboard, 'A15:C20', 'A15:C15', 'A16:C20', ['B16:C20']);
  styleRange(dashboard, 'B16:C20', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  const menuChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A15:C20'), 'Auto');
  menuChart.title.text = 'Forecast revenue vs gross profit';
  menuChart.setPosition(dashboard.getRange('E8:K22'));
  menuChart.width = 620;
  menuChart.height = 320;
  styleChart(menuChart, [COLORS.amber, COLORS.teal]);

  return {
    wb,
    filename: 'menu-launch-and-offer-planner.xlsx',
    previewSheets: [{ sheetName: 'Dashboard', range: 'A1:K22', file: 'menu-launch-and-offer-planner.png' }],
  };
}

function buildDeliveryAuditWorkbook() {
  const wb = Workbook.create();
  buildSetupSheet(wb, {
    title: 'Delivery & Aggregator Audit',
    subtitle:
      'Score platform visibility and menu quality the way operators review a real channel, not just a listing.',
    audience: 'Cloud kitchens, delivery-first brands, operators with meaningful aggregator mix',
    outcome: 'A visible score and action list for menu quality, offer logic, packaging, and repeat-order readiness.',
    focusAreas: [
      'Keep menu quality, pricing, photos, descriptions, bundles, and prep-time logic inside the same review.',
      'Use weighted scoring so one weak area does not hide behind a single strong score.',
      'Turn platform issues into owner-assigned actions instead of vague “improve delivery” notes.',
    ],
    relatedTabs: [
      { name: 'Audit', purpose: 'Weighted scoring by platform and audit area.' },
      { name: 'Action_Plan', purpose: 'Owner-based action list for the issues found in the audit.' },
      { name: 'Dashboard', purpose: 'Average weighted score by platform.' },
    ],
  });

  const auditAreas = [
    ['Talabat', 'Menu selection', 15, 4, null, 'Menu slightly too broad for late-night delivery.', 'Growth lead', 'In progress'],
    ['Talabat', 'Pricing architecture', 15, 3, null, 'Bundle ladder unclear for higher baskets.', 'Growth lead', 'In progress'],
    ['Talabat', 'Photos', 10, 4, null, 'Hero items covered but desserts missing.', 'Content lead', 'Approved'],
    ['Talabat', 'Descriptions', 8, 3, null, 'Descriptions lack brand voice and clear benefit.', 'Brand lead', 'Not started'],
    ['Talabat', 'Bundles / upsells', 15, 2, null, 'Meal deals not surfaced high enough.', 'Growth lead', 'Not started'],
    ['Talabat', 'Promo stack', 12, 4, null, 'Discounts good, but CRM handoff absent.', 'CRM lead', 'Ready'],
    ['Talabat', 'Prep times', 10, 5, null, 'Times mostly accurate.', 'GM', 'Approved'],
    ['Talabat', 'Packaging & repeat', 15, 3, null, 'No reminder insert or reorder nudge.', 'Ops lead', 'Not started'],
    ['Deliveroo', 'Menu selection', 15, 5, null, 'Most popular items pinned well.', 'Growth lead', 'Approved'],
    ['Deliveroo', 'Pricing architecture', 15, 4, null, 'Good value ladder, premium dessert add-on weak.', 'Growth lead', 'In progress'],
    ['Deliveroo', 'Photos', 10, 5, null, 'Strong platform photography set.', 'Content lead', 'Approved'],
    ['Deliveroo', 'Descriptions', 8, 4, null, 'Descriptions clear but could upsell more.', 'Brand lead', 'Approved'],
    ['Deliveroo', 'Bundles / upsells', 15, 4, null, 'Need more side and beverage attach logic.', 'Growth lead', 'In progress'],
    ['Deliveroo', 'Promo stack', 12, 3, null, 'Over-reliance on platform-funded discount.', 'Growth lead', 'Blocked'],
    ['Deliveroo', 'Prep times', 10, 4, null, 'Weekend spikes need reset.', 'GM', 'In progress'],
    ['Deliveroo', 'Packaging & repeat', 15, 4, null, 'Good seal quality, no loyalty hook.', 'Ops lead', 'Approved'],
    ['Careem', 'Menu selection', 15, 3, null, 'Needs tighter menu and better category order.', 'Growth lead', 'Not started'],
    ['Careem', 'Pricing architecture', 15, 3, null, 'Price jumps between mains and bundles feel random.', 'Growth lead', 'Not started'],
    ['Careem', 'Photos', 10, 2, null, 'Too few high-quality hero photos.', 'Content lead', 'Blocked'],
    ['Careem', 'Descriptions', 8, 2, null, 'Descriptions generic and too short.', 'Brand lead', 'Not started'],
    ['Careem', 'Bundles / upsells', 15, 2, null, 'No meal deals or add-on flow.', 'Growth lead', 'Not started'],
    ['Careem', 'Promo stack', 12, 3, null, 'Promos exist but no peak-hour logic.', 'Growth lead', 'In progress'],
    ['Careem', 'Prep times', 10, 3, null, 'Late delivery windows need review.', 'GM', 'In progress'],
    ['Careem', 'Packaging & repeat', 15, 2, null, 'Packaging good enough, repeat trigger absent.', 'Ops lead', 'Not started'],
  ];

  const audit = addTableSheet({
    wb,
    name: 'Audit',
    title: 'Delivery Audit',
    subtitle: 'Use a 1-5 score. Weighted score is calculated automatically.',
    instructions: [
      'Menu best practice: keep delivery menus focused, with hero items clearly surfaced and strong photos and descriptions.',
    ],
    columns: [
      { header: 'Platform', width: 120, fill: 'input', validation: { type: 'list', source: 'Talabat,Deliveroo,Careem' } },
      { header: 'Audit area', width: 170, fill: 'input' },
      { header: 'Weight', width: 85, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 1, max: 100 } },
      { header: 'Score (1-5)', width: 95, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 1, max: 5 } },
      { header: 'Weighted score', width: 110, fill: 'formula', format: FORMATS.decimal1, align: 'right' },
      { header: 'Issue or note', width: 290, fill: 'input' },
      { header: 'Action owner', width: 120, fill: 'input' },
      { header: 'Status', width: 110, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
    ],
    rows: auditAreas,
  });
  for (let row = audit.firstDataRow; row <= audit.lastDataRow; row += 1) {
    setFormulas(audit.sheet, row, 5, [[`=C${row}*D${row}`]]);
  }
  styleRange(audit.sheet, `E${audit.firstDataRow}:E${audit.lastDataRow}`, { fillColor: COLORS.blueFill });

  addTableSheet({
    wb,
    name: 'Action_Plan',
    title: 'Action Plan',
    subtitle: 'Copy or refine the actions that need to happen next.',
    columns: [
      { header: 'Platform', width: 110, fill: 'input' },
      { header: 'Action', width: 270, fill: 'input' },
      { header: 'Owner', width: 120, fill: 'input' },
      { header: 'Due date', width: 110, fill: 'input', format: FORMATS.date },
      { header: 'Impact', width: 110, fill: 'input', validation: { type: 'list', source: PRIORITY_SOURCE } },
      { header: 'Status', width: 110, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
    ],
    rows: [
      ['Talabat', 'Rebuild bundle ladder and attach beverages to hero meals', 'Growth lead', new Date('2026-07-05'), 'High', 'Not started'],
      ['Deliveroo', 'Reduce promo dependence and test premium bundle instead', 'Growth lead', new Date('2026-07-09'), 'Medium', 'In progress'],
      ['Careem', 'Reshoot hero items and shorten menu to top performers only', 'Content lead', new Date('2026-07-03'), 'High', 'Blocked'],
      ['Careem', 'Add packaging insert with reorder prompt and WhatsApp opt-in', 'Ops lead', new Date('2026-07-12'), 'Medium', 'Not started'],
    ],
  });

  const dashboard = wb.worksheets.add('Dashboard');
  setColumnWidths(dashboard, [160, 130, 130, 130, 130, 130, 130, 130]);
  addSheetTitle(
    dashboard,
    'Delivery Audit Dashboard',
    'Average weighted score is calculated by platform so channel health is visible quickly.',
    8,
  );
  addMetricBlock(dashboard, 8, 'Channel summary', [
    { label: 'Audit rows', formula: '=COUNTA(Audit!A8:A31)', format: FORMATS.integer },
    { label: 'Open actions', formula: '=COUNTIF(Action_Plan!F8:F11,"Not started")+COUNTIF(Action_Plan!F8:F11,"In progress")+COUNTIF(Action_Plan!F8:F11,"Blocked")', format: FORMATS.integer },
    { label: 'Average score all platforms', formula: '=AVERAGE(Audit!E8:E31)', format: FORMATS.decimal1 },
    { label: 'Low-scoring rows (score <= 2)', formula: '=COUNTIF(Audit!D8:D31,"<=2")', format: FORMATS.integer },
  ]);
  setValues(dashboard, 15, 1, [['Platform', 'Average weighted score']]);
  ['Talabat', 'Deliveroo', 'Careem'].forEach((platform, index) => {
    const row = 16 + index;
    setValues(dashboard, row, 1, [[platform]]);
    setFormulas(
      dashboard,
      row,
      2,
      [[`=IF(SUMIF(Audit!A8:A31,"${platform}",Audit!C8:C31)=0,"",SUMIF(Audit!A8:A31,"${platform}",Audit!E8:E31)/SUMIF(Audit!A8:A31,"${platform}",Audit!C8:C31))`]],
    );
  });
  styleCompactTable(dashboard, 'A15:B18', 'A15:B15', 'A16:B18', ['B16:B18']);
  styleRange(dashboard, 'B16:B18', { fillColor: COLORS.blueFill, numberFormat: FORMATS.decimal1 });
  const deliveryChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A15:B18'), 'Auto');
  deliveryChart.title.text = 'Average weighted score by platform';
  deliveryChart.setPosition(dashboard.getRange('D8:I22'));
  deliveryChart.width = 560;
  deliveryChart.height = 320;
  styleChart(deliveryChart, [COLORS.teal]);

  return {
    wb,
    filename: 'delivery-aggregator-audit.xlsx',
    previewSheets: [{ sheetName: 'Dashboard', range: 'A1:I22', file: 'delivery-aggregator-audit.png' }],
  };
}

function buildCRMCampaignPlannerWorkbook() {
  const wb = Workbook.create();
  buildSetupSheet(wb, {
    title: 'CRM & Loyalty Campaign Planner',
    subtitle:
      'Plan lifecycle campaigns around repeat behavior, not just one-off promotions.',
    audience: 'CRM leads, founders, guest marketing teams, retention-focused operators',
    outcome: 'A clearer retention plan across journeys, segments, channels, and revenue accountability.',
    focusAreas: [
      'Separate lifecycle journeys from one-off blast campaigns.',
      'Track cost, open rate, CTR, unsubscribes, and revenue in the same planner.',
      'Use the dashboard to review whether retention work is earning repeat demand.',
    ],
    relatedTabs: [
      { name: 'Journey_Map', purpose: 'The standing lifecycle journeys you want to run consistently.' },
      { name: 'Campaign_Planner', purpose: 'Campaign-level execution, cost, and performance tracking.' },
      { name: 'Dashboard', purpose: 'A fast view of CRM revenue and engagement quality.' },
    ],
  });

  addTableSheet({
    wb,
    name: 'Journey_Map',
    title: 'Lifecycle Journeys',
    subtitle: 'Map the repeat-purchase logic you want to make habitual.',
    columns: [
      { header: 'Stage', width: 140, fill: 'input' },
      { header: 'Trigger', width: 220, fill: 'input' },
      { header: 'Channel', width: 130, fill: 'input' },
      { header: 'Objective', width: 200, fill: 'input' },
      { header: 'Offer or message', width: 230, fill: 'input' },
      { header: 'Cadence', width: 120, fill: 'input' },
    ],
    rows: [
      ['Welcome', 'First recorded visit', 'Email', 'Get the second visit booked quickly', 'Thank them and show the hero menu path', 'Within 24 hours'],
      ['Routine builder', '2 visits in 14 days', 'WhatsApp', 'Convert into a habit', 'Coffee pass or weekday ritual reminder', 'Weekly'],
      ['Lapse risk', 'No visit in 21 days', 'SMS', 'Recover the guest before churn deepens', 'Small nudge tied to a hero item', 'One-off'],
      ['Birthday', 'Birthday month', 'Email', 'Celebrate and lift spend', 'Occasion-led experience or gifting hook', 'Monthly'],
      ['VIP', 'High-spend repeat guest', 'WhatsApp', 'Protect loyalty and advocacy', 'Priority access and new menu preview', 'As needed'],
      ['Launch interest', 'Clicked menu launch CTA', 'Email', 'Drive first purchase of the new item', 'Benefit-led follow-up and reminder', '2-step'],
    ],
  });

  const campaigns = addTableSheet({
    wb,
    name: 'Campaign_Planner',
    title: 'Campaign Planner',
    subtitle: 'Track performance by campaign, channel, and segment.',
    columns: [
      { header: 'Send date', width: 110, fill: 'input', format: FORMATS.date },
      { header: 'Channel', width: 110, fill: 'input', validation: { type: 'list', source: 'Email,SMS,WhatsApp,Push' } },
      { header: 'Segment', width: 170, fill: 'input' },
      { header: 'Objective', width: 190, fill: 'input' },
      { header: 'Offer or message', width: 220, fill: 'input' },
      { header: 'Audience size', width: 105, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 0, max: 1000000 } },
      { header: 'Send cost', width: 100, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 100000 } },
      { header: 'Orders / bookings', width: 115, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 0, max: 1000000 } },
      { header: 'Revenue', width: 110, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 1000000 } },
      { header: 'Gross margin %', width: 110, fill: 'input', format: FORMATS.percent1, align: 'right', validation: { type: 'decimal', min: 0, max: 1 } },
      { header: 'Open rate', width: 90, fill: 'input', format: FORMATS.percent1, align: 'right', validation: { type: 'decimal', min: 0, max: 1 } },
      { header: 'CTR', width: 80, fill: 'input', format: FORMATS.percent1, align: 'right', validation: { type: 'decimal', min: 0, max: 1 } },
      { header: 'Unsub %', width: 80, fill: 'input', format: FORMATS.percent1, align: 'right', validation: { type: 'decimal', min: 0, max: 1 } },
      { header: 'MROI', width: 90, fill: 'formula', format: FORMATS.percent1, align: 'right' },
    ],
    rows: [
      [new Date('2026-01-12'), 'Email', 'Recent first-time guests', 'Second visit recovery', 'Try our breakfast duo on your next stop', 4200, 350, 180, 12400, 0.74, 0.48, 0.09, 0.01, null],
      [new Date('2026-02-08'), 'WhatsApp', 'VIP diners', 'Valentine early access', 'Private booking link before public release', 580, 220, 82, 16800, 0.78, 0.72, 0.24, 0.0, null],
      [new Date('2026-03-05'), 'SMS', 'Lapsed Ramadan customers', 'Group-order recovery', 'Sharing bundle live tonight', 2600, 470, 146, 9800, 0.63, 0.96, 0.14, 0.01, null],
      [new Date('2026-06-14'), 'Push', 'Cold drinks engagers', 'Launch conversion', 'Your iced favorite just dropped', 6800, 180, 210, 13400, 0.68, 0.58, 0.12, 0.02, null],
      [new Date('2026-09-02'), 'Email', 'Back-to-office commuters', 'Morning traffic recovery', 'Restart your weekday coffee ritual', 5100, 420, 204, 14300, 0.71, 0.44, 0.07, 0.01, null],
    ],
  });
  for (let row = campaigns.firstDataRow; row <= campaigns.lastDataRow; row += 1) {
    setFormulas(campaigns.sheet, row, 14, [[`=IF(G${row}=0,"",(I${row}*J${row}-G${row})/G${row})`]]);
  }
  styleRange(campaigns.sheet, `N${campaigns.firstDataRow}:N${campaigns.lastDataRow}`, { fillColor: COLORS.blueFill });

  const dashboard = wb.worksheets.add('Dashboard');
  setColumnWidths(dashboard, [180, 130, 180, 140, 140, 140, 140, 140, 140]);
  addSheetTitle(
    dashboard,
    'CRM Dashboard',
    'Review lifecycle revenue, engagement quality, and message efficiency.',
    9,
  );
  addMetricBlock(dashboard, 8, 'CRM summary', [
    { label: 'CRM revenue', formula: '=SUM(Campaign_Planner!I8:I12)', format: FORMATS.currency0 },
    { label: 'Average open rate', formula: '=AVERAGE(Campaign_Planner!K8:K12)', format: FORMATS.percent1 },
    { label: 'Average CTR', formula: '=AVERAGE(Campaign_Planner!L8:L12)', format: FORMATS.percent1 },
    { label: 'Average MROI', formula: '=AVERAGE(Campaign_Planner!N8:N12)', format: FORMATS.percent1 },
  ]);
  setValues(dashboard, 15, 1, [['Channel', 'Revenue']]);
  ['Email', 'SMS', 'WhatsApp', 'Push'].forEach((channel, index) => {
    const row = 16 + index;
    setValues(dashboard, row, 1, [[channel]]);
    setFormulas(dashboard, row, 2, [[`=SUMIF(Campaign_Planner!B8:B12,"${channel}",Campaign_Planner!I8:I12)`]]);
  });
  styleCompactTable(dashboard, 'A15:B19', 'A15:B15', 'A16:B19', ['B16:B19']);
  styleRange(dashboard, 'B16:B19', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  const crmChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A15:B19'), 'Auto');
  crmChart.title.text = 'Revenue by CRM channel';
  crmChart.setPosition(dashboard.getRange('D8:I22'));
  crmChart.width = 560;
  crmChart.height = 320;
  styleChart(crmChart, [COLORS.teal]);

  return {
    wb,
    filename: 'crm-loyalty-campaign-planner.xlsx',
    previewSheets: [{ sheetName: 'Dashboard', range: 'A1:I22', file: 'crm-loyalty-campaign-planner.png' }],
  };
}

function buildGBPChecklistWorkbook() {
  const wb = Workbook.create();
  buildSetupSheet(wb, {
    title: 'Google Business Profile Checklist',
    subtitle:
      'Keep store discovery, map visibility, ordering links, photos, posts, and review handling disciplined at branch level.',
    audience: 'Local SEO leads, store marketers, founders, multi-unit operators',
    outcome: 'A cleaner store profile with clear completion status and a simple log for reviews and posts.',
    focusAreas: [
      'Use the official restaurant profile setup logic: core info, ordering, menu, photos, posts, reviews, and insights.',
      'Keep profile governance visible so branch pages do not drift out of date.',
      'Track review response speed and posting cadence alongside setup completion.',
    ],
    relatedTabs: [
      { name: 'Checklist', purpose: 'Profile setup, governance, and optimization checklist.' },
      { name: 'Review_Post_Log', purpose: 'Simple review and post tracking for local activity.' },
      { name: 'Dashboard', purpose: 'Completion and engagement snapshot.' },
    ],
  });

  addTableSheet({
    wb,
    name: 'Checklist',
    title: 'Profile Checklist',
    subtitle: 'Built from the restaurant Business Profile setup flow and local optimization best practice.',
    columns: [
      { header: 'Area', width: 170, fill: 'input' },
      { header: 'Item', width: 260, fill: 'input' },
      { header: 'Owner', width: 120, fill: 'input' },
      { header: 'Status', width: 110, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
      { header: 'Priority', width: 100, fill: 'input', validation: { type: 'list', source: PRIORITY_SOURCE } },
      { header: 'Due date', width: 110, fill: 'input', format: FORMATS.date },
      { header: 'Notes', width: 260, fill: 'input' },
    ],
    rows: [
      ['Claim & verify', 'Claim profile ownership and complete verification', 'SEO lead', 'Approved', 'High', new Date('2026-04-05'), 'Required before posts and media can work fully.'],
      ['Core info', 'Confirm address, phone, hours, special hours, and social links', 'Store lead', 'In progress', 'High', new Date('2026-04-06'), 'Holiday and exceptional hours need a separate cadence.'],
      ['Ordering', 'Check ordering provider links and preferred menu URL', 'Growth lead', 'Ready', 'High', new Date('2026-04-06'), 'Remove weak third-party links if direct ordering is stronger.'],
      ['Attributes', 'Update dine-in, delivery, pickup, accessibility, and service attributes', 'Store lead', 'Not started', 'Medium', new Date('2026-04-07'), 'Keep this aligned to real service capability.'],
      ['Photos', 'Add exterior, interior, food, team, and atmosphere photos', 'Content lead', 'In progress', 'High', new Date('2026-04-08'), 'Google recommends category-specific coverage.'],
      ['Menu', 'Update sections, dishes, descriptions, and menu images', 'Brand lead', 'Ready', 'High', new Date('2026-04-08'), 'Important for restaurant-specific profile actions.'],
      ['Posts', 'Schedule offers, updates, and event posts', 'SEO lead', 'Not started', 'Medium', new Date('2026-04-10'), 'Keep a monthly cadence, especially for openings and seasonal moments.'],
      ['Reviews', 'Create review request and response workflow', 'GM', 'In progress', 'High', new Date('2026-04-09'), 'Response quality affects trust and local discovery.'],
      ['Insights', 'Review searches, menu clicks, and bookings monthly', 'Growth lead', 'Not started', 'Medium', new Date('2026-04-12'), 'Use trend data to spot weak local visibility.'],
    ],
  });

  addTableSheet({
    wb,
    name: 'Review_Post_Log',
    title: 'Review & Post Log',
    subtitle: 'Track how actively the profile is being used and maintained.',
    columns: [
      { header: 'Date', width: 110, fill: 'input', format: FORMATS.date },
      { header: 'Type', width: 100, fill: 'input', validation: { type: 'list', source: 'Review,Post' } },
      { header: 'Topic', width: 190, fill: 'input' },
      { header: 'Rating', width: 90, fill: 'input', format: FORMATS.decimal1, align: 'right', validation: { type: 'decimal', min: 0, max: 5 } },
      { header: 'Response hours', width: 120, fill: 'input', format: FORMATS.decimal1, align: 'right', validation: { type: 'decimal', min: 0, max: 500 } },
      { header: 'Status', width: 110, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
      { header: 'Notes', width: 280, fill: 'input' },
    ],
    rows: [
      [new Date('2026-04-10'), 'Review', 'Breakfast quality compliment', 4.8, 4, 'Complete', 'Responded with invitation to try the new combo.'],
      [new Date('2026-04-11'), 'Post', 'Opening-week offer', null, null, 'Live', 'Used hero storefront + drink image.'],
      [new Date('2026-04-12'), 'Review', 'Late delivery complaint', 2.4, 10, 'Complete', 'Escalated to delivery ops and responded same day.'],
      [new Date('2026-04-15'), 'Post', 'Cold drinks launch', null, null, 'Approved', 'Publish after hero assets are resized.'],
      [new Date('2026-04-18'), 'Review', 'Atmosphere and service praise', 5.0, 6, 'Complete', 'Good candidate for story repost.'],
    ],
  });

  const dashboard = wb.worksheets.add('Dashboard');
  setColumnWidths(dashboard, [185, 130, 180, 140, 140, 140, 140, 140]);
  addSheetTitle(
    dashboard,
    'GBP Dashboard',
    'Use this view to see how complete and active the profile is at any given moment.',
    8,
  );
  addMetricBlock(dashboard, 8, 'Profile summary', [
    { label: 'Checklist items complete', formula: '=COUNTIF(Checklist!D8:D16,"Complete")+COUNTIF(Checklist!D8:D16,"Ready")+COUNTIF(Checklist!D8:D16,"Approved")', format: FORMATS.integer },
    { label: 'Average review rating', formula: '=AVERAGEIF(Review_Post_Log!D8:D12,">0")', format: FORMATS.decimal1 },
    { label: 'Reviews answered within 24h', formula: '=COUNTIFS(Review_Post_Log!B8:B12,"Review",Review_Post_Log!E8:E12,"<=24")', format: FORMATS.integer },
    { label: 'Posts logged', formula: '=COUNTIF(Review_Post_Log!B8:B12,"Post")', format: FORMATS.integer },
  ]);
  setValues(dashboard, 15, 1, [['Area', 'Open items']]);
  const checklistAreas = ['Claim & verify', 'Core info', 'Ordering', 'Attributes', 'Photos', 'Menu', 'Posts', 'Reviews', 'Insights'];
  checklistAreas.forEach((area, index) => {
    const row = 16 + index;
    setValues(dashboard, row, 1, [[area]]);
    setFormulas(dashboard, row, 2, [[`=COUNTIFS(Checklist!A8:A16,"${area}",Checklist!D8:D16,"<>Complete",Checklist!D8:D16,"<>Ready",Checklist!D8:D16,"<>Approved")`]]);
  });
  styleCompactTable(dashboard, 'A15:B24', 'A15:B15', 'A16:B24', ['B16:B24']);
  styleRange(dashboard, 'B16:B24', { fillColor: COLORS.blueFill, numberFormat: FORMATS.integer });
  const gbpChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A15:B24'), 'Auto');
  gbpChart.title.text = 'Open items by profile area';
  gbpChart.setPosition(dashboard.getRange('D8:I24'));
  gbpChart.width = 560;
  gbpChart.height = 340;
  styleChart(gbpChart, [COLORS.coral]);

  return {
    wb,
    filename: 'google-business-profile-checklist.xlsx',
    previewSheets: [{ sheetName: 'Dashboard', range: 'A1:I24', file: 'google-business-profile-checklist.png' }],
  };
}

function buildFranchiseRolloutTrackerWorkbook() {
  const wb = Workbook.create();
  buildSetupSheet(wb, {
    title: 'Franchise Campaign Rollout Tracker',
    subtitle:
      'Track centralized campaign rollout without losing visibility into local readiness and compliance.',
    audience: 'Franchise marketing teams, multi-unit operators, area managers, brand governance leads',
    outcome: 'A cleaner store-by-store rollout view with compliance and launch status in the same file.',
    focusAreas: [
      'Keep central asset distribution and local adaptation approvals visible together.',
      'Track store compliance as a management signal, not an afterthought.',
      'Use region-based dashboard views to see where rollout friction is clustering.',
    ],
    relatedTabs: [
      { name: 'Stores', purpose: 'The store roster and compliance snapshot.' },
      { name: 'Campaign_Rollout', purpose: 'Campaign-by-store rollout tracking.' },
      { name: 'Dashboard', purpose: 'Average compliance and readiness by region.' },
    ],
  });

  addTableSheet({
    wb,
    name: 'Stores',
    title: 'Store Roster',
    subtitle: 'Track branch format, stage, and compliance in one place.',
    columns: [
      { header: 'Store', width: 180, fill: 'input' },
      { header: 'City', width: 120, fill: 'input' },
      { header: 'Region', width: 120, fill: 'input', validation: { type: 'list', source: 'Dubai,Abu Dhabi,Sharjah,Doha,Riyadh' } },
      { header: 'Format', width: 130, fill: 'input', validation: { type: 'list', source: 'Cafe,QSR,Fast casual,Cloud kitchen' } },
      { header: 'Launch stage', width: 120, fill: 'input', validation: { type: 'list', source: 'Operating,Opening soon,Pipeline' } },
      { header: 'Local lead', width: 120, fill: 'input' },
      { header: 'Compliance %', width: 110, fill: 'input', format: FORMATS.percent1, align: 'right', validation: { type: 'decimal', min: 0, max: 1 } },
      { header: 'Go-live date', width: 110, fill: 'input', format: FORMATS.date },
      { header: 'Status', width: 110, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
    ],
    rows: [
      ['Jumeirah Beach Road', 'Dubai', 'Dubai', 'Cafe', 'Operating', 'Sara', 0.92, new Date('2025-09-10'), 'Live'],
      ['Marina Promenade', 'Dubai', 'Dubai', 'Cafe', 'Operating', 'Faisal', 0.87, new Date('2025-11-02'), 'Live'],
      ['Yas Bay', 'Abu Dhabi', 'Abu Dhabi', 'Fast casual', 'Opening soon', 'Omar', 0.74, new Date('2026-05-12'), 'Ready'],
      ['Aljada', 'Sharjah', 'Sharjah', 'QSR', 'Pipeline', 'Maha', 0.58, new Date('2026-08-20'), 'In progress'],
      ['West Bay', 'Doha', 'Doha', 'Cafe', 'Operating', 'Lina', 0.81, new Date('2025-12-01'), 'Live'],
      ['Olaya', 'Riyadh', 'Riyadh', 'Cloud kitchen', 'Opening soon', 'Hassan', 0.69, new Date('2026-06-18'), 'Approved'],
    ],
  });

  addTableSheet({
    wb,
    name: 'Campaign_Rollout',
    title: 'Campaign Rollout',
    subtitle: 'Use one row per campaign and store pairing when local rollout matters.',
    columns: [
      { header: 'Store', width: 180, fill: 'input' },
      { header: 'Campaign', width: 220, fill: 'input' },
      { header: 'Asset pack sent', width: 110, fill: 'input', validation: { type: 'list', source: YES_NO_SOURCE } },
      { header: 'Local adaptation approved', width: 150, fill: 'input', validation: { type: 'list', source: YES_NO_SOURCE } },
      { header: 'Media live', width: 90, fill: 'input', validation: { type: 'list', source: YES_NO_SOURCE } },
      { header: 'Post-launch review', width: 110, fill: 'input', validation: { type: 'list', source: YES_NO_SOURCE } },
      { header: 'Status', width: 110, fill: 'input', validation: { type: 'list', source: STATUS_SOURCE } },
      { header: 'Notes', width: 270, fill: 'input' },
    ],
    rows: [
      ['Jumeirah Beach Road', 'Summer cold drinks', 'Yes', 'Yes', 'Yes', 'Yes', 'Complete', 'Strong compliance and fast go-live.'],
      ['Marina Promenade', 'Summer cold drinks', 'Yes', 'Yes', 'Yes', 'No', 'Live', 'Waiting on week-one review.'],
      ['Yas Bay', 'Opening launch burst', 'Yes', 'No', 'No', 'No', 'Ready', 'Local mall media version not approved yet.'],
      ['Aljada', 'Breakfast combo reset', 'No', 'No', 'No', 'No', 'Not started', 'Store still in pipeline stage.'],
      ['West Bay', 'Corporate catering push', 'Yes', 'Yes', 'Yes', 'No', 'Live', 'Needs local Arabic creative variant.'],
      ['Olaya', 'Delivery relaunch', 'Yes', 'No', 'No', 'No', 'In progress', 'Delivery partner photography delayed.'],
    ],
  });

  const dashboard = wb.worksheets.add('Dashboard');
  setColumnWidths(dashboard, [170, 130, 180, 140, 140, 140, 140, 140]);
  addSheetTitle(
    dashboard,
    'Franchise Dashboard',
    'Review which regions are rollout-ready and where compliance is slipping.',
    8,
  );
  addMetricBlock(dashboard, 8, 'Rollout summary', [
    { label: 'Store count', formula: '=COUNTA(Stores!A8:A13)', format: FORMATS.integer },
    { label: 'Average compliance', formula: '=AVERAGE(Stores!G8:G13)', format: FORMATS.percent1 },
    { label: 'Stores ready or live', formula: '=COUNTIF(Stores!I8:I13,"Live")+COUNTIF(Stores!I8:I13,"Ready")+COUNTIF(Stores!I8:I13,"Complete")', format: FORMATS.integer },
    { label: 'Blocked or in-progress rollouts', formula: '=COUNTIF(Campaign_Rollout!G8:G13,"Blocked")+COUNTIF(Campaign_Rollout!G8:G13,"In progress")', format: FORMATS.integer },
  ]);
  setValues(dashboard, 15, 1, [['Region', 'Average compliance']]);
  ['Dubai', 'Abu Dhabi', 'Sharjah', 'Doha', 'Riyadh'].forEach((region, index) => {
    const row = 16 + index;
    setValues(dashboard, row, 1, [[region]]);
    setFormulas(dashboard, row, 2, [[`=IFERROR(AVERAGEIF(Stores!C8:C13,"${region}",Stores!G8:G13),"")`]]);
  });
  styleCompactTable(dashboard, 'A15:B20', 'A15:B15', 'A16:B20', ['B16:B20']);
  styleRange(dashboard, 'B16:B20', { fillColor: COLORS.blueFill, numberFormat: FORMATS.percent1 });
  const franchiseChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A15:B20'), 'Auto');
  franchiseChart.title.text = 'Compliance by region';
  franchiseChart.setPosition(dashboard.getRange('D8:I22'));
  franchiseChart.width = 560;
  franchiseChart.height = 320;
  styleChart(franchiseChart, [COLORS.indigo]);

  return {
    wb,
    filename: 'franchise-campaign-rollout-tracker.xlsx',
    previewSheets: [{ sheetName: 'Dashboard', range: 'A1:I22', file: 'franchise-campaign-rollout-tracker.png' }],
  };
}

function buildKPIDashboardWorkbook() {
  const wb = Workbook.create();
  buildSetupSheet(wb, {
    title: 'Restaurant KPI Dashboard Template',
    subtitle:
      'Track weekly trading, delivery mix, repeat behavior, paid efficiency, and CRM contribution in one management view.',
    audience: 'Operators, founders, growth leads, regional managers',
    outcome: 'A disciplined weekly and monthly scorecard that supports trading decisions instead of retrospective reporting.',
    focusAreas: [
      'Keep weekly input disciplined so monthly scorecards are driven by data, not memory.',
      'Track repeat rate, delivery mix, and paid efficiency alongside top-line sales.',
      'Use the dashboard to make faster trading decisions across channels.',
    ],
    relatedTabs: [
      { name: 'Weekly_Input', purpose: 'The recurring weekly trading and marketing input sheet.' },
      { name: 'Monthly_Scorecard', purpose: 'A simple monthly rollup using the same KPI logic.' },
      { name: 'Dashboard', purpose: 'A single-page summary of current trading and marketing momentum.' },
    ],
  });

  const weekly = addTableSheet({
    wb,
    name: 'Weekly_Input',
    title: 'Weekly Input',
    subtitle: 'Enter one line per week. The dashboard rolls from this sheet.',
    columns: [
      { header: 'Week start', width: 110, fill: 'input', format: FORMATS.date },
      { header: 'Net sales', width: 110, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 10000000 } },
      { header: 'Footfall / covers', width: 110, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 0, max: 1000000 } },
      { header: 'Delivery sales', width: 110, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 10000000 } },
      { header: 'New customers', width: 110, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 0, max: 1000000 } },
      { header: 'Repeat customers', width: 110, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 0, max: 1000000 } },
      { header: 'Ad spend', width: 100, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 1000000 } },
      { header: 'Paid revenue', width: 110, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 10000000 } },
      { header: 'CRM revenue', width: 110, fill: 'input', format: FORMATS.currency0, align: 'right', validation: { type: 'decimal', min: 0, max: 10000000 } },
      { header: 'Orders / bookings', width: 115, fill: 'input', format: FORMATS.integer, align: 'right', validation: { type: 'whole', min: 0, max: 1000000 } },
      { header: 'Avg check', width: 95, fill: 'formula', format: FORMATS.currency2, align: 'right' },
      { header: 'Delivery mix', width: 100, fill: 'formula', format: FORMATS.percent1, align: 'right' },
      { header: 'Repeat rate', width: 100, fill: 'formula', format: FORMATS.percent1, align: 'right' },
      { header: 'Paid ROAS', width: 90, fill: 'formula', format: FORMATS.decimal2, align: 'right' },
    ],
    rows: [
      [new Date('2026-01-05'), 168000, 4200, 42800, 620, 980, 6200, 28600, 6400, 1480, null, null, null, null],
      [new Date('2026-01-12'), 171500, 4310, 43900, 640, 990, 6400, 29800, 6600, 1510, null, null, null, null],
      [new Date('2026-01-19'), 176200, 4380, 45100, 650, 1020, 6500, 30400, 6800, 1535, null, null, null, null],
      [new Date('2026-01-26'), 182400, 4460, 46600, 670, 1040, 6700, 31200, 6900, 1590, null, null, null, null],
      [new Date('2026-02-02'), 179800, 4410, 45150, 660, 1010, 6600, 30100, 6750, 1550, null, null, null, null],
      [new Date('2026-02-09'), 188600, 4560, 47800, 710, 1080, 7000, 32600, 7100, 1630, null, null, null, null],
      [new Date('2026-02-16'), 191200, 4600, 48900, 720, 1100, 7100, 33200, 7250, 1650, null, null, null, null],
      [new Date('2026-02-23'), 194800, 4680, 49550, 730, 1110, 7250, 33800, 7420, 1685, null, null, null, null],
      [new Date('2026-03-02'), 202500, 4810, 52800, 760, 1160, 7600, 35600, 7800, 1755, null, null, null, null],
      [new Date('2026-03-09'), 206200, 4870, 53400, 780, 1175, 7750, 36100, 7950, 1780, null, null, null, null],
      [new Date('2026-03-16'), 210600, 4940, 54500, 790, 1190, 7900, 36800, 8120, 1810, null, null, null, null],
      [new Date('2026-03-23'), 214300, 5010, 55700, 805, 1210, 8050, 37400, 8350, 1840, null, null, null, null],
    ],
  });
  for (let row = weekly.firstDataRow; row <= weekly.lastDataRow; row += 1) {
    setFormulas(weekly.sheet, row, 11, [[`=IF(C${row}=0,"",B${row}/C${row})`]]);
    setFormulas(weekly.sheet, row, 12, [[`=IF(B${row}=0,"",D${row}/B${row})`]]);
    setFormulas(weekly.sheet, row, 13, [[`=IF((E${row}+F${row})=0,"",F${row}/(E${row}+F${row}))`]]);
    setFormulas(weekly.sheet, row, 14, [[`=IF(G${row}=0,"",H${row}/G${row})`]]);
  }
  styleRange(weekly.sheet, `K${weekly.firstDataRow}:N${weekly.lastDataRow}`, { fillColor: COLORS.blueFill });

  const monthly = wb.worksheets.add('Monthly_Scorecard');
  setColumnWidths(monthly, [120, 130, 110, 110, 110]);
  addSheetTitle(monthly, 'Monthly Scorecard', 'A simple monthly rollup of the weekly inputs.', 5);
  setValues(monthly, 8, 1, [['Month', 'Net sales', 'Delivery mix', 'Repeat rate', 'Paid ROAS']]);
  const monthGroups = [
    { label: 'Jan', start: 8, end: 11 },
    { label: 'Feb', start: 12, end: 15 },
    { label: 'Mar', start: 16, end: 19 },
  ];
  monthGroups.forEach((group, index) => {
    const row = 9 + index;
    setValues(monthly, row, 1, [[group.label]]);
    setFormulas(monthly, row, 2, [[`=SUM(Weekly_Input!B${group.start}:B${group.end})`]]);
    setFormulas(monthly, row, 3, [[`=AVERAGE(Weekly_Input!L${group.start}:L${group.end})`]]);
    setFormulas(monthly, row, 4, [[`=AVERAGE(Weekly_Input!M${group.start}:M${group.end})`]]);
    setFormulas(monthly, row, 5, [[`=AVERAGE(Weekly_Input!N${group.start}:N${group.end})`]]);
  });
  styleCompactTable(monthly, 'A8:E11', 'A8:E8', 'A9:E11', ['B9:E11']);
  styleRange(monthly, 'B9:B11', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  styleRange(monthly, 'C9:E11', { fillColor: COLORS.blueFill, numberFormat: FORMATS.percent1 });
  styleRange(monthly, 'E9:E11', { numberFormat: FORMATS.decimal2 });

  const dashboard = wb.worksheets.add('Dashboard');
  setColumnWidths(dashboard, [190, 130, 180, 140, 140, 140, 140, 140, 140, 140]);
  addSheetTitle(
    dashboard,
    'KPI Dashboard',
    'A single-page view of trading momentum, repeat behavior, and marketing efficiency.',
    10,
  );
  addMetricBlock(dashboard, 8, 'Trading summary', [
    { label: '12-week net sales', formula: '=SUM(Weekly_Input!B8:B19)', format: FORMATS.currency0 },
    { label: 'Average check', formula: '=AVERAGE(Weekly_Input!K8:K19)', format: FORMATS.currency2 },
    { label: 'Average delivery mix', formula: '=AVERAGE(Weekly_Input!L8:L19)', format: FORMATS.percent1 },
    { label: 'Average repeat rate', formula: '=AVERAGE(Weekly_Input!M8:M19)', format: FORMATS.percent1 },
  ]);
  setValues(dashboard, 15, 1, [['Week', 'Net sales', 'Delivery sales']]);
  for (let index = 0; index < 12; index += 1) {
    const row = 16 + index;
    setFormulas(dashboard, row, 1, [[`=TEXT(Weekly_Input!A${8 + index},"dd-mmm")`]]);
    setFormulas(dashboard, row, 2, [[`=Weekly_Input!B${8 + index}`]]);
    setFormulas(dashboard, row, 3, [[`=Weekly_Input!D${8 + index}`]]);
  }
  styleCompactTable(dashboard, 'A15:C27', 'A15:C15', 'A16:C27', ['B16:C27']);
  styleRange(dashboard, 'B16:C27', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  const kpiChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A15:C27'), 'Auto');
  kpiChart.title.text = 'Weekly net sales vs delivery sales';
  kpiChart.setPosition(dashboard.getRange('E8:K24'));
  kpiChart.width = 650;
  kpiChart.height = 330;
  styleChart(kpiChart, [COLORS.teal, COLORS.amber]);

  return {
    wb,
    filename: 'restaurant-kpi-dashboard-template.xlsx',
    previewSheets: [{ sheetName: 'Dashboard', range: 'A1:K24', file: 'restaurant-kpi-dashboard-template.png' }],
  };
}

async function exportWorkbookArtifact({ wb, filename, previewSheets }) {
  const artifact = await SpreadsheetFile.exportXlsx(wb);
  const outputPath = path.join(OUTPUT_DIR, filename);
  const publicPath = path.join(PUBLIC_DIR, filename);
  await artifact.save(outputPath);
  await fs.copyFile(outputPath, publicPath);

  const errors = await wb.inspect({
    kind: 'match',
    searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',
    options: { useRegex: true, maxResults: 200 },
    summary: `formula scan ${filename}`,
    maxChars: 4000,
  });

  const dashboardInspect = await wb.inspect({
    kind: 'table',
    range: `${previewSheets[0].sheetName}!${previewSheets[0].range}`,
    include: 'values,formulas',
    tableMaxRows: 20,
    tableMaxCols: 12,
    maxChars: 6000,
  });

  await fs.writeFile(
    path.join(OUTPUT_DIR, `${filename.replace('.xlsx', '')}-verification.json`),
    JSON.stringify(
      {
        filename,
        errors: errors.ndjson,
        dashboard: dashboardInspect.ndjson,
      },
      null,
      2,
    ),
  );

  for (const preview of previewSheets) {
    const blob = await wb.render({
      sheetName: preview.sheetName,
      range: preview.range,
      format: 'png',
      scale: 1.6,
    });
    await fs.writeFile(path.join(PREVIEW_DIR, preview.file), Buffer.from(await blob.arrayBuffer()));
  }
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  const workbooks = [
    buildBrandPositioningBriefWorkbook(),
    buildAnnualMarketingPlanWorkbook(),
    buildPromotionTrackerWorkbook(),
    buildContentCalendarWorkbook(),
    buildAnnualBudgetPlannerWorkbook(),
    buildMarketingROICalculatorWorkbook(),
    buildStoreLaunchChecklistWorkbook(),
    buildLocalStoreMarketingPlannerWorkbook(),
    buildMenuLaunchPlannerWorkbook(),
    buildDeliveryAuditWorkbook(),
    buildCRMCampaignPlannerWorkbook(),
    buildGBPChecklistWorkbook(),
    buildFranchiseRolloutTrackerWorkbook(),
    buildKPIDashboardWorkbook(),
  ];

  for (const workbook of workbooks) {
    await exportWorkbookArtifact(workbook);
    console.log(`Built ${workbook.filename}`);
  }
}

await main();
