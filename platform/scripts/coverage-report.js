#!/usr/bin/env node

/**
 * Coverage Report Generator for OneDettyDecember
 * Generates comprehensive test coverage reports and summaries
 */

const fs = require('fs')
const path = require('path')

function generateCoverageSummary() {
  const coverageFile = path.join(__dirname, '../coverage/coverage-summary.json')
  
  if (!fs.existsSync(coverageFile)) {
    console.log('❌ No coverage data found. Run tests with coverage first.')
    console.log('   npm run test:coverage')
    process.exit(1)
  }

  const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'))
  const total = coverage.total

  console.log('\n📊 OneDettyDecember Test Coverage Report')
  console.log('=' .repeat(50))
  
  console.log(`\n📈 Overall Coverage:`)
  console.log(`   Lines:      ${total.lines.pct}% (${total.lines.covered}/${total.lines.total})`)
  console.log(`   Functions:  ${total.functions.pct}% (${total.functions.covered}/${total.functions.total})`)
  console.log(`   Branches:   ${total.branches.pct}% (${total.branches.covered}/${total.branches.total})`)
  console.log(`   Statements: ${total.statements.pct}% (${total.statements.covered}/${total.statements.total})`)

  // Check if coverage meets thresholds
  const thresholds = {
    lines: 70,
    functions: 70,
    branches: 70,
    statements: 70
  }

  console.log('\n🎯 Coverage Thresholds:')
  Object.entries(thresholds).forEach(([metric, threshold]) => {
    const actual = total[metric].pct
    const status = actual >= threshold ? '✅' : '❌'
    console.log(`   ${metric}: ${status} ${actual}% (target: ${threshold}%)`)
  })

  // List files with low coverage
  console.log('\n📋 File Coverage Details:')
  Object.entries(coverage)
    .filter(([file]) => file !== 'total')
    .sort(([,a], [,b]) => a.lines.pct - b.lines.pct)
    .slice(0, 10)
    .forEach(([file, data]) => {
      const status = data.lines.pct >= 70 ? '✅' : '⚠️'
      console.log(`   ${status} ${file}: ${data.lines.pct}% lines`)
    })

  console.log('\n📁 Coverage Reports Generated:')
  console.log(`   HTML Report: coverage/lcov-report/index.html`)
  console.log(`   LCOV Report: coverage/lcov.info`)
  console.log(`   JSON Report: coverage/coverage-final.json`)
  
  console.log('\n🚀 Next Steps:')
  console.log('   • Open HTML report: npm run test:coverage:open')
  console.log('   • Run tests in watch mode: npm run test:watch')
  console.log('   • Run all tests: npm run test:all')
  
  console.log('\n')
}

if (require.main === module) {
  generateCoverageSummary()
}

module.exports = { generateCoverageSummary }
