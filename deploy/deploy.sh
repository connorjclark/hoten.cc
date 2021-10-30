#!/bin/sh -ex

DIR="$(cd "$(dirname "$0")"; pwd)";

# Build and deploys site.
# External projects are deployed to a folder in `public_html`,
# so those directories are excluded from rsync.

rm -rf blog/_site
yarn build
rsync -ahvz --delete ./_site/ --exclude-from "$DIR/exclude-list.txt" root@hoten.cc:/var/www/hoten.cc/public_html/


# ln -s /root/connor-services/connor-services.service /etc/systemd/system/connor-services.service