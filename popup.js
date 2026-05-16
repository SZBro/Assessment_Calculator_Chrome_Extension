'use strict';

let lastResult = null;

function pad(n) { return String(n).padStart(2, '0'); }
function fmtDate(y, m, d) { return y + '/' + pad(m) + '/' + pad(d); }

function calcAge(ty, tm, td, by, bm, bd) {
  const totalTest  = ty * 360 + (tm - 1) * 30 + td;
  const totalBirth = by * 360 + (bm - 1) * 30 + bd;
  const diff = totalTest - totalBirth;
  if (diff < 0) return null;
  return {
    years:       Math.floor(diff / 360),
    months:      Math.floor((diff % 360) / 30),
    days:        diff % 30,
    totalMonths: Math.floor(diff / 30)
  };
}

const errorEl       = document.getElementById('error');
const resultCard    = document.getElementById('result-card');
const resYear       = document.getElementById('res-year');
const resMonth      = document.getElementById('res-month');
const resDay        = document.getElementById('res-day');
const detailEl      = document.getElementById('detail');
const totalMonthsEl = document.getElementById('total-months');

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.style.display = 'block';
}

function getFields() {
  return {
    ty: parseInt(document.getElementById('test-y').value),
    tm: parseInt(document.getElementById('test-m').value),
    td: parseInt(document.getElementById('test-d').value),
    by: parseInt(document.getElementById('birth-y').value),
    bm: parseInt(document.getElementById('birth-m').value),
    bd: parseInt(document.getElementById('birth-d').value),
  };
}

function calculate() {
  errorEl.style.display = 'none';
  const { ty, tm, td, by, bm, bd } = getFields();

  if (!ty || !tm || !td || !by || !bm || !bd) return showError('Please fill in all date fields.');
  if (tm < 1 || tm > 12 || bm < 1 || bm > 12) return showError('Month must be between 1 and 12.');
  if (td < 1 || td > 31 || bd < 1 || bd > 31) return showError('Day must be between 1 and 31.');

  const testDate  = new Date(ty, tm - 1, td);
  const birthDate = new Date(by, bm - 1, bd);
  if (testDate <= birthDate) return showError('Test date must be after date of birth.');

  const age = calcAge(ty, tm, td, by, bm, bd);
  if (!age) return showError('Could not calculate age.');

  lastResult = { age, ty, tm, td, by, bm, bd };

  resYear.textContent  = age.years;
  resMonth.textContent = age.months;
  resDay.textContent   = age.days;
  detailEl.textContent = 'Test: ' + fmtDate(ty, tm, td) + '  ·  DOB: ' + fmtDate(by, bm, bd);

  if (age.years < 6) {
    totalMonthsEl.textContent = age.totalMonths + ' total months';
    totalMonthsEl.style.display = 'block';
  } else {
    totalMonthsEl.style.display = 'none';
  }

  resultCard.style.display = 'block';
}

document.getElementById('test-y').addEventListener('input', e => { if (e.target.value.length === 4) document.getElementById('test-m').focus(); });
document.getElementById('test-m').addEventListener('input', e => { if (e.target.value.length === 2) document.getElementById('test-d').focus(); });
document.getElementById('birth-y').addEventListener('input', e => { if (e.target.value.length === 4) document.getElementById('birth-m').focus(); });
document.getElementById('birth-m').addEventListener('input', e => { if (e.target.value.length === 2) document.getElementById('birth-d').focus(); });

document.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });
document.getElementById('calc-btn').addEventListener('click', calculate);