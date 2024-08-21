import unzipper from 'unzipper';

function parseNodes(nodes_buffer: any) {
    let nodes: any = [];
    let nodes_string = nodes_buffer.toString();
    let nodes_lines = nodes_string.split("\n");
    let gathering = false;
    for (var i=0; i < nodes_lines.length; i++) {
        let line = nodes_lines[i];
        if (line == "**") {
            gathering = false
        }
        if (gathering) {
            let elems = line.split(", ");
            nodes.push({
                "id": elems[0],
                "x": parseFloat(elems[1]),
                "y": parseFloat(elems[2]),
                "z": parseFloat(elems[3])
            });
        }
        if (line == "*Node") {
            gathering = true;
        }
    }
    return nodes;
}

function parseElements(elements_buffer: any) {
    let elements: any = [];
    let current_element:any = {};
    let elements_string = elements_buffer.toString();
    let elements_lines = elements_string.split("\n");
    let gathering = false;
    for (var i=0; i < elements_lines.length; i++) {
        let line = elements_lines[i];
        if (line.includes("*Element, type=")) {
            gathering = true;
        } else if (line == "**" && gathering == true) {
            elements.push(current_element);
            gathering = false;
        } else if (gathering == true) {
            if (JSON.stringify(current_element) != '{}') {
                elements.push(current_element);
            }
            let temp_array = line.split(", ")
            current_element = {
                "id": temp_array.shift(),
                "nodes": temp_array
            }
        }
    }
    return elements;
}

function parseSets(sets_buffer: any) {
    let sets: any = [];
    let current_set:any = {};
    let sets_string = sets_buffer.toString();
    let sets_lines = sets_string.split("\n");
    let gathering = false;
    for (var i=0; i < sets_lines.length; i++) {
        let line = sets_lines[i];
        if (line.includes("*Elset, elset=Grain") && gathering == false) {
            current_set = {"name": line.replace("*Elset, elset=", ""), elements_string: "", elements: []}
            gathering = true;
        } else if (line.includes("*Elset, elset=Grain") && gathering == true) {
            sets.push(current_set);
            let temp_string = current_set.elements_string.replaceAll(", ", ",");
            current_set.elements = temp_string.split(",");
            delete current_set["elements_string"];
            current_set = {"name": line.replace("*Elset, elset=", ""), elements_string: "", elements: []}
            gathering = true;
        } else if (line == "**" && gathering == true) {
            sets.push(current_set);
            let temp_string = current_set.elements_string.replaceAll(", ", ",");
            current_set.elements = temp_string.split(",");
            delete current_set["elements_string"];
            gathering = false;
        } else if (gathering == true) {
            current_set.elements_string += line;
        }
    }3
    return sets;
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// TODO handle FILE_ERROR from unzipper, or swap for adm-zip
/** @type {import('./$types').RequestHandler} */
export async function POST(event: any) {
    let nodes: any[] = [];
    let elements: any[] = [];
    let sets: any[] = [];

    let obje = await event.request.body;
    let reader = await obje.getReader();
    let value = await reader.read();
    let sl = await sleep(2000).then(() => { console.log("waiting..."); });
    console.log(sl);

    let unzipped = await unzipper.Open.buffer(value.value, {crx: true});

    sl = await sleep(2000).then(() => { console.log("waiting..."); });
    console.log(sl);

    for (var i=0; i < unzipped.files.length; i++) {
        let temp_file = unzipped.files[i];
        console.log(temp_file.path);
        if (temp_file.path == "mesh/abqs_nodes.inp") {
            let buf = await temp_file.buffer()
            nodes = await parseNodes(buf);
        } else if (temp_file.path == "mesh/abqs_elems.inp") {
            let buf = await temp_file.buffer()
            elements = await parseElements(buf);
        }else if (temp_file.path == "mesh/abqs_elset.inp") {
            let buf = await temp_file.buffer()
            sets = await parseSets(buf);
        }
    }

    // console.log(unzipped)

    return new Response(JSON.stringify({"nodes": nodes, "elements": elements, "sets": sets}));
};