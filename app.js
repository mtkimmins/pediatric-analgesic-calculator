const DOSING = {
  Tylenol: {
    minMgPerKg: 10,
    maxMgPerKg: 15,
    maxDosesPerDay: 5,
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
  weightKg: document.getElementById('weightKg'),
  weightLbs: document.getElementById('weightLbs'),
  calcKg: document.getElementById('calcKg'),
  mgRange: document.getElementById('mgRange'),
  mlRange: document.getElementById('mlRange'),
  roundedDose: document.getElementById('roundedDose'),
  sig: document.getElementById('sig'),
};

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function roundTo(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function calculate() {
  const brand = els.brand.value;
  const product = els.product.value;
  const kgInput = toNumber(els.weightKg.value);
  const lbsInput = toNumber(els.weightLbs.value);

  const calcKg = kgInput > 0 ? kgInput : lbsInput / 2.2;
  const safeKg = Math.max(calcKg, 0);

  const cfg = DOSING[brand];
  const mgMin = cfg.minMgPerKg * safeKg;
  const mgMax = cfg.maxMgPerKg * safeKg;
  const strength = cfg.strengths[product];

  const mlMin = strength > 0 ? mgMin / strength : 0;
  const mlMax = strength > 0 ? mgMax / strength : 0;
  const roundedDose = Math.round((mlMin + mlMax) / 2);

  els.calcKg.textContent = roundTo(safeKg, 2).toFixed(2);
  els.mgRange.textContent = `${roundTo(mgMin, 2)} to ${roundTo(mgMax, 2)} mg`;
  els.mlRange.textContent = `${roundTo(mlMin, 2)} to ${roundTo(mlMax, 2)} mL`;
  els.roundedDose.textContent = String(roundedDose);
  els.sig.textContent = `Give ${roundedDose} mL(s) orally every ${cfg.minHour}-${cfg.maxHour} hours as needed. Do not exceed ${cfg.maxDosesPerDay} doses.`;
}

for (const input of [els.brand, els.product, els.weightKg, els.weightLbs]) {
  input.addEventListener('input', calculate);
  input.addEventListener('change', calculate);
}

calculate();
