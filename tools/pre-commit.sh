#!/bin/sh

npx lint-staged || exit
npx jest -o || exit
