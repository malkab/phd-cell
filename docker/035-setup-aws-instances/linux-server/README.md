To install into a server, rsync the whole systems-config to the server's user home and modify:

  - **install.sh** script to adjust to local paths;

  - **assets/daemon.json** to set the Docker root folder.
  
Run **install.sh** as a normal user. The systems-config folder can be deleted afterwards.
