if [ -z "$1" ]; then
    echo "Usage: $0 <target directory>" 1>&2
    exit 1
fi

target_dir="$1"


for file in public/images/${target_dir}/*.{jpg,png,webp}; do
    # Get image width using identify command
    width=$(identify -format "%w" "$file")
    
    # Only process if width is greater than 800
    if [ $width -gt 800 ]; then
        filename=$(basename "$file")
        basename="${filename%.*}"
        converted_filename="$(dirname "$file")/${basename}_800x.webp"
        convert "$file" -resize 800x -quality 94 "$converted_filename"
        # 元のファイルを削除
        rm "$file"
        # 変更後の画像の高さを取得
        height=$(identify -format "%h" "$converted_filename")
        new_filename="$(dirname "$file")/${basename}_800x${height}.webp"
        mv "$converted_filename" "$new_filename"
    fi
done
