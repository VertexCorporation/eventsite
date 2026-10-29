// Public catalog only. Never persist registration details or tickets.
const KEY = 'vertex-events-catalog-v1';
const day = () => new Date().toLocaleDateString('en-CA', {timeZone:'Europe/Istanbul'});
let memory;
let pending;
const read = () => {
  try { const value = JSON.parse(localStorage.getItem(KEY));
    if (value?.version === 1 && Array.isArray(value.events)) return value;
  } catch {}
  return memory;
};
const write = value => { memory = value; try {localStorage.setItem(KEY, JSON.stringify(value));} catch {} };
export const cachedCatalog = () => read()?.events;
export async function dailyCatalog(fetchCatalog) {
  if (pending) return pending;
  const run = async () => {
    const saved = read();
    if (saved?.checkedDay === day()) return saved.events;
    // Record the attempt before requesting so repeated visits do not retry all day.
    if (saved) write({...saved, checkedDay:day()});
    try {
      const result = await fetchCatalog();
      if (!Array.isArray(result?.events)) throw new Error('Invalid catalog');
      write({version:1, checkedDay:day(), events:result.events});
      return result.events;
    } catch(error) { if(saved) return saved.events; throw error; }
  };
  pending = (navigator.locks ? navigator.locks.request(KEY,run) : run()).finally(()=>{pending=null;});
  return pending;
}
