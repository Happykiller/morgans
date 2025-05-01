// mail/templates/render.ts
import fs from 'fs'
import { render } from '@react-email/render'

const main = async () => {
  const templateName = process.argv[2]
  if (!templateName) {
    console.error('❌ No template name provided.')
    process.exit(1)
  }

  const { default: Component } = await import(`./sources/${templateName}.tsx`)
  const html = await render(Component())
  fs.writeFileSync(`./compiled/${templateName.toLowerCase()}.html`, html)
  console.log(`✅ Template compiled: compiled/${templateName.toLowerCase()}.html`)
}

main()
