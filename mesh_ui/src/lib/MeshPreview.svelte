<script lang="ts">
    import {onMount} from 'svelte';
    import { mesh } from '@stores/mesh';

    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

    export let mesh_preview: any;
    let container: any;

    function get_box_params(nodes: any[]) {
        let xs = nodes.map(({x}) => x);
        let ys = nodes.map(({y}) => y);
        let zs = nodes.map(({z}) => z);

        let min_x = Math.min(...xs);
        let max_x = Math.max(...xs);
        let min_y = Math.min(...ys);
        let max_y = Math.max(...ys);
        let min_z = Math.min(...zs);
        let max_z = Math.max(...zs);

        return {
            center: [
                min_x + ((min_x + max_x) / 2.0),
                min_y + ((min_y + max_y) / 2.0),
                min_z + ((min_z + max_z) / 2.0)
            ], 
            size: [
                (max_x - min_x) * 2.0,
                (max_y - min_y) * 2.0,
                (max_z - min_z) * 2.0,
            ]
        }
    }

    onMount(() => {
        console.log("preview")
        const camera = new THREE.PerspectiveCamera( 70, 2, 0.01, 100 );
        camera.position.z = 1;

        const scene = new THREE.Scene();

        // loop over groups, changing color
        for (var i = 0; i < mesh_preview.sets.length; i++) {
            let temp_set = mesh_preview.sets[i];
            let color_string = Math.floor(Math.random()*16777215).toString(16);
            let color = parseInt(color_string, 16);
 
            let material = new THREE.MeshBasicMaterial({
                color: color,
                opacity: 0.5,
                transparent: true
            });
            // loop over elements
            let element_ids = temp_set.elements;
            for (var j = 0; j < element_ids.length; j++) {
                let element_id = element_ids[j]
                let element = mesh_preview.elements.find(obj => {
                    return obj.id === element_id;
                });

                let nodes = mesh_preview.nodes.filter(({id}) => element.nodes.includes(id));
                let box_params = get_box_params(nodes);


                let box = new THREE.BoxBufferGeometry(...box_params.size);

                let temp_mesh = new THREE.Mesh(box, material);
                temp_mesh.position.set(...box_params.center);
                scene.add(temp_mesh);
            }
        }

        const renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( 600, 300 );
        renderer.setAnimationLoop( animate );
        renderer.render( scene, camera );
        container.appendChild( renderer.domElement );

        // set camera
        const controls = new OrbitControls( camera, renderer.domElement );
        camera.position.set( 
            ($mesh.sample_size.resolution * $mesh.sample_size.dimensions.x), 
            ($mesh.sample_size.resolution * $mesh.sample_size.dimensions.y) * 3, 
            ($mesh.sample_size.resolution * $mesh.sample_size.dimensions.z) * 1.2 
        );
        camera.lookAt(
            ($mesh.sample_size.resolution * $mesh.sample_size.dimensions.x) / 2, 
            ($mesh.sample_size.resolution * $mesh.sample_size.dimensions.y) / 2, 
            ($mesh.sample_size.resolution * $mesh.sample_size.dimensions.z) / 2
        );
        controls.target.set(
            ($mesh.sample_size.resolution * $mesh.sample_size.dimensions.x) / 2, 
            ($mesh.sample_size.resolution * $mesh.sample_size.dimensions.y) / 2, 
            ($mesh.sample_size.resolution * $mesh.sample_size.dimensions.z) / 2
        );
        controls.update();

        function animate() {
            requestAnimationFrame( animate );
            controls.update();
            renderer.render( scene, camera );
        }
    });
</script>
<div width="100%">
    <center>
        <div class="mesh" bind:this={container}/>
    </center>
</div>


<style>
    .mesh {
        /* height: 300;
        width: 600; */
        border-radius: 1em;
        overflow: hidden;
    }
</style>