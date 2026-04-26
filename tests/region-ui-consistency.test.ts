import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '..');
const read = (filePath: string) => fs.readFileSync(path.join(root, filePath), 'utf8');

export function runRegionUiConsistencyTests() {
  const inHomepage = read('app/in/page.tsx');
  assert.match(inHomepage, /HomepageLayout/, 'India homepage should use the shared HomepageLayout component');

  const navbar = read('components/navbar/AppNavbar.tsx');
  assert.match(navbar, /withRegionPrefix/, 'Navbar links should be region-injected dynamically');

  const regionProvider = read('components/providers/RegionProvider.tsx');
  assert.match(regionProvider, /localStorage\.setItem/, 'RegionProvider should persist region to localStorage');
  assert.match(regionProvider, /setPreferredRegionCookie/, 'RegionProvider should persist region cookie');

  const inLayout = read('app/in/layout.tsx');
  assert.match(inLayout, /canonical: absoluteUrl\('\/in'\)/, 'Region pages should have region-specific canonical URL');
  assert.match(inLayout, /languages/, 'Region pages should expose alternate language links');
}
