#!/bin/sh -ex

rsync -ahvz --delete ./public/ root@165.227.27.153:/var/www/hoten.cc/public_html/ --exclude blog

rm -rf blog/_site
./cmd jekyll build
rsync -ahvz --delete ./blog/_site/ root@165.227.27.153:/var/www/hoten.cc/public_html/blog/
