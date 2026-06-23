node --check package.json 2>&1 || echo "JSON validation failed"
cat package.json
