<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis simplifyDrawingHints="1" version="3.8.3-Zanzibar" simplifyMaxScale="1" simplifyAlgorithm="0" readOnly="0" minScale="1e+08" hasScaleBasedVisibilityFlag="0" labelsEnabled="0" simplifyLocal="1" styleCategories="AllStyleCategories" maxScale="0" simplifyDrawingTol="1">
  <flags>
    <Identifiable>1</Identifiable>
    <Removable>1</Removable>
    <Searchable>1</Searchable>
  </flags>
  <renderer-v2 type="singleSymbol" enableorderby="0" forceraster="0" symbollevels="0">
    <symbols>
      <symbol type="fill" alpha="1" name="0" clip_to_extent="1" force_rhr="0">
        <layer locked="0" class="SimpleFill" pass="0" enabled="1">
          <prop k="border_width_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="color" v="229,182,54,255"/>
          <prop k="joinstyle" v="bevel"/>
          <prop k="offset" v="0,0"/>
          <prop k="offset_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="offset_unit" v="MM"/>
          <prop k="outline_color" v="171,98,98,255"/>
          <prop k="outline_style" v="solid"/>
          <prop k="outline_width" v="0.1"/>
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
  <SingleCategoryDiagramRenderer diagramType="Histogram" attributeLegend="1">
    <DiagramCategory opacity="1" sizeScale="3x:0,0,0,0,0,0" rotationOffset="270" labelPlacementMethod="XHeight" lineSizeScale="3x:0,0,0,0,0,0" backgroundAlpha="255" diagramOrientation="Up" scaleBasedVisibility="0" maxScaleDenominator="1e+08" penWidth="0" sizeType="MM" penColor="#000000" minimumSize="0" backgroundColor="#ffffff" enabled="0" width="15" minScaleDenominator="0" barWidth="5" penAlpha="255" lineSizeType="MM" height="15" scaleDependency="Area">
      <fontProperties style="" description=".AppleSystemUIFont,13,-1,5,50,0,0,0,0,0"/>
    </DiagramCategory>
  </SingleCategoryDiagramRenderer>
  <DiagramLayerSettings showAll="1" placement="1" dist="0" priority="0" obstacle="0" zIndex="0" linePlacementFlags="18">
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
    <field name="codigo">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="distrito">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="seccion">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="poblacion">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="cod_mun">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="municipio">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="provincia">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
  </fieldConfiguration>
  <aliases>
    <alias index="0" name="" field="gid"/>
    <alias index="1" name="" field="codigo"/>
    <alias index="2" name="" field="distrito"/>
    <alias index="3" name="" field="seccion"/>
    <alias index="4" name="" field="poblacion"/>
    <alias index="5" name="" field="cod_mun"/>
    <alias index="6" name="" field="municipio"/>
    <alias index="7" name="" field="provincia"/>
  </aliases>
  <excludeAttributesWMS/>
  <excludeAttributesWFS/>
  <defaults>
    <default applyOnUpdate="0" expression="" field="gid"/>
    <default applyOnUpdate="0" expression="" field="codigo"/>
    <default applyOnUpdate="0" expression="" field="distrito"/>
    <default applyOnUpdate="0" expression="" field="seccion"/>
    <default applyOnUpdate="0" expression="" field="poblacion"/>
    <default applyOnUpdate="0" expression="" field="cod_mun"/>
    <default applyOnUpdate="0" expression="" field="municipio"/>
    <default applyOnUpdate="0" expression="" field="provincia"/>
  </defaults>
  <constraints>
    <constraint constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0" field="gid"/>
    <constraint constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0" field="codigo"/>
    <constraint constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0" field="distrito"/>
    <constraint constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0" field="seccion"/>
    <constraint constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0" field="poblacion"/>
    <constraint constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0" field="cod_mun"/>
    <constraint constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0" field="municipio"/>
    <constraint constraints="0" unique_strength="0" exp_strength="0" notnull_strength="0" field="provincia"/>
  </constraints>
  <constraintExpressions>
    <constraint exp="" desc="" field="gid"/>
    <constraint exp="" desc="" field="codigo"/>
    <constraint exp="" desc="" field="distrito"/>
    <constraint exp="" desc="" field="seccion"/>
    <constraint exp="" desc="" field="poblacion"/>
    <constraint exp="" desc="" field="cod_mun"/>
    <constraint exp="" desc="" field="municipio"/>
    <constraint exp="" desc="" field="provincia"/>
  </constraintExpressions>
  <expressionfields/>
  <attributeactions>
    <defaultAction value="{00000000-0000-0000-0000-000000000000}" key="Canvas"/>
  </attributeactions>
  <attributetableconfig sortExpression="" sortOrder="0" actionWidgetStyle="dropDown">
    <columns>
      <column type="field" name="gid" width="-1" hidden="0"/>
      <column type="field" name="codigo" width="-1" hidden="0"/>
      <column type="field" name="distrito" width="-1" hidden="0"/>
      <column type="field" name="seccion" width="-1" hidden="0"/>
      <column type="field" name="poblacion" width="-1" hidden="0"/>
      <column type="field" name="cod_mun" width="-1" hidden="0"/>
      <column type="field" name="municipio" width="-1" hidden="0"/>
      <column type="field" name="provincia" width="-1" hidden="0"/>
      <column type="actions" width="-1" hidden="1"/>
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
    <field name="cod_mun" editable="1"/>
    <field name="codigo" editable="1"/>
    <field name="distrito" editable="1"/>
    <field name="gid" editable="1"/>
    <field name="municipio" editable="1"/>
    <field name="poblacion" editable="1"/>
    <field name="provincia" editable="1"/>
    <field name="seccion" editable="1"/>
  </editable>
  <labelOnTop>
    <field name="cod_mun" labelOnTop="0"/>
    <field name="codigo" labelOnTop="0"/>
    <field name="distrito" labelOnTop="0"/>
    <field name="gid" labelOnTop="0"/>
    <field name="municipio" labelOnTop="0"/>
    <field name="poblacion" labelOnTop="0"/>
    <field name="provincia" labelOnTop="0"/>
    <field name="seccion" labelOnTop="0"/>
  </labelOnTop>
  <widgets/>
  <previewExpression>gid</previewExpression>
  <mapTip></mapTip>
  <layerGeometryType>2</layerGeometryType>
</qgis>
