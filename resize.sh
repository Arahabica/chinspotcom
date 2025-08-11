if [ -z "$1" ]; then
    echo "Usage: $0 <target directory>" 1>&2
    exit 1
fi

target_dir="$1"


for file in public/images/${target_dir}/*.{jpeg,jpg,png,webp}; do
    # Get image dimensions using identify command
    width=$(identify -format "%w" "$file")
    height=$(identify -format "%h" "$file")
    
    filename=$(basename "$file")
    basename="${filename%.*}"
    extension="${filename##*.}"
    
    # Check if file is already webp
    if [ "$extension" = "webp" ] && [ $width -le 800 ]; then
        # Skip if already webp and 800px or smaller
        continue
    fi
    
    if [ $width -gt 800 ]; then
        # Resize to 800px width and convert to webp
        converted_filename="$(dirname "$file")/${basename}_800x.webp"
        convert "$file" -resize 800x -quality 94 "$converted_filename"
        # 元のファイルを削除
        rm "$file"
        # 変更後の画像の高さを取得
        new_height=$(identify -format "%h" "$converted_filename")
        new_filename="$(dirname "$file")/${basename}_800x${new_height}.webp"
        mv "$converted_filename" "$new_filename"
    else
        # Keep original size but convert to webp
        if [ "$extension" != "webp" ]; then
            new_filename="$(dirname "$file")/${basename}_${width}x${height}.webp"
            convert "$file" -quality 94 "$new_filename"
            # 元のファイルを削除
            rm "$file"
        fi
    fi
done
