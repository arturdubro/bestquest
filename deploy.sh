git archive --format=tar origin/gh-pages | gzip -9c | ssh deployer@188.226.163.161 "cd /var/www/php/best-quest.ru; tar xvzf -"
