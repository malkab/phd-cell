#!/bin/bash

# Setup the ML environment with virtualenv

virtualenv cell_jupyter_ml

. cell_jupyter_ml/bin/activate

pip install \
  jupyter \
  jupyterlab \
  psycopg2 \
  numpy \
  pandas \
  geopandas \
  scikit-learn \
  matplotlib
