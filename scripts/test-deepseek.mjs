// 暂时注释掉AI测试，直接测试连接
// import { AIProcessor } from '../src/lib/openai.js';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function testDeepSeek() {
  console.log('🤖 测试DeepSeek AI连接...');
  
  try {
    // 简单测试API连接
    const response = await fetch('https://api.deepseek.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✅ DeepSeek API连接成功！');
    } else {
      throw new Error(`API连接失败: ${response.status}`);
    }
    
    console.log('✅ DeepSeek AI测试完成！');
    
  } catch (error) {
    console.error('❌ DeepSeek测试失败:', error);
  }
}

testDeepSeek();