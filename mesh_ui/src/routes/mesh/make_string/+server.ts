
/** @type {import('./$types').RequestHandler} */
export async function POST(event: any) {

    let inputs = await event.request.json();

    return new Response(`{\
"0": {\
"CellEnsembleAttributeMatrixName": "CellEnsembleData",\
"CrystalStructuresArrayName": "CrystalStructures",\
"Filter_Human_Label": "StatsGenerator",\
"Filter_Name": "StatsGeneratorFilter",\
"PhaseTypesArrayName": "PhaseTypes",\
"StatsDataArray": {\
"1": {\
"AxisODF-Weights": {\
},\
"Bin Count": ${inputs.bin.numbers.length},\
"BinNumber": [${inputs.bin.numbers.join(',')}],\
"BoundaryArea": 0,\
"Crystal Symmetry": 1,\
"FeatureSize Distribution": {\
"Average": ${inputs.feature_size.average},\
"Standard Deviation": ${inputs.feature_size.std_dev}\
},\
"FeatureSize Vs B Over A Distributions": {\
"Alpha": [${inputs.bOverADist.alpha.join(',')}],\
"Beta": [${inputs.bOverADist.beta.join(',')}],\
"Distribution Type": "Beta Distribution"\
},\
"FeatureSize Vs C Over A Distributions": {\
"Alpha": [${inputs.cOverADist.alpha.join(',')}],\
"Beta": [${inputs.cOverADist.beta.join(',')}],\
"Distribution Type": "Beta Distribution"\
},\
"FeatureSize Vs Neighbors Distributions": {\
"Average": [${inputs.fSizeVsNeighbors.average.join(",")}],\
"Distribution Type": "Log Normal Distribution",\
"Standard Deviation": [${inputs.fSizeVsNeighbors.std_dev.join(",")}]\
},\
"FeatureSize Vs Omega3 Distributions": {\
"Alpha": [${inputs.fSizeVsO3.alpha.join(",")}],\
"Beta": [${inputs.fSizeVsO3.beta.join(",")}],\
"Distribution Type": "Beta Distribution"\
},\
"Feature_Diameter_Info": [${inputs.featureDiamInfo.join(",")}],\
"MDF-Weights": {\
},\
"Name": "Primary",\
"ODF-Weights": {\
},\
"PhaseFraction": 1,\
"PhaseType": "Primary"\
},\
"Name": "Statistics",\
"Phase Count": 2\
},\
"StatsDataArrayName": "Statistics",\
"StatsGeneratorDataContainerName": "StatsGeneratorDataContainer"\
},\
"1": {\
"CellAttributeMatrixName": "CellData",\
"DataContainerName": "SyntheticVolumeDataContainer",\
"Dimensions": {\
"x": ${inputs.sample_size.dimensions.x},\
"y": ${inputs.sample_size.dimensions.y},\
"z": ${inputs.sample_size.dimensions.z}\
},\
"EstimateNumberOfFeatures": 0,\
"FilterVersion": "1.0.278",\
"Filter_Human_Label": "Initialize Synthetic Volume",\
"Filter_Name": "InitializeSyntheticVolume",\
"InputPhaseTypesArrayPath": {\
"Attribute Matrix Name": "CellEnsembleData",\
"Data Array Name": "PhaseTypes",\
"Data Container Name": "StatsGeneratorDataContainer"\
},\
"InputStatsArrayPath": {\
"Attribute Matrix Name": "CellEnsembleData",\
"Data Array Name": "Statistics",\
"Data Container Name": "StatsGeneratorDataContainer"\
},\
"InputStatsFile": "",\
"Origin": {\
"x": 0,\
"y": 0,\
"z": 0\
},\
"Resolution": {\
    "x": ${inputs.sample_size.resolution},\
    "y": ${inputs.sample_size.resolution},\
    "z": ${inputs.sample_size.resolution}\
}\
},\
"2": {\
"FilterVersion": "1.0.278",\
"Filter_Human_Label": "Establish Shape Types",\
"Filter_Name": "EstablishShapeTypes",\
"InputPhaseTypesArrayPath": {\
"Attribute Matrix Name": "CellEnsembleData",\
"Data Array Name": "PhaseTypes",\
"Data Container Name": "StatsGeneratorDataContainer"\
},\
"ShapeTypeData": [\
999,\
0\
],\
"ShapeTypesArrayName": "ShapeTypes"\
},\
"3": {\
"CellPhasesArrayName": "Phases",\
"CsvOutputFile": "",\
"ErrorOutputFile": "",\
"FeatureIdsArrayName": "FeatureIds",\
"FeatureInputFile": "",\
"FeaturePhasesArrayName": "Phases",\
"FilterVersion": "1.0.278",\
"Filter_Human_Label": "Pack Primary Phases",\
"Filter_Name": "PackPrimaryPhases",\
"HaveFeatures": 0,\
"InputPhaseTypesArrayPath": {\
"Attribute Matrix Name": "CellEnsembleData",\
"Data Array Name": "PhaseTypes",\
"Data Container Name": "StatsGeneratorDataContainer"\
},\
"InputShapeTypesArrayPath": {\
"Attribute Matrix Name": "CellEnsembleData",\
"Data Array Name": "ShapeTypes",\
"Data Container Name": "StatsGeneratorDataContainer"\
},\
"InputStatsArrayPath": {\
"Attribute Matrix Name": "CellEnsembleData",\
"Data Array Name": "Statistics",\
"Data Container Name": "StatsGeneratorDataContainer"\
},\
"MaskArrayPath": {\
"Attribute Matrix Name": "",\
"Data Array Name": "",\
"Data Container Name": ""\
},\
"NumFeaturesArrayName": "NumFeatures",\
"OutputCellAttributeMatrixPath": {\
"Attribute Matrix Name": "CellData",\
"Data Array Name": "",\
"Data Container Name": "SyntheticVolumeDataContainer"\
},\
"OutputCellEnsembleAttributeMatrixName": "CellEnsembleData",\
"OutputCellFeatureAttributeMatrixName": "CellFeatureData",\
"PeriodicBoundaries": 0,\
"UseMask": 0,\
"VtkOutputFile": "",\
"WriteGoalAttributes": 0\
},\
"4": {\
"BoundaryCellsArrayName": "BoundaryCells",\
"CellFeatureAttributeMatrixPath": {\
"Attribute Matrix Name": "CellFeatureData",\
"Data Array Name": "",\
"Data Container Name": "SyntheticVolumeDataContainer"\
},\
"FeatureIdsArrayPath": {\
"Attribute Matrix Name": "CellData",\
"Data Array Name": "FeatureIds",\
"Data Container Name": "SyntheticVolumeDataContainer"\
},\
"FilterVersion": "1.0.278",\
"Filter_Human_Label": "Find Feature Neighbors",\
"Filter_Name": "FindNeighbors",\
"NeighborListArrayName": "NeighborList",\
"NumNeighborsArrayName": "NumNeighbors",\
"SharedSurfaceAreaListArrayName": "SharedSurfaceAreaList",\
"StoreBoundaryCells": 0,\
"StoreSurfaceFeatures": 1,\
"SurfaceFeaturesArrayName": "SurfaceFeatures"\
},\
"5": {\
"AvgQuatsArrayName": "AvgQuats",\
"CellEulerAnglesArrayName": "EulerAngles",\
"CrystalStructuresArrayPath": {\
"Attribute Matrix Name": "CellEnsembleData",\
"Data Array Name": "CrystalStructures",\
"Data Container Name": "StatsGeneratorDataContainer"\
},\
"FeatureEulerAnglesArrayName": "EulerAngles",\
"FeatureIdsArrayPath": {\
"Attribute Matrix Name": "CellData",\
"Data Array Name": "FeatureIds",\
"Data Container Name": "SyntheticVolumeDataContainer"\
},\
"FeaturePhasesArrayPath": {\
"Attribute Matrix Name": "CellFeatureData",\
"Data Array Name": "Phases",\
"Data Container Name": "SyntheticVolumeDataContainer"\
},\
"FilterVersion": "1.0.278",\
"Filter_Human_Label": "Match Crystallography",\
"Filter_Name": "MatchCrystallography",\
"InputStatsArrayPath": {\
"Attribute Matrix Name": "CellEnsembleData",\
"Data Array Name": "Statistics",\
"Data Container Name": "StatsGeneratorDataContainer"\
},\
"MaxIterations": 1000,\
"NeighborListArrayPath": {\
"Attribute Matrix Name": "CellFeatureData",\
"Data Array Name": "NeighborList",\
"Data Container Name": "SyntheticVolumeDataContainer"\
},\
"NumFeaturesArrayPath": {\
"Attribute Matrix Name": "CellEnsembleData",\
"Data Array Name": "NumFeatures",\
"Data Container Name": "SyntheticVolumeDataContainer"\
},\
"PhaseTypesArrayPath": {\
"Attribute Matrix Name": "CellEnsembleData",\
"Data Array Name": "PhaseTypes",\
"Data Container Name": "StatsGeneratorDataContainer"\
},\
"SharedSurfaceAreaListArrayPath": {\
"Attribute Matrix Name": "CellFeatureData",\
"Data Array Name": "SharedSurfaceAreaList",\
"Data Container Name": "SyntheticVolumeDataContainer"\
},\
"SurfaceFeaturesArrayPath": {\
"Attribute Matrix Name": "CellFeatureData",\
"Data Array Name": "SurfaceFeatures",\
"Data Container Name": "SyntheticVolumeDataContainer"\
},\
"VolumesArrayName": "Volumes"\
},\
"6": {\
"CellEulerAnglesArrayPath": {\
"Attribute Matrix Name": "CellData",\
"Data Array Name": "EulerAngles",\
"Data Container Name": "SyntheticVolumeDataContainer"\
},\
"CellIPFColorsArrayName": "IPFColor",\
"CellPhasesArrayPath": {\
"Attribute Matrix Name": "CellData",\
"Data Array Name": "Phases",\
"Data Container Name": "SyntheticVolumeDataContainer"\
},\
"CrystalStructuresArrayPath": {\
"Attribute Matrix Name": "CellEnsembleData",\
"Data Array Name": "CrystalStructures",\
"Data Container Name": "StatsGeneratorDataContainer"\
},\
"FilterVersion": "1.0.278",\
"Filter_Human_Label": "Generate IPF Colors",\
"Filter_Name": "GenerateIPFColors",\
"GoodVoxelsArrayPath": {\
"Attribute Matrix Name": "CellData",\
"Data Array Name": "",\
"Data Container Name": "SyntheticVolumeDataContainer"\
},\
"ReferenceDir": {\
"x": 0,\
"y": 0,\
"z": 1\
},\
"UseGoodVoxels": 0\
},\
"7": {\
"FilterVersion": "1.0.278",\
"Filter_Human_Label": "Write DREAM.3D Data File",\
"Filter_Name": "DataContainerWriter",\
"OutputFile": "Data/Output/mesh.dream3d",\
"WriteXdmfFile": 1\
},\
"8": {\
"FeatureIdsArrayPath": {\
"Attribute Matrix Name": "CellData",\
"Data Array Name": "FeatureIds",\
"Data Container Name": "SyntheticVolumeDataContainer"\
},\
"FilePrefix": "abqs",\
"FilterVersion": "6.5.163",\
"Filter_Enabled": true,\
"Filter_Human_Label": "Abaqus Hexahedron Exporter",\
"Filter_Name": "AbaqusHexahedronWriter",\
"HourglassStiffness": 250,\
"JobName": "asdf",\
"OutputPath": "Data/Output"\
},\
"PipelineBuilder": {\
"Name": "(01) Single Cubic Phase Equiaxed",\
"Number_Filters": 9,\
"Version": "1.0"\
}\
}`
    );
}
