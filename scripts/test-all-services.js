const { Pool } = require('pg')

async function testAllServices() {
  console.log('🧪 Testing Clarity Coach AI Services...\n')
  
  // Test Database
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || "postgresql://dpbray@localhost:5432/clarity_coach_dev"
    })
    const result = await pool.query('SELECT NOW()')
    console.log('✅ Database: Connected')
    await pool.end()
  } catch (error) {
    console.log('❌ Database:', error.message)
  }
  
  // Check Environment Variables
  console.log('\n📋 Environment Variables:')
  const vars = ['AZURE_SPEECH_KEY', 'AZURE_SPEECH_REGION', 'PINECONE_API_KEY', 'OPENAI_API_KEY']
  vars.forEach(key => {
    const val = process.env[key]
    console.log(val ? `✅ ${key}: Set` : `❌ ${key}: NOT SET`)
  })
  
  console.log('\n🎉 Test Complete!')
}

testAllServices()
