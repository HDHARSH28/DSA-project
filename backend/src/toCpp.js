import { spawn } from 'child_process'
import path from 'path'

// Contract:
// stdin JSON: { type: 'Array'|'LinkedList'|'BST'|'HashMap', values: number[], op?: 'Insert'|'Delete'|'Find', value?: number }
// stdout JSON: { type?: same, values?: number[], log?: string }

const CPP_EXE = process.env.CPP_WRAPPER_EXE || path.resolve(process.cwd(), 'cpp-wrapper.exe')

export function runCppOp(payload) {
  return new Promise((resolve, reject) => {
    // If no exe, quickly bail with undefined to allow JS fallback
    if (!CPP_EXE) return resolve(undefined)

    const child = spawn(CPP_EXE, [], { stdio: ['pipe', 'pipe', 'pipe'] })
    let out = ''
    let err = ''
    child.stdout.on('data', d => (out += d.toString()))
    child.stderr.on('data', d => (err += d.toString()))
    child.on('error', e => resolve(undefined)) // fallback silently
    child.on('close', (code) => {
      if (code !== 0) return resolve(undefined)
      try {
        const parsed = JSON.parse(out.trim())
        resolve(parsed)
      } catch (e) {
        resolve(undefined)
      }
    })
    child.stdin.write(JSON.stringify(payload))
    child.stdin.end()
  })
}
