#!/usr/bin/env bash

rm -rf dist/extension-review
mkdir -p dist/extension-review/src

cp -R src/shared dist/extension-review/src
cp -R src/extension dist/extension-review/src
cp -R src/static dist/extension-review/src
# types are imported by src/shared/types/phrases.ts
cp -R prisma dist/extension-review

cp package*.json dist/extension-review
cp webpack.config.js dist/extension-review
cp tsconfig.json dist/extension-review
cp svelte.config.js dist/extension-review

cd dist/extension-review
zip -9 -r -q ../extension-review-package.zip .
cd ../..
