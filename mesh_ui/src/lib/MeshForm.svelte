<script lang="ts">
    import MeshPreview from '@lib/MeshPreview.svelte';
    
    import { mesh } from '@stores/mesh';
	import Card, { Content } from '@smui/card';
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import Textfield from '@smui/textfield';
    import Button, { Label } from '@smui/button';
    import Accordion, { Panel, Header, Content as AccordionContent } from '@smui-extra/accordion';
    import LinearProgress from '@smui/linear-progress';
    import Paper, {Content as PaperContent} from '@smui/paper';
    import FormField from '@smui/form-field';
    import Switch from '@smui/switch';

    let status: string = "";
    let progress = 0;

    let dream_packet_blob: any;
    let dream_set = false;
    let mesh_preview_object: any;
    let remote_dir = "";
    let zip_filename = "";
    let exodus_blob: any = null;
    let exodus_set = false;
    let sculpted_made = false;

    let settings: any = {
        preview: true,
        smooth: true
    }

    async function testHPC() {
        let test_response = await fetch('http://localhost:6969/test');
        if (test_response.status == 500) {
            return false;
        }
        console.log(await test_response.text());
        return true;
    }

    async function generateMesh() {
        let mesh_string_response = await fetch('/mesh/make_string', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify($mesh)
        });

        if (mesh_string_response.status == 500) {
            return false;
        }

        let generate_response = await fetch('http://localhost:6868/generate_mesh', {
            method: 'POST',
            mode: 'cors',
            body: await mesh_string_response.text(),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then( response => response.blob())
        .then(blob => {
            // for later use, as preview, and to Cubit
            dream_packet_blob = blob;
            dream_set = true;
            return true;
        }).catch(error => {
            status = error;
            return false;
        });
        return generate_response;
    }

    async function parseDream() {
        let parse_response = await fetch("/mesh/parse_dream", {method: "POST", body: dream_packet_blob});
        if (parse_response.status == 500) {
            return false;
        }
        mesh_preview_object = await parse_response.json();
        console.log(mesh_preview_object)
        return true;
    }

    async function hpcTempDir() {
        let tmpdir_response = await fetch('http://localhost:6969/make_tmpdir');
        if (tmpdir_response.status == 500) {
            return false;
        }
        remote_dir = await tmpdir_response.text();
        return true;
    }

    async function hpcUpload() {
        let fileOfBlob = new File([dream_packet_blob], 'mesh_package.zip');
        let form_data = new FormData();
        form_data.append("file", fileOfBlob);
        form_data.append("remote_dir", remote_dir);

        let post_response = await fetch('http://localhost:6969/post_file', {
            method: 'POST',
            mode: 'cors',
            body: form_data,
        });

        if (post_response.status == 500) {
            return false;
        }

        zip_filename = await post_response.text();
        return true;
    }

    async function hpcUnzip() {
        let unzip_response = await fetch('http://localhost:6969/unzip_file', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({"remote_dir": remote_dir, "filename": zip_filename}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (unzip_response.status == 500) {
            return false;
        }

        return true;
    }

    async function hpcGlobalize() {
        let globalize_response = await fetch('http://localhost:6969/globalize_file_reference', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                "remote_dir": remote_dir + "/mesh", 
                "filename": "abqs.inp",
                "replace_string": "abqs"
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (globalize_response.status == 500) {
            return false;
        }

        return true;
    }

    async function hpcConvert() {
        let convert_response = await fetch('http://localhost:6969/convert_abqs_to_exo', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                "remote_dir": remote_dir + "/mesh", 
                "filename": "abqs.inp"
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (convert_response.status == 500) {
            return false;
        }

        return true;
    }

    async function hpcSculpt(filename: string) {
        let sculpt_response = await fetch('http://localhost:6969/sculpt_exo', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                "remote_dir": remote_dir + "/mesh", 
                "filename": filename
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (sculpt_response.status == 500) {
            return false;
        }

        return true;
    }

    async function hpcMadeSculpt(filename: string) {
        let made_sculpt_response = await fetch('http://localhost:6969/check_sculpt', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                "remote_dir": remote_dir + "/mesh", 
                "filename": filename
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (made_sculpt_response.status == 500) {
            return false;
        }

        let count = await made_sculpt_response.text();

        if (count != "0") {
            sculpted_made = true;
        }

        return true;
    }

    async function hpcDownload(filename: string) {
        let get_exodus_response = await fetch('http://localhost:6969/get_sculpted_exo', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                "remote_dir": remote_dir + "/mesh", 
                "filename": filename
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (get_exodus_response.status == 500) {
            return false;
        }

        exodus_blob = await get_exodus_response.blob();
        exodus_set = true;

        return true;
    }

    async function hpcCleanup() {
        let tempdir_cleanup_response = await fetch('http://localhost:6969/cleanup_tmpdir', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                "remote_dir": remote_dir
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (tempdir_cleanup_response.status == 500) {
            return false;
        }

        return true;
    }

    async function launchDreamDownload() {
        let url = window.URL.createObjectURL(dream_packet_blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = "mesh_package.zip";
        document.body.appendChild(a);
        a.click();    
        a.remove();
    }

    async function launchExodusDownload() {
        let url = window.URL.createObjectURL(exodus_blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = "mesh.e";
        document.body.appendChild(a);
        a.click();    
        a.remove();
    }

    async function initialDream() {
        progress = 0.05;
        status = "generating DREAM 3D mesh...";
        progress = 0.5;
        let gm_response = await generateMesh();
        if (gm_response) {
            status = "parsing DREAM 3D mesh...";
            progress = 0.7
            let pd_response = await parseDream();

            if (pd_response) {
                progress = 1;
                status = "Ready for download or conversion";
            }
        }
    }

    async function convertToExodus() {
        progress = 0.01;
        status = "HPC: creating temporary directory...";
        let hpc_td_response = await hpcTempDir();
        if (hpc_td_response) {
            progress = 0.1;
            status = "HPC: uploading DREAM3D output...";
            let hpc_upload_response = await hpcUpload();
            if (hpc_upload_response) {
                progress = 0.2;
                status = "HPC: unzipping DREAM3D output...";
                let hpc_unzip_response = await hpcUnzip();
                if (hpc_unzip_response) {
                    progress = 0.3;
                    status = "HPC: globalizing file references...";
                    let hpc_globalize_response = await hpcGlobalize();
                    if (hpc_globalize_response) {
                        progress = 0.4;
                        status = "HPC: converting Abaqus to Exodus...";
                        let hpc_convert_response = await hpcConvert();
                        if (hpc_convert_response) {
                            progress = 0.5;
                            let filename = "mesh.e";
                            let cont = true;
                            if (settings.smooth) {
                                progress = 0.6
                                status = "HPC: sculpting Exodus geometry...";
                                await hpcSculpt(filename);
                                await hpcMadeSculpt(filename + "_results.e.1.0");
                                if (sculpted_made) {
                                    filename += "_results.e.1.0";
                                } else {
                                    await hpcCleanup();
                                    status = "HPC: sculpting file failed";
                                    progress = 1;
                                    cont = false;
                                }
                            } 
                            if (cont) {
                                progress = 0.9;
                                status = "HPC: getting Exodus file...";
                                let hpc_download_response = await hpcDownload(filename);
                                if (hpc_download_response) {
                                    await hpcCleanup();
                                    progress = 1;
                                    status = "Done"
                                } else {
                                    await hpcCleanup();
                                    status = "HPC: getting Exodus file failed";
                                    progress = 1;
                                }
                            }
                        } else {
                            await hpcCleanup();
                            status = "HPC: Abaqus conversion failed";
                            progress = 1;
                        }
                    } else {
                        await hpcCleanup();
                        status = "HPC: globalizing file references failed";
                        progress = 1;
                    }
                } else {
                    await hpcCleanup();
                    status = "HPC: unzipping failed";
                    progress = 1;
                }
            } else {
                await hpcCleanup();
                status = "HPC: uploading DREAM3D output failed";
                progress = 1;
            }
        } else {
            status = "HPC: temporary directory creation failed";
            progress = 1;
        }
    }

    function addBin() {
        let last_val = $mesh.bin.numbers[$mesh.bin.numbers.length - 1];
        console.log(last_val)
        $mesh.bin.numbers = [...$mesh.bin.numbers, last_val];
    }

    function removeBin() {
        $mesh.bin.numbers.pop();
        $mesh.bin.numbers = $mesh.bin.numbers;
    }
</script>

<Card class="card-extension">
	<Content>

        <!-- <Accordion>
            <Panel>
                <Header>Mesh settings</Header>
                <AccordionContent> -->
            <LayoutGrid>
                <Cell span={4}>
                    <Accordion>
                        <Panel color="primary">
                            <Header>Sample Size
                                <span slot="description">
                                    {$mesh.sample_size.dimensions.x * $mesh.sample_size.resolution} &times; 
                                    {$mesh.sample_size.dimensions.y * $mesh.sample_size.resolution} &times; 
                                    {$mesh.sample_size.dimensions.z * $mesh.sample_size.resolution} µm; 
                                    {$mesh.sample_size.dimensions.x * $mesh.sample_size.dimensions.y * $mesh.sample_size.dimensions.z} voxels
                                </span>
                                <!-- <span slot="icon">
                                    
                                </span> -->
                            </Header>
                            <AccordionContent>
                                <Textfield label="# of Voxels in X" type="number" bind:value={$mesh.sample_size.dimensions.x}></Textfield> <br><br>
                                <Textfield label="# of Voxels in Y" type="number" bind:value={$mesh.sample_size.dimensions.y}></Textfield><br><br>
                                <Textfield label="# of Voxels in Z" type="number" bind:value={$mesh.sample_size.dimensions.z}></Textfield> <br><br>
                                <Textfield label="Resolution (µm)" type="number" input$step="any" bind:value={$mesh.sample_size.resolution}></Textfield>
                            </AccordionContent>
                        </Panel>
                        <Panel color="primary">
                            <Header>Grain Size
                                <span slot="description">
                                    {$mesh.feature_size.average} avg; 
                                    {$mesh.feature_size.std_dev} std dev
                                </span>
                            </Header>
                            <AccordionContent>
                                <Textfield label="Average (µm)" type="number" input$step="any" bind:value={$mesh.feature_size.average}></Textfield><br><br>
                                <Textfield label="Std Dev (µm)" type="number" input$step="any" bind:value={$mesh.feature_size.std_dev}></Textfield><br><br>
                            </AccordionContent>
                        </Panel>
                        <Panel color="primary">
                            <Header>Grain Stats</Header>
                            <AccordionContent>
                                <u>Bin numbers</u><br>
                                {#each $mesh.bin.numbers as number, i}
                                <Textfield id="mb{i}" label="Value {i + 1}" type="number" input$step="any" bind:value={number}></Textfield><br><br>
                                {/each}
                                <Button color="secondary" on:click={addBin}>
                                    Add bin
                                </Button>
                                <Button color="secondary" on:click={removeBin}>
                                    Remove bin
                                </Button>
                                <hr><br>

                                <u>Feature Size Vs B Over A Distributions</u><br>
                                {#each $mesh.bOverADist.alpha as number, i}
                                <Textfield id="boaa{i}" label="Alpha {i + 1}" type="number" input$step="any" bind:value={number}></Textfield><br><br>
                                {/each}
                                {#each $mesh.bOverADist.beta as number, i}
                                <Textfield id="boab{i}" label="Beta {i + 1}" type="number" input$step="any" bind:value={number}></Textfield><br><br>
                                {/each}
                                <hr><br>

                                <u>Feature Size Vs C Over A Distributions</u><br>
                                {#each $mesh.cOverADist.alpha as number, i}
                                <Textfield id="coaa{i}" label="Alpha {i + 1}" type="number" input$step="any" bind:value={number}></Textfield><br><br>
                                {/each}
                                {#each $mesh.cOverADist.beta as number, i}
                                <Textfield id="coab{i}" label="Beta {i + 1}" type="number" input$step="any" bind:value={number}></Textfield><br><br>
                                {/each}
                                <hr><br>

                                <u>Feature Size Vs Neighbors Distributions</u><br>
                                {#each $mesh.fSizeVsNeighbors.average as number, i}
                                <Textfield id="fsvna{i}" label="Average {i + 1}" type="number" input$step="any" bind:value={number}></Textfield><br><br>
                                {/each}
                                {#each $mesh.fSizeVsNeighbors.std_dev as number, i}
                                <Textfield id="fsvns{i}" label="Std Dev {i + 1}" type="number" input$step="any" bind:value={number}></Textfield><br><br>
                                {/each}
                                <hr><br>

                                <u>Feature Size Vs Omega 3 Distributions</u><br>
                                {#each $mesh.fSizeVsO3.alpha as number, i}
                                <Textfield id="fsvo3a{i}" label="Alpha {i + 1}" type="number" input$step="any" bind:value={number}></Textfield><br><br>
                                {/each}
                                {#each $mesh.fSizeVsO3.beta as number, i}
                                <Textfield id="fsvo3b{i}" label="Beta {i + 1}" type="number" input$step="any" bind:value={number}></Textfield><br><br>
                                {/each}
                                <hr><br>

                                <u>Feature Diameter Information</u><br>
                                {#each $mesh.featureDiamInfo as number, i}
                                <Textfield id="fdi{i}" label="Value {i + 1}" type="number" input$step="any" bind:value={number}></Textfield><br><br>
                                {/each}

                            </AccordionContent>
                        </Panel>
                    </Accordion><br><br>
                    {#if status != ""}
                        {status}
                    {/if}
                    {#if progress != 0}
                        <LinearProgress progress={progress} buffer={1} />
                    {/if}

                    <Paper color="primary">
                        <PaperContent>
                            
                            <FormField>
                                <Switch bind:checked={settings.preview}/>
                                <Label>Preview mesh</Label>
                            </FormField>

                            {#if dream_set }
                            <FormField>
                                <Switch bind:checked={settings.smooth}/>
                                <Label>Smooth grain interfaces</Label>
                            </FormField>
                            <br>
                            {/if}
                            
                            <center>
                                {#if !dream_set && !exodus_set }
                                <Button color="secondary" action="accept" on:click={initialDream}>
                                    <Label>Generate DREAM3D output</Label>
                                </Button>
                                {/if}

                                {#if dream_set }
                                <Button color="secondary" action="accept" on:click={launchDreamDownload}>
                                    <Label>Download DREAM3D</Label>
                                </Button>
                                    {#if !exodus_set}
                                    <Button color="secondary" action="accept" on:click={convertToExodus}>
                                        <Label>Convert to Exodus</Label>
                                    </Button>
                                    {/if}
                                {/if}

                                {#if exodus_set }
                                <Button color="secondary" action="accept" on:click={launchExodusDownload}>
                                    <Label>Download Exodus file</Label>
                                </Button>
                                {/if}
                            </center>
                            
                        </PaperContent>
                    </Paper>
                </Cell>
                <Cell span={8}>
                    {#if mesh_preview_object && settings.preview }
                        <MeshPreview mesh_preview={mesh_preview_object}/>
                    {/if}
                </Cell>
            </LayoutGrid>
                    
    </Content>
    
</Card>

<style>
    :global(.card-extension) {
        font-family: Roboto ;
        font-weight: 300 !important;
    }
</style>
