#!/bin/bash

temp_file=".line-lint.tmp"

# build array of files to lint
files=()
while IFS=  read -r -d $'\0'; do
    files+=("$REPLY")
done < <(find apps src -type f -name "*.ts" -print0)

current=1
modified=0
total=${#files[@]}
echo "Found ${total} files to process..."

# create temp file with linted version of each file from array
for file in "${files[@]}" ; do
    echo -en "\r\033[KProcessing file ${current} of ${total}..."
    ((current++))
    cat "$file" | node_modules/ts-node/dist/bin.js tools/line-lint/line-lint.ts > "$temp_file"

    # if there's a difference, rewrite original file
    if ! (diff "$file" "$temp_file" >/dev/null) ; then
        ((modified++))
        cat "$temp_file" > "$file"
    fi
done

# clean up temp file
if [[ -f "$temp_file" ]] ; then
    rm "$temp_file"
fi

echo
echo
echo "Line-linting complete, ${modified} of ${total} files were modified."