#!/bin/bash
cd /home/ubuntu/open-trivia-night
npm install
sudo pm2 start ecosystem.config.js
sudo pm2 save
