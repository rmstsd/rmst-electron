module.exports = {
  appId: 'com.electron.app',
  productName: 'rmst-tools',
  directories: {
    buildResources: 'build'
  },
  files: [
    '!**/.vscode/*',
    '!src/*',
    '!electron.vite.config.{js,ts,mjs,cjs}',
    '!{.eslintignore,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}',
    '!{.env,.env.*,.npmrc,pnpm-lock.yaml}',
    '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}'
  ],
  asarUnpack: ['resources/**'],
  win: {
    executableName: 'rmst-tools',
    icon: 'resources/icon.png'
  },
  nsis: {
    artifactName: '${name}-${version}-setup.${ext}',
    shortcutName: '${productName}',
    uninstallDisplayName: '${productName}',
    createDesktopShortcut: 'always',
    oneClick: false,
    language: '2052',
    perMachine: true,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: true
  },
  mac: {
    entitlementsInherit: 'build/entitlements.mac.plist',
    extendInfo: [
      {
        NSCameraUsageDescription: "Application requests access to the device's camera."
      },
      {
        NSMicrophoneUsageDescription: "Application requests access to the device's microphone."
      },
      {
        NSDocumentsFolderUsageDescription: "Application requests access to the user's Documents folder."
      },
      {
        NSDownloadsFolderUsageDescription: "Application requests access to the user's Downloads folder."
      }
    ],
    notarize: false
  },
  dmg: {
    artifactName: '${name}-${version}.${ext}'
  },
  linux: {
    target: ['AppImage', 'snap', 'deb'],
    maintainer: 'electronjs.org',
    category: 'Utility'
  },
  appImage: {
    artifactName: '${name}-${version}.${ext}'
  },
  npmRebuild: false,

  // publish: {
  //   provider: 'generic',
  //   url: 'http://127.0.0.1:1666/public/latest'
  // }

  publish: {
    provider: 'github',
    owner: 'rmstsd',
    repo: 'rmst-tools'
  }
}
