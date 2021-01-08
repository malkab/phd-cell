<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis maxScale="0" minScale="100000000" simplifyDrawingTol="1" simplifyMaxScale="1" version="3.14.1-Pi" simplifyAlgorithm="0" readOnly="0" simplifyLocal="1" styleCategories="AllStyleCategories" hasScaleBasedVisibilityFlag="0" labelsEnabled="0" simplifyDrawingHints="1">
  <flags>
    <Identifiable>1</Identifiable>
    <Removable>1</Removable>
    <Searchable>1</Searchable>
  </flags>
  <temporal startExpression="" fixedDuration="0" accumulate="0" endField="" enabled="0" mode="0" startField="" endExpression="" durationField="" durationUnit="min">
    <fixedRange>
      <start></start>
      <end></end>
    </fixedRange>
  </temporal>
  <renderer-v2 forceraster="0" type="singleSymbol" enableorderby="0" symbollevels="0">
    <symbols>
      <symbol force_rhr="0" alpha="1" clip_to_extent="1" type="fill" name="0">
        <layer locked="0" enabled="1" class="SimpleFill" pass="0">
          <prop k="border_width_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="color" v="64,64,64,255"/>
          <prop k="joinstyle" v="bevel"/>
          <prop k="offset" v="0,0"/>
          <prop k="offset_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="offset_unit" v="MM"/>
          <prop k="outline_color" v="92,92,92,255"/>
          <prop k="outline_style" v="solid"/>
          <prop k="outline_width" v="0.4"/>
          <prop k="outline_width_unit" v="MM"/>
          <prop k="style" v="no"/>
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
    <DiagramCategory backgroundAlpha="255" barWidth="5" spacing="5" penAlpha="255" spacingUnit="MM" penWidth="0" sizeType="MM" opacity="1" maxScaleDenominator="1e+08" minScaleDenominator="0" minimumSize="0" scaleBasedVisibility="0" height="15" labelPlacementMethod="XHeight" spacingUnitScale="3x:0,0,0,0,0,0" penColor="#000000" sizeScale="3x:0,0,0,0,0,0" showAxis="1" enabled="0" width="15" direction="0" scaleDependency="Area" diagramOrientation="Up" lineSizeType="MM" rotationOffset="270" backgroundColor="#ffffff" lineSizeScale="3x:0,0,0,0,0,0">
      <fontProperties style="" description="Ubuntu,11,-1,5,50,0,0,0,0,0"/>
      <axisSymbol>
        <symbol force_rhr="0" alpha="1" clip_to_extent="1" type="line" name="">
          <layer locked="0" enabled="1" class="SimpleLine" pass="0">
            <prop k="capstyle" v="square"/>
            <prop k="customdash" v="5;2"/>
            <prop k="customdash_map_unit_scale" v="3x:0,0,0,0,0,0"/>
            <prop k="customdash_unit" v="MM"/>
            <prop k="draw_inside_polygon" v="0"/>
            <prop k="joinstyle" v="bevel"/>
            <prop k="line_color" v="35,35,35,255"/>
            <prop k="line_style" v="solid"/>
            <prop k="line_width" v="0.26"/>
            <prop k="line_width_unit" v="MM"/>
            <prop k="offset" v="0"/>
            <prop k="offset_map_unit_scale" v="3x:0,0,0,0,0,0"/>
            <prop k="offset_unit" v="MM"/>
            <prop k="ring_filter" v="0"/>
            <prop k="use_custom_dash" v="0"/>
            <prop k="width_map_unit_scale" v="3x:0,0,0,0,0,0"/>
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
  <DiagramLayerSettings zIndex="0" showAll="1" dist="0" linePlacementFlags="18" priority="0" obstacle="0" placement="1">
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
    <field name="codigo_nd">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="cod_pob">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="nombre_pob">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="nivel">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="estado">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
  </fieldConfiguration>
  <aliases>
    <alias name="" field="gid" index="0"/>
    <alias name="" field="codigo_nd" index="1"/>
    <alias name="" field="cod_pob" index="2"/>
    <alias name="" field="nombre_pob" index="3"/>
    <alias name="" field="nivel" index="4"/>
    <alias name="" field="estado" index="5"/>
  </aliases>
  <excludeAttributesWMS/>
  <excludeAttributesWFS/>
  <defaults>
    <default expression="" field="gid" applyOnUpdate="0"/>
    <default expression="" field="codigo_nd" applyOnUpdate="0"/>
    <default expression="" field="cod_pob" applyOnUpdate="0"/>
    <default expression="" field="nombre_pob" applyOnUpdate="0"/>
    <default expression="" field="nivel" applyOnUpdate="0"/>
    <default expression="" field="estado" applyOnUpdate="0"/>
  </defaults>
  <constraints>
    <constraint unique_strength="1" constraints="3" field="gid" exp_strength="0" notnull_strength="1"/>
    <constraint unique_strength="0" constraints="0" field="codigo_nd" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="cod_pob" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="nombre_pob" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="nivel" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="estado" exp_strength="0" notnull_strength="0"/>
  </constraints>
  <constraintExpressions>
    <constraint desc="" field="gid" exp=""/>
    <constraint desc="" field="codigo_nd" exp=""/>
    <constraint desc="" field="cod_pob" exp=""/>
    <constraint desc="" field="nombre_pob" exp=""/>
    <constraint desc="" field="nivel" exp=""/>
    <constraint desc="" field="estado" exp=""/>
  </constraintExpressions>
  <expressionfields/>
  <attributeactions>
    <defaultAction value="{00000000-0000-0000-0000-000000000000}" key="Canvas"/>
  </attributeactions>
  <attributetableconfig actionWidgetStyle="dropDown" sortExpression="" sortOrder="0">
    <columns>
      <column width="-1" type="field" name="gid" hidden="0"/>
      <column width="-1" type="field" name="codigo_nd" hidden="0"/>
      <column width="-1" type="field" name="cod_pob" hidden="0"/>
      <column width="-1" type="field" name="nombre_pob" hidden="0"/>
      <column width="-1" type="field" name="nivel" hidden="0"/>
      <column width="-1" type="field" name="estado" hidden="0"/>
      <column width="-1" type="actions" hidden="1"/>
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
    <field editable="1" name="cod_pob"/>
    <field editable="1" name="codigo_nd"/>
    <field editable="1" name="estado"/>
    <field editable="1" name="gid"/>
    <field editable="1" name="nivel"/>
    <field editable="1" name="nombre_pob"/>
  </editable>
  <labelOnTop>
    <field labelOnTop="0" name="cod_pob"/>
    <field labelOnTop="0" name="codigo_nd"/>
    <field labelOnTop="0" name="estado"/>
    <field labelOnTop="0" name="gid"/>
    <field labelOnTop="0" name="nivel"/>
    <field labelOnTop="0" name="nombre_pob"/>
  </labelOnTop>
  <dataDefinedFieldProperties/>
  <widgets/>
  <previewExpression>"nombre_pob"</previewExpression>
  <mapTip></mapTip>
  <layerGeometryType>2</layerGeometryType>
</qgis>
