import fs from 'node:fs/promises';
import path from 'node:path';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const ROOT = '/Users/brandmanager/ashmo/ashmo-website';
const OUTPUT_DIR = path.join(ROOT, 'outputs', '20260419-finance-workbooks');
const PREVIEW_DIR = path.join(OUTPUT_DIR, 'previews');
const PUBLIC_DIR = path.join(ROOT, 'public', 'downloads', 'restaurant-finance');

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
  sand: '#F2F7FB',
  canvas: '#F7FAFC',
  panel: '#FFFFFF',
  panelAlt: '#EEF4F8',
  teal: '#0F766E',
  amber: '#F59E0B',
  text: '#111827',
  muted: '#52606D',
  white: '#FFFFFF',
  border: '#D9E2EC',
  borderStrong: '#C4D0DD',
};

const FORMATS = {
  currency0: '"AED" #,##0;[Red]-"AED" #,##0',
  currency2: '"AED" #,##0.00;[Red]-"AED" #,##0.00',
  percent1: '0.0%',
  percent2: '0.00%',
  integer: '#,##0',
  decimal2: '#,##0.00',
  date: 'dd-mmm-yyyy',
};

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

function paintCanvas(sheet, lastCol = 12, lastRow = 80) {
  sheet.showGridLines = false;
  styleRange(sheet, a1(1, 1, lastRow, lastCol), {
    fillColor: COLORS.canvas,
    fontColor: COLORS.text,
    fontSize: 10,
  });
}

