#!/bin/sh -ex

rm -rf blog/_site
yarn eleventy
rsync -ahvz --delete ./_site/ root@165.227.27.153:/var/www/hoten.cc/public_html/ --exclude gridia/play/
