import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: ['src/components/ui/**', 'src/routeTree.gen.ts'],
  ignoreDependencies: ['tailwindcss', 'tw-animate-css'],
  rules: {
    files: 'warn',
    dependencies: 'warn',
    exports: 'warn',
    types: 'warn',
  },
}

export default config