function addSheetTitle(sheet, title, subtitle, lastCol = 9) {
  paintCanvas(sheet, lastCol + 2, 96);
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
    ['Input cell', 'Starter assumption or user entry'],
    ['Formula cell', 'Calculated output - review logic before editing'],
    ['Control sheet', 'Document assumptions, support files, and reviewer sign-off'],
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
  });
  styleRange(sheet, bodyRange, {
    fillColor: COLORS.panel,
    fontColor: COLORS.text,
    fontSize: 10,
    rowHeightPx: 26,
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

function monthColumns(startCol, count) {
  return Array.from({ length: count }, (_, index) => startCol + index);
}

function buildReadmeSheet(workbook, config) {
  const sheet = workbook.worksheets.add('README');
  sheet.showGridLines = false;
  setColumnWidths(sheet, [180, 220, 140, 140, 140, 140, 140, 140, 140, 140]);
  addSheetTitle(sheet, config.title, config.subtitle, 9);
  addDocumentControl(sheet, 6, [
    ['Entity / branch', 'Replace with legal entity and location'],
    ['Prepared by', ''],
    ['Reviewed by', ''],
    ['Reporting basis', config.reportingBasis],
    ['Version', 'v1.0'],
    ['Last updated', '2026-04-19'],
  ]);
  addInstructionList(sheet, 6, 'How to use this workbook', config.instructions, 9);
  addLegend(sheet, 15);
  addInstructionList(sheet, 21, 'Audit support checklist', config.auditChecklist, 9);
  return sheet;
}

function buildPnLWorkbook() {
  const wb = Workbook.create();
  buildReadmeSheet(wb, {
    title: 'Restaurant P&L Template - UAE Audit-Ready Workbook',
    subtitle:
      'Monthly operating statement with 12-month trend, ratio analysis, dashboard KPIs, and review checks. Designed for management reporting and finance-file support, not as a substitute for statutory accounts.',
    reportingBasis: 'Enter monthly figures on a net-of-VAT basis unless your ERP is configured differently.',
    instructions: [
      'Complete Setup first. Orange cells are for user input and can be overwritten with ERP extracts or accounting trial-balance values.',
      'Enter revenue and expense lines by month in P&L_12M. Blue cells are formula-driven and should be edited only if your reporting policy changes.',
      'Use Dashboard for management review and Checks before circulation. Keep support schedules, invoices, and payroll files referenced in your finance folder.',
    ],
    auditChecklist: [
      'Tie revenue, COGS, payroll, rent, and fees to source reports or ledger extracts for the month.',
      'Document any manual journal entries or allocations, including central overhead methodology.',
      'Retain working papers for VAT treatment, provisions, accruals, and unusual one-off items.',
      'Capture preparer and reviewer sign-off before sharing with investors, banks, or auditors.',
    ],
  });

  const setup = wb.worksheets.add('Setup');
  setColumnWidths(setup, [180, 260, 140, 140, 140, 140, 140, 140]);
  addSheetTitle(
    setup,
    'Setup and reporting policy',
    'Document entity details, reporting basis, and ownership of the workbook before monthly close begins.',
    8,
  );
  setValues(setup, 6, 1, [
    ['Entity legal name', 'Sample Restaurant LLC'],
    ['Branch / location', 'Flagship branch'],
    ['Reporting year', 2026],
    ['Currency', 'AED'],
    ['Figures entered net of VAT?', 'Yes'],
    ['Central overhead allocation used?', 'Yes'],
    ['Prepared by', ''],
    ['Reviewed by', ''],
  ]);
  styleRange(setup, a1(6, 1, 13, 1), { fillColor: COLORS.blueFill, bold: true, fontSize: 10 });
  styleRange(setup, a1(6, 2, 13, 2), { fillColor: COLORS.inputFill, fontSize: 10 });
  applyOutline(setup.getRange(a1(6, 1, 13, 2)));
  addSimpleListValidation(setup, 'B10:B11', ['Yes', 'No']);
  addInstructionList(setup, 16, 'Month-end file support expected', [
    'Monthly sales summary by channel after discounts and VAT treatment',
    'COGS support from stock movements or inventory-costing file',
    'Payroll register including visa, medical, gratuity, and overtime components',
    'Lease schedule, CAM/service-charge backing, and central overhead methodology',
  ], 8);

  const pnl = wb.worksheets.add('P&L_12M');
  pnl.freezePanes.freezeRows(4);
  pnl.freezePanes.freezeColumns(1);
  setColumnWidths(pnl, [230, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 120, 110]);
  addSheetTitle(
    pnl,
    'P&L_12M',
    'Starter assumptions are included to make the workbook usable immediately. Replace orange cells with your branch actuals.',
    15,
  );

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  setValues(pnl, 5, 1, [['Line item', ...months, 'FY Total', '% of Sales']]);
  styleRange(pnl, a1(5, 1, 5, 15), {
    fillColor: COLORS.navy,
    fontColor: COLORS.white,
    bold: true,
    fontSize: 10,
  });

  const rows = [
    ['Revenue', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Food revenue', 320000, 330000, 345000, 350000, 360000, 372000, 380000, 390000, 398000, 405000, 412000, 420000, '', ''],
    ['Beverage revenue', 85000, 88000, 90000, 92000, 94000, 96000, 98000, 99000, 101000, 103000, 104000, 106000, '', ''],
    ['Delivery revenue', 75000, 77000, 81000, 84000, 87000, 90000, 93000, 95000, 97000, 99000, 101000, 103000, '', ''],
    ['Other operating revenue', 5000, 5000, 6000, 6000, 6000, 6000, 7000, 7000, 7000, 7000, 7000, 7000, '', ''],
    ['Net sales', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Direct costs', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Food cost', 112000, 115500, 120750, 122500, 126000, 130200, 133000, 136500, 139300, 141750, 144200, 147000, '', ''],
    ['Beverage cost', 21250, 22000, 22500, 23000, 23500, 24000, 24500, 24750, 25250, 25750, 26000, 26500, '', ''],
    ['Packaging', 9000, 9200, 9500, 9700, 9900, 10100, 10300, 10400, 10600, 10800, 11000, 11100, '', ''],
    ['Aggregator commissions', 20250, 20790, 21870, 22680, 23490, 24300, 25110, 25650, 26190, 26730, 27270, 27810, '', ''],
    ['Promotions funded', 7500, 7700, 8000, 8200, 8500, 8700, 9000, 9200, 9400, 9600, 9800, 10000, '', ''],
    ['Total direct cost', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Gross profit', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Gross margin %', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Labor', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Labor - salaries', 72000, 72000, 73500, 73500, 75000, 75000, 76500, 76500, 78000, 78000, 79500, 79500, '', ''],
    ['Labor - overtime', 4500, 4700, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 5600, 5700, 5800, '', ''],
    ['Labor - benefits / visas / medical', 12000, 12000, 12000, 12200, 12200, 12200, 12400, 12400, 12400, 12600, 12600, 12600, '', ''],
    ['Total labor', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Occupancy and operating overhead', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Rent', 68000, 68000, 68000, 68000, 68000, 68000, 68000, 68000, 68000, 68000, 68000, 68000, '', ''],
    ['Service charge / CAM', 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000, '', ''],
    ['Utilities', 9500, 9600, 9800, 10000, 10100, 10200, 10300, 10400, 10500, 10600, 10700, 10800, '', ''],
    ['Marketing', 7000, 7100, 7200, 7300, 7400, 7500, 7600, 7700, 7800, 7900, 8000, 8100, '', ''],
    ['Repairs and maintenance', 3000, 3000, 3500, 3000, 3000, 3500, 3000, 3000, 3500, 3000, 3000, 3500, '', ''],
    ['Cleaning / pest control', 2200, 2200, 2300, 2300, 2300, 2400, 2400, 2400, 2500, 2500, 2500, 2600, '', ''],
    ['Software / POS / SaaS', 1800, 1800, 1800, 1800, 1800, 1800, 1900, 1900, 1900, 1900, 1900, 1900, '', ''],
    ['Bank charges / payment fees', 5200, 5350, 5500, 5600, 5750, 5900, 6050, 6150, 6300, 6400, 6550, 6700, '', ''],
    ['Licenses / compliance provision', 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, '', ''],
    ['Insurance provision', 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, '', ''],
    ['General and administrative', 6000, 6000, 6200, 6200, 6400, 6400, 6600, 6600, 6800, 6800, 7000, 7000, '', ''],
    ['Other operating costs', 1200, 1200, 1300, 1300, 1400, 1400, 1500, 1500, 1500, 1600, 1600, 1700, '', ''],
    ['Total operating overhead', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Store EBITDA', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Store EBITDA %', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Central overhead allocation', 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, '', ''],
    ['Operating EBITDA', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Operating EBITDA %', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ];
  setValues(pnl, 6, 1, rows);

  const sectionRows = [6, 12, 21, 26];
  sectionRows.forEach((row) => {
    styleRange(pnl, a1(row, 1, row, 15), {
      fillColor: COLORS.sand,
      bold: true,
      fontSize: 10,
    });
  });

  styleRange(pnl, a1(7, 2, 11, 13), { fillColor: COLORS.inputFill, numberFormat: FORMATS.currency0 });
  styleRange(pnl, a1(13, 2, 17, 13), { fillColor: COLORS.inputFill, numberFormat: FORMATS.currency0 });
  styleRange(pnl, a1(22, 2, 24, 13), { fillColor: COLORS.inputFill, numberFormat: FORMATS.currency0 });
  styleRange(pnl, a1(27, 2, 36, 13), { fillColor: COLORS.inputFill, numberFormat: FORMATS.currency0 });
  styleRange(pnl, a1(39, 2, 39, 13), { fillColor: COLORS.inputFill, numberFormat: FORMATS.currency0 });

  const formulaRows = {
    netSales: 11,
    totalDirectCost: 18,
    grossProfit: 19,
    grossMarginPct: 20,
    totalLabor: 25,
    totalOverhead: 37,
    storeEbitda: 38,
    storeEbitdaPct: 39,
    operatingEbitda: 41,
    operatingEbitdaPct: 42,
  };

  const monthCols = monthColumns(2, 12);
  monthCols.forEach((col) => {
    const c = colLetter(col);
    setFormulas(pnl, formulaRows.netSales, col, [[`=SUM(${c}7:${c}10)`]]);
    setFormulas(pnl, formulaRows.totalDirectCost, col, [[`=SUM(${c}13:${c}17)`]]);
    setFormulas(pnl, formulaRows.grossProfit, col, [[`=${c}11-${c}18`]]);
    setFormulas(pnl, formulaRows.grossMarginPct, col, [[`=IF(${c}11=0,"",${c}19/${c}11)`]]);
    setFormulas(pnl, formulaRows.totalLabor, col, [[`=SUM(${c}22:${c}24)`]]);
    setFormulas(pnl, formulaRows.totalOverhead, col, [[`=SUM(${c}27:${c}36)`]]);
    setFormulas(pnl, formulaRows.storeEbitda, col, [[`=${c}19-${c}25-${c}37`]]);
    setFormulas(pnl, formulaRows.storeEbitdaPct, col, [[`=IF(${c}11=0,"",${c}38/${c}11)`]]);
    setFormulas(pnl, formulaRows.operatingEbitda, col, [[`=${c}38-${c}40`]]);
    setFormulas(pnl, formulaRows.operatingEbitdaPct, col, [[`=IF(${c}11=0,"",${c}41/${c}11)`]]);
  });

  for (let row = 7; row <= 42; row += 1) {
    if ([12, 21, 26].includes(row)) continue;
    setFormulas(pnl, row, 14, [[`=SUM(B${row}:M${row})`]]);
    setFormulas(pnl, row, 15, [[`=IF($N${row}=0,"",$N${row}/$N$11)`]]);
  }

  styleRange(pnl, a1(6, 14, 42, 15), { fillColor: COLORS.blueFill });
  styleRange(pnl, a1(11, 2, 20, 15), { numberFormat: FORMATS.currency0 });
  styleRange(pnl, a1(25, 2, 42, 15), { numberFormat: FORMATS.currency0 });
  styleRange(pnl, a1(20, 2, 20, 15), { numberFormat: FORMATS.percent1 });
  styleRange(pnl, a1(39, 2, 39, 15), { numberFormat: FORMATS.percent1 });
  styleRange(pnl, a1(42, 2, 42, 15), { numberFormat: FORMATS.percent1 });
  styleRange(pnl, a1(6, 1, 42, 1), { bold: true, fontSize: 10 });
  applyOutline(pnl.getRange(a1(5, 1, 42, 15)));

  const dashboard = wb.worksheets.add('Dashboard');
  dashboard.showGridLines = false;
  setColumnWidths(dashboard, [190, 140, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160]);
  addSheetTitle(
    dashboard,
    'Dashboard',
    'Management summary using the 12-month P&L. Replace starter inputs in P&L_12M to refresh this page.',
    10,
  );
  setValues(dashboard, 6, 1, [
    ['KPI', 'Value'],
    ['Annual net sales', ''],
    ['Gross margin %', ''],
    ['Labor %', ''],
    ['Rent %', ''],
    ['Store EBITDA %', ''],
    ['Operating EBITDA %', ''],
    ['Average monthly sales', ''],
  ]);
  styleMetricTable(dashboard, 'A6:B13', 'A6:B6', 'A7:A13', 'B7:B13');
  setFormulas(dashboard, 7, 2, [[`='P&L_12M'!N11`]]);
  setFormulas(dashboard, 8, 2, [[`=IF('P&L_12M'!N11=0,"",'P&L_12M'!N19/'P&L_12M'!N11)`]]);
  setFormulas(dashboard, 9, 2, [[`=IF('P&L_12M'!N11=0,"",'P&L_12M'!N25/'P&L_12M'!N11)`]]);
  setFormulas(dashboard, 10, 2, [[`=IF('P&L_12M'!N11=0,"",SUM('P&L_12M'!B27:M27)/'P&L_12M'!N11)`]]);
  setFormulas(dashboard, 11, 2, [[`=IF('P&L_12M'!N11=0,"",'P&L_12M'!N38/'P&L_12M'!N11)`]]);
  setFormulas(dashboard, 12, 2, [[`=IF('P&L_12M'!N11=0,"",'P&L_12M'!N41/'P&L_12M'!N11)`]]);
  setFormulas(dashboard, 13, 2, [[`=IF('P&L_12M'!N11=0,"",'P&L_12M'!N11/12)`]]);
  styleRange(dashboard, 'B7:B7', { numberFormat: FORMATS.currency0, fillColor: COLORS.blueFill });
  styleRange(dashboard, 'B8:B12', { numberFormat: FORMATS.percent1, fillColor: COLORS.blueFill });
  styleRange(dashboard, 'B13:B13', { numberFormat: FORMATS.currency0, fillColor: COLORS.blueFill });

  setValues(dashboard, 16, 1, [['Month', 'Net sales', 'Store EBITDA']]);
  months.forEach((month, index) => {
    const row = 17 + index;
    setValues(dashboard, row, 1, [[month]]);
    setFormulas(dashboard, row, 2, [[`='P&L_12M'!${colLetter(2 + index)}11`]]);
    setFormulas(dashboard, row, 3, [[`='P&L_12M'!${colLetter(2 + index)}38`]]);
  });
  styleCompactTable(dashboard, 'A16:C28', 'A16:C16', 'A17:C28', ['B17:C28']);
  styleRange(dashboard, 'B17:C28', { numberFormat: FORMATS.currency0 });
  const pnlChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A16:C28'), 'Auto');
  pnlChart.title.text = 'Net sales vs store EBITDA by month';
  pnlChart.setPosition(dashboard.getRange('E6:M23'));
  pnlChart.width = 720;
  pnlChart.height = 330;
  styleChart(pnlChart, [COLORS.teal, COLORS.amber]);

  const checks = wb.worksheets.add('Checks');
  checks.showGridLines = false;
  setColumnWidths(checks, [260, 160, 420]);
  addSheetTitle(
    checks,
    'Checks',
    'High-level review tests before sending the file to management, banks, or auditors.',
    6,
  );
  setValues(checks, 6, 1, [
    ['Review test', 'Status', 'Comment'],
    ['Setup fields completed', '', 'Entity, branch, year, currency, and sign-off fields should be filled.'],
    ['No negative gross margin months', '', 'Review pricing, waste, or mix if margin goes negative.'],
    ['No negative store EBITDA months', '', 'Persistent negative store EBITDA suggests a commercial model issue.'],
    ['Central overhead does not exceed store EBITDA', '', 'Allocation policy should not push the unit into avoidable distortion.'],
  ]);
  setFormulas(checks, 7, 2, [[`=IF(COUNTA(Setup!B6:B13)>=6,"PASS","REVIEW")`]]);
  setFormulas(checks, 8, 2, [[`=IF(COUNTIF('P&L_12M'!B20:M20,"<0")=0,"PASS","REVIEW")`]]);
  setFormulas(checks, 9, 2, [[`=IF(COUNTIF('P&L_12M'!B38:M38,"<0")=0,"PASS","REVIEW")`]]);
  setFormulas(checks, 10, 2, [[`=IF(COUNTIF('P&L_12M'!B41:M41,"<0")=0,"PASS","REVIEW")`]]);
  styleRange(checks, 'B7:B10', { fillColor: COLORS.blueFill, bold: true });
  styleCompactTable(checks, 'A6:C10', 'A6:C6', 'A7:C10', ['B7:B10']);

  return {
    wb,
    filename: 'restaurant-p-and-l-template.xlsx',
    previewSheets: [
      { sheetName: 'Dashboard', range: 'A1:M28', file: 'restaurant-p-and-l-template-dashboard.png' },
      { sheetName: 'P&L_12M', range: 'A1:O22', file: 'restaurant-p-and-l-template-core.png' },
    ],
  };
}

function buildWeeklyFlashWorkbook() {
  const wb = Workbook.create();
  buildReadmeSheet(wb, {
    title: 'Weekly Flash Report - UAE Audit-Ready Workbook',
    subtitle:
      'A working weekly trading file with KPI roll-up, channel mix logic, EBITDA bridge, and review checks. Best used for founder, GM, and finance huddles.',
    reportingBasis: 'Weekly figures should be entered on a net-of-VAT basis and tied to source system extracts.',
    instructions: [
      'Use one row per completed week in Weekly_Input. Starter values are examples only and should be replaced with branch actuals.',
      'Capture sales by channel, covers, and direct cost lines consistently each week so trend analysis remains clean.',
      'Review Dashboard and Checks before management meetings. Retain source support for each week in your finance drive.',
    ],
    auditChecklist: [
      'File sales extract, POS covers report, payroll support, and delivery settlement by week.',
      'Confirm weekly sales mix equals net sales and resolve mismatches before circulation.',
      'Document any allocations used for rent, utilities, and central costs so weekly EBITDA is not misleading.',
      'Retain reviewer comments or adjustments in the notes column rather than overwriting history.',
    ],
  });

  const setup = wb.worksheets.add('Setup');
  setColumnWidths(setup, [180, 260, 140, 140, 140, 140, 140, 140]);
  addSheetTitle(setup, 'Setup', 'Identify the branch, reporting owner, and weekly review targets.', 8);
  setValues(setup, 6, 1, [
    ['Entity / branch', 'Sample Restaurant LLC - Marina'],
    ['Primary reviewer', ''],
    ['Weekly cadence', 'Every Monday'],
    ['Target labor %', 0.24],
    ['Target food cost %', 0.31],
    ['Target store EBITDA %', 0.14],
    ['Prepared by', ''],
  ]);
  styleRange(setup, 'A6:A12', { fillColor: COLORS.blueFill, bold: true, fontSize: 10 });
  styleRange(setup, 'B6:B12', { fillColor: COLORS.inputFill, fontSize: 10 });
  styleRange(setup, 'B9:B11', { numberFormat: FORMATS.percent1 });
  applyOutline(setup.getRange('A6:B12'));

  const input = wb.worksheets.add('Weekly_Input');
  input.freezePanes.freezeRows(4);
  setColumnWidths(input, [110, 110, 150, 110, 105, 105, 105, 85, 85, 90, 95, 95, 95, 95, 95, 95, 95, 95, 95, 100, 100, 90, 90, 90]);
  addSheetTitle(
    input,
    'Weekly_Input',
    'Enter one row per completed week. Orange cells are starter assumptions / user inputs. Formula cells calculate KPI outputs and checks.',
    24,
  );
  const headers = [
    'Week start',
    'Week end',
    'Location',
    'Net sales',
    'Dine-in sales',
    'Takeaway sales',
    'Delivery sales',
    'Covers',
    'Delivery orders',
    'APC',
    'Delivery AOV',
    'Food cost AED',
    'Labor AED',
    'Rent alloc AED',
    'Utilities AED',
    'Packaging AED',
    'Aggregator fees AED',
    'Promotions AED',
    'Other opex AED',
    'Total cost AED',
    'Store EBITDA AED',
    'Store EBITDA %',
    'Delivery mix %',
    'Sales mix check',
  ];
  setValues(input, 5, 1, [headers]);
  styleRange(input, a1(5, 1, 5, headers.length), {
    fillColor: COLORS.navy,
    fontColor: COLORS.white,
    bold: true,
    fontSize: 10,
    wrapText: true,
  });

  const weeklyRows = Array.from({ length: 13 }, (_, index) => {
    const start = new Date(2026, 0, 5 + index * 7);
    const dineIn = 145000 + index * 4500;
    const takeaway = 42000 + index * 1200;
    const delivery = 52000 + index * 1800;
    const sales = dineIn + takeaway + delivery;
    return [
      start,
      '',
      'Sample Branch',
      sales,
      dineIn,
      takeaway,
      delivery,
      3800 + index * 90,
      1800 + index * 30,
      '',
      '',
      72000 + index * 2200,
      51000 + index * 1500,
      16000,
      6200 + index * 100,
      5200 + index * 120,
      14500 + index * 360,
      6400 + index * 150,
      2800,
      '',
      '',
      '',
      '',
      '',
    ];
  });
  setValues(input, 6, 1, weeklyRows);
  styleRange(input, a1(6, 1, 18, 9), { fillColor: COLORS.inputFill });
  styleRange(input, a1(6, 12, 18, 19), { fillColor: COLORS.inputFill });
  styleRange(input, a1(6, 4, 18, 7), { numberFormat: FORMATS.currency0 });
  styleRange(input, a1(6, 10, 18, 11), { numberFormat: FORMATS.currency2 });
  styleRange(input, a1(6, 12, 18, 21), { numberFormat: FORMATS.currency0 });
  styleRange(input, a1(6, 22, 18, 23), { numberFormat: FORMATS.percent1 });
  styleRange(input, a1(6, 1, 18, 2), { numberFormat: FORMATS.date });
  addWholeValidation(input, 'H6:I18', 0, 100000);
  addDecimalValidation(input, 'D6:G18', 0, 5000000);
  setFormulas(input, 6, 2, Array.from({ length: 13 }, (_, index) => [[`=IF(A${6 + index}="","",A${6 + index}+6)`]]));
  setFormulas(input, 6, 10, Array.from({ length: 13 }, (_, index) => [[`=IF(H${6 + index}=0,"",D${6 + index}/H${6 + index})`]]));
  setFormulas(input, 6, 11, Array.from({ length: 13 }, (_, index) => [[`=IF(I${6 + index}=0,"",G${6 + index}/I${6 + index})`]]));
  setFormulas(input, 6, 20, Array.from({ length: 13 }, (_, index) => [[`=SUM(L${6 + index}:S${6 + index})`]]));
  setFormulas(input, 6, 21, Array.from({ length: 13 }, (_, index) => [[`=D${6 + index}-T${6 + index}`]]));
  setFormulas(input, 6, 22, Array.from({ length: 13 }, (_, index) => [[`=IF(D${6 + index}=0,"",U${6 + index}/D${6 + index})`]]));
  setFormulas(input, 6, 23, Array.from({ length: 13 }, (_, index) => [[`=IF(D${6 + index}=0,"",G${6 + index}/D${6 + index})`]]));
  setFormulas(input, 6, 24, Array.from({ length: 13 }, (_, index) => [[`=IF(ABS((E${6 + index}+F${6 + index}+G${6 + index})-D${6 + index})<1,"PASS","REVIEW")`]]));
  applyOutline(input.getRange(a1(5, 1, 18, 24)));

  const dashboard = wb.worksheets.add('Dashboard');
  dashboard.showGridLines = false;
  setColumnWidths(dashboard, [200, 140, 140, 140, 140, 140, 140, 140, 140, 140, 140, 140]);
  addSheetTitle(
    dashboard,
    'Dashboard',
    'Snapshot of the most recent weekly trend with KPI and review targets.',
    10,
  );
  setValues(dashboard, 6, 1, [
    ['KPI', 'Latest week'],
    ['Week start', ''],
    ['Net sales', ''],
    ['Store EBITDA %', ''],
    ['Delivery mix %', ''],
    ['APC', ''],
    ['Delivery AOV', ''],
  ]);
  styleMetricTable(dashboard, 'A6:B12', 'A6:B6', 'A7:A12', 'B7:B12');
  const latestRowFormula = 'LOOKUP(2,1/(Weekly_Input!$A$6:$A$18<>""),ROW(Weekly_Input!$A$6:$A$18))';
  setFormulas(dashboard, 7, 2, [[`=INDEX(Weekly_Input!A:A,${latestRowFormula})`]]);
  setFormulas(dashboard, 8, 2, [[`=INDEX(Weekly_Input!D:D,${latestRowFormula})`]]);
  setFormulas(dashboard, 9, 2, [[`=INDEX(Weekly_Input!V:V,${latestRowFormula})`]]);
  setFormulas(dashboard, 10, 2, [[`=INDEX(Weekly_Input!W:W,${latestRowFormula})`]]);
  setFormulas(dashboard, 11, 2, [[`=INDEX(Weekly_Input!J:J,${latestRowFormula})`]]);
  setFormulas(dashboard, 12, 2, [[`=INDEX(Weekly_Input!K:K,${latestRowFormula})`]]);
  styleRange(dashboard, 'B7:B7', { numberFormat: FORMATS.date, fillColor: COLORS.blueFill });
  styleRange(dashboard, 'B8:B8', { numberFormat: FORMATS.currency0, fillColor: COLORS.blueFill });
  styleRange(dashboard, 'B9:B10', { numberFormat: FORMATS.percent1, fillColor: COLORS.blueFill });
  styleRange(dashboard, 'B11:B12', { numberFormat: FORMATS.currency2, fillColor: COLORS.blueFill });

  setValues(dashboard, 16, 1, [['Week', 'Net sales', 'Store EBITDA']]);
  Array.from({ length: 13 }, (_, index) => {
    const row = 17 + index;
    setFormulas(dashboard, row, 1, [[`=TEXT(Weekly_Input!A${6 + index},"dd-mmm")`]]);
    setFormulas(dashboard, row, 2, [[`=Weekly_Input!D${6 + index}`]]);
    setFormulas(dashboard, row, 3, [[`=Weekly_Input!U${6 + index}`]]);
  });
  styleCompactTable(dashboard, 'A16:C29', 'A16:C16', 'A17:C29', ['B17:C29']);
  styleRange(dashboard, 'B17:C29', { numberFormat: FORMATS.currency0 });
  const flashChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A16:C29'), 'Auto');
  flashChart.title.text = 'Weekly sales vs EBITDA';
  flashChart.setPosition(dashboard.getRange('E6:M23'));
  flashChart.width = 700;
  flashChart.height = 320;
  styleChart(flashChart, [COLORS.teal, COLORS.amber]);

  const checks = wb.worksheets.add('Checks');
  checks.showGridLines = false;
  setColumnWidths(checks, [260, 120, 420]);
  addSheetTitle(checks, 'Checks', 'Weekly integrity checks before finance or management review.', 6);
  setValues(checks, 6, 1, [
    ['Review test', 'Status', 'Comment'],
    ['Sales mix equals net sales', '', 'Dine-in + takeaway + delivery should match total net sales.'],
    ['No blank week start dates in populated rows', '', 'Each completed weekly row should have a start date.'],
    ['No negative store EBITDA weeks', '', 'Escalate operational causes before the issue compounds.'],
    ['Latest week beats target EBITDA %', '', 'Compare to target in Setup.'],
  ]);
  setFormulas(checks, 7, 2, [[`=IF(COUNTIF(Weekly_Input!X6:X18,"REVIEW")=0,"PASS","REVIEW")`]]);
  setFormulas(checks, 8, 2, [[`=IF(COUNTIFS(Weekly_Input!D6:D18,">0",Weekly_Input!A6:A18,"")=0,"PASS","REVIEW")`]]);
  setFormulas(checks, 9, 2, [[`=IF(COUNTIF(Weekly_Input!U6:U18,"<0")=0,"PASS","REVIEW")`]]);
  setFormulas(checks, 10, 2, [[`=IF(B9>=Setup!B11,"PASS","REVIEW")`]]);
  styleRange(checks, 'B7:B10', { fillColor: COLORS.blueFill, bold: true });
  styleCompactTable(checks, 'A6:C10', 'A6:C6', 'A7:C10', ['B7:B10']);

  return {
    wb,
    filename: 'weekly-flash-report-template.xlsx',
    previewSheets: [
      { sheetName: 'Dashboard', range: 'A1:M29', file: 'weekly-flash-report-dashboard.png' },
      { sheetName: 'Weekly_Input', range: 'A1:X18', file: 'weekly-flash-report-core.png' },
    ],
  };
}

function buildRecipeWorkbook() {
  const wb = Workbook.create();
  buildReadmeSheet(wb, {
    title: 'Recipe Costing Sheet - UAE Audit-Ready Workbook',
    subtitle:
      'Ingredient master, yield-aware costing input, recipe summary, and control checks. Built for disciplined menu pricing and margin review.',
    reportingBasis: 'Record ingredient costs net of VAT if VAT is recoverable in your purchasing entity.',
    instructions: [
      'Maintain Ingredient_Master first. Orange cells are starter assumptions or user inputs and should be updated from supplier invoices or procurement files.',
      'Use Recipe_Input for one recipe at a time. Duplicate the sheet for additional recipes if you prefer separate costing files.',
      'Use Recipe_Summary during pricing review and Checks before publishing a price or menu engineering decision.',
    ],
    auditChecklist: [
      'Retain supplier invoice support for each ingredient cost used in the model.',
      'Document edible-yield assumptions and any chef-approved waste uplifts.',
      'Capture approver sign-off where menu pricing materially changes gross margin expectations.',
      'Refresh master cost inputs whenever supplier pricing changes or a recipe is reformulated.',
    ],
  });

  const master = wb.worksheets.add('Ingredient_Master');
  master.freezePanes.freezeRows(4);
  setColumnWidths(master, [90, 180, 110, 100, 110, 90, 110, 120, 140, 110]);
  addSheetTitle(master, 'Ingredient_Master', 'Master list of purchased items and usable cost rates.', 10);
  const masterHeaders = [
    'Code',
    'Ingredient',
    'Purchase unit',
    'Pack size',
    'Pack cost AED',
    'Yield %',
    'Usable qty',
    'Cost / usable unit',
    'Preferred supplier',
    'Last update',
  ];
  setValues(master, 5, 1, [masterHeaders]);
  styleRange(master, 'A5:J5', { fillColor: COLORS.navy, fontColor: COLORS.white, bold: true, fontSize: 10 });
  const ingredients = [
    ['CHKN01', 'Chicken breast', 'kg', 5, 96, 0.92, '', '', 'Supplier A', new Date(2026, 0, 10)],
    ['TORT01', 'Tortilla', 'each', 12, 24, 1, '', '', 'Supplier B', new Date(2026, 0, 10)],
    ['SAUC01', 'Garlic sauce', 'kg', 2, 22, 0.98, '', '', 'Supplier C', new Date(2026, 0, 10)],
    ['LETU01', 'Iceberg lettuce', 'kg', 3, 18, 0.82, '', '', 'Supplier D', new Date(2026, 0, 10)],
    ['TOMA01', 'Tomato', 'kg', 5, 25, 0.88, '', '', 'Supplier D', new Date(2026, 0, 10)],
    ['CHEE01', 'Cheddar slice', 'each', 48, 42, 1, '', '', 'Supplier E', new Date(2026, 0, 10)],
    ['BUN01', 'Burger bun', 'each', 24, 26, 1, '', '', 'Supplier B', new Date(2026, 0, 10)],
    ['BEEF01', 'Beef patty', 'kg', 5, 128, 0.9, '', '', 'Supplier F', new Date(2026, 0, 10)],
  ];
  setValues(master, 6, 1, ingredients);
  styleRange(master, 'A6:J13', { fillColor: COLORS.inputFill });
  styleRange(master, 'D6:D13', { numberFormat: FORMATS.decimal2 });
  styleRange(master, 'E6:E13', { numberFormat: FORMATS.currency2 });
  styleRange(master, 'F6:F13', { numberFormat: FORMATS.percent1 });
  styleRange(master, 'J6:J13', { numberFormat: FORMATS.date });
  Array.from({ length: ingredients.length }, (_, index) => {
    const row = 6 + index;
    setFormulas(master, row, 7, [[`=IF(OR(D${row}="",F${row}=""),"",D${row}*F${row})`]]);
    setFormulas(master, row, 8, [[`=IF(G${row}=0,"",E${row}/G${row})`]]);
  });
  styleRange(master, 'G6:H13', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency2 });
  styleRange(master, 'G6:G13', { numberFormat: FORMATS.decimal2 });
  applyOutline(master.getRange('A5:J13'));

  const recipe = wb.worksheets.add('Recipe_Input');
  recipe.freezePanes.freezeRows(9);
  setColumnWidths(recipe, [70, 180, 110, 100, 120, 120, 100, 100, 160]);
  addSheetTitle(recipe, 'Recipe_Input', 'Single-recipe costing input with ingredient-level yield and pricing logic.', 9);
  setValues(recipe, 6, 1, [
    ['Recipe name', 'Grilled chicken wrap'],
    ['Portion size', '1 wrap'],
    ['Target food cost %', 0.28],
    ['Selling price AED', 23],
  ]);
  styleRange(recipe, 'A6:A9', { fillColor: COLORS.blueFill, bold: true });
  styleRange(recipe, 'B6:B9', { fillColor: COLORS.inputFill });
  styleRange(recipe, 'B8:B8', { numberFormat: FORMATS.percent1 });
  styleRange(recipe, 'B9:B9', { numberFormat: FORMATS.currency2 });
  applyOutline(recipe.getRange('A6:B9'));

  const recipeHeaders = ['Line', 'Ingredient', 'Unit', 'Qty / portion', 'Cost / usable unit', 'Base cost', 'Waste uplift %', 'Adjusted cost', 'Notes'];
  setValues(recipe, 11, 1, [recipeHeaders]);
  styleRange(recipe, 'A11:I11', { fillColor: COLORS.navy, fontColor: COLORS.white, bold: true, fontSize: 10 });
  const recipeLines = [
    [1, 'Chicken breast', '', 0.16, '', '', 0.03, '', 'Cooked sliced weight'],
    [2, 'Tortilla', '', 1, '', '', 0, '', 'Large tortilla wrap'],
    [3, 'Garlic sauce', '', 0.03, '', '', 0.02, '', 'Per portion sauce'],
    [4, 'Iceberg lettuce', '', 0.025, '', '', 0.08, '', 'Prep trim allowed'],
    [5, 'Tomato', '', 0.02, '', '', 0.06, '', 'Sliced garnish'],
    [6, 'Cheddar slice', '', 1, '', '', 0, '', 'Optional upsell cheese'],
    [7, '', '', '', '', '', '', '', ''],
    [8, '', '', '', '', '', '', '', ''],
    [9, '', '', '', '', '', '', '', ''],
    [10, '', '', '', '', '', '', '', ''],
    [11, '', '', '', '', '', '', '', ''],
    [12, '', '', '', '', '', '', '', ''],
  ];
  setValues(recipe, 12, 1, recipeLines);
  styleRange(recipe, 'B12:D23', { fillColor: COLORS.inputFill });
  styleRange(recipe, 'G12:G23', { fillColor: COLORS.inputFill, numberFormat: FORMATS.percent1 });
  Array.from({ length: 12 }, (_, index) => {
    const row = 12 + index;
    setFormulas(recipe, row, 3, [[`=IF(B${row}="","",XLOOKUP(B${row},Ingredient_Master!$B$6:$B$13,Ingredient_Master!$C$6:$C$13,""))`]]);
    setFormulas(recipe, row, 5, [[`=IF(B${row}="","",XLOOKUP(B${row},Ingredient_Master!$B$6:$B$13,Ingredient_Master!$H$6:$H$13,""))`]]);
    setFormulas(recipe, row, 6, [[`=IF(OR(D${row}="",E${row}=""),"",D${row}*E${row})`]]);
    setFormulas(recipe, row, 8, [[`=IF(F${row}="","",F${row}*(1+G${row}))`]]);
  });
  styleRange(recipe, 'E12:H23', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency2 });
  styleRange(recipe, 'E12:E23', { numberFormat: FORMATS.currency2 });
  addSimpleListValidation(recipe, 'B12:B23', ingredients.map((row) => row[1]));
  addDecimalValidation(recipe, 'D12:D23', 0, 1000);
  applyOutline(recipe.getRange('A11:I23'));

  const summary = wb.worksheets.add('Recipe_Summary');
  summary.showGridLines = false;
  setColumnWidths(summary, [220, 140, 140, 140, 140, 140, 140, 140]);
  addSheetTitle(summary, 'Recipe_Summary', 'Commercial summary for pricing and menu engineering review.', 8);
  setValues(summary, 6, 1, [
    ['KPI', 'Value'],
    ['Recipe cost / portion', ''],
    ['Target food cost %', ''],
    ['Suggested selling price', ''],
    ['Actual selling price', ''],
    ['Actual food cost %', ''],
    ['Gross contribution / portion', ''],
  ]);
  styleMetricTable(summary, 'A6:B12', 'A6:B6', 'A7:A12', 'B7:B12');
  setFormulas(summary, 7, 2, [[`=SUM(Recipe_Input!H12:H23)`]]);
  setFormulas(summary, 8, 2, [[`=Recipe_Input!B8`]]);
  setFormulas(summary, 9, 2, [[`=IF(B8=0,"",B7/B8)`]]);
  setFormulas(summary, 10, 2, [[`=Recipe_Input!B9`]]);
  setFormulas(summary, 11, 2, [[`=IF(B10=0,"",B7/B10)`]]);
  setFormulas(summary, 12, 2, [[`=IF(B10=0,"",B10-B7)`]]);
  styleRange(summary, 'B7:B7', { numberFormat: FORMATS.currency2, fillColor: COLORS.blueFill });
  styleRange(summary, 'B8:B8', { numberFormat: FORMATS.percent1, fillColor: COLORS.blueFill });
  styleRange(summary, 'B9:B10', { numberFormat: FORMATS.currency2, fillColor: COLORS.blueFill });
  styleRange(summary, 'B11:B11', { numberFormat: FORMATS.percent1, fillColor: COLORS.blueFill });
  styleRange(summary, 'B12:B12', { numberFormat: FORMATS.currency2, fillColor: COLORS.blueFill });
  setValues(summary, 16, 1, [['Ingredient', 'Adjusted cost']]);
  Array.from({ length: 6 }, (_, index) => {
    const row = 17 + index;
    setFormulas(summary, row, 1, [[`=Recipe_Input!B${12 + index}`]]);
    setFormulas(summary, row, 2, [[`=Recipe_Input!H${12 + index}`]]);
  });
  styleCompactTable(summary, 'A16:B22', 'A16:B16', 'A17:B22', ['B17:B22']);
  styleRange(summary, 'B17:B22', { numberFormat: FORMATS.currency2 });
  const recipeChart = summary.charts.add('ColumnClustered', summary.getRange('A16:B22'), 'Auto');
  recipeChart.title.text = 'Ingredient cost contribution';
  recipeChart.setPosition(summary.getRange('D6:H22'));
  recipeChart.width = 520;
  recipeChart.height = 320;
  styleChart(recipeChart, [COLORS.teal]);

  const checks = wb.worksheets.add('Checks');
  checks.showGridLines = false;
  setColumnWidths(checks, [260, 120, 420]);
  addSheetTitle(checks, 'Checks', 'Recipe costing integrity checks.', 6);
  setValues(checks, 6, 1, [
    ['Review test', 'Status', 'Comment'],
    ['Every quantity row has an ingredient', '', 'Avoid blank ingredient rows with non-zero quantity.'],
    ['Target food cost entered', '', 'Set a target percentage before pricing.'],
    ['Actual food cost % below target', '', 'If not, rework price, portion, or recipe mix.'],
    ['All ingredient costs available in master', '', 'Update Ingredient_Master for missing purchase cost data.'],
  ]);
  setFormulas(checks, 7, 2, [[`=IF(COUNTIFS(Recipe_Input!D12:D23,">0",Recipe_Input!B12:B23,"")=0,"PASS","REVIEW")`]]);
  setFormulas(checks, 8, 2, [[`=IF(Recipe_Input!B8>0,"PASS","REVIEW")`]]);
  setFormulas(checks, 9, 2, [[`=IF(OR(Recipe_Summary!B11="",Recipe_Summary!B8=""),"REVIEW",IF(Recipe_Summary!B11<=Recipe_Summary!B8,"PASS","REVIEW"))`]]);
  setFormulas(checks, 10, 2, [[`=IF(COUNTIFS(Recipe_Input!B12:B23,"<>",Recipe_Input!E12:E23,"")=0,"PASS","REVIEW")`]]);
  styleRange(checks, 'B7:B10', { fillColor: COLORS.blueFill, bold: true });
  styleCompactTable(checks, 'A6:C10', 'A6:C6', 'A7:C10', ['B7:B10']);

  return {
    wb,
    filename: 'recipe-costing-sheet.xlsx',
    previewSheets: [
      { sheetName: 'Recipe_Summary', range: 'A1:H22', file: 'recipe-costing-sheet-summary.png' },
      { sheetName: 'Recipe_Input', range: 'A1:I23', file: 'recipe-costing-sheet-core.png' },
    ],
  };
}

function buildOpeningBudgetWorkbook() {
  const wb = Workbook.create();
  buildReadmeSheet(wb, {
    title: 'Opening Budget Template - UAE Audit-Ready Workbook',
    subtitle:
      'Project budget, funding plan, cash-timing view, dashboard KPIs, and review checks for new openings or refits.',
    reportingBasis: 'Enter budget values ex VAT and flag recoverability in Budget_Input.',
    instructions: [
      'Populate Setup and then Budget_Input. Orange cells hold starter assumptions and should be replaced with live quotes or approved budgets.',
      'Track timing and status carefully so the funding plan and cash-timing view stay reliable.',
      'Use Dashboard for sponsor review and Checks before signing leases, purchase orders, or capex approvals.',
    ],
    auditChecklist: [
      'Retain vendor quotes, fit-out contracts, approvals, and payment schedules for each material line item.',
      'Document VAT recoverability assumptions and entity ownership of each cost bucket.',
      'Tie committed and paid values back to purchase orders or the payable register.',
      'Maintain an approval trail for contingency use and funding-source changes.',
    ],
  });

  const setup = wb.worksheets.add('Setup');
  setColumnWidths(setup, [180, 260, 140, 140, 140, 140, 140, 140]);
  addSheetTitle(setup, 'Setup', 'Project identity, opening timeline, and approval ownership.', 8);
  setValues(setup, 6, 1, [
    ['Project name', 'Dubai Marina Flagship'],
    ['Entity', 'Sample Restaurant LLC'],
    ['Planned opening month', 'Jul-2026'],
    ['Prepared by', ''],
    ['Reviewed by', ''],
    ['Contingency target %', 0.1],
    ['Working capital target months', 3],
  ]);
  styleRange(setup, 'A6:A12', { fillColor: COLORS.blueFill, bold: true });
  styleRange(setup, 'B6:B12', { fillColor: COLORS.inputFill });
  styleRange(setup, 'B11:B11', { numberFormat: FORMATS.percent1 });
  styleRange(setup, 'B12:B12', { numberFormat: FORMATS.integer });
  applyOutline(setup.getRange('A6:B12'));

  const budget = wb.worksheets.add('Budget_Input');
  budget.freezePanes.freezeRows(4);
  setColumnWidths(budget, [140, 220, 110, 140, 120, 90, 115, 80, 110, 115, 115, 115, 120, 120, 160]);
  addSheetTitle(budget, 'Budget_Input', 'Detailed uses of funds with timing, status, and approval trail.', 15);
  const budgetHeaders = [
    'Category',
    'Line item',
    'Status',
    'Vendor',
    'Quote ref',
    'Timing',
    'Budget ex VAT',
    'VAT %',
    'VAT AED',
    'Gross cash',
    'Paid to date',
    'Balance to pay',
    'Funding source',
    'Approver',
    'Notes',
  ];
  setValues(budget, 5, 1, [budgetHeaders]);
  styleRange(budget, 'A5:O5', { fillColor: COLORS.navy, fontColor: COLORS.white, bold: true, fontSize: 10, wrapText: true });
  const budgetLines = [
    ['Pre-opening', 'Trade license and approvals', 'Quoted', 'Consultant A', 'Q-001', 'M-3', 28000, 0.05, '', '', 0, '', 'Equity', 'Founder', ''],
    ['Pre-opening', 'Consultants and design', 'Quoted', 'Designer B', 'Q-002', 'M-3', 65000, 0.05, '', '', 0, '', 'Equity', 'Founder', ''],
    ['Fit-out', 'Civil works', 'Quoted', 'Contractor C', 'Q-003', 'M-2', 420000, 0.05, '', '', 0, '', 'Bank debt', 'CEO', ''],
    ['Fit-out', 'Kitchen equipment', 'Quoted', 'Vendor D', 'Q-004', 'M-2', 285000, 0.05, '', '', 0, '', 'Bank debt', 'CEO', ''],
    ['Fit-out', 'Furniture and fixtures', 'Quoted', 'Vendor E', 'Q-005', 'M-1', 125000, 0.05, '', '', 0, '', 'Equity', 'Founder', ''],
    ['Fit-out', 'POS and IT', 'Quoted', 'Vendor F', 'Q-006', 'M-1', 42000, 0.05, '', '', 0, '', 'Equity', 'Founder', ''],
    ['Opening stock', 'Food and beverage inventory', 'Budget', '', '', 'M-1', 54000, 0.05, '', '', 0, '', 'Working capital', 'COO', ''],
    ['Opening stock', 'Packaging and consumables', 'Budget', '', '', 'M-1', 16000, 0.05, '', '', 0, '', 'Working capital', 'COO', ''],
    ['People', 'Recruitment and visas', 'Budget', '', '', 'M-2', 48000, 0.05, '', '', 0, '', 'Equity', 'HR Lead', ''],
    ['People', 'Training payroll', 'Budget', '', '', 'M-1', 58000, 0.05, '', '', 0, '', 'Working capital', 'COO', ''],
    ['Marketing', 'Launch campaign', 'Budget', '', '', 'M-1', 60000, 0.05, '', '', 0, '', 'Equity', 'CMO', ''],
    ['Working capital', 'Three months operating buffer', 'Budget', '', '', 'M+1', 375000, 0, '', '', 0, '', 'Working capital', 'Founder', ''],
    ['Contingency', 'Fit-out contingency', 'Budget', '', '', 'M-2', 85000, 0.05, '', '', 0, '', 'Equity', 'Founder', ''],
    ['Contingency', 'Operating contingency', 'Budget', '', '', 'M+1', 45000, 0, '', '', 0, '', 'Working capital', 'Founder', ''],
  ];
  setValues(budget, 6, 1, budgetLines);
  styleRange(budget, 'A6:O19', { fillColor: COLORS.inputFill });
  styleRange(budget, 'G6:G19', { numberFormat: FORMATS.currency0 });
  styleRange(budget, 'H6:H19', { numberFormat: FORMATS.percent1 });
  styleRange(budget, 'K6:K19', { numberFormat: FORMATS.currency0 });
  addSimpleListValidation(budget, 'C6:C19', ['Budget', 'Quoted', 'Committed', 'Paid']);
  addSimpleListValidation(budget, 'F6:F19', ['M-3', 'M-2', 'M-1', 'M+0', 'M+1', 'M+2']);
  addSimpleListValidation(budget, 'M6:M19', ['Equity', 'Bank debt', 'Working capital', 'Landlord contribution']);
  Array.from({ length: budgetLines.length }, (_, index) => {
    const row = 6 + index;
    setFormulas(budget, row, 9, [[`=IF(G${row}="","",G${row}*H${row})`]]);
    setFormulas(budget, row, 10, [[`=IF(G${row}="","",G${row}+I${row})`]]);
    setFormulas(budget, row, 12, [[`=IF(J${row}="","",J${row}-K${row})`]]);
  });
  styleRange(budget, 'I6:J19', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  styleRange(budget, 'L6:L19', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  applyOutline(budget.getRange('A5:O19'));

  const funding = wb.worksheets.add('Funding_Uses');
  setColumnWidths(funding, [180, 140, 140, 140, 140, 140, 140, 140, 140, 140]);
  addSheetTitle(funding, 'Funding_Uses', 'Sources and uses summary, including cash timing.', 10);
  setValues(funding, 6, 1, [['Category', 'Gross cash'], ['Pre-opening', ''], ['Fit-out', ''], ['Opening stock', ''], ['People', ''], ['Marketing', ''], ['Working capital', ''], ['Contingency', ''], ['Total uses', '']]);
  styleRange(funding, 'A6:B6', { fillColor: COLORS.navy, fontColor: COLORS.white, bold: true });
  const categories = ['Pre-opening', 'Fit-out', 'Opening stock', 'People', 'Marketing', 'Working capital', 'Contingency'];
  categories.forEach((category, index) => {
    const row = 7 + index;
    setFormulas(funding, row, 2, [[`=SUMIF(Budget_Input!A$6:A$19,A${row},Budget_Input!J$6:J$19)`]]);
  });
  setFormulas(funding, 14, 2, [[`=SUM(B7:B13)`]]);
  styleRange(funding, 'B7:B14', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  applyOutline(funding.getRange('A6:B14'));

  setValues(funding, 6, 4, [['Funding source', 'Amount'], ['Equity', 650000], ['Bank debt', 750000], ['Working capital', 420000], ['Landlord contribution', 75000], ['Total sources', ''], ['Funding gap / surplus', '']]);
  styleRange(funding, 'D6:E6', { fillColor: COLORS.navy, fontColor: COLORS.white, bold: true });
  styleRange(funding, 'E7:E10', { fillColor: COLORS.inputFill, numberFormat: FORMATS.currency0 });
  setFormulas(funding, 11, 5, [[`=SUM(E7:E10)`]]);
  setFormulas(funding, 12, 5, [[`=E11-B14`]]);
  styleRange(funding, 'E11:E12', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0, bold: true });
  applyOutline(funding.getRange('D6:E12'));

  setValues(funding, 16, 1, [['Timing', 'Gross cash'], ['M-3', ''], ['M-2', ''], ['M-1', ''], ['M+0', ''], ['M+1', ''], ['M+2', '']]);
  styleRange(funding, 'A16:B16', { fillColor: COLORS.navy, fontColor: COLORS.white, bold: true });
  ['M-3', 'M-2', 'M-1', 'M+0', 'M+1', 'M+2'].forEach((bucket, index) => {
    const row = 17 + index;
    setFormulas(funding, row, 2, [[`=SUMIF(Budget_Input!F$6:F$19,A${row},Budget_Input!J$6:J$19)`]]);
  });
  styleRange(funding, 'B17:B22', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  applyOutline(funding.getRange('A16:B22'));

  const dashboard = wb.worksheets.add('Dashboard');
  dashboard.showGridLines = false;
  setColumnWidths(dashboard, [210, 140, 140, 140, 140, 140, 140, 140, 140, 140]);
  addSheetTitle(dashboard, 'Dashboard', 'Opening-budget summary for sponsors and finance review.', 10);
  setValues(dashboard, 6, 1, [['KPI', 'Value'], ['Total uses', ''], ['Total sources', ''], ['Funding gap / surplus', ''], ['Contingency % of uses', ''], ['Working capital bucket', '']]);
  styleMetricTable(dashboard, 'A6:B11', 'A6:B6', 'A7:A11', 'B7:B11');
  setFormulas(dashboard, 7, 2, [[`=Funding_Uses!B14`]]);
  setFormulas(dashboard, 8, 2, [[`=Funding_Uses!E11`]]);
  setFormulas(dashboard, 9, 2, [[`=Funding_Uses!E12`]]);
  setFormulas(dashboard, 10, 2, [[`=IF(B7=0,"",Funding_Uses!B13/B7)`]]);
  setFormulas(dashboard, 11, 2, [[`=Funding_Uses!B12`]]);
  styleRange(dashboard, 'B7:B9', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  styleRange(dashboard, 'B10:B10', { fillColor: COLORS.blueFill, numberFormat: FORMATS.percent1 });
  styleRange(dashboard, 'B11:B11', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  setValues(dashboard, 14, 1, [['Timing', 'Gross cash'], ['M-3', ''], ['M-2', ''], ['M-1', ''], ['M+0', ''], ['M+1', ''], ['M+2', '']]);
  ['M-3', 'M-2', 'M-1', 'M+0', 'M+1', 'M+2'].forEach((bucket, index) => {
    const row = 15 + index;
    setFormulas(dashboard, row, 2, [[`=SUMIF(Budget_Input!F$6:F$19,A${row},Budget_Input!J$6:J$19)`]]);
  });
  styleCompactTable(dashboard, 'A14:B20', 'A14:B14', 'A15:B20', ['B15:B20']);
  styleRange(dashboard, 'B15:B20', { numberFormat: FORMATS.currency0 });
  const budgetChart = dashboard.charts.add('ColumnClustered', funding.getRange('A6:B13'), 'Auto');
  budgetChart.title.text = 'Uses of funds by category';
  budgetChart.setPosition(dashboard.getRange('D6:J20'));
  budgetChart.width = 620;
  budgetChart.height = 300;
  styleChart(budgetChart, [COLORS.teal]);

  const checks = wb.worksheets.add('Checks');
  checks.showGridLines = false;
  setColumnWidths(checks, [260, 120, 420]);
  addSheetTitle(checks, 'Checks', 'Opening-budget review checks before approvals.', 6);
  setValues(checks, 6, 1, [
    ['Review test', 'Status', 'Comment'],
    ['All lines above AED 0 have a timing bucket', '', 'Timing is needed for real cash-flow visibility.'],
    ['All lines above AED 0 have an approver', '', 'Support approval trail for capex governance.'],
    ['Funding gap is not negative', '', 'Negative means current sources do not cover uses.'],
    ['Contingency meets target', '', 'Compare actual contingency allocation against Setup target.'],
  ]);
  setFormulas(checks, 7, 2, [[`=IF(COUNTIFS(Budget_Input!G6:G19,">0",Budget_Input!F6:F19,"")=0,"PASS","REVIEW")`]]);
  setFormulas(checks, 8, 2, [[`=IF(COUNTIFS(Budget_Input!G6:G19,">0",Budget_Input!N6:N19,"")=0,"PASS","REVIEW")`]]);
  setFormulas(checks, 9, 2, [[`=IF(Dashboard!B9>=0,"PASS","REVIEW")`]]);
  setFormulas(checks, 10, 2, [[`=IF(Dashboard!B10>=Setup!B11,"PASS","REVIEW")`]]);
  styleRange(checks, 'B7:B10', { fillColor: COLORS.blueFill, bold: true });
  styleCompactTable(checks, 'A6:C10', 'A6:C6', 'A7:C10', ['B7:B10']);

  return {
    wb,
    filename: 'opening-budget-template.xlsx',
    previewSheets: [
      { sheetName: 'Dashboard', range: 'A1:J20', file: 'opening-budget-dashboard.png' },
      { sheetName: 'Budget_Input', range: 'A1:O19', file: 'opening-budget-core.png' },
    ],
  };
}

function buildBusinessPlanWorkbook() {
  const wb = Workbook.create();
  buildReadmeSheet(wb, {
    title: 'Business Plan Model - UAE Audit-Ready Workbook',
    subtitle:
      'A 24-month restaurant financial model with revenue build, opex assumptions, P&L, cash flow, dashboard, and review checks. Structured for founder decisions, bank conversations, and investor-ready refinement.',
    reportingBasis: 'Starter assumptions are placeholders only. Replace with branch-specific data, landlord terms, and financing terms before using the model externally.',
    instructions: [
      'Complete Setup, then update Revenue_Build and Opex_Assumptions. Orange cells are editable assumptions; blue cells are formula outputs.',
      'Review P&L_24M, Cash_Flow, and Dashboard together. The model is only as strong as the assumptions supporting occupancy, staffing, and ramp-up.',
      'Use Checks before circulating the file to investors, lenders, landlords, or auditors.',
    ],
    auditChecklist: [
      'Retain support for lease terms, capex quotes, wage assumptions, and sales-ramp logic.',
      'Document all assumptions that do not come directly from executed contracts or historical branch data.',
      'Separate scenario discussion from base-case logic. Do not overwrite the base case without version control.',
      'Capture preparer / reviewer sign-off and note any manual overrides to formulas or assumptions.',
    ],
  });

  const setup = wb.worksheets.add('Setup');
  setColumnWidths(setup, [180, 260, 140, 140, 140, 140, 140, 140]);
  addSheetTitle(setup, 'Setup', 'Project identity, funding assumptions, and model control inputs.', 8);
  setValues(setup, 6, 1, [
    ['Project name', 'Marina flagship cafe'],
    ['Entity', 'Sample Restaurant LLC'],
    ['Model start month', new Date(2026, 6, 1)],
    ['Opening capex AED', 1450000],
    ['Initial funding AED', 1650000],
    ['Corporate tax rate', 0],
    ['Prepared by', ''],
    ['Reviewed by', ''],
  ]);
  styleRange(setup, 'A6:A13', { fillColor: COLORS.blueFill, bold: true });
  styleRange(setup, 'B6:B13', { fillColor: COLORS.inputFill });
  styleRange(setup, 'B8:B8', { numberFormat: FORMATS.date });
  styleRange(setup, 'B9:B10', { numberFormat: FORMATS.currency0 });
  styleRange(setup, 'B11:B11', { numberFormat: FORMATS.percent1 });
  applyOutline(setup.getRange('A6:B13'));

  const months = Array.from({ length: 24 }, (_, index) => new Date(2026, 6 + index, 1));

  const revenue = wb.worksheets.add('Revenue_Build');
  revenue.freezePanes.freezeRows(4);
  setColumnWidths(revenue, [220, ...Array.from({ length: 24 }, () => 88), 120]);
  addSheetTitle(revenue, 'Revenue_Build', 'Base-case sales build across 24 months.', 26);
  setValues(revenue, 5, 1, [['Driver', ...months, 'Year 1 / 2 total']]);
  styleRange(revenue, a1(5, 1, 5, 26), { fillColor: COLORS.navy, fontColor: COLORS.white, bold: true, fontSize: 10 });
  styleRange(revenue, a1(5, 2, 5, 25), { numberFormat: 'mmm-yy' });
  const revRows = [
    ['Operating days', ...Array.from({ length: 24 }, () => 30), ''],
    ['Dine-in covers / day', 210, 215, 220, 225, 230, 235, 240, 242, 245, 248, 250, 252, 255, 258, 260, 262, 264, 266, 268, 270, 270, 270, 270, 270, ''],
    ['Dine-in APC AED', ...Array.from({ length: 24 }, (_, index) => 36 + Math.min(index, 11) * 0.35), ''],
    ['Dine-in sales', ...Array.from({ length: 24 }, () => ''), ''],
    ['Takeaway orders / day', 90, 92, 94, 95, 96, 97, 98, 98, 99, 100, 100, 100, 101, 102, 103, 104, 105, 106, 106, 106, 106, 106, 106, 106, ''],
    ['Takeaway AOV AED', ...Array.from({ length: 24 }, (_, index) => 24.5 + Math.min(index, 11) * 0.15), ''],
    ['Takeaway sales', ...Array.from({ length: 24 }, () => ''), ''],
    ['Delivery orders / day', 100, 102, 104, 106, 108, 110, 112, 113, 114, 115, 116, 117, 118, 118, 119, 120, 120, 121, 122, 122, 122, 122, 122, 122, ''],
    ['Delivery AOV AED', ...Array.from({ length: 24 }, (_, index) => 30.5 + Math.min(index, 11) * 0.18), ''],
    ['Delivery gross sales', ...Array.from({ length: 24 }, () => ''), ''],
    ['Gross sales', ...Array.from({ length: 24 }, () => ''), ''],
    ['Discounts %', 0.055, 0.055, 0.052, 0.052, 0.05, 0.05, 0.05, 0.048, 0.048, 0.047, 0.047, 0.047, 0.045, 0.045, 0.045, 0.045, 0.045, 0.045, 0.045, 0.045, 0.045, 0.045, 0.045, 0.045, ''],
    ['Net sales', ...Array.from({ length: 24 }, () => ''), ''],
  ];
  setValues(revenue, 6, 1, revRows);
  styleRange(revenue, a1(6, 2, 18, 25), { fillColor: COLORS.inputFill });
  styleRange(revenue, a1(6, 2, 18, 25), { numberFormat: FORMATS.integer });
  styleRange(revenue, a1(8, 2, 8, 25), { numberFormat: FORMATS.currency2 });
  styleRange(revenue, a1(11, 2, 11, 25), { numberFormat: FORMATS.currency2 });
  styleRange(revenue, a1(14, 2, 14, 25), { numberFormat: FORMATS.percent1 });
  Array.from({ length: 24 }, (_, index) => {
    const col = 2 + index;
    const c = colLetter(col);
    setFormulas(revenue, 9, col, [[`=${c}6*${c}7*${c}8`]]);
    setFormulas(revenue, 12, col, [[`=${c}6*${c}10*${c}11`]]);
    setFormulas(revenue, 15, col, [[`=${c}6*${c}13*${c}14`]]);
    setFormulas(revenue, 16, col, [[`=${c}9+${c}12+${c}15`]]);
    setFormulas(revenue, 18, col, [[`=${c}16*(1-${c}17)`]]);
  });
  for (let row = 6; row <= 18; row += 1) {
    setFormulas(revenue, row, 26, [[`=SUM(B${row}:Y${row})`]]);
  }
  styleRange(revenue, a1(9, 2, 18, 26), { fillColor: COLORS.blueFill });
  styleRange(revenue, a1(9, 2, 9, 26), { numberFormat: FORMATS.currency0 });
  styleRange(revenue, a1(12, 2, 12, 26), { numberFormat: FORMATS.currency0 });
  styleRange(revenue, a1(15, 2, 15, 26), { numberFormat: FORMATS.currency0 });
  styleRange(revenue, a1(16, 2, 18, 26), { numberFormat: FORMATS.currency0 });
  styleRange(revenue, a1(1, 1, 18, 26), { fontSize: 10 });
  applyOutline(revenue.getRange(a1(5, 1, 18, 26)));

  const opex = wb.worksheets.add('Opex_Assumptions');
  opex.freezePanes.freezeRows(4);
  setColumnWidths(opex, [220, ...Array.from({ length: 24 }, () => 88), 120]);
  addSheetTitle(opex, 'Opex_Assumptions', 'Percentage and fixed-cost assumptions used by the model.', 26);
  setValues(opex, 5, 1, [['Assumption', ...months, 'Year 1 / 2 avg']]);
  styleRange(opex, a1(5, 1, 5, 26), { fillColor: COLORS.navy, fontColor: COLORS.white, bold: true, fontSize: 10 });
  styleRange(opex, a1(5, 2, 5, 25), { numberFormat: 'mmm-yy' });
  const opexRows = [
    ['Food cost %', ...Array.from({ length: 24 }, () => 0.29), ''],
    ['Packaging % of delivery sales', ...Array.from({ length: 24 }, () => 0.045), ''],
    ['Aggregator commission % of delivery sales', ...Array.from({ length: 24 }, () => 0.24), ''],
    ['Labor fixed AED', ...Array.from({ length: 24 }, (_, index) => 80000 + index * 500), ''],
    ['Labor variable % of net sales', ...Array.from({ length: 24 }, () => 0.035), ''],
    ['Rent AED', ...Array.from({ length: 24 }, () => 52000), ''],
    ['CAM / service charge AED', ...Array.from({ length: 24 }, () => 7000), ''],
    ['Utilities AED', ...Array.from({ length: 24 }, (_, index) => 10000 + index * 100), ''],
    ['Marketing % of net sales', ...Array.from({ length: 24 }, () => 0.025), ''],
    ['G&A AED', ...Array.from({ length: 24 }, () => 10000), ''],
    ['Maintenance AED', ...Array.from({ length: 24 }, () => 3500), ''],
    ['Other opex AED', ...Array.from({ length: 24 }, () => 2500), ''],
    ['Maintenance capex AED', ...Array.from({ length: 24 }, () => 2000), ''],
  ];
  setValues(opex, 6, 1, opexRows);
  styleRange(opex, a1(6, 2, 18, 25), { fillColor: COLORS.inputFill });
  styleRange(opex, a1(6, 2, 10, 25), { numberFormat: FORMATS.percent1 });
  styleRange(opex, a1(9, 2, 18, 25), { numberFormat: FORMATS.currency0 });
  for (let row = 6; row <= 18; row += 1) {
    setFormulas(opex, row, 26, [[`=AVERAGE(B${row}:Y${row})`]]);
  }
  styleRange(opex, a1(6, 26, 18, 26), { fillColor: COLORS.blueFill });
  styleRange(opex, a1(6, 8, 6, 26), { numberFormat: FORMATS.percent1 });
  applyOutline(opex.getRange(a1(5, 1, 18, 26)));

  const pnl = wb.worksheets.add('P&L_24M');
  pnl.freezePanes.freezeRows(4);
  setColumnWidths(pnl, [220, ...Array.from({ length: 24 }, () => 88), 120]);
  addSheetTitle(pnl, 'P&L_24M', 'Calculated 24-month operating model.', 26);
  setValues(pnl, 5, 1, [['Line item', ...months, '24M total']]);
  styleRange(pnl, a1(5, 1, 5, 26), { fillColor: COLORS.navy, fontColor: COLORS.white, bold: true, fontSize: 10 });
  styleRange(pnl, a1(5, 2, 5, 25), { numberFormat: 'mmm-yy' });
  const pnlLines = [
    ['Net sales', ...Array.from({ length: 24 }, () => ''), ''],
    ['Food cost', ...Array.from({ length: 24 }, () => ''), ''],
    ['Packaging', ...Array.from({ length: 24 }, () => ''), ''],
    ['Aggregator fees', ...Array.from({ length: 24 }, () => ''), ''],
    ['Gross profit', ...Array.from({ length: 24 }, () => ''), ''],
    ['Gross margin %', ...Array.from({ length: 24 }, () => ''), ''],
    ['Labor fixed', ...Array.from({ length: 24 }, () => ''), ''],
    ['Labor variable', ...Array.from({ length: 24 }, () => ''), ''],
    ['Total labor', ...Array.from({ length: 24 }, () => ''), ''],
    ['Rent', ...Array.from({ length: 24 }, () => ''), ''],
    ['CAM / service charge', ...Array.from({ length: 24 }, () => ''), ''],
    ['Utilities', ...Array.from({ length: 24 }, () => ''), ''],
    ['Marketing', ...Array.from({ length: 24 }, () => ''), ''],
    ['G&A', ...Array.from({ length: 24 }, () => ''), ''],
    ['Maintenance', ...Array.from({ length: 24 }, () => ''), ''],
    ['Other opex', ...Array.from({ length: 24 }, () => ''), ''],
    ['EBITDA', ...Array.from({ length: 24 }, () => ''), ''],
    ['EBITDA %', ...Array.from({ length: 24 }, () => ''), ''],
  ];
  setValues(pnl, 6, 1, pnlLines);
  Array.from({ length: 24 }, (_, index) => {
    const col = 2 + index;
    const c = colLetter(col);
    setFormulas(pnl, 6, col, [[`=Revenue_Build!${c}18`]]);
    setFormulas(pnl, 7, col, [[`=${c}6*Opex_Assumptions!${c}6`]]);
    setFormulas(pnl, 8, col, [[`=Revenue_Build!${c}15*Opex_Assumptions!${c}7`]]);
    setFormulas(pnl, 9, col, [[`=Revenue_Build!${c}15*Opex_Assumptions!${c}8`]]);
    setFormulas(pnl, 10, col, [[`=${c}6-${c}7-${c}8-${c}9`]]);
    setFormulas(pnl, 11, col, [[`=IF(${c}6=0,"",${c}10/${c}6)`]]);
    setFormulas(pnl, 12, col, [[`=Opex_Assumptions!${c}9`]]);
    setFormulas(pnl, 13, col, [[`=${c}6*Opex_Assumptions!${c}10`]]);
    setFormulas(pnl, 14, col, [[`=${c}12+${c}13`]]);
    setFormulas(pnl, 15, col, [[`=Opex_Assumptions!${c}11`]]);
    setFormulas(pnl, 16, col, [[`=Opex_Assumptions!${c}12`]]);
    setFormulas(pnl, 17, col, [[`=Opex_Assumptions!${c}13`]]);
    setFormulas(pnl, 18, col, [[`=${c}6*Opex_Assumptions!${c}14`]]);
    setFormulas(pnl, 19, col, [[`=Opex_Assumptions!${c}15`]]);
    setFormulas(pnl, 20, col, [[`=Opex_Assumptions!${c}16`]]);
    setFormulas(pnl, 21, col, [[`=Opex_Assumptions!${c}17`]]);
    setFormulas(pnl, 22, col, [[`=${c}10-${c}14-${c}15-${c}16-${c}17-${c}18-${c}19-${c}20-${c}21`]]);
    setFormulas(pnl, 23, col, [[`=IF(${c}6=0,"",${c}22/${c}6)`]]);
  });
  for (let row = 6; row <= 23; row += 1) {
    setFormulas(pnl, row, 26, [[`=SUM(B${row}:Y${row})`]]);
  }
  styleRange(pnl, a1(6, 2, 23, 26), { fillColor: COLORS.blueFill });
  styleRange(pnl, a1(6, 2, 22, 26), { numberFormat: FORMATS.currency0 });
  styleRange(pnl, a1(11, 2, 11, 26), { numberFormat: FORMATS.percent1 });
  styleRange(pnl, a1(23, 2, 23, 26), { numberFormat: FORMATS.percent1 });
  applyOutline(pnl.getRange(a1(5, 1, 23, 26)));

  const cash = wb.worksheets.add('Cash_Flow');
  cash.freezePanes.freezeRows(4);
  setColumnWidths(cash, [220, ...Array.from({ length: 24 }, () => 88), 140]);
  addSheetTitle(cash, 'Cash_Flow', 'Funding, capex, and cash payback view.', 26);
  setValues(cash, 5, 1, [['Line item', ...months, '24M total']]);
  styleRange(cash, a1(5, 1, 5, 26), { fillColor: COLORS.navy, fontColor: COLORS.white, bold: true, fontSize: 10 });
  styleRange(cash, a1(5, 2, 5, 25), { numberFormat: 'mmm-yy' });
  const cashLines = [
    ['Opening capex', ...Array.from({ length: 24 }, () => ''), ''],
    ['Initial funding', ...Array.from({ length: 24 }, () => ''), ''],
    ['EBITDA', ...Array.from({ length: 24 }, () => ''), ''],
    ['Maintenance capex', ...Array.from({ length: 24 }, () => ''), ''],
    ['Net cash movement', ...Array.from({ length: 24 }, () => ''), ''],
    ['Cumulative cash', ...Array.from({ length: 24 }, () => ''), ''],
  ];
  setValues(cash, 6, 1, cashLines);
  Array.from({ length: 24 }, (_, index) => {
    const col = 2 + index;
    const c = colLetter(col);
    setFormulas(cash, 6, col, [[index === 0 ? '=Setup!B9' : '=0']]);
    setFormulas(cash, 7, col, [[index === 0 ? '=Setup!B10' : '=0']]);
    setFormulas(cash, 8, col, [[`='P&L_24M'!${c}22`]]);
    setFormulas(cash, 9, col, [[`=Opex_Assumptions!${c}18`]]);
    setFormulas(cash, 10, col, [[`=${c}7-${c}6+${c}8-${c}9`]]);
    if (index === 0) {
      setFormulas(cash, 11, col, [[`=${c}10`]]);
    } else {
      const prev = colLetter(col - 1);
      setFormulas(cash, 11, col, [[`=${prev}11+${c}10`]]);
    }
  });
  for (let row = 6; row <= 11; row += 1) {
    setFormulas(cash, row, 26, [[`=SUM(B${row}:Y${row})`]]);
  }
  styleRange(cash, a1(6, 2, 11, 26), { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  applyOutline(cash.getRange(a1(5, 1, 11, 26)));

  const dashboard = wb.worksheets.add('Dashboard');
  dashboard.showGridLines = false;
  setColumnWidths(dashboard, [220, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160]);
  addSheetTitle(dashboard, 'Dashboard', 'Base-case economics and cash profile.', 10);
  setValues(dashboard, 6, 1, [
    ['KPI', 'Value'],
    ['Year 1 net sales', ''],
    ['Year 2 net sales', ''],
    ['24M EBITDA margin', ''],
    ['Peak funding gap', ''],
    ['Month cash turns positive', ''],
  ]);
  styleMetricTable(dashboard, 'A6:B11', 'A6:B6', 'A7:A11', 'B7:B11');
  setFormulas(dashboard, 7, 2, [[`=SUM('P&L_24M'!B6:M6)`]]);
  setFormulas(dashboard, 8, 2, [[`=SUM('P&L_24M'!N6:Y6)`]]);
  setFormulas(dashboard, 9, 2, [[`=IF('P&L_24M'!Z6=0,"",'P&L_24M'!Z22/'P&L_24M'!Z6)`]]);
  setFormulas(dashboard, 10, 2, [[`=MIN(Cash_Flow!B11:Y11)`]]);
  setFormulas(dashboard, 11, 2, [[`=IFERROR(MATCH(TRUE,INDEX(Cash_Flow!B11:Y11>=0,0),0),"Not reached")`]]);
  styleRange(dashboard, 'B7:B8', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  styleRange(dashboard, 'B9:B9', { fillColor: COLORS.blueFill, numberFormat: FORMATS.percent1 });
  styleRange(dashboard, 'B10:B10', { fillColor: COLORS.blueFill, numberFormat: FORMATS.currency0 });
  styleRange(dashboard, 'B11:B11', { fillColor: COLORS.blueFill });
  setValues(dashboard, 16, 1, [['Month', 'Net sales', 'EBITDA']]);
  Array.from({ length: 24 }, (_, index) => {
    const row = 17 + index;
    const col = 2 + index;
    setValues(dashboard, row, 1, [[months[index]]]);
    styleRange(dashboard, a1(row, 1), { numberFormat: 'mmm-yy' });
    setFormulas(dashboard, row, 2, [[`='P&L_24M'!${colLetter(col)}6`]]);
    setFormulas(dashboard, row, 3, [[`='P&L_24M'!${colLetter(col)}22`]]);
  });
  styleCompactTable(dashboard, 'A16:C40', 'A16:C16', 'A17:C40', ['B17:C40']);
  styleRange(dashboard, 'B17:C40', { numberFormat: FORMATS.currency0 });
  const bizChart = dashboard.charts.add('ColumnClustered', dashboard.getRange('A16:C40'), 'Auto');
  bizChart.title.text = '24-month sales vs EBITDA';
  bizChart.setPosition(dashboard.getRange('E6:M23'));
  bizChart.width = 720;
  bizChart.height = 320;
  styleChart(bizChart, [COLORS.teal, COLORS.amber]);

  const checks = wb.worksheets.add('Checks');
  checks.showGridLines = false;
  setColumnWidths(checks, [260, 120, 420]);
  addSheetTitle(checks, 'Checks', 'Base-case review checks before external sharing.', 6);
  setValues(checks, 6, 1, [
    ['Review test', 'Status', 'Comment'],
    ['Setup fields completed', '', 'Project identity and funding assumptions should be filled.'],
    ['No negative gross margin months', '', 'Fix pricing or cost assumptions if gross margin is negative.'],
    ['No negative EBITDA after month 6', '', 'Later negative EBITDA suggests the model is not commercially viable.'],
    ['Cumulative cash turns positive within 24 months', '', 'If not, funding plan or economics likely need revision.'],
  ]);
  setFormulas(checks, 7, 2, [[`=IF(COUNTA(Setup!B6:B13)>=6,"PASS","REVIEW")`]]);
  setFormulas(checks, 8, 2, [[`=IF(COUNTIF('P&L_24M'!B11:Y11,"<0")=0,"PASS","REVIEW")`]]);
  setFormulas(checks, 9, 2, [[`=IF(COUNTIF('P&L_24M'!H22:Y22,"<0")=0,"PASS","REVIEW")`]]);
  setFormulas(checks, 10, 2, [[`=IF(MIN(Cash_Flow!B11:Y11)>=0,"PASS","REVIEW")`]]);
  styleRange(checks, 'B7:B10', { fillColor: COLORS.blueFill, bold: true });
  styleCompactTable(checks, 'A6:C10', 'A6:C6', 'A7:C10', ['B7:B10']);

  return {
    wb,
    filename: 'business-plan-model-template.xlsx',
    previewSheets: [
      { sheetName: 'Dashboard', range: 'A1:M24', file: 'business-plan-model-dashboard.png' },
      { sheetName: 'P&L_24M', range: 'A1:Z23', file: 'business-plan-model-core.png' },
    ],
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
    maxChars: 5000,
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
    buildPnLWorkbook(),
    buildWeeklyFlashWorkbook(),
    buildRecipeWorkbook(),
    buildOpeningBudgetWorkbook(),
    buildBusinessPlanWorkbook(),
  ];

  for (const workbook of workbooks) {
    await exportWorkbookArtifact(workbook);
    console.log(`Built ${workbook.filename}`);
  }
}

await main();
