module.exports = {
  apps: [{
    name: 'open-trivia-night',
    script: './api/https-server.js',
    cwd: '/home/ubuntu/open-trivia-night',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    }
  }]
};
