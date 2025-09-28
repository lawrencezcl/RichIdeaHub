const { DataManager } = require('./src/app/api/fetch/route.ts')

async function collectLargeDataset() {
  console.log('🚀 Starting large-scale data collection for 1000 cases...')

  let totalProcessed = 0
  const targetCases = 1000
  const maxRetries = 3

  // Get current case count
  const currentCount = await getCurrentCaseCount()
  console.log(`📊 Current case count: ${currentCount}`)
  console.log(`📊 Target case count: ${targetCases}`)
  console.log(`📊 Need to collect: ${targetCases - currentCount} cases`)

  // Run multiple collection cycles until we reach the target
  for (let cycle = 1; cycle <= 10; cycle++) {
    console.log(`\n🔄 Collection Cycle ${cycle}/10`)

    try {
      // Run data collection
      const rawCases = await DataManager.fetchFromAllSources()
      console.log(`📥 Fetched ${rawCases.length} raw cases in cycle ${cycle}`)

      if (rawCases.length === 0) {
        console.log(`⚠️ No new cases found in cycle ${cycle}`)
        continue
      }

      // Process and store cases
      const processedCount = await DataProcessor.processAndStore(rawCases)
      totalProcessed += processedCount

      console.log(`✅ Processed ${processedCount} cases in cycle ${cycle}`)
      console.log(`📊 Total processed so far: ${totalProcessed}`)

      // Check current count
      const newCount = await getCurrentCaseCount()
      console.log(`📊 Current database count: ${newCount}`)

      if (newCount >= targetCases) {
        console.log(`🎉 Target reached! ${newCount} cases in database`)
        break
      }

      // Wait between cycles to avoid rate limiting
      console.log(`⏳ Waiting 30 seconds before next cycle...`)
      await new Promise(resolve => setTimeout(resolve, 30000))

    } catch (error) {
      console.error(`❌ Error in cycle ${cycle}:`, error)

      if (cycle >= maxRetries) {
        console.error(`❌ Max retries reached, stopping collection`)
        break
      }

      console.log(`⏳ Waiting 60 seconds before retry...`)
      await new Promise(resolve => setTimeout(resolve, 60000))
    }
  }

  // Final status
  const finalCount = await getCurrentCaseCount()
  console.log(`\n🎯 Final Results:`)
  console.log(`   - Target cases: ${targetCases}`)
  console.log(`   - Final count: ${finalCount}`)
  console.log(`   - Total processed: ${totalProcessed}`)
  console.log(`   - Success rate: ${finalCount >= targetCases ? '100%' : `${((finalCount/targetCases)*100).toFixed(1)}%`}`)
}

async function getCurrentCaseCount() {
  try {
    // This would need to be implemented based on your database setup
    // For now, we'll use the API endpoint
    const response = await fetch('http://localhost:3001/api/cases?limit=1000')
    const data = await response.json()
    return data.total || 0
  } catch (error) {
    console.error('Error getting current case count:', error)
    return 0
  }
}

// Import DataProcessor (assuming it's exported)
class DataProcessor {
  static async processAndStore(rawCases) {
    // This would need to be implemented based on your existing DataProcessor
    // For now, we'll simulate processing
    console.log(`🤖 Processing ${rawCases.length} cases...`)

    let processed = 0
    for (const rawCase of rawCases) {
      try {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 100))
        processed++
      } catch (error) {
        console.error('Error processing case:', error)
      }
    }

    return processed
  }
}

// Run the collection
collectLargeDataset().catch(console.error)