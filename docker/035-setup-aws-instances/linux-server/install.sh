#!/bin/bash

# RUN AS NORMAL USER 

# This is for Ubuntu 20.04 Focal Fossa

# Installs all revelant config files and scripts in a Linux Server
# system


USER=ubuntu
GROUP=ubuntu
HOME=/home/$USER                  # User's home
COMMON=$(pwd)/../common           # Common arch assets
SPECIFIC=$(pwd)                   # Specific arch assets


# Adds locales
sudo locale-gen es_ES.UTF-8

# Installs basic packages for a Linux box
sudo apt update -y
sudo apt upgrade -y

sudo apt-get -y install \
  curl \
  vim \
  iotop \
  htop \
  ipython3 \
  net-tools \
  python3-pip \
  tmux \
  locate \
  apt-file \
  lm-sensors \
  stress-ng \
  openssh-client \
  openssh-server \
  p7zip-full

sudo ln -s /usr/bin/python3 /usr/bin/python
sudo ln -s /usr/bin/ipython3 /usr/bin/ipython

# Install /usr/local/bin scripts
sudo cp $COMMON/scripts/usr_local_bin/mlk* /usr/local/bin
sudo cp $SPECIFIC/scripts/usr_local_bin/mlk* /usr/local/bin
sudo chmod 755 /usr/local/bin/mlk*

# Install home configurations
rm -f $HOME/.bashrc
rm -f $HOME/.gitconfig
rm -f $HOME/.tmux.conf
rm -f $HOME/.vimrc

cp $SPECIFIC/home/dot.bashrc $HOME/.bashrc
cp $COMMON/home/dot.gitconfig $HOME/.gitconfig
cp $SPECIFIC/home/dot.tmux.conf $HOME/.tmux.conf
cp $SPECIFIC/home/dot.vimrc $HOME/.vimrc

# Create apps folder
sudo mkdir -p /home/apps
sudo chown $USER:$GROUP /home/apps

# Install Docker
sudo mkdir /etc/docker/
sudo cp assets/daemon.json /etc/docker

sudo apt update -y
sudo apt upgrade -y

sudo apt install -y \
  vim \
  tmux \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg-agent \
  software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"

sudo apt update -y

sudo apt install -y docker.io

# Add user to the Docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

# Create the apps folder
sudo mkdir /home/apps
sudo chown $USER:$GROUP /home/apps
