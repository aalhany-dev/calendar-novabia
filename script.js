'use strict';
/** Novabia Chronicle: all sections are client-side and GitHub Pages compatible. */
const MS_DAY = 86400000;
const EPOCH_MS = Date.UTC(2025, 11, 21);
// Year 2026 begins at the December 2025 epoch; 5YLW years use civil-style year labels.
const FIRST_5YLW_YEAR = 2026;
const LAST_5YLW_YEAR = FIRST_5YLW_YEAR + 998;
const YEAR_PICKER_LAST = FIRST_5YLW_YEAR + 149;
const TABS = ['calendar', 'rewards', 'development', 'system', 'archive'];
const schedule = window.NOVABIA_SCHEDULE || { events: [] };
const allEvents = Array.isArray(schedule.events) ? schedule.events.filter(isValidEvent) : [];
const weekdayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const today = new Date();
const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
const todayFive = fromGregorianUTC(todayUTC);
let visibleYear = todayFive ? todayFive.year : FIRST_5YLW_YEAR;
let visibleMonth = todayFive ? todayFive.month : 1;
let selectedDay = todayFive ? todayFive.day : 1;
const $ = id => document.getElementById(id);
const prettyGregorian = new Intl.DateTimeFormat('en-GB', {day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
const shortGregorian = new Intl.DateTimeFormat('en-GB', {day:'numeric',month:'short',timeZone:'UTC'});
const longGregorian = new Intl.DateTimeFormat('en-GB', {weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const safeText = value => String(value ?? '');

function isLeapYear(year) {
  return year >= FIRST_5YLW_YEAR && year % 5 === 0 && year % 50 !== 0 && (year - 25) % 400 !== 0;
}
function monthsInYear(year) { return isLeapYear(year) ? 14 : 13; }
function yearDays(year) { return 364 + (isLeapYear(year) ? 7 : 0); }
function monthDays(year, month) { return month === 14 && isLeapYear(year) ? 7 : 28; }
function toGregorianUTC(year, month, day) {
  if (!Number.isInteger(year) || year < FIRST_5YLW_YEAR || year > LAST_5YLW_YEAR || !Number.isInteger(month) || month < 1 || month > monthsInYear(year) || !Number.isInteger(day) || day < 1 || day > monthDays(year,month)) return null;
  let offset = 0;
  for (let y=FIRST_5YLW_YEAR; y<year; y++) offset += yearDays(y);
  offset += Math.min(13,month-1) * 28 + (day - 1);
  return EPOCH_MS + offset * MS_DAY;
}
function fromGregorianUTC(timestamp) {
  if (!Number.isFinite(timestamp) || timestamp < EPOCH_MS) return null;
  let rem = Math.floor((timestamp - EPOCH_MS) / MS_DAY);
  let year = FIRST_5YLW_YEAR;
  while (year <= LAST_5YLW_YEAR && rem >= yearDays(year)) {rem -= yearDays(year); year++;}
  if (year > LAST_5YLW_YEAR) return null;
  const month = rem >= 364 ? 14 : Math.floor(rem / 28) + 1;
  const day = rem >= 364 ? rem - 364 + 1 : rem % 28 + 1;
  return {year, month, day};
}
function labelMonth(month) {return month === 14 ? 'Hany’s Week' : `Month ${String(month).padStart(2,'0')}`;}
function dateKey(y,m,d) {return `${y}-${m}-${d}`;}
function fmt(timestamp, formatter=prettyGregorian) {return formatter.format(new Date(timestamp));}
function isValidEvent(item) {
  if (!item || typeof item !== 'object') return false;
  if (!['reward','development','update'].includes(item.kind)) return false;
  if (typeof item.title !== 'string' || !item.title.trim() || !toGregorianUTC(item.year,item.month,item.day)) return false;
  if (item.url && !/^https:\/\//i.test(item.url)) return false;
  return true;
}
function eventsForDay(y,m,d) {return allEvents.filter(e=>e.year === y && e.month === m && e.day === d);}
function eventsByKind(kind) {return allEvents.filter(e=>e.kind===kind).sort(sortEvents);}
function sortEvents(a,b) {return toGregorianUTC(b.year,b.month,b.day)-toGregorianUTC(a.year,a.month,a.day);}

function showPage() {
  const requested = decodeURIComponent(location.hash.replace(/^#/,''));
  const active = TABS.includes(requested) ? requested : 'calendar';
  document.querySelectorAll('main > .page').forEach(p => {p.hidden = p.id !== active;});
  document.querySelectorAll('[data-tab]').forEach(a => a.getAttribute('data-tab') === active ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current'));
  $('primaryNav').classList.remove('open');
  $('menuToggle').setAttribute('aria-expanded','false');
  $('menuToggle').setAttribute('aria-label','Open navigation');
  document.title = `${({calendar:'This Month',rewards:'Rewards',development:'Development',system:'The 5YLW System',archive:'Archive'})[active]} | Novabia Calendar`;
  window.scrollTo(0,0);
}
window.addEventListener('hashchange',showPage);
$('menuToggle').addEventListener('click',()=>{
  const open = $('primaryNav').classList.toggle('open');
  $('menuToggle').setAttribute('aria-expanded',String(open));
  $('menuToggle').setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation');
});
showPage();
$('copyrightYear').textContent = new Date().getFullYear();

function makeEl(tag,className,text) {const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}
function showEvents(target,events,emptyTitle,emptyBody) {
  target.replaceChildren();
  if (!events.length) {
    const empty=makeEl('div','empty-state');
    empty.append(makeEl('div','empty-icon','✧'));
    const copy=makeEl('div'); copy.append(makeEl('strong','',emptyTitle),makeEl('p','',emptyBody));empty.append(copy);target.append(empty);return;
  }
  for (const e of events) {
    const el=makeEl('article','announcement');
    el.append(makeEl('div','stamp',`${labelMonth(e.month)} · ${e.day}`));
    const body=makeEl('div');body.append(makeEl('h3','',e.title),makeEl('p','',e.description||''),makeEl('small','',`${fmt(toGregorianUTC(e.year,e.month,e.day))} · ${e.kind.toUpperCase()} · ${(e.status||'announced').replace(/_/g,' ').toUpperCase()}`));
    if(e.url){const link=makeEl('a','', 'View details ↗');link.href=e.url;link.rel='noopener noreferrer';link.target='_blank';body.append(makeEl('br'),link);}
    el.append(body);target.append(el);
  }
}

const yearSelect = $('yearSelect');
for(let y=FIRST_5YLW_YEAR;y<=YEAR_PICKER_LAST;y++){ const option=document.createElement('option');option.value=String(y);option.textContent=`Year ${y}`;yearSelect.append(option); }
yearSelect.addEventListener('change',()=>{visibleYear=Number(yearSelect.value);visibleMonth=Math.min(visibleMonth,monthsInYear(visibleYear));selectedDay=1;renderCalendar();});
function renderCalendar() {
  if (!yearSelect.querySelector(`option[value="${visibleYear}"]`)) {
    const option=document.createElement('option');option.value=String(visibleYear);option.textContent=`Year ${visibleYear}`;yearSelect.append(option);
  }
  yearSelect.value=String(visibleYear);
  const days=monthDays(visibleYear,visibleMonth);
  const start=toGregorianUTC(visibleYear,visibleMonth,1);
  const end=toGregorianUTC(visibleYear,visibleMonth,days);
  $('monthTitle').replaceChildren(document.createTextNode(`${labelMonth(visibleMonth)} `),makeEl('span','',`/ Year ${visibleYear}`));
  $('monthRange').textContent=`${fmt(start)} – ${fmt(end)} · ${days} days`;
  $('calendarFootnote').textContent=visibleMonth === 14 ? 'The seven-day intercalary month' : 'A perpetual four-week grid';
  $('monthProgress').textContent=`${String(visibleMonth).padStart(2,'0')} / ${String(monthsInYear(visibleYear)).padStart(2,'0')}`;
  $('yearNote').textContent=isLeapYear(visibleYear) ? 'Leap year · includes Hany’s Week' : '13 standard months';
  $('prevMonth').disabled=visibleYear===FIRST_5YLW_YEAR&&visibleMonth===1;
  $('nextMonth').disabled=visibleYear===LAST_5YLW_YEAR&&visibleMonth===monthsInYear(visibleYear);
  const grid=$('calendarGrid');grid.replaceChildren();
  for(let day=1;day<=days;day++){
    const utc=start+(day-1)*MS_DAY;
    const ev=eventsForDay(visibleYear,visibleMonth,day);
    const b=makeEl('button',`cal-day${utc===todayUTC?' is-today':''}${visibleMonth===14?' is-leap':''}`);
    b.type='button';b.setAttribute('aria-pressed',String(day===selectedDay));
    b.setAttribute('aria-label',`${labelMonth(visibleMonth)} day ${day}, ${fmt(utc,longGregorian)}${ev.length?', '+ev.length+' scheduled items':''}`);
    b.append(makeEl('span','num',String(day)),makeEl('span','greg',fmt(utc,shortGregorian)));
    const dots=makeEl('span','event-dots');for (const event of ev.slice(0,4))dots.append(makeEl('i',event.kind));b.append(dots);
    b.addEventListener('click',()=>{selectedDay=day;renderCalendar();});
    grid.append(b);
  }
  const strip=$('monthStrip');strip.replaceChildren();
  for(let m=1;m<=monthsInYear(visibleYear);m++){
    const b=makeEl('button');b.type='button';b.setAttribute('aria-pressed',String(m===visibleMonth));b.setAttribute('aria-label',`${labelMonth(m)}, year ${visibleYear}`);
    b.append(makeEl('strong','',String(m).padStart(2,'0')),makeEl('small','',m===14?'LEAP':'MONTH'));
    b.addEventListener('click',()=>{visibleMonth=m;selectedDay=1;renderCalendar();});strip.append(b);
  }
  updateDayPanel();
}
function updateDayPanel(){
  const utc=toGregorianUTC(visibleYear,visibleMonth,selectedDay);
  $('selectedDayNumber').textContent=String(selectedDay).padStart(2,'0');
  $('dayPanelHeading').textContent=`${labelMonth(visibleMonth)} / Year ${visibleYear}`;
  $('selectedGregorian').textContent=fmt(utc,longGregorian);
  const events=eventsForDay(visibleYear,visibleMonth,selectedDay);
  $('eventCount').textContent=`${allEvents.length} PUBLISHED`;
  const el=$('dayEvents');el.replaceChildren();
  if(!events.length){
    el.append(makeEl('p','micro-label','NO PUBLISHED ITEMS'),makeEl('p','day-placeholder','Nothing has been announced for this date yet. Check back for reward windows, development milestones, and news from the provinces.'));
    return;
  }
  for(const e of events){
    const article=makeEl('article',`event-item ${e.kind}`);article.append(makeEl('small','status',`${e.kind} · ${(e.status||'announced').replace(/_/g,' ')}`),makeEl('strong','',e.title),makeEl('p','',e.description||''));
    if(e.url){const link=makeEl('a','','Open announcement ↗');link.href=e.url;link.target='_blank';link.rel='noopener noreferrer';article.append(link);}
    el.append(article);
  }
}
function goMonths(direction){
  let m=visibleMonth+direction, y=visibleYear;
  if(m>monthsInYear(y)){y++;m=1;}
  else if(m<1){y--;if(y<FIRST_5YLW_YEAR)return;m=monthsInYear(y);}
  if(y>LAST_5YLW_YEAR)return;
  visibleMonth=m;selectedDay=1;renderCalendar();
}
$('prevMonth').addEventListener('click',()=>goMonths(-1));
$('nextMonth').addEventListener('click',()=>goMonths(1));
$('todayMonth').addEventListener('click',()=>{visibleYear=todayFive?.year||FIRST_5YLW_YEAR;visibleMonth=todayFive?.month||1;selectedDay=todayFive?.day||1;renderCalendar();});

if(todayFive){
  $('heroDay').textContent=String(todayFive.day).padStart(2,'0');
  $('heroMonth').textContent=labelMonth(todayFive.month).toUpperCase();
  $('heroYear').textContent=`YEAR ${String(todayFive.year).padStart(2,'0')} · 5YLW`;
} else { $('heroDay').textContent='01';$('heroMonth').textContent='MONTH 01';$('heroYear').textContent=`YEAR ${FIRST_5YLW_YEAR} · 5YLW`; }
$('heroGregorian').textContent=fmt(todayUTC,longGregorian);
renderCalendar();
showEvents($('rewardAnnouncements'),eventsByKind('reward'),'Reward announcements are coming.','Confirmed reward items, claim rules, and dates will appear here when published.');
showEvents($('devAnnouncements'),eventsByKind('development'),'Milestone dates are not yet announced.','This board is ready for confirmed development steps, progress reports and playable updates.');

function renderArchive(){
  const type=$('archiveFilter').value;
  const archived=allEvents.filter(e=>(type==='all'||e.kind===type)&&toGregorianUTC(e.year,e.month,e.day)<todayUTC).sort(sortEvents);
  showEvents($('archiveList'),archived,'The archive begins with the first published event.','When dates pass, published rewards and development entries appear here automatically.');
}
$('archiveFilter').addEventListener('change',renderArchive);renderArchive();

const localToday=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
$('gregorianInput').value=localToday < '2025-12-21'?'2025-12-21':localToday;
function updateConverter(){
  const value=$('gregorianInput').value;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value)){$('convertedDate').textContent='Choose a valid date';$('convertedWeekday').textContent='';return;}
  const [year,month,day]=value.split('-').map(Number);
  const dateMs=Date.UTC(year,month-1,day);
  const parsed=new Date(dateMs);
  if(parsed.getUTCFullYear()!==year||parsed.getUTCMonth()!==month-1||parsed.getUTCDate()!==day){$('convertedDate').textContent='Invalid date';$('convertedWeekday').textContent='';return;}
  const d=fromGregorianUTC(dateMs);
  if(!d){$('convertedDate').textContent='Outside supported range';$('convertedWeekday').textContent='Choose December 21, 2025 or a later supported date.';return;}
  $('convertedDate').textContent=`Year ${d.year} · ${labelMonth(d.month)} · Day ${String(d.day).padStart(2,'0')}`;
  $('convertedWeekday').textContent=`${weekdayNames[parsed.getUTCDay()]} · ${fmt(dateMs,longGregorian)}`;
}
$('gregorianInput').addEventListener('change',updateConverter);updateConverter();
$('copyDate').addEventListener('click',async()=>{
  const value=$('convertedDate').textContent;
  if(!value || value==='Invalid date' || value.includes('range'))return;
  try{await navigator.clipboard.writeText(value);$('converterMessage').textContent='Copied: '+value;}
  catch { $('converterMessage').textContent='Select the displayed date to copy it manually.'; }
});
