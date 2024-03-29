#!/bin/bash

# -----------------------------------------------------------------
#
# rsync to the remote machine.
#
# -----------------------------------------------------------------
#
# Push assets to a remote host. Be VERY CAREFULL with the --delete
# option!!! Terrible data loss has happen in the past.
#  
# -----------------------------------------------------------------

# Check mlk-context to check. If void, no check will be performed
MATCH_MLKCONTEXT=
# Source folder, can be the folder itself.
SOURCE_FOLDER=.
# Remote folder, this folder will be created at the remote if possible
# Use absolute paths exclusively.
REMOTE_FOLDER=/home/ubuntu/system-config
# Remote SSH username
USER_NAME=$MLKC_CELL_API_USER
# Host
HOST=$MLKC_CELL_API_HOST
# Excludes, for example ("a*" "e*" "r*") 
EXCLUDES=(
  ".DS_Store" "rsync*" ".gitignore" 
  "*.mlkcontext_template" "ssh.sh" "README.md"
)
# SSH port
SSH_PORT=$MLKC_SSH_PORT
# Amazon AWS PEM key (it´s a path to a file)
AWS_PEM=$MLKC_CELL_API_PEM

echo -------------
echo WORKING AT $(mlkcontext)
echo -------------





# ---

# By default, run dry and without delete
DRY_RUN=true
DELETE=false


# Help function

help(){
cat <<EOF
rsync.sh to a remote host, configure the script for details.

    ./rsync.sh [-r] [-d]

Usage:
    -r    run the command, by default, the command is run dry
    -d    enable delete mode, both for dry and run modes
EOF

return 0
}


# Check mlkcontext

if [ ! -z "${MATCH_MLKCONTEXT}" ] ; then

  if [ ! "$(mlkcontext)" = "$MATCH_MLKCONTEXT" ] ; then

    echo Please initialise context $MATCH_MLKCONTEXT

    exit 1

  fi

fi


# Check options

while getopts :rdh opt
do
	case "$opt" in
    r) DRY_RUN=false
       ;;
    d) DELETE=true
       ;;
    h) help
       exit 0
       ;;
    ?) help
       exit 0
       ;;
	esac
done


# Initial options for SSH and RSYNC

SSH_OPTIONS="-p ${SSH_PORT}"


# Amazon PEM

if [ ! -z $AWS_PEM ] ; then

  SSH_OPTIONS="${SSH_OPTIONS} -i ${AWS_PEM}"

fi


# If


# BEWARE THE DELETE!!!

if [ "$DELETE" = true ] ; then 

  DELETE="--delete"
  
else 

  DELETE=""
  
fi


# Dry run

if [ "$DRY_RUN" = true ] ; then 

  DRY_RUN_F="--dry-run"
  
else 

  DRY_RUN_F=""
  
fi


# The command

RSYNC="rsync -avzhr --progress ${DELETE} ${DRY_RUN_F} --rsh=\"ssh ${SSH_OPTIONS}\" "


# Create the remote folder

ssh $SSH_OPTIONS $USER_NAME@$HOST "mkdir -p ${REMOTE_FOLDER}"


# Process of excludes

for EXCLUDE in "${EXCLUDES[@]}" ; do

  RSYNC="${RSYNC} --exclude \"${EXCLUDE}\""

done


# Command 

RSYNC="${RSYNC} ${SOURCE_FOLDER} ${USER_NAME}@${HOST}:${REMOTE_FOLDER}"

eval $RSYNC


# Inform the user

if [ "$DRY_RUN" = true ] ; then

  echo "NOTE: this was a dry run"

fi

if [ "$DELETE" = "--delete" ] ; then

  echo "WARNING!: this was a delete run"

fi
