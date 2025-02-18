// collegelist.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

// Function to run the Python script
const runPythonScript = (rank: number) => {
  return new Promise<any[]>((resolve, reject) => {
    const scriptPath = path.resolve('backend', 'predict.py');  // Path to your Python script
    const command = `python3 ${scriptPath} ${rank}`;  // Pass rank as argument to Python script

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing Python script: ${stderr}`);
      } else {
        try {
          // Parse the output (assuming the Python script prints JSON data)
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (err) {
          reject('Error parsing Python script output');
        }
      }
    });
  });
};

// Main handler function for API request
export async function GET(req: Request) {
  try {
    // Get rank from query params
    const url = new URL(req.url);
    const rank = url.searchParams.get('rank');
    
    if (!rank || isNaN(Number(rank))) {
      return NextResponse.json({ message: 'Invalid rank parameter' }, { status: 400 });
    }

    // Call Python script with the rank parameter
    const colleges = await runPythonScript(Number(rank));

    if (colleges.length === 0) {
      return NextResponse.json({ message: 'No colleges found' }, { status: 404 });
    }

    // Return the data if successful
    return NextResponse.json({ colleges });
  } catch (error) {
    // Handle any errors that occur
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
