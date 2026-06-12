// TEMP: verifies new live coding tasks by running their test assertions against
// reference solutions, replicating the frontend worker harness (codeRunner.ts).
// Usage: npx ts-node prisma/verify-live-coding.ts
import { LIVE_CODING_TASKS } from './legacy-content/liveCoding';

const SOLUTIONS: Record<string, string> = {
  'baseball-game': `function solution(operations) {
  const stack = [];
  for (const op of operations) {
    if (op === 'C') stack.pop();
    else if (op === 'D') stack.push(stack[stack.length - 1] * 2);
    else if (op === '+') stack.push(stack[stack.length - 1] + stack[stack.length - 2]);
    else stack.push(Number(op));
  }
  return stack.reduce((a, b) => a + b, 0);
}
module.exports = solution`,
  'remove-adjacent-duplicates': `function solution(s) {
  const st = [];
  for (const ch of s) {
    if (st[st.length - 1] === ch) st.pop(); else st.push(ch);
  }
  return st.join('');
}
module.exports = solution`,
  'backspace-compare': `function solution(s, t) {
  const build = (str) => { const st = []; for (const ch of str) { if (ch === '#') st.pop(); else st.push(ch); } return st.join(''); };
  return build(s) === build(t);
}
module.exports = solution`,
  'min-stack': `function solution() {
  const stack = []; const mins = [];
  return {
    push(v) { stack.push(v); mins.push(mins.length ? Math.min(v, mins[mins.length - 1]) : v); },
    pop() { mins.pop(); return stack.pop(); },
    top() { return stack[stack.length - 1]; },
    getMin() { return mins[mins.length - 1]; },
  };
}
module.exports = solution`,
  'evaluate-rpn': `function solution(tokens) {
  const st = [];
  const ops = { '+': (a, b) => a + b, '-': (a, b) => a - b, '*': (a, b) => a * b, '/': (a, b) => Math.trunc(a / b) };
  for (const t of tokens) {
    if (t in ops) { const b = st.pop(); const a = st.pop(); st.push(ops[t](a, b)); }
    else st.push(Number(t));
  }
  return st.pop();
}
module.exports = solution`,
  'largest-rectangle-histogram': `function solution(heights) {
  const st = []; let best = 0;
  const hs = [...heights, 0];
  for (let i = 0; i < hs.length; i++) {
    while (st.length && hs[st[st.length - 1]] > hs[i]) {
      const h = hs[st.pop()];
      const left = st.length ? st[st.length - 1] : -1;
      best = Math.max(best, h * (i - left - 1));
    }
    st.push(i);
  }
  return best;
}
module.exports = solution`,
  'reverse-words': `function solution(s) {
  return s.trim().split(/\\s+/).reverse().join(' ');
}
module.exports = solution`,
  'run-length-encoding': `function solution(s) {
  let res = ''; let i = 0;
  while (i < s.length) {
    let j = i; while (j < s.length && s[j] === s[i]) j++;
    const count = j - i;
    res += s[i] + (count > 1 ? String(count) : '');
    i = j;
  }
  return res;
}
module.exports = solution`,
  'longest-palindromic-substring': `function solution(s) {
  let bestL = 0, bestR = 0;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    return [l + 1, r - 1];
  };
  for (let i = 0; i < s.length; i++) {
    for (const [l, r] of [expand(i, i), expand(i, i + 1)]) {
      if (r - l > bestR - bestL) { bestL = l; bestR = r; }
    }
  }
  return s.slice(bestL, bestR + 1);
}
module.exports = solution`,
  'array-intersection': `function solution(a, b) {
  const setA = new Set(a);
  const result = [];
  for (const x of new Set(b)) if (setA.has(x)) result.push(x);
  return result.sort((x, y) => x - y);
}
module.exports = solution`,
  'spiral-matrix': `function solution(matrix) {
  const res = [];
  let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j++) res.push(matrix[top][j]);
    top++;
    for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);
    right--;
    if (top <= bottom) { for (let j = right; j >= left; j--) res.push(matrix[bottom][j]); bottom--; }
    if (left <= right) { for (let i = bottom; i >= top; i--) res.push(matrix[i][left]); left++; }
  }
  return res;
}
module.exports = solution`,
  'pick-keys': `function solution(obj, keys) {
  const res = {};
  for (const k of keys) if (k in obj) res[k] = obj[k];
  return res;
}
module.exports = solution`,
  'invert-object': `function solution(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
}
module.exports = solution`,
  'get-path': `function solution(obj, path, defaultValue) {
  const parts = path.replace(/\\[(\\d+)\\]/g, '.$1').split('.').filter(Boolean);
  let cur = obj;
  for (const p of parts) {
    if (cur === null || cur === undefined) return defaultValue;
    cur = cur[p];
  }
  return cur === undefined ? defaultValue : cur;
}
module.exports = solution`,
  'deep-merge': `function solution(target, source) {
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  const clone = (v) => Array.isArray(v) ? v.map(clone) : isObj(v) ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clone(x)])) : v;
  const merge = (a, b) => {
    const out = {};
    for (const k of Object.keys(a)) out[k] = clone(a[k]);
    for (const k of Object.keys(b)) {
      out[k] = isObj(out[k]) && isObj(b[k]) ? merge(out[k], b[k]) : clone(b[k]);
    }
    return out;
  };
  return merge(target, source);
}
module.exports = solution`,
  'build-query': `function solution(params) {
  const pairs = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(v));
  }
  return pairs.join('&');
}
module.exports = solution`,
  'hex-to-rgb': `function solution(hex) {
  let h = hex.slice(1).toLowerCase();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}
module.exports = solution`,
  'escape-html': `function solution(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
module.exports = solution`,
  'parse-cookie': `function solution(str) {
  const res = {};
  if (!str) return res;
  for (const part of str.split(';')) {
    const p = part.trim();
    if (!p) continue;
    const eq = p.indexOf('=');
    res[p.slice(0, eq)] = decodeURIComponent(p.slice(eq + 1));
  }
  return res;
}
module.exports = solution`,
  'format-bytes': `function solution(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes; let u = 0;
  while (value >= 1024 && u < units.length - 1) { value /= 1024; u++; }
  const rounded = Math.round(value * 10) / 10;
  return String(rounded) + ' ' + units[u];
}
module.exports = solution`,
  'template-render': `function solution(template, data) {
  return template.replace(/\\{\\{\\s*(\\w+)\\s*\\}\\}/g, (_, name) => (name in data ? String(data[name]) : ''));
}
module.exports = solution`,
  'is-prime': `function solution(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}
module.exports = solution`,
  gcd: `function solution(a, b) {
  while (b) { [a, b] = [b, a % b]; }
  return a;
}
module.exports = solution`,
  'pascal-triangle': `function solution(n) {
  const rows = [];
  for (let i = 0; i < n; i++) {
    const row = [1];
    for (let j = 1; j < i; j++) row.push(rows[i - 1][j - 1] + rows[i - 1][j]);
    if (i > 0) row.push(1);
    rows.push(row);
  }
  return rows;
}
module.exports = solution`,
  'merge-sort': `function solution(nums) {
  if (nums.length <= 1) return [...nums];
  const mid = Math.floor(nums.length / 2);
  const left = solution(nums.slice(0, mid));
  const right = solution(nums.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}
module.exports = solution`,
  'count-primes': `function solution(n) {
  if (n < 3) return 0;
  const sieve = new Array(n).fill(true);
  sieve[0] = sieve[1] = false;
  for (let i = 2; i * i < n; i++) {
    if (!sieve[i]) continue;
    for (let j = i * i; j < n; j += i) sieve[j] = false;
  }
  return sieve.filter(Boolean).length;
}
module.exports = solution`,
  'zip-arrays': `function solution(a, b) {
  return Array.from({ length: Math.min(a.length, b.length) }, (_, i) => [a[i], b[i]]);
}
module.exports = solution`,
  'count-by': `function solution(items, fn) {
  const res = {};
  for (const item of items) { const key = fn(item); res[key] = (res[key] ?? 0) + 1; }
  return res;
}
module.exports = solution`,
  'key-by': `function solution(items, fn) {
  const res = {};
  for (const item of items) res[fn(item)] = item;
  return res;
}
module.exports = solution`,
  'unique-by': `function solution(items, fn) {
  const seen = new Set();
  return items.filter((item) => { const k = fn(item); if (seen.has(k)) return false; seen.add(k); return true; });
}
module.exports = solution`,
  'tree-from-list': `function solution(list) {
  const map = new Map();
  for (const item of list) map.set(item.id, { id: item.id, name: item.name, children: [] });
  const roots = [];
  for (const item of list) {
    const node = map.get(item.id);
    if (item.parentId === null) roots.push(node);
    else map.get(item.parentId).children.push(node);
  }
  return roots;
}
module.exports = solution`,
  'flatten-tree': `function solution(nodes) {
  const out = [];
  const visit = (node, parentId) => {
    out.push({ id: node.id, name: node.name, parentId });
    for (const child of node.children) visit(child, node.id);
  };
  for (const n of nodes) visit(n, null);
  return out;
}
module.exports = solution`,
  'ransom-note': `function solution(note, magazine) {
  const counts = {};
  for (const ch of magazine) counts[ch] = (counts[ch] ?? 0) + 1;
  for (const ch of note) {
    if (!counts[ch]) return false;
    counts[ch] -= 1;
  }
  return true;
}
module.exports = solution`,
  'isomorphic-strings': `function solution(s, t) {
  const st = new Map(); const ts = new Map();
  for (let i = 0; i < s.length; i++) {
    const a = s[i], b = t[i];
    if (st.has(a) && st.get(a) !== b) return false;
    if (ts.has(b) && ts.get(b) !== a) return false;
    st.set(a, b); ts.set(b, a);
  }
  return true;
}
module.exports = solution`,
  'happy-number': `function solution(n) {
  const seen = new Set();
  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    let sum = 0;
    while (n > 0) { const d = n % 10; sum += d * d; n = Math.floor(n / 10); }
    n = sum;
  }
  return n === 1;
}
module.exports = solution`,
  'subarray-sum-k': `function solution(nums, k) {
  const map = new Map([[0, 1]]);
  let sum = 0, count = 0;
  for (const x of nums) {
    sum += x;
    count += map.get(sum - k) ?? 0;
    map.set(sum, (map.get(sum) ?? 0) + 1);
  }
  return count;
}
module.exports = solution`,
  'encode-decode-strings': `function solution() {
  return {
    encode(strings) { return strings.map((s) => s.length + '#' + s).join(''); },
    decode(encoded) {
      const res = []; let i = 0;
      while (i < encoded.length) {
        const hash = encoded.indexOf('#', i);
        const len = Number(encoded.slice(i, hash));
        res.push(encoded.slice(hash + 1, hash + 1 + len));
        i = hash + 1 + len;
      }
      return res;
    },
  };
}
module.exports = solution`,
  'merge-sorted-arrays': `function solution(a, b) {
  const out = []; let i = 0, j = 0;
  while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++]);
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);
  return out;
}
module.exports = solution`,
  'sort-colors': `function solution(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) { [nums[low], nums[mid]] = [nums[mid], nums[low]]; low++; mid++; }
    else if (nums[mid] === 2) { [nums[mid], nums[high]] = [nums[high], nums[mid]]; high--; }
    else mid++;
  }
  return nums;
}
module.exports = solution`,
  'max-average-subarray': `function solution(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) { sum += nums[i] - nums[i - k]; best = Math.max(best, sum); }
  return best / k;
}
module.exports = solution`,
  'min-subarray-len': `function solution(nums, target) {
  let best = Infinity, sum = 0, left = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) { best = Math.min(best, right - left + 1); sum -= nums[left++]; }
  }
  return best === Infinity ? 0 : best;
}
module.exports = solution`,
  'longest-ones': `function solution(nums, k) {
  let left = 0, zeros = 0, best = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;
    while (zeros > k) { if (nums[left] === 0) zeros--; left++; }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
module.exports = solution`,
  'permutation-in-string': `function solution(s1, s2) {
  if (s1.length > s2.length) return false;
  const need = new Array(26).fill(0);
  const win = new Array(26).fill(0);
  const idx = (ch) => ch.charCodeAt(0) - 97;
  for (const ch of s1) need[idx(ch)]++;
  for (let i = 0; i < s2.length; i++) {
    win[idx(s2[i])]++;
    if (i >= s1.length) win[idx(s2[i - s1.length])]--;
    if (i >= s1.length - 1 && need.every((v, j) => v === win[j])) return true;
  }
  return false;
}
module.exports = solution`,
  'longest-repeating-replacement': `function solution(s, k) {
  const counts = {};
  let left = 0, maxFreq = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    counts[s[right]] = (counts[s[right]] ?? 0) + 1;
    maxFreq = Math.max(maxFreq, counts[s[right]]);
    while (right - left + 1 - maxFreq > k) { counts[s[left]] -= 1; left++; }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
module.exports = solution`,
  'min-window-substring': `function solution(s, t) {
  if (!t.length) return '';
  const need = {};
  for (const ch of t) need[ch] = (need[ch] ?? 0) + 1;
  const required = Object.keys(need).length;
  let formed = 0;
  const window = {};
  let left = 0, bestLen = Infinity, bestStart = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    window[ch] = (window[ch] ?? 0) + 1;
    if (need[ch] !== undefined && window[ch] === need[ch]) formed++;
    while (formed === required) {
      if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestStart = left; }
      const lch = s[left];
      window[lch] -= 1;
      if (need[lch] !== undefined && window[lch] < need[lch]) formed--;
      left++;
    }
  }
  return bestLen === Infinity ? '' : s.slice(bestStart, bestStart + bestLen);
}
module.exports = solution`,
  'min-cost-climbing-stairs': `function solution(cost) {
  let a = 0, b = 0;
  for (let i = 2; i <= cost.length; i++) {
    const cur = Math.min(b + cost[i - 1], a + cost[i - 2]);
    a = b; b = cur;
  }
  return b;
}
module.exports = solution`,
  'word-break': `function solution(s, wordDict) {
  const words = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && words.has(s.slice(j, i))) { dp[i] = true; break; }
    }
  }
  return dp[s.length];
}
module.exports = solution`,
  'assign-cookies': `function solution(g, s) {
  const kids = [...g].sort((a, b) => a - b);
  const cookies = [...s].sort((a, b) => a - b);
  let i = 0, j = 0;
  while (i < kids.length && j < cookies.length) {
    if (cookies[j] >= kids[i]) i++;
    j++;
  }
  return i;
}
module.exports = solution`,
  'can-place-flowers': `function solution(flowerbed, n) {
  const bed = [...flowerbed];
  let count = 0;
  for (let i = 0; i < bed.length; i++) {
    if (bed[i] === 0 && (i === 0 || bed[i - 1] === 0) && (i === bed.length - 1 || bed[i + 1] === 0)) {
      bed[i] = 1; count++;
    }
  }
  return count >= n;
}
module.exports = solution`,
  'best-time-buy-sell-ii': `function solution(prices) {
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
  }
  return profit;
}
module.exports = solution`,
  'jump-game-ii': `function solution(nums) {
  let jumps = 0, end = 0, far = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    far = Math.max(far, i + nums[i]);
    if (i === end) { jumps++; end = far; }
  }
  return jumps;
}
module.exports = solution`,
  'gas-station': `function solution(gas, cost) {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    total += diff; tank += diff;
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return total < 0 ? -1 : start;
}
module.exports = solution`,
  'partition-labels': `function solution(s) {
  const last = {};
  for (let i = 0; i < s.length; i++) last[s[i]] = i;
  const res = [];
  let start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last[s[i]]);
    if (i === end) { res.push(i - start + 1); start = i + 1; }
  }
  return res;
}
module.exports = solution`,
  'non-overlapping-intervals': `function solution(intervals) {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let kept = 0; let end = -Infinity;
  for (const [s, e] of sorted) { if (s >= end) { kept++; end = e; } }
  return intervals.length - kept;
}
module.exports = solution`,
  'search-insert-position': `function solution(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] < target) lo = mid + 1; else hi = mid;
  }
  return lo;
}
module.exports = solution`,
  'my-sqrt': `function solution(x) {
  let lo = 0, hi = x;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (mid * mid <= x) lo = mid + 1; else hi = mid - 1;
  }
  return hi;
}
module.exports = solution`,
  'find-peak-element': `function solution(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] < nums[mid + 1]) lo = mid + 1; else hi = mid;
  }
  return lo;
}
module.exports = solution`,
  'find-min-rotated': `function solution(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] > nums[hi]) lo = mid + 1; else hi = mid;
  }
  return nums[lo];
}
module.exports = solution`,
  'search-rotated': `function solution(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
    }
  }
  return -1;
}
module.exports = solution`,
  'koko-bananas': `function solution(piles, h) {
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    const hours = piles.reduce((acc, p) => acc + Math.ceil(p / mid), 0);
    if (hours <= h) hi = mid; else lo = mid + 1;
  }
  return lo;
}
module.exports = solution`,
  'median-two-sorted': `function solution(a, b) {
  const m = [...a, ...b].sort((x, y) => x - y);
  const n = m.length;
  return n % 2 ? m[(n - 1) / 2] : (m[n / 2 - 1] + m[n / 2]) / 2;
}
module.exports = solution`,
  'power-of-two': `function solution(n) {
  return n > 0 && (n & (n - 1)) === 0;
}
module.exports = solution`,
  'counting-bits': `function solution(n) {
  const bits = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) bits[i] = bits[i >> 1] + (i & 1);
  return bits;
}
module.exports = solution`,
  'reverse-bits': `function solution(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);
    n >>>= 1;
  }
  return result >>> 0;
}
module.exports = solution`,
  'add-without-plus': `function solution(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}
module.exports = solution`,
  'single-number-ii': `function solution(nums) {
  let ones = 0, twos = 0;
  for (const x of nums) {
    ones = (ones ^ x) & ~twos;
    twos = (twos ^ x) & ~ones;
  }
  return ones;
}
module.exports = solution`,
  'compact-object': `function solution(value) {
  const isEmpty = (v) => v === null || v === '';
  if (Array.isArray(value)) {
    return value.filter((v) => !isEmpty(v)).map((v) => (v && typeof v === 'object' ? solution(v) : v));
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (isEmpty(v)) continue;
      out[k] = v && typeof v === 'object' ? solution(v) : v;
    }
    return out;
  }
  return value;
}
module.exports = solution`,
  'object-depth': `function solution(value) {
  if (value === null || typeof value !== 'object') return 0;
  const depths = Object.values(value).map(solution);
  return 1 + (depths.length ? Math.max(...depths) : 0);
}
module.exports = solution`,
  'semver-compare': `function solution(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}
module.exports = solution`,
  'palindrome-number': `function solution(x) {
  if (x < 0) return false;
  let n = x, rev = 0;
  while (n > 0) { rev = rev * 10 + (n % 10); n = Math.floor(n / 10); }
  return rev === x;
}
module.exports = solution`,
  'reverse-integer': `function solution(x) {
  const sign = x < 0 ? -1 : 1;
  let n = Math.abs(x), rev = 0;
  while (n > 0) { rev = rev * 10 + (n % 10); n = Math.floor(n / 10); }
  rev *= sign;
  if (rev < -(2 ** 31) || rev > 2 ** 31 - 1) return 0;
  return rev;
}
module.exports = solution`,
  'roman-to-integer': `function solution(s) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]];
    const next = map[s[i + 1]] ?? 0;
    total += cur < next ? -cur : cur;
  }
  return total;
}
module.exports = solution`,
  'plus-one': `function solution(digits) {
  const out = [...digits];
  for (let i = out.length - 1; i >= 0; i--) {
    if (out[i] < 9) { out[i] += 1; return out; }
    out[i] = 0;
  }
  out.unshift(1);
  return out;
}
module.exports = solution`,
  'pow-x-n': `function solution(x, n) {
  let base = x, exp = n, result = 1;
  if (exp < 0) { base = 1 / base; exp = -exp; }
  while (exp > 0) {
    if (exp % 2 === 1) result *= base;
    base *= base;
    exp = Math.floor(exp / 2);
  }
  return result;
}
module.exports = solution`,
  'excel-column-title': `function solution(columnNumber) {
  let n = columnNumber, out = '';
  while (n > 0) {
    n -= 1;
    out = String.fromCharCode(65 + (n % 26)) + out;
    n = Math.floor(n / 26);
  }
  return out;
}
module.exports = solution`,
  'trailing-zeroes': `function solution(n) {
  let count = 0;
  while (n > 0) { n = Math.floor(n / 5); count += n; }
  return count;
}
module.exports = solution`,
  'integer-to-roman': `function solution(num) {
  const table = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let n = num, out = '';
  for (const [value, sym] of table) {
    while (n >= value) { out += sym; n -= value; }
  }
  return out;
}
module.exports = solution`,
  fibonacci: `function solution(n) {
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) { const next = a + b; a = b; b = next; }
  return a;
}
module.exports = solution`,
  'hanoi-moves': `function solution(n) {
  return 2 ** n - 1 < 0 ? 0 : 2 ** n - 1;
}
module.exports = solution`,
  subsets: `function solution(nums) {
  const res = [[]];
  for (const num of nums) {
    const len = res.length;
    for (let i = 0; i < len; i++) res.push([...res[i], num]);
  }
  return res;
}
module.exports = solution`,
  permutations: `function solution(nums) {
  if (nums.length <= 1) return [nums.slice()];
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    const rest = [...nums.slice(0, i), ...nums.slice(i + 1)];
    for (const perm of solution(rest)) res.push([nums[i], ...perm]);
  }
  return res;
}
module.exports = solution`,
  'combination-sum': `function solution(candidates, target) {
  const res = [];
  const walk = (start, remain, path) => {
    if (remain === 0) { res.push([...path]); return; }
    if (remain < 0) return;
    for (let i = start; i < candidates.length; i++) {
      path.push(candidates[i]);
      walk(i, remain - candidates[i], path);
      path.pop();
    }
  };
  walk(0, target, []);
  return res;
}
module.exports = solution`,
  'generate-parentheses': `function solution(n) {
  const res = [];
  const walk = (open, close, cur) => {
    if (cur.length === n * 2) { res.push(cur); return; }
    if (open < n) walk(open + 1, close, cur + '(');
    if (close < open) walk(open, close + 1, cur + ')');
  };
  walk(0, 0, '');
  return res;
}
module.exports = solution`,
  'letter-combinations': `function solution(digits) {
  if (!digits.length) return [];
  const map = { 2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz' };
  let res = [''];
  for (const d of digits) {
    const next = [];
    for (const prefix of res) for (const ch of map[d]) next.push(prefix + ch);
    res = next;
  }
  return res;
}
module.exports = solution`,
  'n-queens-count': `function solution(n) {
  let count = 0;
  const cols = new Set(), d1 = new Set(), d2 = new Set();
  const walk = (row) => {
    if (row === n) { count += 1; return; }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || d1.has(row + col) || d2.has(row - col)) continue;
      cols.add(col); d1.add(row + col); d2.add(row - col);
      walk(row + 1);
      cols.delete(col); d1.delete(row + col); d2.delete(row - col);
    }
  };
  walk(0);
  return count;
}
module.exports = solution`,
};

