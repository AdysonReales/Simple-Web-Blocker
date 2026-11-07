const categories = {
  social: ['facebook.com', 'instagram.com', 'tiktok.com', 'x.com', 'twitter.com', 'reddit.com'],
  video: ['youtube.com', 'netflix.com', 'twitch.tv'],
  gaming: ['roblox.com', 'steampowered.com', 'epicgames.com'],
  news: ['cnn.com', 'bbc.com', 'nytimes.com']
};
const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const matches = (host, domain) => host === domain || host.endsWith('.' + domain);
function scheduled(rule, now = new Date()) {
  if (rule.mode !== 'schedule') return true;
  const current = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = rule.start.split(':').map(Number), [eh, em] = rule.end.split(':').map(Number);
  const start = sh * 60 + sm, end = eh * 60 + em;
  if (start === end) return false;
  if (start < end) return rule.days.includes(now.getDay()) && current >= start && current < end;
  return (current >= start && rule.days.includes(now.getDay())) || (current < end && rule.days.includes((now.getDay()+6)%7));
}
async function check(tab) {
  if (!tab?.id || !tab.url) return;
  let host; try { const u = new URL(tab.url); if (!['http:', 'https:'].includes(u.protocol)) return; host = u.hostname.toLowerCase(); } catch { return; }
  const data = await chrome.storage.local.get(['rules','categories','usage']);
  const usage = data.usage?.[dayKey()] || {};
  const rule = (data.rules || []).find(r => matches(host, r.domain) && (r.mode === 'limit' ? (usage[r.domain] || 0) >= r.minutes * 60 : scheduled(r)));
  const cat = Object.entries(data.categories || {}).find(([key, on]) => on && categories[key]?.some(d => matches(host,d)));
  if (rule || cat) await chrome.tabs.update(tab.id, {url: chrome.runtime.getURL('src/blocked/index.html')});
}
chrome.tabs.onUpdated.addListener((id, info, tab) => { if (info.url || info.status === 'loading') check(tab); });
chrome.tabs.onActivated.addListener(({tabId}) => chrome.tabs.get(tabId).then(check).catch(() => {}));
chrome.alarms.create('tick', {periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name !== 'tick') return;
  const windows = await chrome.windows.getAll({windowTypes:['normal']});
  const focused = windows.find(w => w.focused); if (!focused) return;
  const [tab] = await chrome.tabs.query({active:true, windowId:focused.id}); if (!tab?.url) return;
  let host; try { const u = new URL(tab.url); if (!['http:','https:'].includes(u.protocol)) return; host = u.hostname.toLowerCase(); } catch { return; }
  const data = await chrome.storage.local.get(['rules','usage']); const rules = data.rules || [];
  const domain = rules.find(r => matches(host,r.domain))?.domain || host;
  const usage = data.usage || {}; const key = dayKey(); usage[key] ||= {}; usage[key][domain] = (usage[key][domain] || 0) + 60;
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate()-30); for (const date of Object.keys(usage)) if (date < dayKey(cutoff)) delete usage[date];
  await chrome.storage.local.set({usage}); await check(tab);
});
chrome.storage.onChanged.addListener((changes, area) => { if (area === 'local' && (changes.rules || changes.categories)) chrome.tabs.query({}).then(tabs => tabs.forEach(check)); });
