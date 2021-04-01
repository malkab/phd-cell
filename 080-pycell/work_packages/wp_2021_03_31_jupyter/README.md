# Jupyter Environment

The Docker container must be run attached to the host network to be able to reach kepler.


## Setup with Virtualenv

Create the virtualenv by running **setup.sh**.


## Running the Environment

Just:

```shell
. cell_jupyter_ml/bin/activate

jupyter notebook --ip 0.0.0.0
jupyter lab --ip 0.0.0.0
```
