<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis simplifyDrawingTol="1" simplifyDrawingHints="1" maxScale="0" labelsEnabled="0" hasScaleBasedVisibilityFlag="1" minScale="250001" version="3.8.3-Zanzibar" simplifyLocal="1" styleCategories="AllStyleCategories" simplifyMaxScale="1" readOnly="0" simplifyAlgorithm="0">
  <flags>
    <Identifiable>1</Identifiable>
    <Removable>1</Removable>
    <Searchable>1</Searchable>
  </flags>
  <renderer-v2 type="singleSymbol" symbollevels="0" enableorderby="0" forceraster="0">
    <symbols>
      <symbol type="fill" alpha="1" force_rhr="0" name="0" clip_to_extent="1">
        <layer enabled="1" class="SimpleFill" locked="0" pass="0">
          <prop k="border_width_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="color" v="171,171,171,255"/>
          <prop k="joinstyle" v="bevel"/>
          <prop k="offset" v="0,0"/>
          <prop k="offset_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="offset_unit" v="MM"/>
          <prop k="outline_color" v="84,84,84,255"/>
          <prop k="outline_style" v="solid"/>
          <prop k="outline_width" v="0.26"/>
          <prop k="outline_width_unit" v="MM"/>
          <prop k="style" v="solid"/>
          <data_defined_properties>
            <Option type="Map">
              <Option type="QString" value="" name="name"/>
              <Option name="properties"/>
              <Option type="QString" value="collection" name="type"/>
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
  <SingleCategoryDiagramRenderer diagramType="Histogram" attributeLegend="1">
    <DiagramCategory sizeScale="3x:0,0,0,0,0,0" labelPlacementMethod="XHeight" scaleBasedVisibility="0" minScaleDenominator="0" sizeType="MM" barWidth="5" enabled="0" rotationOffset="270" penAlpha="255" maxScaleDenominator="1e+08" height="15" lineSizeScale="3x:0,0,0,0,0,0" backgroundAlpha="255" width="15" penWidth="0" minimumSize="0" backgroundColor="#ffffff" scaleDependency="Area" diagramOrientation="Up" penColor="#000000" opacity="1" lineSizeType="MM">
      <fontProperties style="" description=".AppleSystemUIFont,13,-1,5,50,0,0,0,0,0"/>
    </DiagramCategory>
  </SingleCategoryDiagramRenderer>
  <DiagramLayerSettings priority="0" linePlacementFlags="18" zIndex="0" showAll="1" dist="0" obstacle="0" placement="1">
    <properties>
      <Option type="Map">
        <Option type="QString" value="" name="name"/>
        <Option name="properties"/>
        <Option type="QString" value="collection" name="type"/>
      </Option>
    </properties>
  </DiagramLayerSettings>
  <geometryOptions geometryPrecision="0" removeDuplicateNodes="0">
    <activeChecks/>
    <checkConfiguration/>
  </geometryOptions>
  <fieldConfiguration>
    <field name="gid">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="num_total_hic">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="num_hic_prioritarios">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="num_hic_prioritarios_propuestos">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="num_hic_no_prioritarios">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="num_hic_no_prioritarios_propuestos">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="codigos">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="labels">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
  </fieldConfiguration>
  <aliases>
    <alias field="gid" name="" index="0"/>
    <alias field="num_total_hic" name="" index="1"/>
    <alias field="num_hic_prioritarios" name="" index="2"/>
    <alias field="num_hic_prioritarios_propuestos" name="" index="3"/>
    <alias field="num_hic_no_prioritarios" name="" index="4"/>
    <alias field="num_hic_no_prioritarios_propuestos" name="" index="5"/>
    <alias field="codigos" name="" index="6"/>
    <alias field="labels" name="" index="7"/>
  </aliases>
  <excludeAttributesWMS/>
  <excludeAttributesWFS/>
  <defaults>
    <default field="gid" applyOnUpdate="0" expression=""/>
    <default field="num_total_hic" applyOnUpdate="0" expression=""/>
    <default field="num_hic_prioritarios" applyOnUpdate="0" expression=""/>
    <default field="num_hic_prioritarios_propuestos" applyOnUpdate="0" expression=""/>
    <default field="num_hic_no_prioritarios" applyOnUpdate="0" expression=""/>
    <default field="num_hic_no_prioritarios_propuestos" applyOnUpdate="0" expression=""/>
    <default field="codigos" applyOnUpdate="0" expression=""/>
    <default field="labels" applyOnUpdate="0" expression=""/>
  </defaults>
  <constraints>
    <constraint field="gid" constraints="3" unique_strength="1" exp_strength="0" notnull_strength="1"/>
    <constraint field="num_total_hic" constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0"/>
    <constraint field="num_hic_prioritarios" constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0"/>
    <constraint field="num_hic_prioritarios_propuestos" constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0"/>
    <constraint field="num_hic_no_prioritarios" constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0"/>
    <constraint field="num_hic_no_prioritarios_propuestos" constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0"/>
    <constraint field="codigos" constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0"/>
    <constraint field="labels" constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0"/>
  </constraints>
  <constraintExpressions>
    <constraint field="gid" desc="" exp=""/>
    <constraint field="num_total_hic" desc="" exp=""/>
    <constraint field="num_hic_prioritarios" desc="" exp=""/>
    <constraint field="num_hic_prioritarios_propuestos" desc="" exp=""/>
    <constraint field="num_hic_no_prioritarios" desc="" exp=""/>
    <constraint field="num_hic_no_prioritarios_propuestos" desc="" exp=""/>
    <constraint field="codigos" desc="" exp=""/>
    <constraint field="labels" desc="" exp=""/>
  </constraintExpressions>
  <expressionfields/>
  <attributeactions>
    <defaultAction value="{00000000-0000-0000-0000-000000000000}" key="Canvas"/>
  </attributeactions>
  <attributetableconfig sortOrder="0" actionWidgetStyle="dropDown" sortExpression="">
    <columns>
      <column type="field" name="gid" hidden="0" width="-1"/>
      <column type="field" name="num_total_hic" hidden="0" width="-1"/>
      <column type="field" name="num_hic_prioritarios" hidden="0" width="-1"/>
      <column type="field" name="num_hic_prioritarios_propuestos" hidden="0" width="-1"/>
      <column type="field" name="num_hic_no_prioritarios" hidden="0" width="-1"/>
      <column type="field" name="num_hic_no_prioritarios_propuestos" hidden="0" width="-1"/>
      <column type="field" name="codigos" hidden="0" width="-1"/>
      <column type="field" name="labels" hidden="0" width="-1"/>
      <column type="actions" hidden="1" width="-1"/>
    </columns>
  </attributetableconfig>
  <conditionalstyles>
    <rowstyles/>
    <fieldstyles/>
  </conditionalstyles>
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
    <field editable="1" name="codigos"/>
    <field editable="1" name="gid"/>
    <field editable="1" name="labels"/>
    <field editable="1" name="num_hic_no_prioritarios"/>
    <field editable="1" name="num_hic_no_prioritarios_propuestos"/>
    <field editable="1" name="num_hic_prioritarios"/>
    <field editable="1" name="num_hic_prioritarios_propuestos"/>
    <field editable="1" name="num_total_hic"/>
  </editable>
  <labelOnTop>
    <field labelOnTop="0" name="codigos"/>
    <field labelOnTop="0" name="gid"/>
    <field labelOnTop="0" name="labels"/>
    <field labelOnTop="0" name="num_hic_no_prioritarios"/>
    <field labelOnTop="0" name="num_hic_no_prioritarios_propuestos"/>
    <field labelOnTop="0" name="num_hic_prioritarios"/>
    <field labelOnTop="0" name="num_hic_prioritarios_propuestos"/>
    <field labelOnTop="0" name="num_total_hic"/>
  </labelOnTop>
  <widgets/>
  <previewExpression>gid</previewExpression>
  <mapTip></mapTip>
  <layerGeometryType>2</layerGeometryType>
</qgis>
