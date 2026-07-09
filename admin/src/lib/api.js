export function uid() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export function emptyItem() {
  return { id: uid(), date: '', description: '', amount: '' };
}

const PROMPTS = {
  out: `You are reading a handwritten daily expense log from a construction site in Nigeria (a palm kernel processing mill). Extract every line item you can identify. For each line item return an object with:
- "date": the date if written, in YYYY-MM-DD format if you can determine the year, otherwise null
- "description": a short description in the site manager's own words
- "amount": the numeric amount in Naira only, as a plain number (no currency symbol, no commas, no letters)

IMPORTANT INSTRUCTION: Do NOT extract any summary lines that represent Totals, Subtotals, Total Spent, or Balances. Only extract the individual items.

If a word or number is unclear, use your best reading and prefix the description with "(unclear) ".

Respond with ONLY a JSON array of these objects and nothing else. No explanation, no markdown code fences.`,
  in: `You are reading a bank transfer receipt, transfer alert screenshot, or note showing money sent from a company to a site manager for a Nigerian mill construction site. Extract each transfer as an object with:
- "date": the date of the transfer if shown, in YYYY-MM-DD format if possible, otherwise null
- "description": a short description (recipient, purpose, or reference if stated), or "Transfer to site" if nothing more specific is visible
- "amount": the numeric amount in Naira only, as a plain number (no currency symbol, no commas, no letters)

Usually a receipt shows a single transfer, but include more objects if multiple are visible.

Respond with ONLY a JSON array of these objects and nothing else. No explanation, no markdown code fences.`
};

export async function extractLineItems(file, type) {
  const base64 = await fileToBase64(file);
  const mediaType = file.type || 'image/jpeg';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: PROMPTS[type] },
          { type: 'image_url', image_url: { url: `data:${mediaType};base64,${base64}` } }
        ]
      }]
    })
  });

  if (!response.ok) {
    throw new Error('The extraction request failed (status ' + response.status + ')');
  }

  const data = await response.json();
  let raw = data.choices[0].message.content.trim();
  raw = raw.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error('Could not read the extracted items. Try a clearer photo, or add lines manually.');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Unexpected response format from extraction.');
  }

  return parsed.map(item => ({
    id: uid(),
    date: item.date || '',
    description: item.description || '',
    amount: (item.amount === null || item.amount === undefined) ? '' : String(item.amount)
  }));
}
