<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis simplifyAlgorithm="0" minScale="100000000" styleCategories="AllStyleCategories" simplifyMaxScale="1" simplifyDrawingHints="1" version="3.14.1-Pi" maxScale="0" simplifyLocal="1" readOnly="0" simplifyDrawingTol="1" hasScaleBasedVisibilityFlag="0" labelsEnabled="0">
  <flags>
    <Identifiable>1</Identifiable>
    <Removable>1</Removable>
    <Searchable>1</Searchable>
  </flags>
  <temporal accumulate="0" startField="" mode="0" enabled="0" endField="" endExpression="" durationField="" startExpression="" durationUnit="min" fixedDuration="0">
    <fixedRange>
      <start></start>
      <end></end>
    </fixedRange>
  </temporal>
  <renderer-v2 forceraster="0" symbollevels="0" enableorderby="0" type="singleSymbol">
    <symbols>
      <symbol force_rhr="0" name="0" clip_to_extent="1" alpha="1" type="fill">
        <layer locked="0" enabled="1" pass="0" class="SimpleFill">
          <prop v="3x:0,0,0,0,0,0" k="border_width_map_unit_scale"/>
          <prop v="164,113,88,255" k="color"/>
          <prop v="bevel" k="joinstyle"/>
          <prop v="0,0" k="offset"/>
          <prop v="3x:0,0,0,0,0,0" k="offset_map_unit_scale"/>
          <prop v="MM" k="offset_unit"/>
          <prop v="55,129,206,255" k="outline_color"/>
          <prop v="solid" k="outline_style"/>
          <prop v="1" k="outline_width"/>
          <prop v="MM" k="outline_width_unit"/>
          <prop v="no" k="style"/>
          <data_defined_properties>
            <Option type="Map">
              <Option value="" name="name" type="QString"/>
              <Option name="properties"/>
              <Option value="collection" name="type" type="QString"/>
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
    <DiagramCategory diagramOrientation="Up" direction="0" penColor="#000000" rotationOffset="270" opacity="1" spacingUnitScale="3x:0,0,0,0,0,0" barWidth="5" maxScaleDenominator="1e+08" lineSizeType="MM" lineSizeScale="3x:0,0,0,0,0,0" sizeType="MM" enabled="0" penWidth="0" backgroundAlpha="255" spacingUnit="MM" sizeScale="3x:0,0,0,0,0,0" backgroundColor="#ffffff" width="15" height="15" scaleDependency="Area" minimumSize="0" penAlpha="255" minScaleDenominator="0" labelPlacementMethod="XHeight" showAxis="1" spacing="5" scaleBasedVisibility="0">
      <fontProperties description="Ubuntu,11,-1,5,50,0,0,0,0,0" style=""/>
      <axisSymbol>
        <symbol force_rhr="0" name="" clip_to_extent="1" alpha="1" type="line">
          <layer locked="0" enabled="1" pass="0" class="SimpleLine">
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
                <Option value="" name="name" type="QString"/>
                <Option name="properties"/>
                <Option value="collection" name="type" type="QString"/>
              </Option>
            </data_defined_properties>
          </layer>
        </symbol>
      </axisSymbol>
    </DiagramCategory>
  </SingleCategoryDiagramRenderer>
  <DiagramLayerSettings dist="0" linePlacementFlags="18" obstacle="0" priority="0" zIndex="0" showAll="1" placement="1">
    <properties>
      <Option type="Map">
        <Option value="" name="name" type="QString"/>
        <Option name="properties"/>
        <Option value="collection" name="type" type="QString"/>
      </Option>
    </properties>
  </DiagramLayerSettings>
  <geometryOptions removeDuplicateNodes="0" geometryPrecision="0">
    <activeChecks/>
    <checkConfiguration type="Map">
      <Option name="QgsGeometryGapCheck" type="Map">
        <Option value="0" name="allowedGapsBuffer" type="double"/>
        <Option value="false" name="allowedGapsEnabled" type="bool"/>
        <Option value="" name="allowedGapsLayer" type="QString"/>
      </Option>
    </checkConfiguration>
  </geometryOptions>
  <referencedLayers/>
  <referencingLayers/>
  <fieldConfiguration>
    <field name="gridder_job_id">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="gridder_task_id">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="max_zoom_level">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="min_zoom_level">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="sql_area_retrieval">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
  </fieldConfiguration>
  <aliases>
    <alias field="gridder_job_id" index="0" name=""/>
    <alias field="gridder_task_id" index="1" name=""/>
    <alias field="max_zoom_level" index="2" name=""/>
    <alias field="min_zoom_level" index="3" name=""/>
    <alias field="sql_area_retrieval" index="4" name=""/>
  </aliases>
  <excludeAttributesWMS/>
  <excludeAttributesWFS/>
  <defaults>
    <default field="gridder_job_id" expression="" applyOnUpdate="0"/>
    <default field="gridder_task_id" expression="" applyOnUpdate="0"/>
    <default field="max_zoom_level" expression="" applyOnUpdate="0"/>
    <default field="min_zoom_level" expression="" applyOnUpdate="0"/>
    <default field="sql_area_retrieval" expression="" applyOnUpdate="0"/>
  </defaults>
  <constraints>
    <constraint field="gridder_job_id" constraints="3" unique_strength="1" notnull_strength="1" exp_strength="0"/>
    <constraint field="gridder_task_id" constraints="0" unique_strength="0" notnull_strength="0" exp_strength="0"/>
    <constraint field="max_zoom_level" constraints="0" unique_strength="0" notnull_strength="0" exp_strength="0"/>
    <constraint field="min_zoom_level" constraints="0" unique_strength="0" notnull_strength="0" exp_strength="0"/>
    <constraint field="sql_area_retrieval" constraints="0" unique_strength="0" notnull_strength="0" exp_strength="0"/>
  </constraints>
  <constraintExpressions>
    <constraint field="gridder_job_id" exp="" desc=""/>
    <constraint field="gridder_task_id" exp="" desc=""/>
    <constraint field="max_zoom_level" exp="" desc=""/>
    <constraint field="min_zoom_level" exp="" desc=""/>
    <constraint field="sql_area_retrieval" exp="" desc=""/>
  </constraintExpressions>
  <expressionfields/>
  <attributeactions>
    <defaultAction value="{00000000-0000-0000-0000-000000000000}" key="Canvas"/>
  </attributeactions>
  <attributetableconfig sortExpression="" actionWidgetStyle="dropDown" sortOrder="0">
    <columns>
      <column name="gridder_job_id" type="field" hidden="0" width="-1"/>
      <column name="gridder_task_id" type="field" hidden="0" width="-1"/>
      <column name="max_zoom_level" type="field" hidden="0" width="-1"/>
      <column name="min_zoom_level" type="field" hidden="0" width="-1"/>
      <column name="sql_area_retrieval" type="field" hidden="0" width="-1"/>
      <column type="actions" hidden="1" width="-1"/>
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
    <field name="gridder_job_id" editable="1"/>
    <field name="gridder_task_id" editable="1"/>
    <field name="max_zoom_level" editable="1"/>
    <field name="min_zoom_level" editable="1"/>
    <field name="sql_area_retrieval" editable="1"/>
  </editable>
  <labelOnTop>
    <field labelOnTop="0" name="gridder_job_id"/>
    <field labelOnTop="0" name="gridder_task_id"/>
    <field labelOnTop="0" name="max_zoom_level"/>
    <field labelOnTop="0" name="min_zoom_level"/>
    <field labelOnTop="0" name="sql_area_retrieval"/>
  </labelOnTop>
  <dataDefinedFieldProperties/>
  <widgets/>
  <previewExpression>"gridder_job_id"</previewExpression>
  <mapTip></mapTip>
  <layerGeometryType>2</layerGeometryType>
</qgis>