// --- harness replicated from frontend/src/features/live-coding/codeRunner.ts ---
function normalize(value: any): any {
  if (Number.isNaN(value)) return '__NaN__';
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') {
    const entries = Object.keys(value)
      .sort()
      .map((key) => [key, normalize(value[key])]);
    return Object.fromEntries(entries);
  }
  return value;
}

function isEqual(actual: any, expected: any) {
  return JSON.stringify(normalize(actual)) === JSON.stringify(normalize(expected));
}

function assertDeepEqual(actual: any, expected: any) {
  if (!isEqual(actual, expected)) {
    throw new Error(
      'Ожидалось ' + JSON.stringify(normalize(expected)) + ', получено ' + JSON.stringify(normalize(actual))
    );
  }
}

function print(...values: any[]) {
  console.log(...values);
}

async function main() {
  let tasksRun = 0;
  let testsRun = 0;
  const failures: string[] = [];

  for (const task of LIVE_CODING_TASKS) {
    const code = SOLUTIONS[task.slug];
    if (!code) continue;
    tasksRun += 1;

    let candidate: any;
    try {
      const moduleObj: any = { exports: {} };
      const factory = new Function(
        'module',
        'exports',
        code + '\n; return module.exports.default ?? module.exports.solution ?? (typeof module.exports === "function" ? module.exports : undefined) ?? (typeof solution !== "undefined" ? solution : undefined);'
      );
      candidate = factory(moduleObj, moduleObj.exports);
    } catch (error) {
      failures.push(`${task.slug}: failed to build candidate: ${(error as Error).message}`);
      continue;
    }

    if (typeof candidate !== 'function') {
      failures.push(`${task.slug}: candidate is not a function`);
      continue;
    }

    for (const test of task.tests) {
      testsRun += 1;
      try {
        const run = new Function(
          'candidate',
          'assertDeepEqual',
          'print',
          'isEqual',
          'return (async () => { ' + test.assertion + ' })();'
        );
        await run(candidate, assertDeepEqual, print, isEqual);
      } catch (error) {
        failures.push(`${task.slug} :: "${test.title}": ${(error as Error).message}`);
      }
    }
  }

  console.log(`Verified ${tasksRun} tasks / ${testsRun} tests`);
  const missing = Object.keys(SOLUTIONS).filter(
    (slug) => !LIVE_CODING_TASKS.some((task) => task.slug === slug)
  );
  if (missing.length) console.log('Solutions without matching task:', missing);
  if (failures.length) {
    console.log(`\n${failures.length} FAILURES:`);
    for (const f of failures) console.log(' - ' + f);
    process.exitCode = 1;
  } else {
    console.log('All assertions passed.');
  }
}

main();
