import type { LiveCodingTestCase } from '@/entities/liveCoding'

export interface CodeRunCaseResult {
  title: string
  passed: boolean
  durationMs: number
  message?: string
}

export interface CodeRunResult {
  passed: boolean
  results: CodeRunCaseResult[]
  error?: string
}

const WORKER_TIMEOUT_MS = 2500

const workerSource = `
self.onmessage = async (event) => {
  const { code, tests } = event.data;

  function normalize(value) {
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

  function assertDeepEqual(actual, expected) {
    const left = JSON.stringify(normalize(actual));
    const right = JSON.stringify(normalize(expected));

    if (left !== right) {
      throw new Error('Ожидалось ' + right + ', получено ' + left);
    }
  }

  try {
    const module = { exports: {} };
    const exports = module.exports;
    const factory = new Function(
      'module',
      'exports',
      code + '\\n; return module.exports.default ?? module.exports.solution ?? exports.default ?? exports.solution ?? (typeof solution !== "undefined" ? solution : undefined);'
    );
    const candidate = factory(module, exports);

    if (typeof candidate !== 'function') {
      throw new Error('Экспортируйте функцию через module.exports или объявите function solution(...)');
    }

    const results = [];
    for (const test of tests) {
      const started = performance.now();
      try {
        const run = new Function(
          'candidate',
          'assertDeepEqual',
          'return (async () => { ' + test.assertion + ' })();'
        );
        await run(candidate, assertDeepEqual);
        results.push({
          title: test.title,
          passed: true,
          durationMs: Math.round(performance.now() - started),
        });
      } catch (error) {
        results.push({
          title: test.title,
          passed: false,
          durationMs: Math.round(performance.now() - started),
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }

    self.postMessage({ passed: results.every((result) => result.passed), results });
  } catch (error) {
    self.postMessage({
      passed: false,
      results: [],
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
`

export function runLiveCodingTests(code: string, tests: LiveCodingTestCase[]) {
  return new Promise<CodeRunResult>((resolve) => {
    const blob = new Blob([workerSource], { type: 'text/javascript' })
    const workerUrl = URL.createObjectURL(blob)
    const worker = new Worker(workerUrl)

    const timeout = window.setTimeout(() => {
      worker.terminate()
      URL.revokeObjectURL(workerUrl)
      resolve({
        passed: false,
        results: [],
        error: 'Код выполнялся слишком долго. Проверьте бесконечные циклы.',
      })
    }, WORKER_TIMEOUT_MS)

    worker.onmessage = (event: MessageEvent<CodeRunResult>) => {
      window.clearTimeout(timeout)
      worker.terminate()
      URL.revokeObjectURL(workerUrl)
      resolve(event.data)
    }

    worker.onerror = (event) => {
      window.clearTimeout(timeout)
      worker.terminate()
      URL.revokeObjectURL(workerUrl)
      resolve({
        passed: false,
        results: [],
        error: event.message || 'Не удалось выполнить код',
      })
    }

    worker.postMessage({ code, tests })
  })
}
