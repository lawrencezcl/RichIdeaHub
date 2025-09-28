const fetch = require('node-fetch')

// 直接调用各个数据收集服务
async function runDirectCollection() {
  console.log('🚀 Starting direct data collection...')

  let totalAdded = 0
  const target = 1000

  // 获取当前数量
  const currentCount = await getCaseCount()
  console.log(`📊 Current cases: ${currentCount}`)
  console.log(`📊 Target cases: ${target}`)
  console.log(`📊 Need to add: ${target - currentCount}`)

  // 多次运行收集直到达到目标
  for (let round = 1; round <= 20; round++) {
    console.log(`\n🔄 Round ${round}/20`)

    const beforeCount = await getCaseCount()
    console.log(`📊 Before collection: ${beforeCount}`)

    // 触发收集（不等待完成）
    console.log('🚀 Triggering collection...')
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

      const response = await fetch('http://localhost:3001/api/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: ['reddit', 'producthunt', 'indiehackers'], limit: 50 }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Collection triggered: ${JSON.stringify(data)}`)
      } else {
        console.log(`⚠️ Collection response: ${response.status}`)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('⏰ Collection request timed out (running in background)')
      } else {
        console.log(`⚠️ Collection error: ${error.message}`)
      }
    }

    // 等待一段时间让收集完成
    console.log('⏳ Waiting for collection to complete...')
    await new Promise(resolve => setTimeout(resolve, 60000)) // 60秒等待

    // 检查新增数量
    const afterCount = await getCaseCount()
    const added = afterCount - beforeCount
    totalAdded += added

    console.log(`📊 After collection: ${afterCount}`)
    console.log(`📊 Added this round: ${added}`)
    console.log(`📊 Total added: ${totalAdded}`)

    if (afterCount >= target) {
      console.log(`🎉 Target reached! ${afterCount} cases`)
      break
    }

    // 休息一下
    console.log('💤 Resting 30 seconds before next round...')
    await new Promise(resolve => setTimeout(resolve, 30000))
  }

  // 最终统计
  const finalCount = await getCaseCount()
  console.log(`\n🎯 Final Results:`)
  console.log(`   - Target: ${target}`)
  console.log(`   - Final: ${finalCount}`)
  console.log(`   - Total Added: ${totalAdded}`)
  console.log(`   - Success: ${finalCount >= target ? 'YES' : 'NO'}`)
}

async function getCaseCount() {
  try {
    const response = await fetch('http://localhost:3001/api/cases?limit=1000')
    const data = await response.json()
    return data.total || 0
  } catch (error) {
    console.error('Error getting case count:', error)
    return 0
  }
}

// 运行收集
runDirectCollection().catch(console.error)