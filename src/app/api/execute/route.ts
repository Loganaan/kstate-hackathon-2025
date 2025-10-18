import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

interface TestCase {
  input: string;
  output: string;
}

interface ExecuteRequest {
  code: string;
  testCases: TestCase[];
  language: string;
}

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ExecuteRequest = await request.json();
    const { code, testCases, language } = body;

    if (!code || !testCases || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: code, testCases, language' },
        { status: 400 }
      );
    }

    if (language !== 'python') {
      return NextResponse.json(
        { error: 'Only Python is currently supported' },
        { status: 400 }
      );
    }

    // Generate a unique filename for this execution
    const fileId = randomBytes(16).toString('hex');
    const tempFilePath = join(tmpdir(), `code_${fileId}.py`);

    try {
      // Write the user's code to a temporary file
      await writeFile(tempFilePath, code, 'utf-8');

      // Run each test case
      const results: TestResult[] = [];

      for (const testCase of testCases) {
        try {
          const result = await runPythonCode(tempFilePath, code, testCase);
          results.push(result);
        } catch (error) {
          results.push({
            passed: false,
            input: testCase.input,
            expected: testCase.output,
            actual: '',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      // Clean up the temporary file
      await unlink(tempFilePath).catch(() => {
        // Ignore cleanup errors
      });

      const passedCount = results.filter((r) => r.passed).length;
      const totalCount = results.length;

      return NextResponse.json({
        success: true,
        results,
        summary: {
          passed: passedCount,
          total: totalCount,
          allPassed: passedCount === totalCount,
        },
      });
    } catch (error) {
      // Clean up on error
      await unlink(tempFilePath).catch(() => {
        // Ignore cleanup errors
      });
      throw error;
    }
  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute code',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function runPythonCode(
  filePath: string,
  code: string,
  testCase: TestCase
): Promise<TestResult> {
  return new Promise(async (resolve) => {
    // Generate unique test file
    const testFileId = randomBytes(8).toString('hex');
    const testFilePath = join(tmpdir(), `test_${testFileId}.py`);

    try {
      // Parse the input to extract function arguments
      const inputArgs = parseTestInput(testCase.input);
      
      // Detect if code uses a class or standalone function
      const hasClass = code.includes('class ');
      const functionCall = extractFunctionCall(code, inputArgs, hasClass);
      
      // Create a wrapper script that calls the user's function with the test input
      const wrapperCode = `
import sys
import json

${code}

# Test input
${inputArgs}

# Call the function (extract function name from code)
try:
    ${hasClass ? 'solution = Solution()' : ''}
    result = ${functionCall}
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"error": str(e)}), file=sys.stderr)
    sys.exit(1)
`;

      // Write wrapper code to temp file
      await writeFile(testFilePath, wrapperCode, 'utf-8');

      // Debug: log the wrapper code
      console.log('=== Generated Python Code ===');
      console.log(wrapperCode);
      console.log('=== End Generated Code ===');

      let stdout = '';
      let stderr = '';
      let timedOut = false;

      // Execute Python with the file
      const pythonProcess = spawn('python', [testFilePath], {
        shell: true,
        timeout: 5000,
      });

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pythonProcess.on('close', async (code) => {
        // Clean up test file
        await unlink(testFilePath).catch(() => {});

        console.log('Python exit code:', code);
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);

        if (timedOut) {
          resolve({
            passed: false,
            input: testCase.input,
            expected: testCase.output,
            actual: '',
            error: 'Execution timeout (5 seconds)',
          });
          return;
        }

        if (code !== 0) {
          resolve({
            passed: false,
            input: testCase.input,
            expected: testCase.output,
            actual: '',
            error: stderr || 'Runtime error',
          });
          return;
        }

        try {
          // Parse the output and compare with expected
          const actual = stdout.trim();
          const expected = testCase.output.trim();
          
          console.log('Actual output (raw):', actual);
          console.log('Expected output:', expected);
          
          // Normalize JSON output for comparison
          const actualNormalized = normalizeOutput(actual);
          const expectedNormalized = normalizeOutput(expected);

          console.log('Actual (normalized):', actualNormalized);
          console.log('Expected (normalized):', expectedNormalized);

          const passed = actualNormalized === expectedNormalized;

          console.log('Test passed?', passed);

          resolve({
            passed,
            input: testCase.input,
            expected: testCase.output,
            actual: actual || '(no output)',
          });
        } catch (error) {
          resolve({
            passed: false,
            input: testCase.input,
            expected: testCase.output,
            actual: stdout,
            error: 'Failed to parse output',
          });
        }
      });

      pythonProcess.on('error', async (error) => {
        await unlink(testFilePath).catch(() => {});
        resolve({
          passed: false,
          input: testCase.input,
          expected: testCase.output,
          actual: '',
          error: `Execution error: ${error.message}`,
        });
      });

      // Handle timeout
      const timeoutId = setTimeout(() => {
        timedOut = true;
        pythonProcess.kill();
      }, 5000);

      pythonProcess.on('close', () => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      await unlink(testFilePath).catch(() => {});
      resolve({
        passed: false,
        input: testCase.input,
        expected: testCase.output,
        actual: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}

function parseTestInput(input: string): string {
  // The input may contain multiple variable assignments separated by commas
  // e.g., "s = \"eceba\", k = 2" or "nums = [1,2,3], target = 9"
  
  // Split by commas, but be careful with commas inside brackets/quotes
  const assignments: string[] = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const prevChar = i > 0 ? input[i - 1] : '';
    
    // Track string state
    if ((char === '"' || char === "'") && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }
    
    // Track bracket depth
    if (!inString) {
      if (char === '[' || char === '(' || char === '{') {
        depth++;
      } else if (char === ']' || char === ')' || char === '}') {
        depth--;
      }
    }
    
    // Split on comma only if outside brackets/strings
    if (char === ',' && depth === 0 && !inString) {
      assignments.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last assignment
  if (current.trim()) {
    assignments.push(current.trim());
  }
  
  // Join with newlines for separate variable declarations
  return assignments.join('\n');
}

function extractFunctionCall(code: string, inputArgs: string, hasClass: boolean = false): string {
  // Extract the function or method name from the code
  let functionMatch;
  
  if (hasClass) {
    // Look for method inside a class (def method_name inside class)
    functionMatch = code.match(/class\s+\w+:[\s\S]*?def\s+(\w+)\s*\(/);
  } else {
    // Look for standalone function
    functionMatch = code.match(/def\s+(\w+)\s*\(/);
  }
  
  if (!functionMatch) {
    return 'None';
  }

  const functionName = functionMatch[1];
  
  // Skip __init__ and look for the actual method
  if (hasClass && functionName === '__init__') {
    const methodMatch = code.match(/def\s+(\w+)\s*\([^)]*\):/g);
    if (methodMatch && methodMatch.length > 1) {
      // Get the second method (first is __init__)
      const secondMethod = methodMatch[1];
      const methodNameMatch = secondMethod.match(/def\s+(\w+)/);
      if (methodNameMatch) {
        const methodName = methodNameMatch[1];
        // Extract parameters for this method
        const methodParamsMatch = code.match(new RegExp(`def\\s+${methodName}\\s*\\(([^)]*)\\)`));
        const params = extractParameters(methodParamsMatch ? methodParamsMatch[1] : '');
        return params.length > 0 ? `solution.${methodName}(${params.join(', ')})` : `solution.${methodName}()`;
      }
    }
  }
  
  // Extract parameter names from the function/method definition
  const paramsRegex = hasClass 
    ? new RegExp(`def\\s+${functionName}\\s*\\(([^)]*)\\)`)
    : new RegExp(`def\\s+${functionName}\\s*\\(([^)]*)\\)`);
    
  const paramsMatch = code.match(paramsRegex);
  const params = extractParameters(paramsMatch ? paramsMatch[1] : '');

  // Build function call with parameters
  if (hasClass) {
    return params.length > 0 ? `solution.${functionName}(${params.join(', ')})` : `solution.${functionName}()`;
  } else {
    return params.length > 0 ? `${functionName}(${params.join(', ')})` : `${functionName}()`;
  }
}

function extractParameters(paramString: string): string[] {
  return paramString
    .split(',')
    .map((p) => p.trim().split(':')[0].trim())
    .filter((p) => p && p !== 'self'); // Filter out 'self' for class methods
}

function normalizeOutput(output: string): string {
  try {
    // Try to parse as JSON and stringify consistently
    const parsed = JSON.parse(output);
    return JSON.stringify(parsed);
  } catch {
    // Not JSON, just normalize whitespace
    return output.trim().replace(/\s+/g, ' ');
  }
}
