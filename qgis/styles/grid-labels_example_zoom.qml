<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis simplifyAlgorithm="0" minScale="100000000" styleCategories="AllStyleCategories" simplifyMaxScale="1" simplifyDrawingHints="1" version="3.14.1-Pi" maxScale="0" simplifyLocal="1" readOnly="0" simplifyDrawingTol="1" hasScaleBasedVisibilityFlag="0" labelsEnabled="1">
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
          <prop v="229,182,54,0" k="color"/>
          <prop v="bevel" k="joinstyle"/>
          <prop v="0,0" k="offset"/>
          <prop v="3x:0,0,0,0,0,0" k="offset_map_unit_scale"/>
          <prop v="MM" k="offset_unit"/>
          <prop v="187,7,10,255" k="outline_color"/>
          <prop v="no" k="outline_style"/>
          <prop v="0.5" k="outline_width"/>
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
  <labeling type="rule-based">
    <rules key="{0e6fec07-455a-4b0d-a00c-44edcc0bdab2}">
      <rule filter=" &quot;zoom&quot; = 0" key="{e27713a9-8be4-4445-87bf-9808c04872db}">
        <settings calloutType="simple">
          <text-style blendMode="0" multilineHeight="1" fontWordSpacing="0" fontCapitals="0" textOpacity="1" namedStyle="Regular" allowHtml="0" fontKerning="1" isExpression="1" textOrientation="horizontal" textColor="0,0,0,255" previewBkgrdColor="255,255,255,255" fieldName="'('  || &quot;zoom&quot; || ',' || &quot;x&quot;   || ',' || &quot;y&quot; || ')' " fontSize="12" fontWeight="50" fontSizeUnit="Point" fontItalic="0" fontLetterSpacing="0" fontStrikeout="0" fontFamily="Ubuntu" fontSizeMapUnitScale="3x:0,0,0,0,0,0" fontUnderline="0" useSubstitutions="0">
            <text-buffer bufferDraw="1" bufferSize="1" bufferBlendMode="0" bufferSizeUnits="MM" bufferSizeMapUnitScale="3x:0,0,0,0,0,0" bufferNoFill="1" bufferJoinStyle="128" bufferColor="255,255,255,255" bufferOpacity="1"/>
            <text-mask maskSizeUnits="MM" maskedSymbolLayers="" maskType="0" maskEnabled="0" maskSize="0" maskSizeMapUnitScale="3x:0,0,0,0,0,0" maskJoinStyle="128" maskOpacity="1"/>
            <background shapeOffsetX="0" shapeSizeType="0" shapeBorderWidthUnit="MM" shapeOffsetY="0" shapeRadiiY="0" shapeFillColor="255,255,255,255" shapeSizeX="0" shapeBorderWidthMapUnitScale="3x:0,0,0,0,0,0" shapeJoinStyle="64" shapeBlendMode="0" shapeBorderColor="128,128,128,255" shapeType="0" shapeSVGFile="" shapeRadiiMapUnitScale="3x:0,0,0,0,0,0" shapeRadiiUnit="MM" shapeBorderWidth="0" shapeOffsetUnit="MM" shapeRadiiX="0" shapeRotationType="0" shapeRotation="0" shapeSizeY="0" shapeDraw="0" shapeOffsetMapUnitScale="3x:0,0,0,0,0,0" shapeSizeMapUnitScale="3x:0,0,0,0,0,0" shapeOpacity="1" shapeSizeUnit="MM">
              <symbol force_rhr="0" name="markerSymbol" clip_to_extent="1" alpha="1" type="marker">
                <layer locked="0" enabled="1" pass="0" class="SimpleMarker">
                  <prop v="0" k="angle"/>
                  <prop v="141,90,153,255" k="color"/>
                  <prop v="1" k="horizontal_anchor_point"/>
                  <prop v="bevel" k="joinstyle"/>
                  <prop v="circle" k="name"/>
                  <prop v="0,0" k="offset"/>
                  <prop v="3x:0,0,0,0,0,0" k="offset_map_unit_scale"/>
                  <prop v="MM" k="offset_unit"/>
                  <prop v="35,35,35,255" k="outline_color"/>
                  <prop v="solid" k="outline_style"/>
                  <prop v="0" k="outline_width"/>
                  <prop v="3x:0,0,0,0,0,0" k="outline_width_map_unit_scale"/>
                  <prop v="MM" k="outline_width_unit"/>
                  <prop v="diameter" k="scale_method"/>
                  <prop v="2" k="size"/>
                  <prop v="3x:0,0,0,0,0,0" k="size_map_unit_scale"/>
                  <prop v="MM" k="size_unit"/>
                  <prop v="1" k="vertical_anchor_point"/>
                  <data_defined_properties>
                    <Option type="Map">
                      <Option value="" name="name" type="QString"/>
                      <Option name="properties"/>
                      <Option value="collection" name="type" type="QString"/>
                    </Option>
                  </data_defined_properties>
                </layer>
              </symbol>
            </background>
            <shadow shadowOffsetAngle="135" shadowRadiusMapUnitScale="3x:0,0,0,0,0,0" shadowRadiusAlphaOnly="0" shadowRadiusUnit="MM" shadowOpacity="0.7" shadowColor="0,0,0,255" shadowOffsetUnit="MM" shadowRadius="1.5" shadowScale="100" shadowOffsetMapUnitScale="3x:0,0,0,0,0,0" shadowUnder="0" shadowOffsetDist="1" shadowOffsetGlobal="1" shadowDraw="1" shadowBlendMode="6"/>
            <dd_properties>
              <Option type="Map">
                <Option value="" name="name" type="QString"/>
                <Option name="properties"/>
                <Option value="collection" name="type" type="QString"/>
              </Option>
            </dd_properties>
            <substitutions/>
          </text-style>
          <text-format rightDirectionSymbol=">" wrapChar="" useMaxLineLengthForAutoWrap="1" leftDirectionSymbol="&lt;" formatNumbers="0" placeDirectionSymbol="0" autoWrapLength="0" decimals="3" reverseDirectionSymbol="0" addDirectionSymbol="0" plussign="0" multilineAlign="0"/>
          <placement yOffset="0" repeatDistanceUnits="MM" geometryGeneratorEnabled="0" polygonPlacementFlags="2" predefinedPositionOrder="TR,TL,BR,BL,R,L,TSR,BSR" distUnits="MM" overrunDistanceUnit="MM" labelOffsetMapUnitScale="3x:0,0,0,0,0,0" centroidWhole="0" centroidInside="0" placement="1" maxCurvedCharAngleIn="25" xOffset="0" offsetType="0" rotationAngle="0" repeatDistanceMapUnitScale="3x:0,0,0,0,0,0" geometryGenerator="" layerType="PolygonGeometry" quadOffset="4" placementFlags="10" geometryGeneratorType="PointGeometry" distMapUnitScale="3x:0,0,0,0,0,0" priority="5" offsetUnits="MM" preserveRotation="1" overrunDistance="0" dist="0" fitInPolygonOnly="0" repeatDistance="0" overrunDistanceMapUnitScale="3x:0,0,0,0,0,0" maxCurvedCharAngleOut="-25"/>
          <rendering mergeLines="0" obstacleType="0" upsidedownLabels="0" fontLimitPixelSize="0" obstacle="1" limitNumLabels="0" fontMaxPixelSize="10000" maxNumLabels="2000" zIndex="0" obstacleFactor="1" drawLabels="1" minFeatureSize="0" labelPerPart="0" displayAll="0" scaleMin="0" scaleMax="0" scaleVisibility="0" fontMinPixelSize="3"/>
          <dd_properties>
            <Option type="Map">
              <Option value="" name="name" type="QString"/>
              <Option name="properties"/>
              <Option value="collection" name="type" type="QString"/>
            </Option>
          </dd_properties>
          <callout type="simple">
            <Option type="Map">
              <Option value="pole_of_inaccessibility" name="anchorPoint" type="QString"/>
              <Option name="ddProperties" type="Map">
                <Option value="" name="name" type="QString"/>
                <Option name="properties"/>
                <Option value="collection" name="type" type="QString"/>
              </Option>
              <Option value="false" name="drawToAllParts" type="bool"/>
              <Option value="0" name="enabled" type="QString"/>
              <Option value="point_on_exterior" name="labelAnchorPoint" type="QString"/>
              <Option value="&lt;symbol force_rhr=&quot;0&quot; name=&quot;symbol&quot; clip_to_extent=&quot;1&quot; alpha=&quot;1&quot; type=&quot;line&quot;>&lt;layer locked=&quot;0&quot; enabled=&quot;1&quot; pass=&quot;0&quot; class=&quot;SimpleLine&quot;>&lt;prop v=&quot;square&quot; k=&quot;capstyle&quot;/>&lt;prop v=&quot;5;2&quot; k=&quot;customdash&quot;/>&lt;prop v=&quot;3x:0,0,0,0,0,0&quot; k=&quot;customdash_map_unit_scale&quot;/>&lt;prop v=&quot;MM&quot; k=&quot;customdash_unit&quot;/>&lt;prop v=&quot;0&quot; k=&quot;draw_inside_polygon&quot;/>&lt;prop v=&quot;bevel&quot; k=&quot;joinstyle&quot;/>&lt;prop v=&quot;60,60,60,255&quot; k=&quot;line_color&quot;/>&lt;prop v=&quot;solid&quot; k=&quot;line_style&quot;/>&lt;prop v=&quot;0.3&quot; k=&quot;line_width&quot;/>&lt;prop v=&quot;MM&quot; k=&quot;line_width_unit&quot;/>&lt;prop v=&quot;0&quot; k=&quot;offset&quot;/>&lt;prop v=&quot;3x:0,0,0,0,0,0&quot; k=&quot;offset_map_unit_scale&quot;/>&lt;prop v=&quot;MM&quot; k=&quot;offset_unit&quot;/>&lt;prop v=&quot;0&quot; k=&quot;ring_filter&quot;/>&lt;prop v=&quot;0&quot; k=&quot;use_custom_dash&quot;/>&lt;prop v=&quot;3x:0,0,0,0,0,0&quot; k=&quot;width_map_unit_scale&quot;/>&lt;data_defined_properties>&lt;Option type=&quot;Map&quot;>&lt;Option value=&quot;&quot; name=&quot;name&quot; type=&quot;QString&quot;/>&lt;Option name=&quot;properties&quot;/>&lt;Option value=&quot;collection&quot; name=&quot;type&quot; type=&quot;QString&quot;/>&lt;/Option>&lt;/data_defined_properties>&lt;/layer>&lt;/symbol>" name="lineSymbol" type="QString"/>
              <Option value="0" name="minLength" type="double"/>
              <Option value="3x:0,0,0,0,0,0" name="minLengthMapUnitScale" type="QString"/>
              <Option value="MM" name="minLengthUnit" type="QString"/>
              <Option value="0" name="offsetFromAnchor" type="double"/>
              <Option value="3x:0,0,0,0,0,0" name="offsetFromAnchorMapUnitScale" type="QString"/>
              <Option value="MM" name="offsetFromAnchorUnit" type="QString"/>
              <Option value="0" name="offsetFromLabel" type="double"/>
              <Option value="3x:0,0,0,0,0,0" name="offsetFromLabelMapUnitScale" type="QString"/>
              <Option value="MM" name="offsetFromLabelUnit" type="QString"/>
            </Option>
          </callout>
        </settings>
      </rule>
    </rules>
  </labeling>
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
    <field name="data">
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
    <alias field="grid_id" index="0" name=""/>
    <alias field="epsg" index="1" name=""/>
    <alias field="zoom" index="2" name=""/>
    <alias field="x" index="3" name=""/>
    <alias field="y" index="4" name=""/>
    <alias field="data" index="5" name=""/>
    <alias field="geom_4326" index="6" name=""/>
  </aliases>
  <excludeAttributesWMS/>
  <excludeAttributesWFS/>
  <defaults>
    <default field="grid_id" expression="" applyOnUpdate="0"/>
    <default field="epsg" expression="" applyOnUpdate="0"/>
    <default field="zoom" expression="" applyOnUpdate="0"/>
    <default field="x" expression="" applyOnUpdate="0"/>
    <default field="y" expression="" applyOnUpdate="0"/>
    <default field="data" expression="" applyOnUpdate="0"/>
    <default field="geom_4326" expression="" applyOnUpdate="0"/>
  </defaults>
  <constraints>
    <constraint field="grid_id" constraints="1" unique_strength="0" notnull_strength="1" exp_strength="0"/>
    <constraint field="epsg" constraints="0" unique_strength="0" notnull_strength="0" exp_strength="0"/>
    <constraint field="zoom" constraints="1" unique_strength="0" notnull_strength="1" exp_strength="0"/>
    <constraint field="x" constraints="1" unique_strength="0" notnull_strength="1" exp_strength="0"/>
    <constraint field="y" constraints="1" unique_strength="0" notnull_strength="1" exp_strength="0"/>
    <constraint field="data" constraints="0" unique_strength="0" notnull_strength="0" exp_strength="0"/>
    <constraint field="geom_4326" constraints="0" unique_strength="0" notnull_strength="0" exp_strength="0"/>
  </constraints>
  <constraintExpressions>
    <constraint field="grid_id" exp="" desc=""/>
    <constraint field="epsg" exp="" desc=""/>
    <constraint field="zoom" exp="" desc=""/>
    <constraint field="x" exp="" desc=""/>
    <constraint field="y" exp="" desc=""/>
    <constraint field="data" exp="" desc=""/>
    <constraint field="geom_4326" exp="" desc=""/>
  </constraintExpressions>
  <expressionfields/>
  <attributeactions>
    <defaultAction value="{00000000-0000-0000-0000-000000000000}" key="Canvas"/>
  </attributeactions>
  <attributetableconfig sortExpression="" actionWidgetStyle="dropDown" sortOrder="0">
    <columns>
      <column type="actions" hidden="1" width="-1"/>
      <column name="x" type="field" hidden="0" width="-1"/>
      <column name="y" type="field" hidden="0" width="-1"/>
      <column name="grid_id" type="field" hidden="0" width="-1"/>
      <column name="epsg" type="field" hidden="0" width="-1"/>
      <column name="zoom" type="field" hidden="0" width="-1"/>
      <column name="data" type="field" hidden="0" width="-1"/>
      <column name="geom_4326" type="field" hidden="0" width="-1"/>
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
    <field name="data" editable="1"/>
    <field name="epsg" editable="1"/>
    <field name="geom_4326" editable="1"/>
    <field name="gid" editable="1"/>
    <field name="grid_id" editable="1"/>
    <field name="x" editable="1"/>
    <field name="y" editable="1"/>
    <field name="zoom" editable="1"/>
  </editable>
  <labelOnTop>
    <field labelOnTop="0" name="data"/>
    <field labelOnTop="0" name="epsg"/>
    <field labelOnTop="0" name="geom_4326"/>
    <field labelOnTop="0" name="gid"/>
    <field labelOnTop="0" name="grid_id"/>
    <field labelOnTop="0" name="x"/>
    <field labelOnTop="0" name="y"/>
    <field labelOnTop="0" name="zoom"/>
  </labelOnTop>
  <dataDefinedFieldProperties/>
  <widgets/>
  <previewExpression>gid</previewExpression>
  <mapTip></mapTip>
  <layerGeometryType>2</layerGeometryType>
</qgis>
