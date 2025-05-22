#!/bin/bash

source ~/miniconda3/etc/profile.d/conda.sh

conda activate wizard

uvicorn main:app --host 0.0.0.0 --port 8000



# chmod +x server-start.sh 

# pm2 start ./server-start.sh --name server

# pm2 save

# pm2 startup