const fs = require("fs")
const path = require("path")

// Files to update
const filesToUpdate = ["lib/auth.ts", "app/api/auth/register/route.ts"]

// Function to replace bcrypt with bcryptjs
function replaceBcryptWithBcryptjs(filePath) {
  try {
    // Read the file
    const content = fs.readFileSync(filePath, "utf8")

    // Replace bcrypt with bcryptjs
    const updatedContent = content.replace(/from ['"]bcrypt['"]/g, 'from "bcryptjs"')

    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, "utf8")

    console.log(`✅ Successfully updated ${filePath}`)
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message)
  }
}

// Process each file
filesToUpdate.forEach((file) => {
  const fullPath = path.join(process.cwd(), file)
  replaceBcryptWithBcryptjs(fullPath)
})

console.log('\nDone! Now run "npm install" or "pnpm install" to ensure bcryptjs is installed.')

