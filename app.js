const DOSING = {
  Tylenol: {
    minMgPerKg: 10,
    maxMgPerKg: 15,
    maxDosesPerDay: 5,
    maxMgPerDay: 4000,
    maxMgPerKgPerDay: 75,
    minHour: 4,
    maxHour: 6,
    strengths: {
      'Infant Drops': 80,
      "Children's Liquid": 32,
    },
  },
  Advil: {
    minMgPerKg: 5,
    maxMgPerKg: 10,
    maxDosesPerDay: 4,
    maxMgPerDay: 1200,
    maxMgPerKgPerDay: 40,
    minHour: 6,
    maxHour: 8,
    strengths: {
      'Infant Drops': 40,
      "Children's Liquid": 20,
    },
  },
};

const els = {
  brand: document.getElementById('brand'),
  product: document.getElementById('product'),
  weightInput: document.getElementById('weightInput'),
  weightLabel: document.getElementById('weightLabel'),
  weightUnitToggle: document.getElementById('weightUnitToggle'),
  calcKg: document.getElementById('calcKg'),
  mgRange: document.getElementById('mgRange'),
  mlRange: document.getElementById('mlRange'),
  roundedDose: document.getElementById('roundedDose'),
  mgDailyMax: document.getElementById('mgDailyMax'),
  wtBasedDailyMax: document.getElementById('wtBasedDailyMax'),
  sig: document.getElementById('sig'),
  productWarning: document.getElementById('productWarning'),
};

const LBS_PER_KG = 2.2;

function roundTo(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function getSelectedWeightUnit() {
  return els.weightUnitToggle.checked ? 'lbs' : 'kg';
}

function updateWeightLabel() {
  const unit = getSelectedWeightUnit();
  els.weightLabel.textContent = `Weight (${unit})`;
}

function parseWeightInput(rawValue) {
  const trimmed = rawValue.trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

function getWeightKg() {
  const weightValue = parseWeightInput(els.weightInput.value);
  if (weightValue === null) return 0;
  return getSelectedWeightUnit() === 'lbs' ? weightValue / LBS_PER_KG : weightValue;
}

function handleUnitToggle() {
  const numericWeight = parseWeightInput(els.weightInput.value);
  if (numericWeight !== null) {
    const converted =
      getSelectedWeightUnit() === 'lbs'
        ? numericWeight * LBS_PER_KG
        : numericWeight / LBS_PER_KG;
    els.weightInput.value = String(roundTo(converted, 2));
  } else {
    els.weightInput.value = '';
  }
  updateWeightLabel();
  calculate();
}

function calculate() {
  const brand = els.brand.value;
  const product = els.product.value;
  const safeKg = Math.max(getWeightKg(), 0);

  const cfg = DOSING[brand];
  const mgMin = cfg.minMgPerKg * safeKg;
  const mgMax = cfg.maxMgPerKg * safeKg;
  const strength = cfg.strengths[product];

  const mlMin = strength > 0 ? mgMin / strength : 0;
  const mlMax = strength > 0 ? mgMax / strength : 0;
  const roundedDose = Math.round((mlMin + mlMax) / 2);

  //Maximum Daily Dosing Calculations
  //Translate all limits to mg/day
  const wtBasedDailyMax = safeKg * cfg.maxMgPerKgPerDay;
  const nDosesToMg = (cfg.maxDosesPerDay * roundedDose)*strength;
  //+the hard-coded limit mg cap

  const lowestDailyLimitMg = Math.min(wtBasedDailyMax, nDosesToMg, cfg.maxMgPerDay);
  const lowestDailyLimitMl = Math.max((lowestDailyLimitMg / strength),0);
  let floorDoses = Math.floor(lowestDailyLimitMl / roundedDose);
  if (Number.isNaN(floorDoses)){
    floorDoses = 0;
  }
  const lowestDailyLimitDoses = floorDoses;



  els.calcKg.textContent = roundTo(safeKg, 2).toFixed(2);
  els.mgRange.textContent = `${roundTo(mgMin, 2)} to ${roundTo(mgMax, 2)} mg`;
  els.mlRange.textContent = `${roundTo(mlMin, 2)} to ${roundTo(mlMax, 2)} mL`;
  els.roundedDose.textContent = `${String(roundedDose)} mL (${roundedDose * strength} mg)`;
  els.mgDailyMax.textContent = `${lowestDailyLimitMg} mg (${lowestDailyLimitMl} mL)`;
  els.sig.textContent = `Give ${roundedDose} mL(s) orally every ${cfg.minHour}-${cfg.maxHour} hours as needed. Do not exceed ${lowestDailyLimitDoses} doses per day.`;

  let warningMessage = '';
  if (safeKg > 0 && safeKg < 5.5){
    warningMessage = 'For infants under 5.5 kg (12.1 lbs), it is recommended to speak to a physician prior to administration.'
  } else if (safeKg > 43.2){
    warningMessage = 'For children over 43.2 kg (95 lbs), consider using adult dosing with help from a healthcare professional.'
  } else if (safeKg > 0 && safeKg <= 11 && product === "Children's Liquid") {
    warningMessage = 'For weights of 11 kg (24.2 lbs) and under, select Infant Drops instead of Children\'s Liquid.';
  } else if (safeKg > 11 && product === 'Infant Drops') {
    warningMessage = 'For weights over 11 kg (24.2 lbs), select Children\'s Liquid instead of Infant Drops.';
  }

    //cap adult dosing
  if (roundedDose * strength > lowestDailyLimitMg){
    warningMessage = 'Dose required higher than daily maximum recommended.';
    els.sig.textContent = `Consult a healthcare professional`;
  }
  

  els.productWarning.textContent = warningMessage;
  els.productWarning.classList.toggle('hidden', warningMessage === '');
}

for (const input of [els.brand, els.product, els.weightInput]) {
  input.addEventListener('input', calculate);
  input.addEventListener('change', calculate);
}

els.weightUnitToggle.addEventListener('change', handleUnitToggle);

updateWeightLabel();
calculate();
