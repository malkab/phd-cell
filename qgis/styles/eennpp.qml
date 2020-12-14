<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis labelsEnabled="0" styleCategories="AllStyleCategories" simplifyAlgorithm="0" version="3.14.1-Pi" simplifyLocal="1" minScale="100000000" hasScaleBasedVisibilityFlag="0" maxScale="0" simplifyMaxScale="1" simplifyDrawingHints="1" simplifyDrawingTol="1" readOnly="0">
  <flags>
    <Identifiable>1</Identifiable>
    <Removable>1</Removable>
    <Searchable>1</Searchable>
  </flags>
  <temporal mode="0" endExpression="" startExpression="" endField="" durationUnit="min" accumulate="0" startField="" durationField="" enabled="0" fixedDuration="0">
    <fixedRange>
      <start></start>
      <end></end>
    </fixedRange>
  </temporal>
  <renderer-v2 enableorderby="0" type="singleSymbol" symbollevels="0" forceraster="0">
    <symbols>
      <symbol type="fill" alpha="1" clip_to_extent="1" force_rhr="0" name="0">
        <layer pass="0" locked="0" class="SimpleFill" enabled="1">
          <prop v="3x:0,0,0,0,0,0" k="border_width_map_unit_scale"/>
          <prop v="202,207,164,255" k="color"/>
          <prop v="bevel" k="joinstyle"/>
          <prop v="0,0" k="offset"/>
          <prop v="3x:0,0,0,0,0,0" k="offset_map_unit_scale"/>
          <prop v="MM" k="offset_unit"/>
          <prop v="75,81,31,255" k="outline_color"/>
          <prop v="solid" k="outline_style"/>
          <prop v="0.26" k="outline_width"/>
          <prop v="MM" k="outline_width_unit"/>
          <prop v="solid" k="style"/>
          <data_defined_properties>
            <Option type="Map">
              <Option value="" type="QString" name="name"/>
              <Option name="properties"/>
              <Option value="collection" type="QString" name="type"/>
            </Option>
          </data_defined_properties>
        </layer>
      </symbol>
    </symbols>
    <rotation/>
    <sizescale/>
  </renderer-v2>
  <customproperties>
    <property value="0" key="embeddedWidgets/count"/>
    <property key="variableNames"/>
    <property key="variableValues"/>
  </customproperties>
  <blendMode>0</blendMode>
  <featureBlendMode>0</featureBlendMode>
  <layerOpacity>1</layerOpacity>
  <SingleCategoryDiagramRenderer attributeLegend="1" diagramType="Histogram">
    <DiagramCategory minimumSize="0" backgroundAlpha="255" lineSizeScale="3x:0,0,0,0,0,0" backgroundColor="#ffffff" direction="0" spacingUnit="MM" barWidth="5" scaleDependency="Area" penWidth="0" opacity="1" penAlpha="255" spacing="5" maxScaleDenominator="1e+08" width="15" minScaleDenominator="0" scaleBasedVisibility="0" sizeType="MM" showAxis="1" penColor="#000000" rotationOffset="270" sizeScale="3x:0,0,0,0,0,0" spacingUnitScale="3x:0,0,0,0,0,0" diagramOrientation="Up" labelPlacementMethod="XHeight" lineSizeType="MM" enabled="0" height="15">
      <fontProperties style="" description="Ubuntu,11,-1,5,50,0,0,0,0,0"/>
      <axisSymbol>
        <symbol type="line" alpha="1" clip_to_extent="1" force_rhr="0" name="">
          <layer pass="0" locked="0" class="SimpleLine" enabled="1">
            <prop v="square" k="capstyle"/>
            <prop v="5;2" k="customdash"/>
            <prop v="3x:0,0,0,0,0,0" k="customdash_map_unit_scale"/>
            <prop v="MM" k="customdash_unit"/>
            <prop v="0" k="draw_inside_polygon"/>
            <prop v="bevel" k="joinstyle"/>
            <prop v="35,35,35,255" k="line_color"/>
            <prop v="solid" k="line_style"/>
            <prop v="0.26" k="line_width"/>
            <prop v="MM" k="line_width_unit"/>
            <prop v="0" k="offset"/>
            <prop v="3x:0,0,0,0,0,0" k="offset_map_unit_scale"/>
            <prop v="MM" k="offset_unit"/>
            <prop v="0" k="ring_filter"/>
            <prop v="0" k="use_custom_dash"/>
            <prop v="3x:0,0,0,0,0,0" k="width_map_unit_scale"/>
            <data_defined_properties>
              <Option type="Map">
                <Option value="" type="QString" name="name"/>
                <Option name="properties"/>
                <Option value="collection" type="QString" name="type"/>
              </Option>
            </data_defined_properties>
          </layer>
        </symbol>
      </axisSymbol>
    </DiagramCategory>
  </SingleCategoryDiagramRenderer>
  <DiagramLayerSettings dist="0" obstacle="0" zIndex="0" showAll="1" linePlacementFlags="18" priority="0" placement="1">
    <properties>
      <Option type="Map">
        <Option value="" type="QString" name="name"/>
        <Option name="properties"/>
        <Option value="collection" type="QString" name="type"/>
      </Option>
    </properties>
  </DiagramLayerSettings>
  <geometryOptions removeDuplicateNodes="0" geometryPrecision="0">
    <activeChecks/>
    <checkConfiguration type="Map">
      <Option type="Map" name="QgsGeometryGapCheck">
        <Option value="0" type="double" name="allowedGapsBuffer"/>
        <Option value="false" type="bool" name="allowedGapsEnabled"/>
        <Option value="" type="QString" name="allowedGapsLayer"/>
      </Option>
    </checkConfiguration>
  </geometryOptions>
  <referencedLayers/>
  <referencingLayers/>
  <fieldConfiguration>
    <field name="gid">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="figura">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="nombre">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
  </fieldConfiguration>
  <aliases>
    <alias index="0" field="gid" name=""/>
    <alias index="1" field="figura" name=""/>
    <alias index="2" field="nombre" name=""/>
  </aliases>
  <excludeAttributesWMS/>
  <excludeAttributesWFS/>
  <defaults>
    <default applyOnUpdate="0" expression="" field="gid"/>
    <default applyOnUpdate="0" expression="" field="figura"/>
    <default applyOnUpdate="0" expression="" field="nombre"/>
  </defaults>
  <constraints>
    <constraint unique_strength="1" notnull_strength="1" exp_strength="0" constraints="3" field="gid"/>
    <constraint unique_strength="0" notnull_strength="0" exp_strength="0" constraints="0" field="figura"/>
    <constraint unique_strength="0" notnull_strength="0" exp_strength="0" constraints="0" field="nombre"/>
  </constraints>
  <constraintExpressions>
    <constraint desc="" field="gid" exp=""/>
    <constraint desc="" field="figura" exp=""/>
    <constraint desc="" field="nombre" exp=""/>
  </constraintExpressions>
  <expressionfields/>
  <attributeactions>
    <defaultAction value="{00000000-0000-0000-0000-000000000000}" key="Canvas"/>
  </attributeactions>
  <attributetableconfig actionWidgetStyle="dropDown" sortExpression="" sortOrder="0">
    <columns>
      <column type="actions" width="-1" hidden="1"/>
      <column type="field" width="-1" name="gid" hidden="0"/>
      <column type="field" width="-1" name="figura" hidden="0"/>
      <column type="field" width="-1" name="nombre" hidden="0"/>
    </columns>
  </attributetableconfig>
  <conditionalstyles>
    <rowstyles/>
    <fieldstyles/>
  </conditionalstyles>
  <storedexpressions/>
  <editform tolerant="1"></editform>
  <editforminit/>
  <editforminitcodesource>0</editforminitcodesource>
  <editforminitfilepath></editforminitfilepath>
  <editforminitcode><![CDATA[# -*- coding: utf-8 -*-
"""
QGIS forms can have a Python function that is called when the form is
opened.

Use this function to add extra logic to your forms.

Enter the name of the function in the "Python Init function"
field.
An example follows:
"""
from qgis.PyQt.QtWidgets import QWidget

def my_form_open(dialog, layer, feature):
	geom = feature.geometry()
	control = dialog.findChild(QWidget, "MyLineEdit")
]]></editforminitcode>
  <featformsuppress>0</featformsuppress>
  <editorlayout>generatedlayout</editorlayout>
  <editable>
    <field editable="1" name="CARACTER"/>
    <field editable="1" name="CODIGOESPA"/>
    <field editable="1" name="FEC_DECLA"/>
    <field editable="1" name="FEC_DEC_PR"/>
    <field editable="1" name="FEC_LIM_CA"/>
    <field editable="1" name="FEC_LIM_LI"/>
    <field editable="1" name="FIGURA"/>
    <field editable="1" name="FORMAT_LEG"/>
    <field editable="1" name="NOMBRE"/>
    <field editable="1" name="NOR_DECLA"/>
    <field editable="1" name="NOR_DEC_PR"/>
    <field editable="1" name="NOR_LIM_CA"/>
    <field editable="1" name="NOR_LIM_LI"/>
    <field editable="1" name="OBSERVAC"/>
    <field editable="1" name="SUPERFICIE"/>
    <field editable="1" name="SUP_MAR"/>
    <field editable="1" name="SUP_TER"/>
    <field editable="1" name="TIPO_FIGUR"/>
    <field editable="1" name="ZON_PRO"/>
    <field editable="1" name="figura"/>
    <field editable="1" name="gid"/>
    <field editable="1" name="nombre"/>
  </editable>
  <labelOnTop>
    <field labelOnTop="0" name="CARACTER"/>
    <field labelOnTop="0" name="CODIGOESPA"/>
    <field labelOnTop="0" name="FEC_DECLA"/>
    <field labelOnTop="0" name="FEC_DEC_PR"/>
    <field labelOnTop="0" name="FEC_LIM_CA"/>
    <field labelOnTop="0" name="FEC_LIM_LI"/>
    <field labelOnTop="0" name="FIGURA"/>
    <field labelOnTop="0" name="FORMAT_LEG"/>
    <field labelOnTop="0" name="NOMBRE"/>
    <field labelOnTop="0" name="NOR_DECLA"/>
    <field labelOnTop="0" name="NOR_DEC_PR"/>
    <field labelOnTop="0" name="NOR_LIM_CA"/>
    <field labelOnTop="0" name="NOR_LIM_LI"/>
    <field labelOnTop="0" name="OBSERVAC"/>
    <field labelOnTop="0" name="SUPERFICIE"/>
    <field labelOnTop="0" name="SUP_MAR"/>
    <field labelOnTop="0" name="SUP_TER"/>
    <field labelOnTop="0" name="TIPO_FIGUR"/>
    <field labelOnTop="0" name="ZON_PRO"/>
    <field labelOnTop="0" name="figura"/>
    <field labelOnTop="0" name="gid"/>
    <field labelOnTop="0" name="nombre"/>
  </labelOnTop>
  <dataDefinedFieldProperties/>
  <widgets/>
  <previewExpression>"nombre"</previewExpression>
  <mapTip></mapTip>
  <layerGeometryType>2</layerGeometryType>
</qgis>
