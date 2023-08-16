import { exec } from 'child_process';
function runPythonScript(callback: (error: Error | null, output?: string) => void): void {
  exec(' python scripts/test.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return callback(error);
    }
    console.log(`Python Output: ${stdout}`);
    callback(null, stdout);
  });
}

export {
  runPythonScript
};
