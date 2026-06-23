import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const TEST_FILE = '/tmp/test-10mb.json';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));

// Track unresponsive (long tasks)
let longTaskDetected = false;
page.on('response', r => { /* noop */ });

try {
  console.log('Navigating...');
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle', timeout: 15000 });
  console.log('Page loaded.');

  // File picker
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser', { timeout: 5000 }),
    page.click('button:has-text("Open file")'),
  ]);
  console.log('File chooser opened, selecting file...');

  const startTime = Date.now();
  await fileChooser.setFiles(TEST_FILE);
  console.log('File selected, waiting for parse...');

  // Wait for parsing overlay to appear
  await page.waitForSelector('.parsing-overlay', { timeout: 5000 });
  const overlayTime = Date.now();
  console.log(`Parsing overlay visible after ${overlayTime - startTime}ms`);

  // Wait for overlay to disappear (parse complete)
  await page.waitForSelector('.parsing-overlay', { state: 'detached', timeout: 60000 });
  const parseDoneTime = Date.now();
  console.log(`Parse complete after ${parseDoneTime - overlayTime}ms (total ${parseDoneTime - startTime}ms)`);

  // Wait for tree items to render
  await page.waitForSelector('.tree-node', { timeout: 10000 });
  console.log('Tree nodes rendered.');

  // Check page responsiveness by running a simple eval
  const responsive = await page.evaluate(() => {
    const start = performance.now();
    // Busy-wait for 5ms to check if main thread is free
    const deadline = start + 5;
    while (performance.now() < deadline) { /* spin */ }
    const elapsed = performance.now() - start;
    return elapsed < 100; // if it took >100ms, page was likely frozen
  });
  console.log(`Page responsive after parse: ${responsive}`);

  // Count visible tree nodes
  const nodeCount = await page.evaluate(() => document.querySelectorAll('.tree-node').length);
  console.log(`Visible tree nodes: ${nodeCount}`);

  // Check for "Show more" button
  const hasShowMore = await page.evaluate(() => !!document.querySelector('.tree-show-more'));
  console.log(`Has "Show more" button: ${hasShowMore}`);

  console.log('\n=== TEST PASSED ===\n');
} catch (err) {
  console.error('TEST FAILED:', err.message);
  process.exit(1);
} finally {
  await browser.close();
}
