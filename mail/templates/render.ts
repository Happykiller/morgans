import fs from 'fs'
import { render } from '@react-email/render'

const main = async () => {
  const templateName = process.argv[2]
  const locale = (process.argv[3] ?? 'fr').toLowerCase()

  if (!templateName) {
    console.error('No template name provided.')
    process.exit(1)
  }

  const { default: Component } = await import(`./sources/${templateName}.tsx`)
  const html = await render(Component({ locale }))
  const outputFileName = `./compiled/${templateName.toLowerCase()}.${locale}.html`

  fs.writeFileSync(outputFileName, html)
  console.log(`Template compiled: ${outputFileName}`)
}

main()
