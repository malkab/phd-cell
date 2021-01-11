#!/bin/bash

DROPBOX_FOLDER=/home/malkab/Dropbox/tags/00-current/phd/050-workpackages/scientific/2020-12-21-libcellbackend_cli_commands

mkdir -p $DROPBOX_FOLDER/DiscretePolyAreaSummary/gridder
mkdir -p $DROPBOX_FOLDER/DiscretePolyAreaSummary/griddersetup

mkdir -p $DROPBOX_FOLDER/DiscretePolyTopArea/gridder
mkdir -p $DROPBOX_FOLDER/DiscretePolyTopArea/griddersetup

mkdir -p $DROPBOX_FOLDER/MdtProcessing/gridder
mkdir -p $DROPBOX_FOLDER/MdtProcessing/griddersetup

mkdir -p $DROPBOX_FOLDER/PointAggregations/gridder
mkdir -p $DROPBOX_FOLDER/PointAggregations/griddersetup

mkdir -p $DROPBOX_FOLDER/PointIdwInterpolation/gridder
mkdir -p $DROPBOX_FOLDER/PointIdwInterpolation/griddersetup

cp ../dist/gridder.js $DROPBOX_FOLDER/DiscretePolyAreaSummary/gridder
cp ../dist/gridder.js $DROPBOX_FOLDER/DiscretePolyTopArea/gridder
cp ../dist/gridder.js $DROPBOX_FOLDER/MdtProcessing/gridder
cp ../dist/gridder.js $DROPBOX_FOLDER/PointAggregations/gridder
cp ../dist/gridder.js $DROPBOX_FOLDER/PointIdwInterpolation/gridder

cp ../../assets/gridder/gridder-config-discretepolyareasummary.json \
  $DROPBOX_FOLDER/DiscretePolyAreaSummary/gridder/config.json
cp ../../assets/gridder/gridder-config-discretepolytoparea.json \
  $DROPBOX_FOLDER/DiscretePolyTopArea/gridder/config.json
cp ../../assets/gridder/gridder-config-mdtprocessing.json \
  $DROPBOX_FOLDER/MdtProcessing/gridder/config.json
cp ../../assets/gridder/gridder-config-pointaggregations.json \
  $DROPBOX_FOLDER/PointAggregations/gridder/config.json
cp ../../assets/gridder/gridder-config-pointidwinterpolation.json \
  $DROPBOX_FOLDER/PointIdwInterpolation/gridder/config.json

cp ../dist/griddersetup.js $DROPBOX_FOLDER/DiscretePolyAreaSummary/griddersetup
cp ../dist/griddersetup.js $DROPBOX_FOLDER/DiscretePolyTopArea/griddersetup
cp ../dist/griddersetup.js $DROPBOX_FOLDER/MdtProcessing/griddersetup
cp ../dist/griddersetup.js $DROPBOX_FOLDER/PointAggregations/griddersetup
cp ../dist/griddersetup.js $DROPBOX_FOLDER/PointIdwInterpolation/griddersetup

cp ../../assets/griddersetup/griddersetup-config-discretepolyareasummary.json \
  $DROPBOX_FOLDER/DiscretePolyAreaSummary/griddersetup/config.json
cp ../../assets/griddersetup/griddersetup-config-discretepolytoparea.json \
  $DROPBOX_FOLDER/DiscretePolyTopArea/griddersetup/config.json
cp ../../assets/griddersetup/griddersetup-config-mdtprocessing.json \
  $DROPBOX_FOLDER/MdtProcessing/griddersetup/config.json
cp ../../assets/griddersetup/griddersetup-config-pointaggregations.json \
  $DROPBOX_FOLDER/PointAggregations/griddersetup/config.json
cp ../../assets/griddersetup/griddersetup-config-pointidwinterpolation.json \
  $DROPBOX_FOLDER/PointIdwInterpolation/griddersetup/config.json
