<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis maxScale="0" minScale="100000000" simplifyDrawingTol="1" simplifyMaxScale="1" version="3.14.1-Pi" simplifyAlgorithm="0" readOnly="0" simplifyLocal="1" styleCategories="AllStyleCategories" hasScaleBasedVisibilityFlag="0" labelsEnabled="0" simplifyDrawingHints="0">
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
      <symbol force_rhr="0" alpha="1" clip_to_extent="1" type="marker" name="0">
        <layer locked="0" enabled="1" class="SimpleMarker" pass="0">
          <prop k="angle" v="0"/>
          <prop k="color" v="178,123,112,255"/>
          <prop k="horizontal_anchor_point" v="1"/>
          <prop k="joinstyle" v="bevel"/>
          <prop k="name" v="circle"/>
          <prop k="offset" v="0,0"/>
          <prop k="offset_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="offset_unit" v="MM"/>
          <prop k="outline_color" v="35,35,35,255"/>
          <prop k="outline_style" v="no"/>
          <prop k="outline_width" v="0"/>
          <prop k="outline_width_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="outline_width_unit" v="MM"/>
          <prop k="scale_method" v="diameter"/>
          <prop k="size" v="1"/>
          <prop k="size_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="size_unit" v="MM"/>
          <prop k="vertical_anchor_point" v="1"/>
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
  <DiagramLayerSettings zIndex="0" showAll="1" dist="0" linePlacementFlags="18" priority="0" obstacle="0" placement="0">
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
  <referencedLayers/>
  <referencingLayers/>
  <fieldConfiguration>
    <field name="id">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ptot02">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="pm02">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ph02">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e001502">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e166402">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e6502">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="esp02">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ue1502">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="mag02">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ams02">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="otr02">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ptot13">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="pm13">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ph13">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e001513">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e166413">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e6513">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="esp13">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ue1513">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="mag13">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ams13">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="otr13">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ptot14">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="pm14">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ph14">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e001514">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e166414">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e6514">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="esp14">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ue1514">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="mag14">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ams14">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="otr14">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ptot15">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="pm15">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ph15">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e001515">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e166415">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e6515">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="esp15">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ue1515">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="mag15">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ams15">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="otr15">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ptot16">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="pm16">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ph16">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e001516">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e166416">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e6516">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="esp16">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ue1516">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="mag16">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ams16">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="otr16">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ptot17">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="pm17">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ph17">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e001517">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e166417">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e6517">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="esp17">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ue1517">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="mag17">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ams17">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="otr17">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ptot18">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="pm18">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ph18">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e001518">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e166418">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="e6518">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="esp18">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ue1518">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="mag18">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ams18">
      <editWidget type="Range">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="otr18">
      <editWidget type="Range">
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
    <field name="municipio">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="nuc_pob">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="nuc_pob_nivel">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="sc_codigo">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="geom_cell">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
  </fieldConfiguration>
  <aliases>
    <alias name="" field="id" index="0"/>
    <alias name="" field="ptot02" index="1"/>
    <alias name="" field="pm02" index="2"/>
    <alias name="" field="ph02" index="3"/>
    <alias name="" field="e001502" index="4"/>
    <alias name="" field="e166402" index="5"/>
    <alias name="" field="e6502" index="6"/>
    <alias name="" field="esp02" index="7"/>
    <alias name="" field="ue1502" index="8"/>
    <alias name="" field="mag02" index="9"/>
    <alias name="" field="ams02" index="10"/>
    <alias name="" field="otr02" index="11"/>
    <alias name="" field="ptot13" index="12"/>
    <alias name="" field="pm13" index="13"/>
    <alias name="" field="ph13" index="14"/>
    <alias name="" field="e001513" index="15"/>
    <alias name="" field="e166413" index="16"/>
    <alias name="" field="e6513" index="17"/>
    <alias name="" field="esp13" index="18"/>
    <alias name="" field="ue1513" index="19"/>
    <alias name="" field="mag13" index="20"/>
    <alias name="" field="ams13" index="21"/>
    <alias name="" field="otr13" index="22"/>
    <alias name="" field="ptot14" index="23"/>
    <alias name="" field="pm14" index="24"/>
    <alias name="" field="ph14" index="25"/>
    <alias name="" field="e001514" index="26"/>
    <alias name="" field="e166414" index="27"/>
    <alias name="" field="e6514" index="28"/>
    <alias name="" field="esp14" index="29"/>
    <alias name="" field="ue1514" index="30"/>
    <alias name="" field="mag14" index="31"/>
    <alias name="" field="ams14" index="32"/>
    <alias name="" field="otr14" index="33"/>
    <alias name="" field="ptot15" index="34"/>
    <alias name="" field="pm15" index="35"/>
    <alias name="" field="ph15" index="36"/>
    <alias name="" field="e001515" index="37"/>
    <alias name="" field="e166415" index="38"/>
    <alias name="" field="e6515" index="39"/>
    <alias name="" field="esp15" index="40"/>
    <alias name="" field="ue1515" index="41"/>
    <alias name="" field="mag15" index="42"/>
    <alias name="" field="ams15" index="43"/>
    <alias name="" field="otr15" index="44"/>
    <alias name="" field="ptot16" index="45"/>
    <alias name="" field="pm16" index="46"/>
    <alias name="" field="ph16" index="47"/>
    <alias name="" field="e001516" index="48"/>
    <alias name="" field="e166416" index="49"/>
    <alias name="" field="e6516" index="50"/>
    <alias name="" field="esp16" index="51"/>
    <alias name="" field="ue1516" index="52"/>
    <alias name="" field="mag16" index="53"/>
    <alias name="" field="ams16" index="54"/>
    <alias name="" field="otr16" index="55"/>
    <alias name="" field="ptot17" index="56"/>
    <alias name="" field="pm17" index="57"/>
    <alias name="" field="ph17" index="58"/>
    <alias name="" field="e001517" index="59"/>
    <alias name="" field="e166417" index="60"/>
    <alias name="" field="e6517" index="61"/>
    <alias name="" field="esp17" index="62"/>
    <alias name="" field="ue1517" index="63"/>
    <alias name="" field="mag17" index="64"/>
    <alias name="" field="ams17" index="65"/>
    <alias name="" field="otr17" index="66"/>
    <alias name="" field="ptot18" index="67"/>
    <alias name="" field="pm18" index="68"/>
    <alias name="" field="ph18" index="69"/>
    <alias name="" field="e001518" index="70"/>
    <alias name="" field="e166418" index="71"/>
    <alias name="" field="e6518" index="72"/>
    <alias name="" field="esp18" index="73"/>
    <alias name="" field="ue1518" index="74"/>
    <alias name="" field="mag18" index="75"/>
    <alias name="" field="ams18" index="76"/>
    <alias name="" field="otr18" index="77"/>
    <alias name="" field="provincia" index="78"/>
    <alias name="" field="municipio" index="79"/>
    <alias name="" field="nuc_pob" index="80"/>
    <alias name="" field="nuc_pob_nivel" index="81"/>
    <alias name="" field="sc_codigo" index="82"/>
    <alias name="" field="geom_cell" index="83"/>
  </aliases>
  <excludeAttributesWMS/>
  <excludeAttributesWFS/>
  <defaults>
    <default expression="" field="id" applyOnUpdate="0"/>
    <default expression="" field="ptot02" applyOnUpdate="0"/>
    <default expression="" field="pm02" applyOnUpdate="0"/>
    <default expression="" field="ph02" applyOnUpdate="0"/>
    <default expression="" field="e001502" applyOnUpdate="0"/>
    <default expression="" field="e166402" applyOnUpdate="0"/>
    <default expression="" field="e6502" applyOnUpdate="0"/>
    <default expression="" field="esp02" applyOnUpdate="0"/>
    <default expression="" field="ue1502" applyOnUpdate="0"/>
    <default expression="" field="mag02" applyOnUpdate="0"/>
    <default expression="" field="ams02" applyOnUpdate="0"/>
    <default expression="" field="otr02" applyOnUpdate="0"/>
    <default expression="" field="ptot13" applyOnUpdate="0"/>
    <default expression="" field="pm13" applyOnUpdate="0"/>
    <default expression="" field="ph13" applyOnUpdate="0"/>
    <default expression="" field="e001513" applyOnUpdate="0"/>
    <default expression="" field="e166413" applyOnUpdate="0"/>
    <default expression="" field="e6513" applyOnUpdate="0"/>
    <default expression="" field="esp13" applyOnUpdate="0"/>
    <default expression="" field="ue1513" applyOnUpdate="0"/>
    <default expression="" field="mag13" applyOnUpdate="0"/>
    <default expression="" field="ams13" applyOnUpdate="0"/>
    <default expression="" field="otr13" applyOnUpdate="0"/>
    <default expression="" field="ptot14" applyOnUpdate="0"/>
    <default expression="" field="pm14" applyOnUpdate="0"/>
    <default expression="" field="ph14" applyOnUpdate="0"/>
    <default expression="" field="e001514" applyOnUpdate="0"/>
    <default expression="" field="e166414" applyOnUpdate="0"/>
    <default expression="" field="e6514" applyOnUpdate="0"/>
    <default expression="" field="esp14" applyOnUpdate="0"/>
    <default expression="" field="ue1514" applyOnUpdate="0"/>
    <default expression="" field="mag14" applyOnUpdate="0"/>
    <default expression="" field="ams14" applyOnUpdate="0"/>
    <default expression="" field="otr14" applyOnUpdate="0"/>
    <default expression="" field="ptot15" applyOnUpdate="0"/>
    <default expression="" field="pm15" applyOnUpdate="0"/>
    <default expression="" field="ph15" applyOnUpdate="0"/>
    <default expression="" field="e001515" applyOnUpdate="0"/>
    <default expression="" field="e166415" applyOnUpdate="0"/>
    <default expression="" field="e6515" applyOnUpdate="0"/>
    <default expression="" field="esp15" applyOnUpdate="0"/>
    <default expression="" field="ue1515" applyOnUpdate="0"/>
    <default expression="" field="mag15" applyOnUpdate="0"/>
    <default expression="" field="ams15" applyOnUpdate="0"/>
    <default expression="" field="otr15" applyOnUpdate="0"/>
    <default expression="" field="ptot16" applyOnUpdate="0"/>
    <default expression="" field="pm16" applyOnUpdate="0"/>
    <default expression="" field="ph16" applyOnUpdate="0"/>
    <default expression="" field="e001516" applyOnUpdate="0"/>
    <default expression="" field="e166416" applyOnUpdate="0"/>
    <default expression="" field="e6516" applyOnUpdate="0"/>
    <default expression="" field="esp16" applyOnUpdate="0"/>
    <default expression="" field="ue1516" applyOnUpdate="0"/>
    <default expression="" field="mag16" applyOnUpdate="0"/>
    <default expression="" field="ams16" applyOnUpdate="0"/>
    <default expression="" field="otr16" applyOnUpdate="0"/>
    <default expression="" field="ptot17" applyOnUpdate="0"/>
    <default expression="" field="pm17" applyOnUpdate="0"/>
    <default expression="" field="ph17" applyOnUpdate="0"/>
    <default expression="" field="e001517" applyOnUpdate="0"/>
    <default expression="" field="e166417" applyOnUpdate="0"/>
    <default expression="" field="e6517" applyOnUpdate="0"/>
    <default expression="" field="esp17" applyOnUpdate="0"/>
    <default expression="" field="ue1517" applyOnUpdate="0"/>
    <default expression="" field="mag17" applyOnUpdate="0"/>
    <default expression="" field="ams17" applyOnUpdate="0"/>
    <default expression="" field="otr17" applyOnUpdate="0"/>
    <default expression="" field="ptot18" applyOnUpdate="0"/>
    <default expression="" field="pm18" applyOnUpdate="0"/>
    <default expression="" field="ph18" applyOnUpdate="0"/>
    <default expression="" field="e001518" applyOnUpdate="0"/>
    <default expression="" field="e166418" applyOnUpdate="0"/>
    <default expression="" field="e6518" applyOnUpdate="0"/>
    <default expression="" field="esp18" applyOnUpdate="0"/>
    <default expression="" field="ue1518" applyOnUpdate="0"/>
    <default expression="" field="mag18" applyOnUpdate="0"/>
    <default expression="" field="ams18" applyOnUpdate="0"/>
    <default expression="" field="otr18" applyOnUpdate="0"/>
    <default expression="" field="provincia" applyOnUpdate="0"/>
    <default expression="" field="municipio" applyOnUpdate="0"/>
    <default expression="" field="nuc_pob" applyOnUpdate="0"/>
    <default expression="" field="nuc_pob_nivel" applyOnUpdate="0"/>
    <default expression="" field="sc_codigo" applyOnUpdate="0"/>
    <default expression="" field="geom_cell" applyOnUpdate="0"/>
  </defaults>
  <constraints>
    <constraint unique_strength="1" constraints="3" field="id" exp_strength="0" notnull_strength="1"/>
    <constraint unique_strength="0" constraints="0" field="ptot02" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="pm02" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ph02" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e001502" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e166402" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e6502" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="esp02" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ue1502" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="mag02" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ams02" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="otr02" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ptot13" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="pm13" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ph13" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e001513" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e166413" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e6513" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="esp13" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ue1513" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="mag13" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ams13" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="otr13" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ptot14" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="pm14" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ph14" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e001514" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e166414" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e6514" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="esp14" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ue1514" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="mag14" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ams14" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="otr14" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ptot15" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="pm15" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ph15" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e001515" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e166415" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e6515" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="esp15" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ue1515" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="mag15" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ams15" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="otr15" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ptot16" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="pm16" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ph16" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e001516" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e166416" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e6516" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="esp16" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ue1516" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="mag16" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ams16" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="otr16" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ptot17" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="pm17" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ph17" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e001517" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e166417" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e6517" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="esp17" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ue1517" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="mag17" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ams17" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="otr17" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ptot18" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="pm18" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ph18" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e001518" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e166418" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="e6518" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="esp18" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ue1518" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="mag18" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="ams18" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="otr18" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="provincia" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="municipio" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="nuc_pob" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="nuc_pob_nivel" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="sc_codigo" exp_strength="0" notnull_strength="0"/>
    <constraint unique_strength="0" constraints="0" field="geom_cell" exp_strength="0" notnull_strength="0"/>
  </constraints>
  <constraintExpressions>
    <constraint desc="" field="id" exp=""/>
    <constraint desc="" field="ptot02" exp=""/>
    <constraint desc="" field="pm02" exp=""/>
    <constraint desc="" field="ph02" exp=""/>
    <constraint desc="" field="e001502" exp=""/>
    <constraint desc="" field="e166402" exp=""/>
    <constraint desc="" field="e6502" exp=""/>
    <constraint desc="" field="esp02" exp=""/>
    <constraint desc="" field="ue1502" exp=""/>
    <constraint desc="" field="mag02" exp=""/>
    <constraint desc="" field="ams02" exp=""/>
    <constraint desc="" field="otr02" exp=""/>
    <constraint desc="" field="ptot13" exp=""/>
    <constraint desc="" field="pm13" exp=""/>
    <constraint desc="" field="ph13" exp=""/>
    <constraint desc="" field="e001513" exp=""/>
    <constraint desc="" field="e166413" exp=""/>
    <constraint desc="" field="e6513" exp=""/>
    <constraint desc="" field="esp13" exp=""/>
    <constraint desc="" field="ue1513" exp=""/>
    <constraint desc="" field="mag13" exp=""/>
    <constraint desc="" field="ams13" exp=""/>
    <constraint desc="" field="otr13" exp=""/>
    <constraint desc="" field="ptot14" exp=""/>
    <constraint desc="" field="pm14" exp=""/>
    <constraint desc="" field="ph14" exp=""/>
    <constraint desc="" field="e001514" exp=""/>
    <constraint desc="" field="e166414" exp=""/>
    <constraint desc="" field="e6514" exp=""/>
    <constraint desc="" field="esp14" exp=""/>
    <constraint desc="" field="ue1514" exp=""/>
    <constraint desc="" field="mag14" exp=""/>
    <constraint desc="" field="ams14" exp=""/>
    <constraint desc="" field="otr14" exp=""/>
    <constraint desc="" field="ptot15" exp=""/>
    <constraint desc="" field="pm15" exp=""/>
    <constraint desc="" field="ph15" exp=""/>
    <constraint desc="" field="e001515" exp=""/>
    <constraint desc="" field="e166415" exp=""/>
    <constraint desc="" field="e6515" exp=""/>
    <constraint desc="" field="esp15" exp=""/>
    <constraint desc="" field="ue1515" exp=""/>
    <constraint desc="" field="mag15" exp=""/>
    <constraint desc="" field="ams15" exp=""/>
    <constraint desc="" field="otr15" exp=""/>
    <constraint desc="" field="ptot16" exp=""/>
    <constraint desc="" field="pm16" exp=""/>
    <constraint desc="" field="ph16" exp=""/>
    <constraint desc="" field="e001516" exp=""/>
    <constraint desc="" field="e166416" exp=""/>
    <constraint desc="" field="e6516" exp=""/>
    <constraint desc="" field="esp16" exp=""/>
    <constraint desc="" field="ue1516" exp=""/>
    <constraint desc="" field="mag16" exp=""/>
    <constraint desc="" field="ams16" exp=""/>
    <constraint desc="" field="otr16" exp=""/>
    <constraint desc="" field="ptot17" exp=""/>
    <constraint desc="" field="pm17" exp=""/>
    <constraint desc="" field="ph17" exp=""/>
    <constraint desc="" field="e001517" exp=""/>
    <constraint desc="" field="e166417" exp=""/>
    <constraint desc="" field="e6517" exp=""/>
    <constraint desc="" field="esp17" exp=""/>
    <constraint desc="" field="ue1517" exp=""/>
    <constraint desc="" field="mag17" exp=""/>
    <constraint desc="" field="ams17" exp=""/>
    <constraint desc="" field="otr17" exp=""/>
    <constraint desc="" field="ptot18" exp=""/>
    <constraint desc="" field="pm18" exp=""/>
    <constraint desc="" field="ph18" exp=""/>
    <constraint desc="" field="e001518" exp=""/>
    <constraint desc="" field="e166418" exp=""/>
    <constraint desc="" field="e6518" exp=""/>
    <constraint desc="" field="esp18" exp=""/>
    <constraint desc="" field="ue1518" exp=""/>
    <constraint desc="" field="mag18" exp=""/>
    <constraint desc="" field="ams18" exp=""/>
    <constraint desc="" field="otr18" exp=""/>
    <constraint desc="" field="provincia" exp=""/>
    <constraint desc="" field="municipio" exp=""/>
    <constraint desc="" field="nuc_pob" exp=""/>
    <constraint desc="" field="nuc_pob_nivel" exp=""/>
    <constraint desc="" field="sc_codigo" exp=""/>
    <constraint desc="" field="geom_cell" exp=""/>
  </constraintExpressions>
  <expressionfields/>
  <attributeactions>
    <defaultAction value="{00000000-0000-0000-0000-000000000000}" key="Canvas"/>
  </attributeactions>
  <attributetableconfig actionWidgetStyle="dropDown" sortExpression="" sortOrder="0">
    <columns>
      <column width="-1" type="field" name="id" hidden="0"/>
      <column width="-1" type="field" name="ptot02" hidden="0"/>
      <column width="-1" type="field" name="pm02" hidden="0"/>
      <column width="-1" type="field" name="ph02" hidden="0"/>
      <column width="-1" type="field" name="e001502" hidden="0"/>
      <column width="-1" type="field" name="e166402" hidden="0"/>
      <column width="-1" type="field" name="e6502" hidden="0"/>
      <column width="-1" type="field" name="esp02" hidden="0"/>
      <column width="-1" type="field" name="ue1502" hidden="0"/>
      <column width="-1" type="field" name="mag02" hidden="0"/>
      <column width="-1" type="field" name="ams02" hidden="0"/>
      <column width="-1" type="field" name="otr02" hidden="0"/>
      <column width="-1" type="field" name="ptot13" hidden="0"/>
      <column width="-1" type="field" name="pm13" hidden="0"/>
      <column width="-1" type="field" name="ph13" hidden="0"/>
      <column width="-1" type="field" name="e001513" hidden="0"/>
      <column width="-1" type="field" name="e166413" hidden="0"/>
      <column width="-1" type="field" name="e6513" hidden="0"/>
      <column width="-1" type="field" name="esp13" hidden="0"/>
      <column width="-1" type="field" name="ue1513" hidden="0"/>
      <column width="-1" type="field" name="mag13" hidden="0"/>
      <column width="-1" type="field" name="ams13" hidden="0"/>
      <column width="-1" type="field" name="otr13" hidden="0"/>
      <column width="-1" type="field" name="ptot14" hidden="0"/>
      <column width="-1" type="field" name="pm14" hidden="0"/>
      <column width="-1" type="field" name="ph14" hidden="0"/>
      <column width="-1" type="field" name="e001514" hidden="0"/>
      <column width="-1" type="field" name="e166414" hidden="0"/>
      <column width="-1" type="field" name="e6514" hidden="0"/>
      <column width="-1" type="field" name="esp14" hidden="0"/>
      <column width="-1" type="field" name="ue1514" hidden="0"/>
      <column width="-1" type="field" name="mag14" hidden="0"/>
      <column width="-1" type="field" name="ams14" hidden="0"/>
      <column width="-1" type="field" name="otr14" hidden="0"/>
      <column width="-1" type="field" name="ptot15" hidden="0"/>
      <column width="-1" type="field" name="pm15" hidden="0"/>
      <column width="-1" type="field" name="ph15" hidden="0"/>
      <column width="-1" type="field" name="e001515" hidden="0"/>
      <column width="-1" type="field" name="e166415" hidden="0"/>
      <column width="-1" type="field" name="e6515" hidden="0"/>
      <column width="-1" type="field" name="esp15" hidden="0"/>
      <column width="-1" type="field" name="ue1515" hidden="0"/>
      <column width="-1" type="field" name="mag15" hidden="0"/>
      <column width="-1" type="field" name="ams15" hidden="0"/>
      <column width="-1" type="field" name="otr15" hidden="0"/>
      <column width="-1" type="field" name="ptot16" hidden="0"/>
      <column width="-1" type="field" name="pm16" hidden="0"/>
      <column width="-1" type="field" name="ph16" hidden="0"/>
      <column width="-1" type="field" name="e001516" hidden="0"/>
      <column width="-1" type="field" name="e166416" hidden="0"/>
      <column width="-1" type="field" name="e6516" hidden="0"/>
      <column width="-1" type="field" name="esp16" hidden="0"/>
      <column width="-1" type="field" name="ue1516" hidden="0"/>
      <column width="-1" type="field" name="mag16" hidden="0"/>
      <column width="-1" type="field" name="ams16" hidden="0"/>
      <column width="-1" type="field" name="otr16" hidden="0"/>
      <column width="-1" type="field" name="ptot17" hidden="0"/>
      <column width="-1" type="field" name="pm17" hidden="0"/>
      <column width="-1" type="field" name="ph17" hidden="0"/>
      <column width="-1" type="field" name="e001517" hidden="0"/>
      <column width="-1" type="field" name="e166417" hidden="0"/>
      <column width="-1" type="field" name="e6517" hidden="0"/>
      <column width="-1" type="field" name="esp17" hidden="0"/>
      <column width="-1" type="field" name="ue1517" hidden="0"/>
      <column width="-1" type="field" name="mag17" hidden="0"/>
      <column width="-1" type="field" name="ams17" hidden="0"/>
      <column width="-1" type="field" name="otr17" hidden="0"/>
      <column width="-1" type="field" name="ptot18" hidden="0"/>
      <column width="-1" type="field" name="pm18" hidden="0"/>
      <column width="-1" type="field" name="ph18" hidden="0"/>
      <column width="-1" type="field" name="e001518" hidden="0"/>
      <column width="-1" type="field" name="e166418" hidden="0"/>
      <column width="-1" type="field" name="e6518" hidden="0"/>
      <column width="-1" type="field" name="esp18" hidden="0"/>
      <column width="-1" type="field" name="ue1518" hidden="0"/>
      <column width="-1" type="field" name="mag18" hidden="0"/>
      <column width="-1" type="field" name="ams18" hidden="0"/>
      <column width="-1" type="field" name="otr18" hidden="0"/>
      <column width="-1" type="field" name="provincia" hidden="0"/>
      <column width="-1" type="field" name="municipio" hidden="0"/>
      <column width="-1" type="field" name="nuc_pob" hidden="0"/>
      <column width="-1" type="field" name="nuc_pob_nivel" hidden="0"/>
      <column width="-1" type="field" name="sc_codigo" hidden="0"/>
      <column width="-1" type="field" name="geom_cell" hidden="0"/>
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
    <field editable="1" name="ams02"/>
    <field editable="1" name="ams13"/>
    <field editable="1" name="ams14"/>
    <field editable="1" name="ams15"/>
    <field editable="1" name="ams16"/>
    <field editable="1" name="ams17"/>
    <field editable="1" name="ams18"/>
    <field editable="1" name="e001502"/>
    <field editable="1" name="e001513"/>
    <field editable="1" name="e001514"/>
    <field editable="1" name="e001515"/>
    <field editable="1" name="e001516"/>
    <field editable="1" name="e001517"/>
    <field editable="1" name="e001518"/>
    <field editable="1" name="e166402"/>
    <field editable="1" name="e166413"/>
    <field editable="1" name="e166414"/>
    <field editable="1" name="e166415"/>
    <field editable="1" name="e166416"/>
    <field editable="1" name="e166417"/>
    <field editable="1" name="e166418"/>
    <field editable="1" name="e6502"/>
    <field editable="1" name="e6513"/>
    <field editable="1" name="e6514"/>
    <field editable="1" name="e6515"/>
    <field editable="1" name="e6516"/>
    <field editable="1" name="e6517"/>
    <field editable="1" name="e6518"/>
    <field editable="1" name="esp02"/>
    <field editable="1" name="esp13"/>
    <field editable="1" name="esp14"/>
    <field editable="1" name="esp15"/>
    <field editable="1" name="esp16"/>
    <field editable="1" name="esp17"/>
    <field editable="1" name="esp18"/>
    <field editable="1" name="geom_cell"/>
    <field editable="1" name="id"/>
    <field editable="1" name="mag02"/>
    <field editable="1" name="mag13"/>
    <field editable="1" name="mag14"/>
    <field editable="1" name="mag15"/>
    <field editable="1" name="mag16"/>
    <field editable="1" name="mag17"/>
    <field editable="1" name="mag18"/>
    <field editable="1" name="municipio"/>
    <field editable="1" name="nuc_pob"/>
    <field editable="1" name="nuc_pob_nivel"/>
    <field editable="1" name="otr02"/>
    <field editable="1" name="otr13"/>
    <field editable="1" name="otr14"/>
    <field editable="1" name="otr15"/>
    <field editable="1" name="otr16"/>
    <field editable="1" name="otr17"/>
    <field editable="1" name="otr18"/>
    <field editable="1" name="ph02"/>
    <field editable="1" name="ph13"/>
    <field editable="1" name="ph14"/>
    <field editable="1" name="ph15"/>
    <field editable="1" name="ph16"/>
    <field editable="1" name="ph17"/>
    <field editable="1" name="ph18"/>
    <field editable="1" name="pm02"/>
    <field editable="1" name="pm13"/>
    <field editable="1" name="pm14"/>
    <field editable="1" name="pm15"/>
    <field editable="1" name="pm16"/>
    <field editable="1" name="pm17"/>
    <field editable="1" name="pm18"/>
    <field editable="1" name="provincia"/>
    <field editable="1" name="ptot02"/>
    <field editable="1" name="ptot13"/>
    <field editable="1" name="ptot14"/>
    <field editable="1" name="ptot15"/>
    <field editable="1" name="ptot16"/>
    <field editable="1" name="ptot17"/>
    <field editable="1" name="ptot18"/>
    <field editable="1" name="sc_codigo"/>
    <field editable="1" name="ue1502"/>
    <field editable="1" name="ue1513"/>
    <field editable="1" name="ue1514"/>
    <field editable="1" name="ue1515"/>
    <field editable="1" name="ue1516"/>
    <field editable="1" name="ue1517"/>
    <field editable="1" name="ue1518"/>
  </editable>
  <labelOnTop>
    <field labelOnTop="0" name="ams02"/>
    <field labelOnTop="0" name="ams13"/>
    <field labelOnTop="0" name="ams14"/>
    <field labelOnTop="0" name="ams15"/>
    <field labelOnTop="0" name="ams16"/>
    <field labelOnTop="0" name="ams17"/>
    <field labelOnTop="0" name="ams18"/>
    <field labelOnTop="0" name="e001502"/>
    <field labelOnTop="0" name="e001513"/>
    <field labelOnTop="0" name="e001514"/>
    <field labelOnTop="0" name="e001515"/>
    <field labelOnTop="0" name="e001516"/>
    <field labelOnTop="0" name="e001517"/>
    <field labelOnTop="0" name="e001518"/>
    <field labelOnTop="0" name="e166402"/>
    <field labelOnTop="0" name="e166413"/>
    <field labelOnTop="0" name="e166414"/>
    <field labelOnTop="0" name="e166415"/>
    <field labelOnTop="0" name="e166416"/>
    <field labelOnTop="0" name="e166417"/>
    <field labelOnTop="0" name="e166418"/>
    <field labelOnTop="0" name="e6502"/>
    <field labelOnTop="0" name="e6513"/>
    <field labelOnTop="0" name="e6514"/>
    <field labelOnTop="0" name="e6515"/>
    <field labelOnTop="0" name="e6516"/>
    <field labelOnTop="0" name="e6517"/>
    <field labelOnTop="0" name="e6518"/>
    <field labelOnTop="0" name="esp02"/>
    <field labelOnTop="0" name="esp13"/>
    <field labelOnTop="0" name="esp14"/>
    <field labelOnTop="0" name="esp15"/>
    <field labelOnTop="0" name="esp16"/>
    <field labelOnTop="0" name="esp17"/>
    <field labelOnTop="0" name="esp18"/>
    <field labelOnTop="0" name="geom_cell"/>
    <field labelOnTop="0" name="id"/>
    <field labelOnTop="0" name="mag02"/>
    <field labelOnTop="0" name="mag13"/>
    <field labelOnTop="0" name="mag14"/>
    <field labelOnTop="0" name="mag15"/>
    <field labelOnTop="0" name="mag16"/>
    <field labelOnTop="0" name="mag17"/>
    <field labelOnTop="0" name="mag18"/>
    <field labelOnTop="0" name="municipio"/>
    <field labelOnTop="0" name="nuc_pob"/>
    <field labelOnTop="0" name="nuc_pob_nivel"/>
    <field labelOnTop="0" name="otr02"/>
    <field labelOnTop="0" name="otr13"/>
    <field labelOnTop="0" name="otr14"/>
    <field labelOnTop="0" name="otr15"/>
    <field labelOnTop="0" name="otr16"/>
    <field labelOnTop="0" name="otr17"/>
    <field labelOnTop="0" name="otr18"/>
    <field labelOnTop="0" name="ph02"/>
    <field labelOnTop="0" name="ph13"/>
    <field labelOnTop="0" name="ph14"/>
    <field labelOnTop="0" name="ph15"/>
    <field labelOnTop="0" name="ph16"/>
    <field labelOnTop="0" name="ph17"/>
    <field labelOnTop="0" name="ph18"/>
    <field labelOnTop="0" name="pm02"/>
    <field labelOnTop="0" name="pm13"/>
    <field labelOnTop="0" name="pm14"/>
    <field labelOnTop="0" name="pm15"/>
    <field labelOnTop="0" name="pm16"/>
    <field labelOnTop="0" name="pm17"/>
    <field labelOnTop="0" name="pm18"/>
    <field labelOnTop="0" name="provincia"/>
    <field labelOnTop="0" name="ptot02"/>
    <field labelOnTop="0" name="ptot13"/>
    <field labelOnTop="0" name="ptot14"/>
    <field labelOnTop="0" name="ptot15"/>
    <field labelOnTop="0" name="ptot16"/>
    <field labelOnTop="0" name="ptot17"/>
    <field labelOnTop="0" name="ptot18"/>
    <field labelOnTop="0" name="sc_codigo"/>
    <field labelOnTop="0" name="ue1502"/>
    <field labelOnTop="0" name="ue1513"/>
    <field labelOnTop="0" name="ue1514"/>
    <field labelOnTop="0" name="ue1515"/>
    <field labelOnTop="0" name="ue1516"/>
    <field labelOnTop="0" name="ue1517"/>
    <field labelOnTop="0" name="ue1518"/>
  </labelOnTop>
  <dataDefinedFieldProperties/>
  <widgets/>
  <previewExpression>"id"</previewExpression>
  <mapTip></mapTip>
  <layerGeometryType>0</layerGeometryType>
</qgis>
