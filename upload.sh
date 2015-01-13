jekyll build

aws s3 cp ./_site/css/main.css s3://inc-broll/TOP/css/main.css --acl public-read
aws s3 cp ./_site/js/main.js s3://inc-broll/TOP/js/main.js --acl public-read

cat ./_site/partial/index.html | pbcopy
