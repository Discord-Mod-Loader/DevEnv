cd ./resources
npm i
out = $(tsc)
if [[ "$out" ]]
then
    echo "$out" > ../compile-error-log.txt
fi