<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis hasScaleBasedVisibilityFlag="0" maxScale="0" styleCategories="AllStyleCategories" readOnly="0" simplifyMaxScale="1" minScale="100000000" labelsEnabled="0" simplifyAlgorithm="0" simplifyDrawingHints="1" version="3.14.1-Pi" simplifyLocal="1" simplifyDrawingTol="1">
  <flags>
    <Identifiable>1</Identifiable>
    <Removable>1</Removable>
    <Searchable>1</Searchable>
  </flags>
  <temporal endField="" mode="0" startField="" enabled="0" endExpression="" fixedDuration="0" durationField="" startExpression="" accumulate="0" durationUnit="min">
    <fixedRange>
      <start></start>
      <end></end>
    </fixedRange>
  </temporal>
  <renderer-v2 attr="pop_cluster" forceraster="0" type="categorizedSymbol" enableorderby="0" symbollevels="0">
    <categories>
      <category value="0" symbol="0" label="Índices de dependencia equilibrados, poca dependencia anciana" render="true"/>
      <category value="1" symbol="1" label="Desequilibrio dependencia anciana severa" render="true"/>
      <category value="2" symbol="2" label="Desequilibrio dependencia anciana baja" render="true"/>
    </categories>
    <symbols>
      <symbol clip_to_extent="1" type="fill" alpha="1" force_rhr="0" name="0">
        <layer class="SimpleFill" enabled="1" pass="0" locked="0">
          <prop v="3x:0,0,0,0,0,0" k="border_width_map_unit_scale"/>
          <prop v="91,133,231,255" k="color"/>
          <prop v="bevel" k="joinstyle"/>
          <prop v="0,0" k="offset"/>
          <prop v="3x:0,0,0,0,0,0" k="offset_map_unit_scale"/>
          <prop v="MM" k="offset_unit"/>
          <prop v="35,35,35,255" k="outline_color"/>
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
      <symbol clip_to_extent="1" type="fill" alpha="1" force_rhr="0" name="1">
        <layer class="SimpleFill" enabled="1" pass="0" locked="0">
          <prop v="3x:0,0,0,0,0,0" k="border_width_map_unit_scale"/>
          <prop v="226,110,16,255" k="color"/>
          <prop v="bevel" k="joinstyle"/>
          <prop v="0,0" k="offset"/>
          <prop v="3x:0,0,0,0,0,0" k="offset_map_unit_scale"/>
          <prop v="MM" k="offset_unit"/>
          <prop v="35,35,35,255" k="outline_color"/>
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
      <symbol clip_to_extent="1" type="fill" alpha="1" force_rhr="0" name="2">
        <layer class="SimpleFill" enabled="1" pass="0" locked="0">
          <prop v="3x:0,0,0,0,0,0" k="border_width_map_unit_scale"/>
          <prop v="217,244,117,255" k="color"/>
          <prop v="bevel" k="joinstyle"/>
          <prop v="0,0" k="offset"/>
          <prop v="3x:0,0,0,0,0,0" k="offset_map_unit_scale"/>
          <prop v="MM" k="offset_unit"/>
          <prop v="35,35,35,255" k="outline_color"/>
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
    <source-symbol>
      <symbol clip_to_extent="1" type="fill" alpha="1" force_rhr="0" name="0">
        <layer class="SimpleFill" enabled="1" pass="0" locked="0">
          <prop v="3x:0,0,0,0,0,0" k="border_width_map_unit_scale"/>
          <prop v="125,139,143,255" k="color"/>
          <prop v="bevel" k="joinstyle"/>
          <prop v="0,0" k="offset"/>
          <prop v="3x:0,0,0,0,0,0" k="offset_map_unit_scale"/>
          <prop v="MM" k="offset_unit"/>
          <prop v="35,35,35,255" k="outline_color"/>
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
    </source-symbol>
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
    <DiagramCategory opacity="1" enabled="0" height="15" maxScaleDenominator="1e+08" minScaleDenominator="0" sizeScale="3x:0,0,0,0,0,0" labelPlacementMethod="XHeight" scaleDependency="Area" barWidth="5" spacingUnit="MM" rotationOffset="270" penWidth="0" sizeType="MM" lineSizeType="MM" penAlpha="255" spacingUnitScale="3x:0,0,0,0,0,0" scaleBasedVisibility="0" backgroundAlpha="255" penColor="#000000" spacing="5" lineSizeScale="3x:0,0,0,0,0,0" width="15" diagramOrientation="Up" showAxis="1" direction="0" minimumSize="0" backgroundColor="#ffffff">
      <fontProperties style="" description="Ubuntu,11,-1,5,50,0,0,0,0,0"/>
      <attribute color="#000000" label="" field=""/>
      <axisSymbol>
        <symbol clip_to_extent="1" type="line" alpha="1" force_rhr="0" name="">
          <layer class="SimpleLine" enabled="1" pass="0" locked="0">
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
  <DiagramLayerSettings priority="0" placement="1" linePlacementFlags="18" showAll="1" dist="0" obstacle="0" zIndex="0">
    <properties>
      <Option type="Map">
        <Option value="" type="QString" name="name"/>
        <Option name="properties"/>
        <Option value="collection" type="QString" name="type"/>
      </Option>
    </properties>
  </DiagramLayerSettings>
  <geometryOptions geometryPrecision="0" removeDuplicateNodes="0">
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
    <field name="grid_id">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="epsg">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="zoom">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="x">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="y">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="p18">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="p1864">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="p64">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ptotal">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="r0_18">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="r18_64">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="r64">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="pop_cluster">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="geom_4326">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
  </fieldConfiguration>
  <aliases>
    <alias index="0" field="grid_id" name=""/>
    <alias index="1" field="epsg" name=""/>
    <alias index="2" field="zoom" name=""/>
    <alias index="3" field="x" name=""/>
    <alias index="4" field="y" name=""/>
    <alias index="5" field="p18" name=""/>
    <alias index="6" field="p1864" name=""/>
    <alias index="7" field="p64" name=""/>
    <alias index="8" field="ptotal" name=""/>
    <alias index="9" field="r0_18" name=""/>
    <alias index="10" field="r18_64" name=""/>
    <alias index="11" field="r64" name=""/>
    <alias index="12" field="pop_cluster" name=""/>
    <alias index="13" field="geom_4326" name=""/>
  </aliases>
  <excludeAttributesWMS/>
  <excludeAttributesWFS/>
  <defaults>
    <default applyOnUpdate="0" expression="" field="grid_id"/>
    <default applyOnUpdate="0" expression="" field="epsg"/>
    <default applyOnUpdate="0" expression="" field="zoom"/>
    <default applyOnUpdate="0" expression="" field="x"/>
    <default applyOnUpdate="0" expression="" field="y"/>
    <default applyOnUpdate="0" expression="" field="p18"/>
    <default applyOnUpdate="0" expression="" field="p1864"/>
    <default applyOnUpdate="0" expression="" field="p64"/>
    <default applyOnUpdate="0" expression="" field="ptotal"/>
    <default applyOnUpdate="0" expression="" field="r0_18"/>
    <default applyOnUpdate="0" expression="" field="r18_64"/>
    <default applyOnUpdate="0" expression="" field="r64"/>
    <default applyOnUpdate="0" expression="" field="pop_cluster"/>
    <default applyOnUpdate="0" expression="" field="geom_4326"/>
  </defaults>
  <constraints>
    <constraint unique_strength="1" constraints="3" notnull_strength="1" exp_strength="0" field="grid_id"/>
    <constraint unique_strength="0" constraints="0" notnull_strength="0" exp_strength="0" field="epsg"/>
    <constraint unique_strength="0" constraints="0" notnull_strength="0" exp_strength="0" field="zoom"/>
    <constraint unique_strength="0" constraints="0" notnull_strength="0" exp_strength="0" field="x"/>
    <constraint unique_strength="0" constraints="0" notnull_strength="0" exp_strength="0" field="y"/>
    <constraint unique_strength="0" constraints="0" notnull_strength="0" exp_strength="0" field="p18"/>
    <constraint unique_strength="0" constraints="0" notnull_strength="0" exp_strength="0" field="p1864"/>
    <constraint unique_strength="0" constraints="0" notnull_strength="0" exp_strength="0" field="p64"/>
    <constraint unique_strength="0" constraints="0" notnull_strength="0" exp_strength="0" field="ptotal"/>
    <constraint unique_strength="0" constraints="0" notnull_strength="0" exp_strength="0" field="r0_18"/>
    <constraint unique_strength="0" constraints="0" notnull_strength="0" exp_strength="0" field="r18_64"/>
    <constraint unique_strength="0" constraints="0" notnull_strength="0" exp_strength="0" field="r64"/>
    <constraint unique_strength="0" constraints="0" notnull_strength="0" exp_strength="0" field="pop_cluster"/>
    <constraint unique_strength="0" constraints="0" notnull_strength="0" exp_strength="0" field="geom_4326"/>
  </constraints>
  <constraintExpressions>
    <constraint exp="" field="grid_id" desc=""/>
    <constraint exp="" field="epsg" desc=""/>
    <constraint exp="" field="zoom" desc=""/>
    <constraint exp="" field="x" desc=""/>
    <constraint exp="" field="y" desc=""/>
    <constraint exp="" field="p18" desc=""/>
    <constraint exp="" field="p1864" desc=""/>
    <constraint exp="" field="p64" desc=""/>
    <constraint exp="" field="ptotal" desc=""/>
    <constraint exp="" field="r0_18" desc=""/>
    <constraint exp="" field="r18_64" desc=""/>
    <constraint exp="" field="r64" desc=""/>
    <constraint exp="" field="pop_cluster" desc=""/>
    <constraint exp="" field="geom_4326" desc=""/>
  </constraintExpressions>
  <expressionfields/>
  <attributeactions>
    <defaultAction value="{00000000-0000-0000-0000-000000000000}" key="Canvas"/>
  </attributeactions>
  <attributetableconfig actionWidgetStyle="dropDown" sortExpression="" sortOrder="0">
    <columns>
      <column hidden="0" width="-1" type="field" name="grid_id"/>
      <column hidden="0" width="-1" type="field" name="epsg"/>
      <column hidden="0" width="-1" type="field" name="zoom"/>
      <column hidden="0" width="-1" type="field" name="x"/>
      <column hidden="0" width="-1" type="field" name="y"/>
      <column hidden="0" width="-1" type="field" name="p18"/>
      <column hidden="0" width="-1" type="field" name="p1864"/>
      <column hidden="0" width="-1" type="field" name="p64"/>
      <column hidden="0" width="-1" type="field" name="ptotal"/>
      <column hidden="0" width="-1" type="field" name="r64"/>
      <column hidden="0" width="-1" type="field" name="pop_cluster"/>
      <column hidden="0" width="-1" type="field" name="geom_4326"/>
      <column hidden="1" width="-1" type="actions"/>
      <column hidden="0" width="-1" type="field" name="r0_18"/>
      <column hidden="0" width="-1" type="field" name="r18_64"/>
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
    <field editable="1" name="epsg"/>
    <field editable="1" name="geom_4326"/>
    <field editable="1" name="grid_id"/>
    <field editable="1" name="p18"/>
    <field editable="1" name="p1864"/>
    <field editable="1" name="p64"/>
    <field editable="1" name="pop_cluster"/>
    <field editable="1" name="ptotal"/>
    <field editable="1" name="r0_18"/>
    <field editable="1" name="r18"/>
    <field editable="1" name="r1864"/>
    <field editable="1" name="r18_64"/>
    <field editable="1" name="r64"/>
    <field editable="1" name="x"/>
    <field editable="1" name="y"/>
    <field editable="1" name="zoom"/>
  </editable>
  <labelOnTop>
    <field labelOnTop="0" name="epsg"/>
    <field labelOnTop="0" name="geom_4326"/>
    <field labelOnTop="0" name="grid_id"/>
    <field labelOnTop="0" name="p18"/>
    <field labelOnTop="0" name="p1864"/>
    <field labelOnTop="0" name="p64"/>
    <field labelOnTop="0" name="pop_cluster"/>
    <field labelOnTop="0" name="ptotal"/>
    <field labelOnTop="0" name="r0_18"/>
    <field labelOnTop="0" name="r18"/>
    <field labelOnTop="0" name="r1864"/>
    <field labelOnTop="0" name="r18_64"/>
    <field labelOnTop="0" name="r64"/>
    <field labelOnTop="0" name="x"/>
    <field labelOnTop="0" name="y"/>
    <field labelOnTop="0" name="zoom"/>
  </labelOnTop>
  <dataDefinedFieldProperties/>
  <widgets/>
  <previewExpression>"grid_id"</previewExpression>
  <mapTip></mapTip>
  <layerGeometryType>2</layerGeometryType>
</qgis>
